/** @format */

import React, { useEffect, useState } from "react";
import Select from "react-select";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { get_all_active_departments } from "../../Redux/services/Department";
import { get_employee_data } from "../../Redux/services/Employee";
import {
  add_shift_roster,
  update_shift_roster,
} from "../../Redux/services/ShiftRoster";
import { useDispatch, useSelector } from "react-redux";

dayjs.extend(customParseFormat);

const shifts = [
  { value: "morning", label: "Morning Shift" },
  { value: "evening", label: "Evening Shift" },
  { value: "night", label: "Night Shift" },
];

const ScheduleModelPopup = ({ isOpen, initialData, onClose }) => {
  const dispatch = useDispatch();

  // Load Departments + Employees
  useEffect(() => {
    dispatch(get_all_active_departments());
    dispatch(get_employee_data());
  }, [dispatch]);

  // Redux Data
  const departmentsList = useSelector(
    (state) => state?.department?.ActiveDepartments
  );

  const AllEmployeeData = useSelector((state) => state?.employee?.employeeData);
  const users = AllEmployeeData?.users || [];

  // Local states
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [shiftDate, setShiftDate] = useState(dayjs().format("YYYY-MM-DD"));

  // Convert Departments → Select Dropdown
  const departments = (departmentsList || []).map((d) => ({
    value: d.id,
    label: d.name,
  }));

  // Auto Filter Employees Based on Department
  const employeeOptions = selectedDepartment
    ? users
        .filter((u) => u.department_id === selectedDepartment.value)
        .map((u) => ({
          value: u.id,
          label: `${u.first_name} ${u.last_name}`,
        }))
    : [];

  // Shift Types

  useEffect(() => {
    if (isOpen && !initialData) {
      setSelectedDepartment(null);
      setSelectedEmployees([]);
      setSelectedShift(null); // Add mode me shift empty hoga yahi sahi behavior
      setShiftDate(dayjs().format("YYYY-MM-DD"));
    }
  }, [isOpen, initialData]);

  // AUTOFILL (ADD + EDIT)
  useEffect(() => {
    if (!isOpen || !initialData) return;

    if (initialData) {
      // Autofill Department
      const dept = departments.find(
        (d) => d.value === initialData.department_id
      );
      setSelectedDepartment(dept || null);

      // Autofill Employees
      const selectedEmps = (initialData.attendance_ids || [])
        .map((id) => {
          const u = users.find((e) => e.id === id);
          return u
            ? { value: u.id, label: `${u.first_name} ${u.last_name}` }
            : null;
        })
        .filter(Boolean);

      setSelectedEmployees(selectedEmps);

      // Autofill Shift (edit mode)
      setSelectedShift(
        shifts.find((s) => s.value === initialData.shift_type) || null
      );

      // Autofill Date
      setShiftDate(initialData.shift_date);
    }
  }, [isOpen, initialData]);

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedDepartment ||
      selectedEmployees.length === 0 ||
      !selectedShift
    ) {
      alert("Please fill all required fields!");
      return;
    }

    const payload = {
      department_id: selectedDepartment.value,
      attendance_ids: selectedEmployees.map((x) => x.value),
      shift_date: shiftDate,
      shift_type: selectedShift.value,
    };

    // If editing → update call
    if (initialData?.id) {
      await dispatch(
        update_shift_roster({ id: initialData.id, formData: payload })
      );
    } else {
      // Else ADD
      await dispatch(add_shift_roster(payload));
    }

    onClose && onClose();
  };

  // Select Styles
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": { backgroundColor: "#ff9b44" },
    }),
  };

  return (
    <div
      id="add_schedule"
      className={`modal custom-modal fade ${isOpen ? "show" : ""}`}
      style={{
        display: isOpen ? "block" : "none",
        background: "rgba(0,0,0,0.5)",
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {initialData?.id ? "Edit Assigned Shift" : "Assign Shift"}
            </h5>
            <button className="btn-close" onClick={onClose}>
              {" "}
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Department */}
              <div className="input-block mb-3">
                <label>Department *</label>

                <Select
                  value={selectedDepartment}
                  options={departments}
                  onChange={(val) => {
                    setSelectedDepartment(val);
                    setSelectedEmployees([]); // Reset on change
                  }}
                  styles={customStyles}
                />
              </div>

              {/* Employees */}
              <div className="input-block mb-3">
                <label>Employees *</label>

                <Select
                  isMulti
                  value={selectedEmployees}
                  options={employeeOptions}
                  onChange={setSelectedEmployees}
                  isDisabled={!selectedDepartment}
                  styles={customStyles}
                />
              </div>

              {/* Shift */}
              <div className="input-block mb-3">
                <label>Shift *</label>

                <Select
                  value={selectedShift}
                  options={shifts}
                  onChange={setSelectedShift}
                  styles={customStyles}
                />
              </div>

              {/* Date */}
              <div className="input-block mb-3">
                <label>Date *</label>

                <input
                  type="date"
                  className="form-control"
                  value={shiftDate}
                  min={dayjs().format("YYYY-MM-DD")}
                  onChange={(e) => setShiftDate(e.target.value)}
                />
              </div>

              <div className="submit-section">
                <button className="btn btn-primary submit-btn" type="submit">
                  {initialData?.id ? "Update" : "Submit"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={onClose}
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

export default ScheduleModelPopup;
