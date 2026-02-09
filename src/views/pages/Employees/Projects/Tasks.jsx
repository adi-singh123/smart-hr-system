/** @format */

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import TaskFollowersModelPopup from "../../../../components/modelpopup/TaskFollowersModelPopup";
import ProjectModelPopup from "../../../../components/modelpopup/ProjectModelPopup";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

import {
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../../../../Redux/services/Task";
import { getAllUsers } from "../../../../Redux/services/User"; // ✅ import getAllUsers
import { HTTPURL } from "../../../../Constent/Matcher";

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.task); // Redux state
  const { users = [] } = useSelector((state) => state.user); // ✅ users slice से dynamic list
  const [selectedTask, setSelectedTask] = useState(null);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);

  // Add Task Modal state
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newDueDate, setNewDueDate] = useState(null);

  // Assignee modal state
  const [searchValue, setSearchValue] = useState("");
  const [activeAssignTaskId, setActiveAssignTaskId] = useState(null);
  const [selectedAssignees, setSelectedAssignees] = useState([]);

  // ✅ Filter users dynamically
  const filteredAssignees = users.filter((u) => {
    const fullName = `${u.first_name || ""} ${u.last_name || ""}`.trim();
    return fullName.toLowerCase().includes(searchValue.toLowerCase());
  });

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(getAllUsers()); // ✅ load all users initially
  }, [dispatch]);

  useEffect(() => {
    if (tasks?.length && !selectedTask) setSelectedTask(tasks[0]);
  }, [tasks]);

  const parseAssignees = (assignees) => {
    if (!assignees) return [];
    if (Array.isArray(assignees)) return assignees; // agar array hai to wahi return
    try {
      return JSON.parse(assignees);
    } catch {
      return [];
    }
  };

  // ✅ Ab use karo
  const assigneesWithData = (parseAssignees(selectedTask?.assignees) || []).map(
    (assigneeId) => {
      const user = users.find((u) => u.id === assigneeId);
      return {
        id: assigneeId,
        name: user ? `${user.first_name} ${user.last_name}`.trim() : "Unknown",
        avatar: user?.profile_pic
          ? `${HTTPURL}${user.profile_pic}`
          : "/default-avatar.png",
        role: user?.role?.name || "N/A",
      };
    }
  );

  const getAssigneeObjects = (assigneeIds) => {
    if (!assigneeIds) return [];
    const idsArray = parseAssignees(assigneeIds);
    return idsArray.map((id) => {
      const user = users.find((u) => u.id === id);
      return {
        id,
        name: user ? `${user.first_name} ${user.last_name}`.trim() : "Unknown",
        avatar: user?.profile_pic || "/default-avatar.png",
      };
    });
  };

  const openAssigneeModal = (taskId, e) => {
    e.stopPropagation();
    setActiveAssignTaskId(taskId);
    const task = tasks.find((t) => t.id === taskId);
    setSelectedAssignees(getAssigneeObjects(task?.assignees));
    setSearchValue("");
    const modal = window.bootstrap?.Modal.getOrCreateInstance(
      document.getElementById("assignee")
    );
    modal?.show();
  };

  const toggleAssigneeSelection = (assignee) => {
    if (!assignee?.id) {
      console.warn("Invalid assignee selected:", assignee);
      return;
    }
    setSelectedAssignees((prev) =>
      prev.some((a) => a.id === assignee.id)
        ? prev.filter((a) => a.id !== assignee.id)
        : [
            ...prev,
            {
              id: assignee.id,
              name: `${assignee.first_name || ""} ${
                assignee.last_name || ""
              }`.trim(),
              avatar: assignee.profile_pic || "/default-avatar.png",
            },
          ]
    );
  };
  const handleAssigneesChange = (taskId) => {
    if (!taskId) return;

    const assigneeIds = selectedAssignees.map((a) => a.id).filter(Boolean);

    dispatch(updateTask({ taskId, assignees: assigneeIds })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const updatedTask = res.payload; // ✅ sirf payload, data nahi

        console.log("updatedTask", updatedTask);

        if (selectedTask?.id === taskId) {
          setSelectedTask({
            ...selectedTask,
            assignees: parseAssignees(updatedTask.assignees),
          });
        }

        dispatch(fetchTasks());
        closeModal("assignee");
      }
    });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskName.trim() || !newDueDate) return;

    const newTask = {
      name: newTaskName,
      description: newTaskDesc,
      dueDate: newDueDate,
      assignees: [],
    };

    dispatch(createTask(newTask)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        // Reset form
        setNewTaskName("");
        setNewTaskDesc("");
        setNewDueDate(null);

        // Close modal safely
        closeModal("addTaskModal");
      }
    });
  };

  const closeModal = (modalId) => {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) return;

    // Get existing instance or create one
    let modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (!modalInstance) modalInstance = new bootstrap.Modal(modalEl);

    // Listen for hidden event, then cleanup
    modalEl.addEventListener(
      "hidden.bs.modal",
      () => {
        document.body.classList.remove("modal-open"); // restore scroll
        document.body.style.paddingRight = ""; // remove any padding
        document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
        modalInstance.dispose(); // fully remove instance
      },
      { once: true }
    );

    modalInstance.hide(); // trigger hide animation
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        // Delete ke baad fetch updated tasks
        dispatch(fetchTasks()).then((res) => {
          const updatedTasks = res.payload.data || [];
          if (selectedTask?.id === id) {
            setSelectedTask(updatedTasks[0] || null); // Right panel update
          }
        });
      }
    });
  };

  const removeAssignee = (taskId, assigneeId, e) => {
    e.stopPropagation();

    // Find the task in current tasks list
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Parse current assignees (in case backend sends string)
    const currentAssigneeIds = parseAssignees(task.assignees);

    // Remove the selected assignee
    const updatedAssigneeIds = currentAssigneeIds.filter(
      (id) => id !== assigneeId
    );

    // Update task via Redux action
    dispatch(updateTask({ taskId, assignees: updatedAssigneeIds })).then(
      (res) => {
        if (res.meta.requestStatus === "fulfilled") {
          const updatedTask = res.payload;

          // Update Right Panel (selectedTask) with full user objects
          if (selectedTask?.id === taskId) {
            const parsedIds = parseAssignees(updatedTask.assignees);
            const updatedAssignees = parsedIds.map((id) => {
              const user = users.find((u) => u.id === id);
              return {
                id,
                name: user
                  ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                  : "Unknown",
                avatar: user?.profile_pic
                  ? `${HTTPURL}${user.profile_pic}`
                  : "/default-avatar.png",
                role: user?.role?.name || "N/A",
              };
            });

            setSelectedTask({
              ...selectedTask,
              assignees: parsedIds, // ✅ store IDs only, same as Left Panel
            });
          }

          // Refresh Left Panel (task list)
          dispatch(fetchTasks());
        }
      }
    );
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

  const daysDiff = (date) => {
    if (!date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return Math.floor((d - today) / 86400000);
  };

  const getDueStatus = (date) => {
    const diff = daysDiff(date);
    if (diff < 0) return "missed";
    if (diff === 0) return "due today";
    if (diff <= 2) return "upcoming";
    return "";
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Tasks"
          title="Dashboard"
          subtitle="Tasks"
          Linkname="/tasks"
          Linkname1="/task-list"
        />
        <div className="row h-100" style={{ height: "calc(100vh - 150px)" }}>
          {/* Left section */}
          <div className="col-lg-7 col-md-12 mb-4 h-100">
            <div className="card h-100 d-flex flex-column">
              <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Task List</h4>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const modalEl = document.getElementById("addTaskModal");
                    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                    modal.show();
                  }}
                >
                  <i className="fa fa-plus me-1"></i> Add Task
                </button>
              </div>
              <div
                className="card-body flex-fill overflow-auto"
                style={{ maxHeight: "calc(100vh - 220px)" }}
              >
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <ul
                    className="list-group list-group-flush"
                    style={{ minHeight: "100%" }}
                  >
                    {tasks?.map((task) => {
                      const isSelected = selectedTask?.id === task.id;
                      const dueStatus = getDueStatus(task.dueDate);
                      const assigneeObjs = getAssigneeObjects(task.assignees);

                      return (
                        <li
                          key={task.id}
                          className={`list-group-item border-0 ${
                            isSelected ? "bg-primary text-white" : ""
                          } ${
                            hoveredTaskId === task.id && !isSelected
                              ? "bg-primary bg-opacity-25"
                              : ""
                          }`}
                          style={{
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                          onClick={() => setSelectedTask(task)}
                          onMouseEnter={() => setHoveredTaskId(task.id)}
                          onMouseLeave={() => setHoveredTaskId(null)}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-bold">{task.name}</div>
                              <div className="small mt-1">
                                <span className="fw-semibold">Due:</span>{" "}
                                <span
                                  className={
                                    dueStatus === "missed"
                                      ? "text-danger"
                                      : dueStatus === "due today"
                                      ? "text-warning"
                                      : dueStatus === "upcoming"
                                      ? "text-success"
                                      : isSelected
                                      ? "text-white"
                                      : "text-muted"
                                  }
                                >
                                  {formatDate(task.dueDate)}
                                  {dueStatus === "missed" && (
                                    <span className="badge bg-danger ms-1">
                                      Missed
                                    </span>
                                  )}
                                  {dueStatus === "due today" && (
                                    <span className="badge bg-warning text-dark ms-1">
                                      Due Today
                                    </span>
                                  )}
                                  {dueStatus === "upcoming" && (
                                    <span className="badge bg-info text-dark ms-1">
                                      Upcoming
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="d-flex align-items-center mt-1">
                                <span className="fw-semibold me-1">
                                  Assignees:
                                </span>
                                <div className="d-flex">
                                  {assigneeObjs.map((assignee) => (
                                    <div
                                      key={assignee.id}
                                      className="position-relative me-1"
                                    >
                                      <img
                                        src={
                                          assignee.avatar.startsWith("http")
                                            ? assignee.avatar
                                            : `${HTTPURL}${assignee.avatar}`
                                        }
                                        alt={assignee.name}
                                        className="rounded-circle"
                                        width="24"
                                        height="24"
                                        title={assignee.name}
                                      />
                                      {isSelected && (
                                        <button
                                          className="position-absolute top-0 start-100 translate-middle badge border-0 bg-danger p-0"
                                          style={{
                                            fontSize: "0.6rem",
                                            width: "14px",
                                            height: "14px",
                                          }}
                                          onClick={(e) =>
                                            removeAssignee(
                                              task.id,
                                              assignee.id,
                                              e
                                            )
                                          }
                                        >
                                          ×
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div>
                              <button
                                type="button"
                                className={`btn btn-sm me-2 ${
                                  isSelected
                                    ? "btn-outline-light"
                                    : "btn-outline-primary"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openAssigneeModal(task.id, e);
                                  const modalEl =
                                    document.getElementById("assignee");
                                  const modal =
                                    bootstrap.Modal.getOrCreateInstance(
                                      modalEl
                                    );
                                  modal.show();
                                }}
                              >
                                <i className="material-icons">person_add</i>
                              </button>

                              <button
                                type="button"
                                className={`btn btn-sm ${
                                  isSelected
                                    ? "btn-outline-light"
                                    : "btn-outline-danger"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTask(task.id);
                                }}
                              >
                                <i className="material-icons">delete</i>
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="col-lg-5 col-md-12">
            <div className="card h-auto">
              <div className="card-header bg-white border-bottom">
                <h4 className="mb-0">Task Details / Chat</h4>
              </div>
              <div
                className="card-body"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                {selectedTask ? (
                  <>
                    <h5>Task : {selectedTask.name}</h5>
                    <div className="mb-2 text-muted">
                      Description: {selectedTask.description}
                    </div>
                    <div className="mb-2">
                      <span className="fw-bold">Due Date:</span>{" "}
                      <span
                        className={
                          getDueStatus(selectedTask?.dueDate) === "missed"
                            ? "text-danger"
                            : getDueStatus(selectedTask?.dueDate) ===
                              "due today"
                            ? "text-warning"
                            : getDueStatus(selectedTask?.dueDate) === "upcoming"
                            ? "text-primary"
                            : "text-muted"
                        }
                      >
                        {formatDate(selectedTask?.dueDate)}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-bold">Assignees:</span>
                      <div className="d-flex flex-wrap mt-1">
                        {assigneesWithData.map((assignee) => (
                          <div
                            key={assignee.id}
                            className="d-flex align-items-center me-3 mb-1"
                          >
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="rounded-circle me-1"
                              width="30"
                              height="30"
                              style={{ cursor: "pointer" }}
                              onClick={(e) =>
                                openAssigneeModal(selectedTask?.id, e)
                              }
                            />
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={(e) =>
                                openAssigneeModal(selectedTask?.id, e)
                              }
                            >
                              {assignee.name}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger ms-1 p-0"
                              style={{ fontSize: "0.7rem", lineHeight: "1rem" }}
                              onClick={(e) =>
                                removeAssignee(selectedTask.id, assignee.id, e)
                              }
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div>Select a task to view details</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Task Modal */}
        <div
          className="modal custom-modal fade"
          id="addTaskModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleAddTask}>
                <div className="modal-header">
                  <h5 className="modal-title">Add New Task</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Task Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      placeholder="Task Name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      placeholder="Task Description"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Due Date</label>
                    <DatePicker
                      className="form-control"
                      selected={newDueDate}
                      onChange={(date) => setNewDueDate(date)}
                      minDate={new Date()}
                      dateFormat="dd MMM yyyy"
                      placeholderText="Select due date"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Assignee Modal */}
        <div
          id="assignee"
          className="modal custom-modal fade"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign to this task</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    placeholder="Search to add"
                    className="form-control"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <ul className="list-unstyled">
                  {filteredAssignees.map((a) => {
                    const fullName = `${a.first_name || ""} ${
                      a.last_name || ""
                    }`.trim();
                    return (
                      <li
                        key={a.id} // ensure unique key
                        onClick={() => toggleAssigneeSelection(a)} // pass whole user object
                        className={`py-2 ${
                          selectedAssignees.some((sa) => sa.id === a.id)
                            ? "bg-light"
                            : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={
                            `${HTTPURL}${a.profile_pic}` ||
                            "/default-avatar.png"
                          }
                          alt={`${a.first_name || ""} ${
                            a.last_name || ""
                          }`.trim()}
                          className="rounded-circle me-2"
                          width="30"
                          height="30"
                        />
                        {`${a.first_name || ""} ${a.last_name || ""}`.trim()} (
                        {a.role?.name || "N/A"})
                        {selectedAssignees.some((sa) => sa.id === a.id) && (
                          <i className="material-icons text-success ms-2">
                            check
                          </i>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-3 text-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleAssigneesChange(activeAssignTaskId)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProjectModelPopup />
        <TaskFollowersModelPopup />
      </div>
    </div>
  );
};

export default Tasks;
