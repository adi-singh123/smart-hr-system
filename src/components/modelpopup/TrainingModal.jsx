/** @format */

import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { message } from "antd";
import * as bootstrap from "bootstrap";
import { useDispatch } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";

import { get_employee_data } from "../../Redux/services/Employee";
import { getTrainingTypes } from "../../Redux/services/TrainingType";
import { addTraining, updateTraining } from "../../Redux/services/Training";

const TrainingModal = ({ fetchData, editRecord, setEditRecord }) => {
  const dispatch = useDispatch();

  const [trainer, setTrainer] = useState("");
  const [employees, setEmployees] = useState([]); // ✅ store all employees
  const [selectedEmployee, setSelectedEmployee] = useState(null); // ✅ selected employee

  const [trainingType, setTrainingType] = useState("");
  const [trainingTypesOptions, setTrainingTypesOptions] = useState([]);
  const [trainingCost, setTrainingCost] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": { backgroundColor: "#ff9b44" },
    }),
  };

  const resetForm = () => {
    setTrainer("");
    setSelectedEmployee(null);
    setTrainingType("");
    setTrainingCost("");
    setStartDate(null);
    setEndDate(null);
    setDescription("");
    setStatus("Active");
    setEditRecord(null);
  };

  // ✅ Fetch employees (excluding admins)
  const fetchEmployees = async () => {
    const res = await dispatch(get_employee_data());
    const users = res?.payload?.data?.users || [];
    const filtered = users.filter(
      (u) => u?.role?.name?.toLowerCase() !== "admin"
    );
    setEmployees(filtered);
  };

  // ✅ Fetch training types
  const fetchTypes = async () => {
    try {
      const res = await getTrainingTypes();
      const options = res.data.map((item) => ({
        label: item.type,
        value: item.id,
      }));
      setTrainingTypesOptions(options);
    } catch (err) {
      console.error(err);
      message.error("Failed to load training types");
    }
  };

  useEffect(() => {
    fetchTypes();
    fetchEmployees();
  }, []);

  // ✅ Prefill when editing
  useEffect(() => {
    if (editRecord) {
      setTrainer(editRecord.trainer_id || "");

      const emp = employees.find(
        (e) =>
          `${e.first_name} ${e.last_name}`.trim().toLowerCase() ===
          (editRecord.employees_id || "").trim().toLowerCase()
      );
      setSelectedEmployee(emp || null);

      const selectedType = trainingTypesOptions.find(
        (opt) => opt.label === editRecord.traning_type_id
      );
      setTrainingType(selectedType ? selectedType.value : "");
      setTrainingCost(editRecord.training_cost || "");
      setStartDate(
        editRecord.start_date ? new Date(editRecord.start_date) : null
      );
      setEndDate(editRecord.end_date ? new Date(editRecord.end_date) : null);
      setDescription(editRecord.description || "");
      setStatus(editRecord.status || "Active");
    } else {
      resetForm();
    }
  }, [editRecord, employees, trainingTypesOptions]);

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !trainer ||
      !selectedEmployee ||
      !trainingType ||
      !trainingCost ||
      !startDate ||
      !endDate ||
      !description
    ) {
      message.error("Please fill all required fields");
      return;
    }

    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
    const formatDateTime = (date) =>
      new Date(date).toISOString().slice(0, 19).replace("T", " ");

    const now = new Date();
    const payload = {
      trainer_id: trainer,
      employees_id: selectedEmployee
        ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
        : "",
      traning_type_id: trainingTypesOptions.find(
        (opt) => opt.value === trainingType
      )?.label,
      training_cost: trainingCost,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      description,
      status,
      created_at: formatDateTime(now),
      updated_at: formatDateTime(now),
    };

    try {
      if (editRecord?.id) {
        await updateTraining(editRecord.id, payload);
        message.success("Training updated successfully");
      } else {
        await addTraining(payload);
        message.success("Training added successfully");
      }

      fetchData();

      const modalId = editRecord ? "edit_training" : "add_training";
      setTimeout(() => {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
          const instance =
            bootstrap.Modal.getInstance(modalElement) ||
            new bootstrap.Modal(modalElement);
          instance.hide();
        }
        document.body.classList.remove("modal-open");
        document
          .querySelectorAll(".modal-backdrop")
          .forEach((el) => el.remove());
      }, 300);

      resetForm();
    } catch (err) {
      console.error("API Error:", err?.response?.data || err.message);
      message.error("Operation failed");
    }
  };

  const renderModal = (id, title) => (
    <div id={id} className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => {
                const modalEl = document.getElementById(id);
                const modalInstance =
                  bootstrap.Modal.getInstance(modalEl) ||
                  new bootstrap.Modal(modalEl);
                modalInstance.hide();
                document
                  .querySelectorAll(".modal-backdrop")
                  .forEach((b) => b.remove());
                document.body.classList.remove("modal-open");
                resetForm();
              }}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Training Type */}
                <div className="col-sm-6 mb-3">
                  <label>Training Type *</label>
                  <Select
                    options={trainingTypesOptions}
                    value={trainingTypesOptions.find(
                      (opt) => opt.value === trainingType
                    )}
                    onChange={(selected) => setTrainingType(selected.value)}
                    styles={customStyles}
                  />
                </div>

                {/* Trainer */}
                <div className="col-sm-6 mb-3">
                  <label>Trainer *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter trainer name"
                    value={trainer}
                    onChange={(e) => setTrainer(e.target.value)}
                  />
                </div>

                {/* Employee Dropdown */}
                <div className="col-sm-6 mb-3">
                  <label>Employee *</label>
                  <select
                    className="form-control"
                    value={selectedEmployee?.id || ""}
                    onChange={(e) => {
                      const emp = employees.find(
                        (u) => u.id === e.target.value
                      );
                      setSelectedEmployee(emp || null);
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

                {/* Cost */}
                <div className="col-sm-6 mb-3">
                  <label>Training Cost *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter cost"
                    value={trainingCost}
                    onChange={(e) => setTrainingCost(e.target.value)}
                  />
                </div>

                {/* Dates */}
                <div className="col-sm-6 mb-3">
                  <label>Start Date *</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                <div className="col-sm-6 mb-3">
                  <label>End Date *</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>

                {/* Description */}
                <div className="col-sm-12 mb-3">
                  <label>Description *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Status */}
                <div className="col-sm-12 mb-3">
                  <label>Status</label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find((opt) => opt.value === status)}
                    onChange={(selected) => setStatus(selected.value)}
                    styles={customStyles}
                  />
                </div>
              </div>
              <div className="submit-section text-end">
                <button type="submit" className="btn btn-primary submit-btn">
                  {editRecord ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderModal("add_training", "Add Training")}
      {renderModal("edit_training", "Edit Training")}
    </>
  );
};

export default TrainingModal;
