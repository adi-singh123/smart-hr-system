/** @format */

import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import {
  add_update_termination,
  get_terminations,
} from "../../Redux/services/Termination";
import { get_all_active_departments } from "../../Redux/services/Department";
import { get_employee_data } from "../../Redux/services/Employee";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

const TerminationModal = ({ editingData = null, isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const ActiveDepartments = useSelector(
    (state) => state?.department?.ActiveDepartments
  );

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [terminationType, setTerminationType] = useState("");
  const [terminationDate, setTerminationDate] = useState(null);
  const [noticeDate, setNoticeDate] = useState(null);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("Active");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const selectMisconduct = [
    { label: "Misconduct", value: "Misconduct" },
    { label: "Others", value: "Others" },
  ];

  const fetchDepartments = useCallback(async () => {
    try {
      await dispatch(get_all_active_departments());
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  }, [dispatch]);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await dispatch(get_employee_data());
      const users = res?.payload?.data?.users || [];
      const filtered = users.filter(
        (user) => user?.role?.name?.toLowerCase() !== "admin"
      );
      setEmployees(filtered);

      // ✅ If editingData exists, pre-select employee
      if (editingData?.terminated_employee) {
        const emp = filtered.find(
          (e) =>
            `${e.first_name} ${e.last_name}` === editingData.terminated_employee
        );
        setSelectedEmployee(emp || null);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  }, [dispatch, editingData]);

  const resetForm = () => {
    setSelectedEmployee(null);
    setTerminationType("");
    setTerminationDate(null);
    setNoticeDate(null);
    setReason("");
    setStatus("Active");
    setDepartment("");
  };

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();

    if (editingData) {
      setTerminationType(editingData.termination_type || "");
      setTerminationDate(
        editingData.termination_date
          ? new Date(editingData.termination_date)
          : null
      );
      setNoticeDate(
        editingData.notice_date ? new Date(editingData.notice_date) : null
      );
      setReason(editingData.reason || "");
      setStatus(editingData.status || "Active");
      setDepartment(editingData.department || "");
    } else {
      resetForm();
    }
  }, [editingData, fetchDepartments, fetchEmployees]);

  const closeModal = () => {
    const modalEl = document.getElementById("termination_model");
    if (modalEl) {
      const bsModal =
        bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      bsModal.hide();
    }
    document.body.classList.remove("modal-open");
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedEmployee ||
      !terminationType ||
      !terminationDate ||
      !noticeDate ||
      !reason ||
      !department
    ) {
      return;
    }

    const payload = {
      id: editingData?.id || undefined,
      terminated_employee: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
      employee_id: selectedEmployee?.employee_id || null,
      termination_type: terminationType,
      termination_date: terminationDate.toISOString().split("T")[0],
      notice_date: noticeDate.toISOString().split("T")[0],
      reason: reason.trim(),
      status,
      department,
    };

    try {
      setLoading(true);
      const response = await dispatch(add_update_termination(payload));

      // ✅ Always check the actual status or existence of response
      if (response?.payload?.status || response?.payload?.success) {
        await dispatch(get_terminations());
        closeModal(); // ✅ Close modal after successful update
      } else {
        console.error("Update failed:", response);
      }
    } catch (err) {
      console.error("Error submitting termination:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const modalEl = document.getElementById("termination_model");
    if (!modalEl) return;

    const bsModal =
      bootstrap.Modal.getInstance(modalEl) ||
      new bootstrap.Modal(modalEl, { backdrop: "static", keyboard: true });

    if (isOpen) bsModal.show();
    else bsModal.hide();

    const handleHidden = () => {
      resetForm();
      setIsOpen(false);
      document.body.classList.remove("modal-open");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };

    modalEl.addEventListener("hidden.bs.modal", handleHidden);
    return () => modalEl.removeEventListener("hidden.bs.modal", handleHidden);
  }, [isOpen, setIsOpen]);

  return (
    <div
      id="termination_model"
      className="modal custom-modal fade"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingData ? "Edit Termination" : "Add Termination"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeModal} // ✅ make close button functional
              style={{
                border: "none",
                background: "transparent",
                fontSize: "1.5rem",
                fontWeight: "bold",
                lineHeight: "1",
                color: "#000",
              }}
            >
              &times;
            </button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Employee Dropdown */}
              <div className="form-group mb-3">
                <label>Terminated Employee</label>
                <select
                  className="form-control"
                  value={selectedEmployee?.id || ""}
                  onChange={(e) => {
                    const emp = employees.find(
                      (emp) => emp.id === e.target.value
                    );
                    setSelectedEmployee(emp || null);
                  }}
                  required
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
              <div className="form-group mb-3">
                <label>Department</label>
                <select
                  className="form-control"
                  value={department || ""}
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

              <div className="form-group mb-3">
                <label>Termination Type</label>
                <select
                  className="form-control"
                  value={terminationType}
                  onChange={(e) => setTerminationType(e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  {selectMisconduct.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-3">
                <label>Termination Date</label>
                <DatePicker
                  selected={terminationDate}
                  onChange={setTerminationDate}
                  className="form-control"
                  placeholderText="Select termination date"
                  dateFormat="yyyy-MM-dd"
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Notice Date</label>
                <DatePicker
                  selected={noticeDate}
                  onChange={setNoticeDate}
                  className="form-control"
                  placeholderText="Select notice date"
                  dateFormat="yyyy-MM-dd"
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Reason</label>
                <textarea
                  className="form-control"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Reason for termination"
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Status</label>
                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="submit-section text-end">
                <button
                  type="submit"
                  className="btn btn-primary submit-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editingData
                    ? "Update Termination"
                    : "Save Termination"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminationModal;
