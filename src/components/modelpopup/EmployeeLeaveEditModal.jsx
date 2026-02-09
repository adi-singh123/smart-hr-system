import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { customAlert } from "../../utils/Alert";
import { useDispatch } from "react-redux";
import {
  addOrUpdateLeave,
  getLeaves,
} from "../../Redux/services/EmployeeLeaves";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const EmployeeLeaveEditModelPopup = (props) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [remainingLeaves, setRemainingLeaves] = useState(12);
  const [errors, setErrors] = useState({});
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("")

  const dispatch = useDispatch();

  const { editLeave } = useSelector((state) => state.employee_leaves);

  useEffect(() => {
    if (editLeave) {
      console.log(editLeave);
      setFromDate(editLeave.from ? new Date(editLeave.from) : null);
      setToDate(editLeave.to ? new Date(editLeave.to) : null);
      setNumberOfDays(editLeave.no_of_days || 0);
      setRemainingLeaves(editLeave.remaining_leaves || 12);
      setLeaveType(editLeave.leave_type || "");
      setReason(editLeave?.leave_reason || "")
    }
  }, [editLeave]);

  const calculateDays = (start, end) => {
    if (start && end) {
      const diffTime = new Date(end) - new Date(start);
      const days = Math.max(0, diffTime / (1000 * 60 * 60 * 24) + 1);
      setNumberOfDays(days);
      setRemainingLeaves(Math.max(12 - days, 0));
    } else {
      setNumberOfDays(0);
      setRemainingLeaves(12);
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

  const validateForm = (formData) => {
    let newErrors = {};

    if (!formData.get("leaveType"))
      newErrors.leaveType = "Leave type is required.";
    if (!fromDate) newErrors.fromDate = "Start date is required.";
    if (!toDate) newErrors.toDate = "End date is required.";
    if (fromDate && toDate && new Date(toDate) < new Date(fromDate))
      newErrors.toDate = "'To' date must be after 'From' date.";
    if (!formData.get("reason").trim())
      newErrors.reason = "Leave reason is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.target);

      if (!validateForm(formData)) return;

      const leaveData = {
        id: editLeave?.id,
        leave_type: leaveType,
        from: new Date(fromDate).toISOString().split("T")[0],
        to: new Date(toDate).toISOString().split("T")[0],
        no_of_days: numberOfDays,
        remaining_leaves: remainingLeaves,
        leave_reason: formData.get("reason"),
      };

      console.log(leaveData);
      const response = await dispatch(addOrUpdateLeave(leaveData));
      console.log(response);
      if (response?.payload?.status) {
        await dispatch(getLeaves());
        const closeButton = document.querySelector("#edit_leave .btn-close");
        if (closeButton) {
          closeButton.click();
        }
        customAlert(response?.payload?.message, "success");
      } else {
        customAlert(response?.payload?.message, "fail");
      }
      event.target.reset();
      setFromDate(null);
      setToDate(null);
      setNumberOfDays(0);
      setRemainingLeaves(12);
      setErrors({});
    } catch (error) {
      console.log(error);
      customAlert(
        error?.message || "Error while adding or updating leave request",
        "fail"
      );
    }
  };

  return (
    <>
      <div id="edit_leave" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Leave</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    name="leaveType"
                    value={leaveType}
                    // onChange={(e) => setLeaveType(e.target.value)}
                  >
                    {/* <option value="">Select Leave Type</option> */}
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Medical Leave">Medical Leave</option>
                    <option value="Loss of Pay">Loss of Pay</option>
                  </select>
                  {errors.leaveType && (
                    <small className="text-danger">{errors.leaveType}</small>
                  )}
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    From <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    selected={fromDate}
                    onChange={handleFromDateChange}
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                  />
                  {errors.fromDate && (
                    <small className="text-danger">{errors.fromDate}</small>
                  )}
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    To <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    selected={toDate}
                    onChange={handleToDateChange}
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                  />
                  {errors.toDate && (
                    <small className="text-danger">{errors.toDate}</small>
                  )}
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Number of Days <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={numberOfDays}
                    readOnly
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Remaining Leaves <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={remainingLeaves}
                    readOnly
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Leave Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    name="reason"
                    defaultValue={reason}
                  />

                  {errors.reason && (
                    <small className="text-danger">{errors.reason}</small>
                  )}
                </div>

                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
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

export default EmployeeLeaveEditModelPopup;
