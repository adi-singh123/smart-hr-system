import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

const AddOverTime = ({ onCreate }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(null);
  const [otType, setOtType] = useState(null);

  const employeeOptions = [
    { value: 1, label: "John Deo" },
    { value: 2, label: "Richard Miles" },
    { value: 3, label: "John Smith" },
  ];

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  const otTypeOptions = [
    { value: "Normal day OT 1.5x", label: "Normal day OT 1.5x" },
    { value: "Weekend OT 2x", label: "Weekend OT 2x" },
    { value: "Holiday OT 2.5x", label: "Holiday OT 2.5x" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff9b44",
      },
    }),
  };

  const validateHours = (val) => /^\d+(\.\d{1,2})?$/.test(val) && Number(val) > 0 && Number(val) <= 24;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployee) return alert("Please select an employee.");
    if (!selectedDate) return alert("Please select an overtime date.");
    if (!hours || !validateHours(hours)) return alert("Enter valid hours (e.g., 2 or 2.5), max 24.");
    if (!description.trim()) return alert("Description is required.");
    if (!status) return alert("Please select status.");
    if (!otType) return alert("Please select OT Type.");

    const payload = {
      employee: selectedEmployee,
      date: selectedDate,
      hours: Number(hours),
      description: description.trim(),
      status: status.value,
      otType: otType.value,
    };

    onCreate?.(payload);
    alert("Overtime entry added successfully!");

    // Reset
    setSelectedEmployee(null);
    setSelectedDate(null);
    setHours("");
    setDescription("");
    setStatus(null);
    setOtType(null);
  };

  return (
    <div>
      <div id="add_overtime" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Overtime</h5>
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
                    Select Employee <span className="text-danger">*</span>
                  </label>
                  <Select
                    value={selectedEmployee}
                    onChange={setSelectedEmployee}
                    options={employeeOptions}
                    placeholder="Select Employee (e.g., John Deo)"
                    styles={customStyles}
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Overtime Date <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={setSelectedDate}
                    className="form-control"
                    placeholderText="Select Date"
                    dateFormat="dd/MM/yyyy"
                    isClearable
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Hours <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g., 2 or 2.5"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    maxLength={4}
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Completed urgent client testing after hours."
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <Select
                    value={status}
                    onChange={setStatus}
                    options={statusOptions}
                    placeholder="Select Status"
                    styles={customStyles}
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    OT Type <span className="text-danger">*</span>
                  </label>
                  <Select
                    value={otType}
                    onChange={setOtType}
                    options={otTypeOptions}
                    placeholder="Select OT Type"
                    styles={customStyles}
                  />
                </div>

                <div className="submit-section text-end">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* You can copy the same form inside #edit_overtime if needed */}
    </div>
  );
};

export default AddOverTime;
