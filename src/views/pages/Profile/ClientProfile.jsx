/** @format */

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { fetchClientById } from "../../../Redux/services/Client";
import { fetchProjects } from "../../../Redux/services/Project";
import { fetchTasks } from "../../../Redux/services/Task";
import { HTTPURL } from "../../../Constent/Matcher";
import axios from "axios";
import { getName } from "../../../Redux/services/User";
import CommonAvatar from "../../../../src/CommanAvater.jsx";

const ClientProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const { selectedClient, loading: clientLoading } = useSelector(
    (state) => state.client || {}
  );
  const projects = useSelector((state) => state.project?.allProjects || []);
  const projectsLoading = useSelector(
    (state) => state.project?.loading || false
  );
  const { tasks = [], loading: tasksLoading } = useSelector(
    (state) => state.task || {}
  );

  const [leaders, setLeaders] = useState({});
  const [members, setMembers] = useState({});

  useEffect(() => {
    if (userId) {
      dispatch(fetchClientById(userId));
      dispatch(fetchProjects({ client_id: userId }));
      dispatch(fetchTasks({ client_id: userId }));
    }
  }, [userId, dispatch]);

  // ✅ Fetch project leader and member names
  useEffect(() => {
    if (projects?.length) {
      projects.forEach((proj) => {
        if (proj.project_leader_id) {
          dispatch(getName(proj.project_leader_id)).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
              setLeaders((prev) => ({
                ...prev,
                [proj.project_leader_id]: res.payload,
              }));
            }
          });
        }

        if (proj.projectMembers?.length) {
          proj.projectMembers.forEach((memberId) => {
            dispatch(getName(memberId)).then((res) => {
              if (res.meta.requestStatus === "fulfilled") {
                setMembers((prev) => ({
                  ...prev,
                  [memberId]: res.payload,
                }));
              }
            });
          });
        }
      });
    }
  }, [projects, dispatch]);

  if (clientLoading || !selectedClient) {
    return <div className="text-center mt-5">Loading Client...</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Client Profile"
          title="Dashboard"
          subtitle="Client Profile"
          modal="#add_indicator"
          name="Add New"
        />

        {/* Client Info Card */}
        <div className="card mb-0">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <div className="profile-view">
                  <div className="profile-img-wrap">
                    <div className="profile-img">
                      <Link to="#">
                        <CommonAvatar
                          imageUrl={selectedClient?.profile_pic ? `${HTTPURL}${selectedClient.profile_pic}` : ""}
                          alt={`${selectedClient?.first_name || ""} ${selectedClient?.last_name || ""}`}
                          size={100}
                        />

                      </Link>
                    </div>
                  </div>
                  <div className="profile-basic">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="profile-info-left">
                          <h3 className="user-name m-t-0">
                            {selectedClient
                              ? `${selectedClient.first_name || ""} ${selectedClient.last_name || ""
                              }`
                              : "No Name Provided"}
                          </h3>

                          <h5 className="company-role m-t-0 mb-0">
                            {selectedClient?.role || "No Role Provided"}
                          </h5>
                          <small className="text-muted">
                            {selectedClient?.position || "No Position Provided"}
                          </small>
                          <div className="staff-id">
                            Client ID : {selectedClient?.client_id || "N/A"}
                          </div>
                          <div className="staff-msg">
                            <Link to="/call/chat" className="btn btn-custom">
                              Send Message
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-7">
                        <ul className="personal-info">
                          <li>
                            <span className="title">Phone:</span>
                            <span className="text">
                              {selectedClient?.phone ? (
                                <Link to={`tel:${selectedClient.phone}`}>
                                  {selectedClient.phone}
                                </Link>
                              ) : (
                                "N/A"
                              )}
                            </span>
                          </li>
                          <li>
                            <span className="title">Email:</span>
                            <span className="text">
                              {selectedClient?.email ? (
                                <Link to={`mailto:${selectedClient.email}`}>
                                  {selectedClient.email}
                                </Link>
                              ) : (
                                "N/A"
                              )}
                            </span>
                          </li>
                          <li>
                            <span className="title">Birthday:</span>
                            <span className="text">
                              {selectedClient?.birthday || "N/A"}
                            </span>
                          </li>
                          <li>
                            <span className="title">Address:</span>
                            <span className="text">
                              {selectedClient?.address || "N/A"}
                            </span>
                          </li>
                          <li>
                            <span className="title">Gender:</span>
                            <span className="text">
                              {selectedClient?.gender || "N/A"}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card tab-box">
          <div className="row user-tabs">
            <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
              <ul className="nav nav-tabs nav-tabs-bottom">
                <li className="nav-item col-sm-3">
                  <Link
                    className="nav-link active"
                    data-bs-toggle="tab"
                    to="#myprojects"
                  >
                    Projects
                  </Link>
                </li>
                <li className="nav-item col-sm-3">
                  <Link className="nav-link" data-bs-toggle="tab" to="#tasks">
                    Tasks
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Projects & Tasks */}
        <div className="row">
          <div className="col-lg-12">
            <div className="tab-content profile-tab-content">
              {/* Projects Tab */}
              <div id="myprojects" className="tab-pane fade show active">
                <div className="row">
                  {projects.map((project, index) => (
                    <div
                      className="col-lg-4 col-sm-6 col-md-4 col-xl-3 d-flex"
                      key={index}
                    >
                      <div className="card w-100">
                        <div className="card-body">
                          <h4 className="project-title">
                            <Link to="/projects-view">
                              {project.projectName}
                            </Link>
                          </h4>
                          <small className="block text-ellipsis m-b-15">
                            <span className="text-xs">{project.openTasks}</span>{" "}
                            <span className="text-muted">open tasks, </span>
                            <span className="text-xs">
                              {project.completedTasks}
                            </span>{" "}
                            <span className="text-muted">tasks completed</span>
                          </small>
                          <p
                            className="text-muted"
                            dangerouslySetInnerHTML={{
                              __html: project.description || "",
                            }}
                          />

                          <div className="pro-deadline m-b-15">
                            <div className="sub-title">Deadline:</div>
                            <div className="text-muted">
                              {project.endDate
                                ? new Date(project.endDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                                : "N/A"}
                            </div>
                          </div>

                          {/* ✅ Project Leader */}
                          <div className="project-members m-b-15">
                            <div>Project Leader :</div>
                            <div className="text-muted">
                              {leaders[project.project_leader_id] ||
                                "Loading..."}
                            </div>
                          </div>

                          {/* ✅ Team Members */}
                          <div className="project-members m-b-15">
                            <div>Team :</div>
                            <ul className="team-members">
                              {project.projectMembers &&
                                project.projectMembers.length > 0 ? (
                                project.projectMembers.map((memberId, idx) => (
                                  <li key={idx} className="text-muted">
                                    • {members[memberId] || "Loading..."}
                                  </li>
                                ))
                              ) : (
                                <li className="text-muted">No Members</li>
                              )}
                            </ul>
                          </div>

                          <p className="m-b-5">
                            Progress{" "}
                            <span className="text-success float-end">
                              {project.progress}
                            </span>
                          </p>
                          <div className="progress progress-xs mb-0">
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              data-bs-toggle="tooltip"
                              title="40%"
                              style={{ width: "40%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* /Projects Tab */}

              {/* Task Tab */}
              <div id="tasks" className="tab-pane fade">
                <div className="project-task">
                  <ul className="nav nav-tabs nav-tabs-top nav-justified mb-0">
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        to="#all_tasks"
                        data-bs-toggle="tab"
                        aria-expanded="true"
                      >
                        All Tasks
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="#pending_tasks"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                      >
                        Pending Tasks
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="#completed_tasks"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                      >
                        Completed Tasks
                      </Link>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane show active" id="all_tasks">
                      <div className="task-wrapper">
                        <div className="task-list-container">
                          <div className="task-list-body">
                            <ul id="task-list">
                              {tasks.map((task, index) => (
                                <li className="task" key={index}>
                                  <div className="task-container">
                                    <span className="task-action-btn task-check">
                                      <span
                                        className="action-circle large complete-btn"
                                        title="Mark Complete"
                                      >
                                        <i className="material-icons">check</i>
                                      </span>
                                    </span>
                                    <span className="task-label">
                                      {task.name}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="task-list-footer">
                            <div className="new-task-wrapper">
                              <textarea
                                id="new-task"
                                placeholder="Enter new task here. . ."
                                defaultValue={""}
                              />
                              <span className="error-message hidden">
                                You need to enter a task first
                              </span>
                              <span
                                className="add-new-task-btn btn"
                                id="add-task"
                              >
                                Add Task
                              </span>
                              <span className="btn" id="close-task-panel">
                                Close
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane" id="pending_tasks" />
                    <div className="tab-pane" id="completed_tasks" />
                  </div>
                </div>
              </div>
              {/* /Task Tab */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
