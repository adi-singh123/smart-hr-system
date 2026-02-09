/** @format */

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { get_employee_data } from "../../Redux/services/Employee";
import {
  add_update_resignation,
  get_resignations,
} from "../../Redux/services/Resignation";
import { get_all_active_departments } from "../../Redux/services/Department";
import { customAlert } from "../../utils/Alert";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import * as bootstrap from "bootstrap";

const ResignationModal = ({ editingData, onClose, fetchResignations }) => {
  const dispatch = useDispatch();
  const ActiveDepartments = useSelector(
    (state) => state?.department?.ActiveDepartments
  );

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [department, setDepartment] = useState("");
  const [selectedNoticeDate, setSelectedNoticeDate] = useState(null);
  const [selectedResignationDate, setSelectedResignationDate] = useState(null);
  const [reason, setReason] = useState("");

  // Fetch all active departments on mount
  useEffect(() => {
    dispatch(get_all_active_departments());
  }, [dispatch]);

  // Fetch employees excluding Admin
  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await dispatch(get_employee_data());
      const users = res?.payload?.data?.users || [];
      const filtered = users.filter(
        (u) => u?.role?.name?.toLowerCase() !== "admin"
      );
      setEmployees(filtered);
    };
    fetchEmployees();
  }, [dispatch]);

  // Prefill edit data
  useEffect(() => {
    if (editingData) {
      console.log("editingDAta", editingData);
      const emp = employees.find(
        (e) => `${e.first_name} ${e.last_name}` === editingData.employee_name
      );
      setSelectedEmployee(emp || null);
      setDepartment(editingData.department || "");
      setSelectedNoticeDate(
        editingData.notice_date ? new Date(editingData.notice_date) : null
      );
      setSelectedResignationDate(
        editingData.resignation_date
          ? new Date(editingData.resignation_date)
          : null
      );
      setReason(editingData.reason || "");
    } else {
      resetForm();
    }
  }, [editingData, employees]);

  const resetForm = () => {
    setSelectedEmployee(null);
    setDepartment("");
    setSelectedNoticeDate(null);
    setSelectedResignationDate(null);
    setReason("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedEmployee ||
      !department ||
      !selectedNoticeDate ||
      !selectedResignationDate ||
      !reason
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      id: editingData?.id,
      employee_name: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
      department,
      notice_date: selectedNoticeDate.toISOString().split("T")[0],
      resignation_date: selectedResignationDate.toISOString().split("T")[0],
      reason,
    };

    const response = await dispatch(add_update_resignation(payload));
    if (response?.payload?.status || response?.payload?.success) {
      customAlert(
        response?.payload?.message || "Resignation submitted successfully!",
        "success"
      );
      await dispatch(get_resignations());
      fetchResignations?.();

      // Remove focus first
      if (document.activeElement) document.activeElement.blur();

      // Close modal properly
      const modalId = editingData ? "edit_resignation" : "add_resignation";
      const modalEl = document.getElementById(modalId);
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
          modalEl.addEventListener(
            "hidden.bs.modal",
            () => {
              // Clean up everything AFTER bootstrap fully hides it
              document.body.classList.remove("modal-open");
              document
                .querySelectorAll(".modal-backdrop")
                .forEach((b) => b.remove());
              resetForm();
              onClose?.();
            },
            { once: true }
          );
          modalInstance.hide();
        } else {
          // fallback safety
          document
            .querySelectorAll(".modal-backdrop")
            .forEach((b) => b.remove());
          resetForm();
          onClose?.();
        }
      }
    } else {
      customAlert(
        response?.payload?.message || "Failed to submit resignation",
        "error"
      );
    }
  };

  return (
    <>
      {/* Add Resignation Modal */}
      <div
        id="add_resignation"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Resignation</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => {
                  const modalId = editingData
                    ? "edit_resignation"
                    : "add_resignation";
                  const modalEl = document.getElementById(modalId);
                  if (modalEl) {
                    const modalInstance =
                      bootstrap.Modal.getInstance(modalEl) ||
                      new bootstrap.Modal(modalEl);
                    modalInstance.hide();

                    // Remove backdrop
                    document
                      .querySelectorAll(".modal-backdrop")
                      .forEach((b) => b.remove());
                    document.body.classList.remove("modal-open");

                    // Reset form & trigger parent onClose
                    resetForm();
                    onClose?.();
                  }
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {/* Employee Dropdown */}
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Resigning Employee <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={selectedEmployee?.id || ""}
                    onChange={(e) => {
                      const emp = employees.find(
                        (emp) => emp.id === e.target.value
                      );
                      setSelectedEmployee(emp);
                      setDepartment(emp?.department || "");
                    }}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.first_name} {emp.last_name} ({emp.role?.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department Dropdown */}
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Department <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {ActiveDepartments?.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notice Date */}
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Notice Date <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    selected={selectedNoticeDate}
                    onChange={setSelectedNoticeDate}
                    className="form-control"
                    placeholderText="Select notice date"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>

                {/* Resignation Date */}
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Resignation Date <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    selected={selectedResignationDate}
                    onChange={setSelectedResignationDate}
                    className="form-control"
                    placeholderText="Select resignation date"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>

                {/* Reason */}
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Enter resignation reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <div className="submit-section text-end">
                  <button type="submit" className="btn btn-primary submit-btn">
                    {editingData ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Resignation Modal */}
      <div
        id="edit_resignation"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Resignation</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  resetForm();
                  onClose?.();
                }}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {/* Employee Dropdown */}
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Resigning Employee <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={selectedEmployee?.id || ""}
                    onChange={(e) => {
                      const emp = employees.find(
                        (emp) => emp.id === e.target.value
                      );
                      setSelectedEmployee(emp);
                      setDepartment(emp?.department || "");
                    }}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.first_name} {emp.last_name} ({emp.role?.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department Dropdown */}
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Department <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {ActiveDepartments?.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notice Date */}
                <div className="input-block mb-3">
                  <label className="col-form-label">Notice Date</label>
                  <DatePicker
                    selected={selectedNoticeDate}
                    onChange={setSelectedNoticeDate}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>

                {/* Resignation Date */}
                <div className="input-block mb-3">
                  <label className="col-form-label">Resignation Date</label>
                  <DatePicker
                    selected={selectedResignationDate}
                    onChange={setSelectedResignationDate}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>

                {/* Reason */}
                <div className="input-block mb-3">
                  <label className="col-form-label">Reason</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <div className="submit-section text-end">
                  <button type="submit" className="btn btn-primary submit-btn">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResignationModal;
