/** @format */

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  adminAddLeave,
  updateLeave,
  getAllLeaves,
} from "../../Redux/services/EmployeeLeaves";
import { getAllUsers } from "../../Redux/services/User";
import { customAlert } from "../../utils/Alert";

export const AdminLeaveAddModelPopup = ({
  isEditing = false,
  isViewing = false,
  leaveData = null,
  onClose,
}) => {
  const dispatch = useDispatch();

  const leaveOptions = [
    { value: "Casual Leave 12 Days", label: "Casual Leave 12 Days" },
    { value: "Medical Leave", label: "Medical Leave" },
    { value: "Loss of Pay", label: "Loss of Pay" },
  ];

  const usersState = useSelector((state) => state.users); // users slice
  const allUsers = useSelector((state) => state?.employee?.employeeData.users);

  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [leaveType, setLeaveType] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [numDays, setNumDays] = useState(0);
  const [leaveReason, setLeaveReason] = useState("");
  const [remainingLeaves, setRemainingLeaves] = useState(0);
  const [status, setStatus] = useState("Pending");

  // 🔹 Fetch users via Redux and filter Admins
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (allUsers.length) {
      const adminsList = allUsers
        .filter((user) => user.role?.name.toLowerCase() === "admin")
        .map((admin) => ({
          value: admin.id,
          label:
            admin.first_name + (admin.last_name ? " " + admin.last_name : ""),
        }));
      setAdmins(adminsList);
    }
  }, [allUsers]);

  // 🔹 Calculate working days
  const calculateWorkingDays = (start, end) => {
    let count = 0;
    let current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  useEffect(() => {
    if (fromDate && toDate) {
      setNumDays(calculateWorkingDays(fromDate, toDate));
    }
  }, [fromDate, toDate]);

  // 🔹 Prefill for edit/view
  useEffect(() => {
    if ((isEditing || isViewing) && leaveData) {
      setSelectedAdmin({
        value: leaveData.admin_id,
        label: leaveData.name,
      });
      setLeaveType({
        value: leaveData.leave_type,
        label: leaveData.leave_type,
      });
      setFromDate(new Date(leaveData.from));
      setToDate(new Date(leaveData.to));
      setLeaveReason(leaveData.leave_reason);
      setNumDays(leaveData.no_of_days);
      setRemainingLeaves(leaveData.remaining_leaves || 0);
      setStatus(leaveData.status || "Pending");
    } else {
      resetForm();
    }
  }, [isEditing, isViewing, leaveData]);

  const resetForm = () => {
    setSelectedAdmin(null);
    setLeaveType(null);
    setFromDate(null);
    setToDate(null);
    setNumDays(0);
    setLeaveReason("");
    setRemainingLeaves(0);
    setStatus("Pending");
    if (onClose) onClose();
  };

  const handleReasonChange = (e) => {
    const value = e.target.value;
    setLeaveReason(value.charAt(0).toUpperCase() + value.slice(1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewing) return;

    if (!leaveType || !fromDate || !toDate || !leaveReason || !selectedAdmin) {
      customAlert("Please fill all required fields ❌", "error");
      return;
    }

    try {
      const payload = {
        admin_id: selectedAdmin.value,
        admin_name: selectedAdmin.label,
        leave_type: leaveType.value,
        fromDate: fromDate.toISOString().split("T")[0],
        toDate: toDate.toISOString().split("T")[0],
        no_of_days: numDays,
        remaining_leaves: remainingLeaves,
        leave_reason: leaveReason,
        status,
      };

      if (isEditing && leaveData) {
        payload.id = leaveData.id;
        await dispatch(updateLeave(payload)).unwrap();
        customAlert("Admin leave updated successfully ✅", "success");
      } else {
        await dispatch(adminAddLeave(payload)).unwrap();
        customAlert("Admin leave added successfully ✅", "success");
      }

      resetForm();
      document.getElementById("closeAdminLeave")?.click();
      dispatch(getAllLeaves());
    } catch (err) {
      console.error(err);
      customAlert(err?.message || "Server error ❌", "error");
    }
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": { backgroundColor: "#ff9b44" },
    }),
  };

  const modalTitle = isViewing
    ? "View Admin Leave"
    : isEditing
    ? "Edit Admin Leave"
    : "Add Admin Leave";

  return (
    <div id="add_leave" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modalTitle}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="closeAdminLeave"
              onClick={resetForm}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Admin */}
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Admin <span className="text-danger">*</span>
                </label>
                <Select
                  options={admins}
                  placeholder="Select Admin"
                  styles={customStyles}
                  value={selectedAdmin}
                  onChange={setSelectedAdmin}
                  isDisabled={isViewing}
                  isLoading={admins.length === 0}
                />
              </div>

              {/* Leave Type */}
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Leave Type <span className="text-danger">*</span>
                </label>
                <Select
                  options={leaveOptions}
                  placeholder="Select Leave Type"
                  styles={customStyles}
                  value={leaveType}
                  onChange={setLeaveType}
                  isDisabled={isViewing}
                />
              </div>

              {/* From Date */}
              <div className="input-block mb-3">
                <label className="col-form-label">From</label>
                <DatePicker
                  selected={fromDate}
                  onChange={setFromDate}
                  className="form-control"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select start date"
                  maxDate={toDate}
                  disabled={isViewing}
                />
              </div>

              {/* To Date */}
              <div className="input-block mb-3">
                <label className="col-form-label">To</label>
                <DatePicker
                  selected={toDate}
                  onChange={setToDate}
                  className="form-control"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select end date"
                  minDate={fromDate}
                  disabled={isViewing}
                />
              </div>

              {/* Number of Days */}
              <div className="input-block mb-3">
                <label className="col-form-label">Number of Days</label>
                <input
                  className="form-control"
                  readOnly
                  value={numDays}
                  type="number"
                />
              </div>

              {/* Leave Reason */}
              <div className="input-block mb-3">
                <label className="col-form-label">Leave Reason</label>
                <textarea
                  rows={4}
                  className="form-control"
                  placeholder="Enter reason"
                  value={leaveReason}
                  onChange={handleReasonChange}
                  disabled={isViewing}
                />
              </div>

              {/* Submit Button */}
              {!isViewing && (
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    {isEditing ? "Update" : "Add"} Leave
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
