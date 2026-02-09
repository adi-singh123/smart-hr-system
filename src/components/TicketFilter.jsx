import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { get_tickets } from "../Redux/services/Ticket";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";

const TicketFilter = () => {
  const dispatch = useDispatch();

  const [selectedDate1, setSelectedDate1] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSearch = () => {
    const filters = {
      ticket_subject: inputValue || "",
      status: selectedStatus ? selectedStatus.value : "",
      priority: selectedPriority ? selectedPriority.value : "",
      fromDate: selectedDate1 ? selectedDate1.toISOString().split("T")[0] : "",
      toDate: selectedDate2 ? selectedDate2.toISOString().split("T")[0] : "",
    };

    dispatch(get_tickets(filters));

    // Clear all fields
    setInputValue("");
    setSelectedStatus(null);
    setSelectedPriority(null);
    setSelectedDate1(null);
    setSelectedDate2(null);
    setFocused(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value !== "" && !focused) setFocused(true);
  };

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "Open", label: "Open" },
    { value: "Reopened", label: "Reopened" },
    { value: "On Hold", label: "On Hold" },
    { value: "Closed", label: "Closed" },
    { value: "In Progress", label: "In Progress" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const priorityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
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

  return (
    <div className="row filter-row">
      <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
        <div
          className={`input-block form-focus ${
            focused || inputValue !== "" ? "focused" : ""
          }`}
        >
          <input
            type="text"
            className="form-control floating"
            value={inputValue}
            onFocus={() => setFocused(true)}
            onBlur={() => inputValue === "" && setFocused(false)}
            onChange={handleInputChange}
          />
          <label className="focus-label">Ticket Subject</label>
        </div>
      </div>

      <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
        <div className="input-block form-focus select-focus">
          <Select
            options={statusOptions}
            placeholder="--Select--"
            styles={customStyles}
            value={selectedStatus}
            onChange={setSelectedStatus}
          />
          <label className="focus-label">Status</label>
        </div>
      </div>

      <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
        <div className="input-block form-focus select-focus">
          <Select
            options={priorityOptions}
            placeholder="--Select--"
            styles={customStyles}
            value={selectedPriority}
            onChange={setSelectedPriority}
          />
          <label className="focus-label">Priority</label>
        </div>
      </div>

      <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
        <div className="input-block form-focus select-focus">
          <div className="cal-icon">
            <DatePicker
              selected={selectedDate1}
              onChange={(date) => setSelectedDate1(date)}
              className="form-control floating datetimepicker"
              dateFormat="dd-MM-yyyy"
            />
          </div>
          <label className="focus-label">From</label>
        </div>
      </div>

      <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
        <div className="input-block form-focus select-focus">
          <div className="cal-icon">
            <DatePicker
              selected={selectedDate2}
              onChange={(date) => setSelectedDate2(date)}
              className="form-control floating datetimepicker"
              dateFormat="dd-MM-yyyy"
            />
          </div>
          <label className="focus-label">To</label>
        </div>
      </div>

      <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
        <button className="btn btn-success btn-block w-100" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default TicketFilter;
