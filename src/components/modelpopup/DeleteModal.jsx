/** @format */

import React from "react";
import { useDispatch } from "react-redux";
import {
  deleteLeave,
  getAllLeaves,
  getLeaves,
  deleteLeaveAdmin,
} from "../../Redux/services/EmployeeLeaves";
import { deleteClient, fetchClients } from "../../Redux/services/Client";
import { deleteFile, fetchFiles } from "../../Redux/services/File";
import { delete_employee } from "../../Redux/services/Employee";
import {
  deleteDepartment,
  get_department_data,
} from "../../Redux/services/Department";
import {
  deletePerformanceAppraisal,
  fetchPerformanceAppraisals,
} from "../../Redux/services/PerformanceAppraisal";
import { fetchNotifications } from "../../Redux/services/Notifications";
import {
  get_terminations,
  delete_termination,
} from "../../Redux/services/Termination";
import { customAlert } from "../../utils/Alert";
import {
  fetchJobApplications,
  deleteJobApplication,
} from "../../Redux/services/JobForm";
import { get_holidays, delete_holiday } from "../../Redux/services/Holiday";
import { getAdapter } from "axios";
import {
  get_designation_data,
  delete_designation,
} from "../../Redux/services/Designation";
import { deleteTraining, getTrainings } from "../../Redux/services/Training";
import {
  deleteTrainingType,
  getTrainingTypes,
} from "../../Redux/services/TrainingType";
import { fetchTrainings } from "../../Redux/features/TrainingSlice";
import { delete_timesheet } from "../../Redux/services/Timesheet";
import {
  deleteInternshipApplication,
  fetchInternshipApplications,
} from "../../Redux/services/InternshipForm";
const DeleteModal = (props) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      // ✅ Always call onConfirm if passed
      if (typeof props.onConfirm === "function") {
        await props.onConfirm(); // This handles Goal Tracking (API-based)
      }

      // ✅ Redux-based deletions
      if (props.Name === "Delete Leaves" && props.Id) {
        const response = await dispatch(deleteLeave({ id: props.Id }));
        if (response?.payload?.status) {
          await dispatch(getLeaves());
          await dispatch(fetchNotifications()); // 🔹 fetch notifications after delete
          customAlert(response?.payload?.message, "success");
        } else {
          customAlert(response?.payload?.message, "fail");
        }
      }

      if (props.Name === "Delete Department" && props.Id) {
        const response = await dispatch(deleteDepartment(props.Id));
        if (response?.payload?.status) {
          await dispatch(get_department_data());
          await dispatch(fetchNotifications()); // 🔹 fetch notifications after delete
        } else {
        }
      }

      if (props.Name === "Delete Holiday" && props.Id) {
        const response = await dispatch(delete_holiday(props.Id));
        if (response?.payload?.status) {
          await dispatch(get_holidays());
          await dispatch(fetchNotifications()); // 🔹 fetch notifications after delete
        } else {
        }
      } else if (props.Name === "Delete Client" && props.Id) {
        const response = await dispatch(deleteClient({ id: props.Id }));
        if (response?.payload?.status) {
          await dispatch(fetchClients());
          await dispatch(fetchNotifications()); // 🔹 fetch notifications
          customAlert(response?.payload?.message, "success");
        } else {
          customAlert(response?.payload?.message, "fail");
        }
      } else if (props.Name === "Delete File" && props.Id) {
        const response = await dispatch(deleteFile(props.Id));
        if (response?.payload?.status) {
          await dispatch(fetchFiles());
          await dispatch(fetchNotifications()); // 🔹 fetch notifications
          customAlert(response?.payload?.message, "success");
        } else {
          customAlert(response?.payload?.message, "fail");
        }
      } else if (props.Name === "Delete Employee" && props.Id) {
        const response = await dispatch(delete_employee(props.Id));
        await dispatch(fetchNotifications()); // 🔹 fetch notifications
      } else if (props.Name === "Delete Performance" && props.Id) {
        const response = await dispatch(deletePerformanceAppraisal(props.Id));
        if (response?.payload?.status) {
          await dispatch(fetchPerformanceAppraisals());
          await dispatch(fetchNotifications()); // 🔹 fetch notifications
          customAlert(response?.payload?.message, "success");
        } else {
          customAlert(response?.payload?.message, "fail");
        }
      } else if (props.Name === "Delete Termination" && props.Id) {
        const response = await dispatch(delete_termination(props.Id));
        if (response?.payload?.status) {
          await dispatch(get_terminations());
        } else {
        }
      } else if (props.Name === "Delete Candidates" && props.Id) {
        const response = await dispatch(deleteJobApplication(props.Id));
        if (response?.payload?.status) {
          await dispatch(fetchJobApplications());
          customAlert(response?.payload?.message, "success");
        } else {
          customAlert(response?.payload?.message, "fail");
        }
      } else if (props.Name === "Delete Intern" && props.Id) {
        const response = await dispatch(deleteInternshipApplication(props.Id));
        if (response?.payload?.success) {
          await dispatch(fetchInternshipApplications());
          customAlert(response?.payload?.message, "success");
        } else {
          customAlert(response?.payload?.message, "fail");
        }
      } else if (props.Name === "Delete Designation" && props.Id) {
        const response = await dispatch(delete_designation(props.Id));
        if (response?.payload?.status) {
          await dispatch(get_designation_data());
          customAlert(response?.payload?.message, "success");
        } else {
          customAlert(response?.payload?.message, "fail");
        }
      } else if (props.Name === "Delete AdminLeave" && props.Id) {
        const response = await dispatch(deleteLeaveAdmin(props.Id));
        if (response?.payload?.status) {
          await dispatch(getAllLeaves());
          customAlert(response?.payload?.message, "success");
        } else {
          customAlert(response?.payload?.message, "fail");
        }
      } else if (props.Name === "Delete Training" && props.Id) {
        const response = await dispatch(deleteTraining(props.Id));
        if (response?.payload?.success) {
          // 🔹 Call parent’s fetchData to refresh the list
          if (typeof props.fetchData === "function") {
            await props.fetchData();
          }
        } else {
        }
      } else if (props.Name === "Delete TimeSheet" && props.Id) {
        const response = await dispatch(delete_timesheet(props.Id));
        if (response?.payload?.success) {
          // 🔹 Call parent’s fetchData to refresh the list
          if (typeof props.fetchData === "function") {
            await props.fetchData();
          }
        } else {
        }
      }
      // ✅ Close modal after deletion
      const closeButton = document.querySelector("#delete .cancel-btn");
      closeButton?.click();
    } catch (error) {
      customAlert(error?.message || "Failed to delete", "fail");
    }
  };

  return (
    <div className="modal custom-modal fade" id="delete" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body">
            <div className="form-header text-center">
              <h3>{props.Name}</h3>
              <p>Are you sure you want to delete?</p>
            </div>
            <div className="modal-btn delete-action d-flex justify-content-center gap-3">
              <button
                className="btn btn-danger continue-btn"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="btn btn-secondary cancel-btn"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
