/** @format */

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useDispatch } from "react-redux";
import {
  fetchPromotions,
  addOrUpdatePromotion,
} from "../../Redux/services/Promotion";
import { get_employee_data } from "../../Redux/services/Employee";
import { getFullUserById } from "../../Redux/services/User";
import { customAlert } from "../../utils/Alert"; // Use custom alert
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import * as bootstrap from "bootstrap";
const PromotionModal = ({ editingData, onClose }) => {
  const dispatch = useDispatch();

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [fromDesignation, setFromDesignation] = useState("");
  const [toDesignation, setToDesignation] = useState("");
  const [promotionDate, setPromotionDate] = useState(new Date());
  const [status, setStatus] = useState("Pending");

  // Fetch employees
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

  // Prefill editing data
  useEffect(() => {
    if (editingData) {
      setName(editingData.name || "");
      setRole(editingData.role || "");
      setDepartment(editingData.department || "");
      setFromDesignation(editingData.from_designation || "");
      setToDesignation(editingData.to_designation || "");
      setPromotionDate(
        editingData.promotion_date
          ? new Date(editingData.promotion_date)
          : new Date()
      );
      setStatus(editingData.status || "Pending");
    } else {
      resetForm();
    }
  }, [editingData]);

  // Prefill selected employee
  useEffect(() => {
    if (editingData && employees.length > 0) {
      const emp = employees.find(
        (e) => `${e.first_name} ${e.last_name}` === editingData.name
      );
      if (emp) setSelectedEmployee(emp);
    }
  }, [editingData, employees]);

  // Reset form
  const resetForm = () => {
    setSelectedEmployee(null);
    setName("");
    setRole("");
    setDepartment("");
    setFromDesignation("");
    setToDesignation("");
    setPromotionDate(new Date());
    setStatus("Pending");
  };

  // Employee select handler
  const handleEmployeeSelect = async (e) => {
    const emp = employees.find((u) => u.id === e.target.value);
    setSelectedEmployee(emp || null);

    if (emp) {
      setName(`${emp.first_name} ${emp.last_name}`);
      const res = await dispatch(
        getFullUserById({ userId: emp.id, employeeId: emp.employee_id })
      );
      const data = res?.payload || {};
      setRole(data?.role?.name || "");
      setDepartment(data?.department?.name || "");

      // Reset promotionFor only if changed manually
      if (
        !editingData ||
        editingData.name !== `${emp.first_name} ${emp.last_name}`
      ) {
        setFromDesignation("");
      }
    }
  };
  useEffect(() => {
    const modalEl = document.getElementById("add_promotion");
    if (!modalEl) return;

    const handleHide = () => {
      resetForm();
    };

    modalEl.addEventListener("hidden.bs.modal", handleHide);

    return () => {
      modalEl.removeEventListener("hidden.bs.modal", handleHide);
    };
  }, []);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee || !fromDesignation.trim() || !toDesignation.trim()) {
      customAlert("Please fill all required fields.", "error");
      return;
    }

    const payload = {
      id: editingData?.id,
      name,
      role,
      department,
      fromDesignation,
      toDesignation,
      promotionDate: promotionDate.toISOString().split("T")[0],
      status,
      employee_id: selectedEmployee?.id,
    };

    const res = await dispatch(addOrUpdatePromotion(payload));

    if (res?.payload?.success) {
      await dispatch(fetchPromotions());
      resetForm();
      onClose?.();
      const modalEl = document.getElementById("add_promotion");
      if (modalEl) {
        const modal =
          bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();

        // ✅ Remove backdrop manually
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
          backdrop.parentNode.removeChild(backdrop);
        }

        // ✅ Remove modal-open class from body
        document.body.classList.remove("modal-open");
      }
    } else {
      customAlert(
        res?.payload?.message || "Failed to save promotion.",
        "error"
      );
    }
  };

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
  ];

  return (
    <div id="add_promotion" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingData ? "Edit Promotion" : "Add Promotion"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => {
                const modalEl = document.getElementById("add_promotion");
                if (modalEl) {
                  const modalInstance =
                    bootstrap.Modal.getInstance(modalEl) ||
                    new bootstrap.Modal(modalEl);
                  modalInstance.hide();

                  // ✅ Remove backdrop manually
                  const backdrop = document.querySelector(".modal-backdrop");
                  if (backdrop) backdrop.parentNode.removeChild(backdrop);

                  // ✅ Remove modal-open class from body
                  document.body.classList.remove("modal-open");

                  // Reset form
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
              {/* Employee */}
              <div className="input-block mb-3">
                <label>Employee Name *</label>
                <select
                  className="form-control"
                  value={selectedEmployee?.id || ""}
                  onChange={handleEmployeeSelect}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name} ({emp.role?.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Role */}
              <div className="input-block mb-3">
                <label>Role *</label>
                <input
                  type="text"
                  className="form-control"
                  value={role}
                  readOnly
                  placeholder="Auto-filled"
                />
              </div>

              {/* Department */}
              <div className="input-block mb-3">
                <label>Department *</label>
                <input
                  type="text"
                  className="form-control"
                  value={department}
                  readOnly
                  placeholder="Auto-fetched"
                />
              </div>

              {/* Promotion For */}
              <div className="input-block mb-3">
                <label>Promotion For *</label>
                <input
                  type="text"
                  className="form-control"
                  value={fromDesignation}
                  onChange={(e) => setFromDesignation(e.target.value)}
                  placeholder="Senior Developer"
                />
              </div>

              {/* Promoted To */}
              <div className="input-block mb-3">
                <label>Promoted To *</label>
                <input
                  type="text"
                  className="form-control"
                  value={toDesignation}
                  onChange={(e) => setToDesignation(e.target.value)}
                  placeholder="Junior Developer"
                />
              </div>

              {/* Promotion Date */}
              <div className="input-block mb-3">
                <label>Promotion Date</label>
                <DatePicker
                  selected={promotionDate}
                  onChange={(date) => setPromotionDate(date)}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              {/* Status */}
              <div className="input-block mb-4">
                <label>Status</label>
                <Select
                  options={statusOptions}
                  value={{ label: status, value: status }}
                  onChange={(e) => setStatus(e.value)}
                  placeholder="Select status"
                />
              </div>

              <div className="submit-section">
                <button type="submit" className="btn btn-primary submit-btn">
                  {editingData ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
