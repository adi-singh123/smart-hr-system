/** @format */

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  add_timesheet,
  get_all_timesheets,
  update_timesheet,
} from "../../Redux/services/Timesheet";
import { fetchProjects } from "../../Redux/services/Project";

import { customAlert } from "../../utils/Alert";
import { punch } from "../../Redux/services/EmployeeAttendance";

export const AddTimeSheetModelPopup = ({
  isEditing,
  isViewing,
  data,
  onClose,
}) => {
  const dispatch = useDispatch();
  console.log("data", data);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [totalHours, setTotalHours] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);
  const [deadline, setDeadline] = useState("");

  const Projects = useSelector((state) => state.project.allProjects);
  const userId = useSelector((state) => state.user.logUserID);
  const punchData = useSelector(
    (state) => state.employee_attendance.punchData || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Load projects
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Reset modal
  useEffect(() => {
    const modalEl = document.getElementById("time_sheet_modal");
    const handleHide = () => {
      reset();
      setSelectedDate(null);
      setSelectedProject("");
      setTotalHours(0);
      setRemainingHours(0);
      setDeadline("");
      if (onClose) onClose();
    };
    if (modalEl) modalEl.addEventListener("hidden.bs.modal", handleHide);
    return () => {
      if (modalEl) modalEl.removeEventListener("hidden.bs.modal", handleHide);
    };
  }, [reset, onClose]);

  const filteredProjects = Projects?.filter((p) =>
    p?.projectMembers?.includes(userId)
  );

  // Prefill edit/view
  useEffect(() => {
    if ((isEditing || isViewing) && data) {
      setSelectedProject(data.project_id);
      setValue("project_id", data.project_id);

      const dateObj = new Date(data.work_date);
      setSelectedDate(dateObj);
      setValue("hours", data.hours);
      setValue("description", data.description);

      // Notes (optional)
      setValue("notes", data.notes || "");

      // ⭐ Run project calculations
      const proj = Projects?.find((p) => p.id === data.project_id);
      if (proj) {
        const start = new Date(proj.startDate);
        const end = new Date(proj.endDate);

        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const totalHrs = totalDays * 8;

        setTotalHours(totalHrs);

        const remDays = Math.ceil((end - dateObj) / (1000 * 60 * 60 * 24)) + 1;
        const remHrs = remDays * 8;

        setRemainingHours(remHrs > 0 ? remHrs : 0);
        setDeadline(end.toLocaleDateString("en-GB"));
      }
    }
  }, [isEditing, isViewing, data, Projects, setValue]);

  // Auto-calc when project changes
  const handleProjectChange = (e) => {
    const projId = e.target.value;
    setSelectedProject(projId);
    setValue("project_id", projId);

    const proj = filteredProjects.find((p) => p.id === projId);
    if (proj) {
      const start = new Date(proj.startDate);
      const end = new Date(proj.endDate);

      const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      const totalHrs = totalDays * 8; // 8 hours/day

      setDeadline(end.toLocaleDateString("en-GB")); // dd/mm/yyyy
      setTotalHours(totalHrs);

      // If date selected, update remaining hours
      if (selectedDate) {
        const remDays =
          Math.ceil((end - selectedDate) / (1000 * 60 * 60 * 24)) + 1;
        const remHrs = remDays * 8;
        setRemainingHours(remHrs > 0 ? remHrs : 0);
        setValue("hours", remHrs > 0 ? remHrs : 0);
      }
    }
  };

  // Auto-calc remaining hours when date changes
  const isSameDate = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // 🔹 Check Punch Data First
    const punch = punchData.find(
      (p) => p.employee_id === userId && isSameDate(new Date(p.punch_in), date)
    );

    if (punch) {
      setValue("hours", parseFloat(punch.work_hours || 0));
    } else {
      // 🔹 Punch record nahi mila = hours = 0
      setValue("hours", 0);
    }

    // 🔹 Project-based remaining hours calculation
    if (selectedProject) {
      const proj = filteredProjects.find((p) => p.id === selectedProject);
      if (proj) {
        const end = new Date(proj.endDate);
        const remDays = Math.ceil((end - date) / (1000 * 60 * 60 * 24)) + 1;
        const remHrs = remDays * 8;

        setRemainingHours(remHrs > 0 ? remHrs : 0);

        // ❗ Yahaan hours mat overwrite karo warna punch record ka value chala jayega.
        // ❗ Isliye hours set mat karo!
      }
    }
  };

  // Submit
  const onSubmit = async (formData) => {
    if (isViewing) return;

    if (!selectedProject) {
      customAlert("Please select a project.");
      return;
    }
    if (!selectedDate) {
      customAlert("Please select a date.");
      return;
    }

    const payload = {
      ...formData,
      project_id: selectedProject,
      work_date: selectedDate.toISOString().split("T")[0],
      user_id: userId,
    };

    try {
      let response;
      if (isEditing) {
        response = await dispatch(
          update_timesheet({ timesheet_id: data.key, formData: payload })
        );
      } else {
        response = await dispatch(add_timesheet(payload));
      }

      if (response?.payload?.success) {
        document.getElementById("closeTimeSheetModal")?.click();
        dispatch(get_all_timesheets());
      } else {
        customAlert(response?.payload?.message || "Error");
      }
    } catch (err) {
      console.error(err);
      customAlert("Server error");
    }
  };

  const modalTitle = isViewing
    ? "View Time Sheet"
    : isEditing
    ? "Edit Time Sheet"
    : "Add Time Sheet";

  return (
    <>
      <div
        id="time_sheet_modal"
        className="modal custom-modal fade"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalTitle}</h5>
              <button
                id="closeTimeSheetModal"
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  reset();
                  setSelectedDate(null);
                  setSelectedProject("");
                  setTotalHours(0);
                  setRemainingHours(0);
                  setDeadline("");
                  if (onClose) onClose();
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              {!isEditing && !isViewing ? (
                <span
                  style={{
                    backgroundColor: "#ffe5e5",
                    color: "#d60000",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    fontWeight: "600",
                    border: "1px solid #ffcccc",
                    display: "block",
                  }}
                >
                  ❌ Once you punch out then you can add a timesheet.
                </span>
              ) : null}

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Project */}
                <div className="row">
                  <div className="input-block mb-3 col-sm-6">
                    <label className="col-form-label">
                      Project <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      {...register("project_id", {
                        required: "Project is required",
                      })}
                      value={selectedProject}
                      onChange={handleProjectChange}
                      disabled={isViewing}
                    >
                      <option value="">Select Project</option>
                      {filteredProjects?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.projectName}
                        </option>
                      ))}
                    </select>
                    {errors.project_id && (
                      <small className="text-danger">
                        {errors.project_id.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* Date + Hours */}
                <div className="row">
                  <div className="input-block mb-3 col-sm-6">
                    <label className="col-form-label">
                      Date <span className="text-danger">*</span>
                    </label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      className="form-control"
                      dateFormat="dd-MM-yyyy"
                      disabled={isViewing}
                    />
                  </div>
                  <div className="input-block mb-3 col-sm-6">
                    <label className="col-form-label">
                      Hours <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      {...register("hours", { required: "Hours required" })}
                      readOnly
                      value={watch("hours")}
                      onChange={(e) => setValue("hours", e.target.value)}
                    />
                  </div>
                </div>

                {/* Deadline, Total, Remaining */}
                <div className="row">
                  <div className="input-block mb-3 col-sm-4">
                    <label className="col-form-label">Deadline</label>
                    <input
                      type="text"
                      className="form-control"
                      value={deadline}
                      readOnly
                    />
                  </div>
                  <div className="input-block mb-3 col-sm-4">
                    <label className="col-form-label">Total Hours</label>
                    <input
                      type="text"
                      className="form-control"
                      value={totalHours}
                      readOnly
                    />
                  </div>
                  <div className="input-block mb-3 col-sm-4">
                    <label className="col-form-label">Remaining Hours</label>
                    <input
                      type="text"
                      className="form-control"
                      value={remainingHours}
                      readOnly
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="input-block mb-3">
                  <label className="col-form-label">Description</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="Enter work details"
                    {...register("description")}
                    disabled={isViewing}
                  />
                </div>

                {!isViewing && (
                  <div className="submit-section">
                    <button
                      className="btn btn-primary submit-btn"
                      type="submit"
                    >
                      {isEditing ? "Update" : "Add"} TimeSheet
                    </button>
                  </div>
                )}

                {isViewing && data?.notes && (
                  <div className="input-block mb-3">
                    <label className="col-form-label">Notes</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      value={data.notes}
                      readOnly
                    />
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
