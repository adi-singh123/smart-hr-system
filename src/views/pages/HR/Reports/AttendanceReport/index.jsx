import React, { useState } from "react";

import Breadcrumbs from "../../../../../components/Breadcrumbs";
import { Link } from "react-router-dom";

import Select from "react-select";
import AttendanceReportTable from "./AttendanceReportTable";
import { attendanceData } from "./AttendanceReportData";

const AttendanceReport = () => {
  // Form state (for user input)
  const [formEmployeeName, setFormEmployeeName] = useState("");
  const [formSelectedMonth, setFormSelectedMonth] = useState(null);
  const [formSelectedYear, setFormSelectedYear] = useState({ value: 1, label: "2018" });
  const [focused, setFocused] = useState(false);

  // State for actual filter/search
  const [employeeName, setEmployeeName] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState({ value: 1, label: "2018" });

  const monthOptions = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" },
  ];
  const yearOptions = [
    { value: 1, label: "2018" },
    { value: 2, label: "2022" },
    { value: 3, label: "2023" },
  ];

  // Filtering logic
  const filteredData = attendanceData.filter(row => {
    // Employee Name filter
    if (employeeName && !row.employeeName.toLowerCase().includes(employeeName.trim().toLowerCase())) {
      return false;
    }
    // Year filter
    if (selectedYear && selectedYear.label) {
      if (!row.date.includes(selectedYear.label)) return false;
    }
    // Month filter
    if (selectedMonth && selectedMonth.label) {
      if (!row.date.includes(selectedMonth.label)) return false;
    }
    return true;
  });

  // Handle form submit to apply filters
  const handleSearch = (e) => {
    e.preventDefault();
    setEmployeeName(formEmployeeName);
    setSelectedMonth(formSelectedMonth);
    setSelectedYear(formSelectedYear);
  };

  // Reset both form and filter state
  const handleReset = () => {
    setFormEmployeeName("");
    setFormSelectedMonth(null);
    setFormSelectedYear({ value: 1, label: "2018" });
    setEmployeeName("");
    setSelectedMonth(null);
    setSelectedYear({ value: 1, label: "2018" });
  };

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
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Attendance Reports"
          title="Dashboard"
          subtitle="Attendance Reports"
        />

        <form className="row filter-row space" onSubmit={handleSearch}>
          <div className="col-sm-6 col-md-3">
            <div
              className={
                focused || formEmployeeName !== ""
                  ? "input-block form-focus focused"
                  : "input-block form-focus"
              }
            >
              <input
                type="text"
                className="form-control floating"
                value={formEmployeeName}                
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={e => setFormEmployeeName(e.target.value)}
              />
              <label className="focus-label">Employee Name</label>
            </div>
          </div>

          <div className="col-sm-6 col-md-3">
            <div className="input-block form-focus select-focus">
              <Select
                placeholder="Select Month"
                onChange={setFormSelectedMonth}
                options={monthOptions}
                className="select floating"
                styles={customStyles}
                value={formSelectedMonth}
                isClearable
              />
              <label className="focus-label">Month</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="input-block form-focus select-focus">
              <Select
                placeholder="Select Year"
                onChange={setFormSelectedYear}
                options={yearOptions}
                className="select floating"
                styles={customStyles}
                value={formSelectedYear}
                isClearable
              />
              <label className="focus-label">Year</label>
            </div>
          </div>

          <div className="col-sm-6 col-md-3 ">
            <button type="submit" className="btn btn-success  w-100">
              Search
            </button>
            </div>            
        </form>
        <AttendanceReportTable data={filteredData} />
      </div>
    </div>
  );
};

export default AttendanceReport;
