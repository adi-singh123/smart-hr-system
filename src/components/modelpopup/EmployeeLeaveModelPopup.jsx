/** @format */

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { customAlert } from "../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrUpdateLeave,
  getAllLeaves,
  getLeaves,
  getLeaveById, // ✅ new import
} from "../../Redux/services/EmployeeLeaves";
import { get_employee_data } from "../../Redux/services/Employee";
import { getFullUserById } from "../../Redux/services/User";

const EmployeeLeaveModelPopup = ({
  mode = "add",
  leaveData = null,
  onClose,
}) => {
  const [employeeName, setEmployeeName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [remainingLeaves, setRemainingLeaves] = useState(0);
  console.log("reaminagLeave", remainingLeaves);
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const dispatch = useDispatch();

  const userId = useSelector((state) => state.user.logUserID);
  const role = localStorage.getItem("role");

  // ✅ Fetch all employees (for admin)
  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await dispatch(get_employee_data());
      const users = res?.payload?.data?.users || [];
      const filtered = users.filter(
        (user) => user?.role?.name && user.role.name.toLowerCase() !== "admin"
      );
      setEmployees(filtered);
    };
    fetchEmployees();
  }, [dispatch]);

  // ✅ Fetch logged-in employee (for non-admin)
  useEffect(() => {
    const fetchLoggedInEmployee = async () => {
      if (userId && role?.toLowerCase() !== "admin") {
        try {
          const res = await dispatch(getFullUserById({ userId }));
          const data = res?.payload;
          if (data) {
            const fullName = `${data.first_name || ""} ${
              data.last_name || ""
            }`.trim();
            setEmployeeName(fullName);
            setSelectedEmployee({
              id: data.id,
              employee_id: data.employee_id || null,
              first_name: data.first_name || "",
              last_name: data.last_name || "",
              role: { name: data.role?.name || role },
            });

            // ✅ Fetch remaining leaves for this employee
            const leaveRes = await dispatch(
              getLeaveById({ employeeId: data.employee_id })
            );
            const leaves = leaveRes?.payload || [];

            if (leaves.length > 0) {
              // backend se direct remaining_leaves milti hai
              const lastRecord = leaves[leaves.length - 1];
              setRemainingLeaves(lastRecord.remaining_leaves || 30);
            } else {
              setRemainingLeaves(30); // new employee default
            }
          }
        } catch (err) {
          console.error("Error fetching employee name:", err);
        }
      }
    };
    fetchLoggedInEmployee();
  }, [userId, role, dispatch]);

  // ✅ Fetch remaining leaves when admin selects an employee
  useEffect(() => {
    const fetchEmployeeRemainingLeave = async () => {
      if (selectedEmployee?.employee_id) {
        const res = await dispatch(
          getLeaveById({ employeeId: selectedEmployee.employee_id })
        );
        const leaves = res?.payload || [];
        if (leaves.length > 0) {
          const last = leaves[leaves.length - 1];
          setRemainingLeaves(last.remaining_leaves || 30);
        } else {
          setRemainingLeaves(30);
        }
      }
    };
    fetchEmployeeRemainingLeave();
  }, [selectedEmployee, dispatch]);

  // ✅ NEW: Fetch admin’s own remaining leaves if admin wants to add for self
  useEffect(() => {
    const fetchAdminRemainingLeave = async () => {
      if (role?.toLowerCase() === "admin" && userId && !selectedEmployee) {
        try {
          const res = await dispatch(getFullUserById({ userId }));
          const data = res?.payload;
          if (data?.employee_id) {
            const leaveRes = await dispatch(
              getLeaveById({ employeeId: data.employee_id })
            );
            const leaves = leaveRes?.payload?.data || [];
            if (leaves.length > 0) {
              const last = leaves[leaves.length - 1];
              setRemainingLeaves(last.remaining_leaves || 30);
            } else {
              setRemainingLeaves(30);
            }
          } else {
            setRemainingLeaves(30);
          }
        } catch (error) {
          console.error("Admin remaining leave fetch error:", error);
        }
      }
    };
    fetchAdminRemainingLeave();
  }, [role, userId, dispatch, selectedEmployee]);

  // ✅ Prefill in edit/view
  useEffect(() => {
    if (!leaveData) return;
    setEmployeeName(leaveData.employee_name || "");
    setLeaveType(leaveData.leave_type || "");
    setFromDate(leaveData.from ? new Date(leaveData.from) : null);
    setToDate(leaveData.to ? new Date(leaveData.to) : null);
    setNumberOfDays(leaveData.no_of_days || 0);
    setRemainingLeaves(leaveData.remaining_leaves ?? 30);
    setReason(leaveData.leave_reason || "");

    if (employees.length > 0) {
      const emp = employees.find(
        (e) => `${e.first_name} ${e.last_name}` === leaveData.employee_name
      );
      if (emp) setSelectedEmployee(emp);
    }
  }, [leaveData, employees]);

  const resetForm = () => {
    setLeaveType("");
    setFromDate(null);
    setToDate(null);
    setNumberOfDays(0);
    setRemainingLeaves(30);
    setReason("");
    setErrors({});

    // ✅ If non-admin user, keep their prefilled data
    if (role?.toLowerCase() !== "admin" && selectedEmployee) {
      setEmployeeName(
        `${selectedEmployee.first_name || ""} ${
          selectedEmployee.last_name || ""
        }`.trim()
      );
    } else {
      // ✅ For admin, reset everything
      setSelectedEmployee(null);
      setEmployeeName("");
    }
  };

  const calculateDays = (start, end) => {
    if (start && end) {
      const diffTime = new Date(end) - new Date(start);
      const days = Math.max(0, diffTime / (1000 * 60 * 60 * 24) + 1);
      setNumberOfDays(days);
    } else {
      setNumberOfDays(0);
    }
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
    calculateDays(date, toDate);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    calculateDays(fromDate, date);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!selectedEmployee) newErrors.employee = "Employee is required.";
    if (!leaveType) newErrors.leaveType = "Leave type is required.";
    if (!fromDate) newErrors.fromDate = "Start date is required.";
    if (!toDate) newErrors.toDate = "End date is required.";
    if (fromDate && toDate && new Date(toDate) < new Date(fromDate))
      newErrors.toDate = "'To' date must be after 'From' date.";
    if (!reason?.trim()) newErrors.reason = "Leave reason is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (numberOfDays > remainingLeaves) {
      customAlert(
        `You cannot request ${numberOfDays} days. Only ${remainingLeaves} leaves are remaining.`,
        "fail"
      );
      return; // Stop submission
    }

    const leavePayload = {
      id: leaveData?.id,
      employee_name: selectedEmployee
        ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
        : "",
      employee_id: selectedEmployee?.employee_id || null,
      leave_type: leaveType,
      from: new Date(fromDate).toISOString().split("T")[0],
      to: new Date(toDate).toISOString().split("T")[0],
      no_of_days: numberOfDays,
      leave_reason: reason,
    };

    const response = await dispatch(addOrUpdateLeave(leavePayload));
    if (response?.payload?.status) {
      await dispatch(getLeaves());
      await dispatch(getAllLeaves());
      customAlert(response?.payload?.message, "success");
      const closeButton = document.querySelector("#add_leave .btn-close");
      closeButton?.click();
      resetForm();
      onClose?.();
    } else {
      customAlert(response?.payload?.message, "fail");
    }
  };

  const isView = mode === "view";
  const isEdit = mode === "edit";

  useEffect(() => {
    const modalElement = document.getElementById("add_leave");

    if (modalElement) {
      const handleModalClose = () => {
        resetForm();
        onClose?.();
      };

      // ✅ Bootstrap modal close event listener
      modalElement.addEventListener("hidden.bs.modal", handleModalClose);

      // cleanup
      return () => {
        modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
      };
    }
  }, [onClose]);

  return (
    <div id="add_leave" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" && "Add Leave"}
              {mode === "edit" && "Edit Leave"}
              {mode === "view" && "View Leave"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                resetForm();
                onClose?.();
              }}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Employee Name */}
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Employee Name <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control"
                  value={selectedEmployee?.id || ""}
                  onChange={(e) => {
                    const emp = employees.find(
                      (emp) => emp.id === e.target.value
                    );
                    setSelectedEmployee(emp);
                  }}
                  disabled={isView || role?.toLowerCase() !== "admin"}
                >
                  {role?.toLowerCase() === "admin" ? (
                    <>
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name} ({emp.role?.name})
                        </option>
                      ))}
                    </>
                  ) : (
                    selectedEmployee && (
                      <option value={selectedEmployee.id}>
                        {employeeName} ({role})
                      </option>
                    )
                  )}
                </select>
                {errors.employee && (
                  <small className="text-danger">{errors.employee}</small>
                )}
              </div>

              {/* Leave Type */}
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Leave Type <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  disabled={isView}
                >
                  <option value="">Select Leave Type</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Medical Leave">Medical Leave</option>
                  <option value="Loss of Pay">Loss of Pay</option>
                </select>
                {errors.leaveType && (
                  <small className="text-danger">{errors.leaveType}</small>
                )}
              </div>

              {/* Dates */}
              <div className="input-block mb-3">
                <label className="col-form-label">From</label>
                <DatePicker
                  selected={fromDate}
                  onChange={handleFromDateChange}
                  className="form-control"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="DD/MM/YYYY"
                  disabled={isView}
                />
              </div>

              <div className="input-block mb-3">
                <label className="col-form-label">To</label>
                <DatePicker
                  selected={toDate}
                  onChange={handleToDateChange}
                  className="form-control"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="DD/MM/YYYY"
                  disabled={isView}
                />
              </div>

              {/* Number of Days */}
              <div className="input-block mb-3">
                <label className="col-form-label">Number of Days</label>
                <input
                  className="form-control"
                  type="text"
                  value={numberOfDays}
                  readOnly
                  disabled
                />
              </div>

              {/* ✅ Remaining Leaves (from backend) */}
              <div className="input-block mb-3">
                <label className="col-form-label">Remaining Leaves</label>
                <input
                  className="form-control"
                  type="text"
                  value={remainingLeaves}
                  readOnly
                  disabled
                  placeholder="Fetched from backend"
                />
              </div>

              {/* Reason */}
              <div className="input-block mb-3">
                <label className="col-form-label">Leave Reason</label>
                <textarea
                  rows={4}
                  className="form-control"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isView}
                />
              </div>

              {!isView && (
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    {isEdit ? "Update" : "Submit"}
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

export default EmployeeLeaveModelPopup;
