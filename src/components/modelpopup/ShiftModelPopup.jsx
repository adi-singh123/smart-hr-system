// ShiftModelPopup.jsx (improved)
// - Added placeholders for clarity
// - Setup for potential duration validation

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TimePicker } from "antd";
import Select from "react-select";

dayjs.extend(customParseFormat);

const ShiftModelPopup = () => {
  const [selectedDate1, setSelectedDate1] = useState(null);

  const handleDateChange1 = (date) => setSelectedDate1(date);

  const employee = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": { backgroundColor: "#ff9b44" },
    }),
  };

  const onChange = (time, timeString) => {
    // Future: store values and validate duration
  };

  return (
    <div id="add_shift" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Shift</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="row">
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Shift Name <span className="text-danger">*</span></label>
                    <input className="form-control" placeholder="e.g., Morning Shift" />
                  </div>
                </div>

                {[
                  "Min Start Time",
                  "Start Time",
                  "Max Start Time",
                  "Min End Time",
                  "End Time",
                  "Max End Time",
                ].map((label, i) => (
                  <div className="col-md-4" key={i}>
                    <div className="input-block mb-3">
                      <label>{label} <span className="text-danger">*</span></label>
                      <div className="input-group time">
                        <div className="form-control timepicker">
                          <TimePicker
                            className="input-group-text"
                            onChange={onChange}
                            bordered={false}
                            defaultValue={dayjs("00:00:00", "HH:mm:ss")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-md-4">
                  <div className="input-block mb-3">
                    <label>Break Time (In Minutes)</label>
                    <input className="form-control" placeholder="e.g., 30" />
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input me-1" id="customCheck1" />
                    <label className="custom-control-label" htmlFor="customCheck1">Recurring Shift</label>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Repeat Every</label>
                    <Select options={employee} placeholder="Select week count" styles={customStyles} />
                    <label className="col-form-label">Week(s)</label>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">End On <span className="text-danger">*</span></label>
                    <DatePicker
                      selected={selectedDate1}
                      onChange={handleDateChange1}
                      className="form-control datetimepicker"
                      type="date"
                      dateFormat="dd-MM-yyyy"
                    />
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input me-1" id="customCheck2" />
                    <label className="custom-control-label" htmlFor="customCheck2">Indefinite</label>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Add Tag</label>
                    <input type="text" className="form-control" placeholder="e.g., Team A" />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Add Note</label>
                    <textarea className="form-control" placeholder="e.g., Night shift for backup coverage" />
                  </div>
                </div>
              </div>
              <div className="submit-section">
                <button className="btn btn-primary submit-btn" data-bs-dismiss="modal" aria-label="Close" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftModelPopup;
