import React, { useState } from "react";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import { Link } from "react-router-dom";
import Select from "react-select";
import PaySlipReportTable from "./PaySlipReportTable";
import { paySlipData } from "./PaySlipReportData";

const PaySlipReports = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [filteredData, setFilteredData] = useState(paySlipData);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    let filtered = paySlipData;

    // Employee name filter
    if (employeeName.trim() !== "") {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(employeeName.trim().toLowerCase())
      );
    }

    // Month filter
    if (selectedMonth) {
      filtered = filtered.filter(employee =>
        employee.paymentmonth.toLowerCase() === selectedMonth.label.toLowerCase()
      );
    }

    // Year filter
    if (selectedYear) {
      filtered = filtered.filter(employee =>
        employee.paymentyear === selectedYear.label
      );
    }

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setEmployeeName("");
    setSelectedMonth(null);
    setSelectedYear(null);
    setFilteredData(paySlipData);
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
    { value: 1, label: "2019" },
    { value: 2, label: "2023" },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Payslip Reports"
          title="Dashboard"
          subtitle="Payslip Reports"
        />

        <form className="row filter-row space" onSubmit={handleSearch}>
          <div className="col-sm-6 col-md-3">
            <div className={`input-block mb-3 form-focus ${isFocused || employeeName ? 'focused' : ''}`}>
              <input
                type="text"
                className="form-control floating"
                
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <label className="focus-label">Employee Name</label>
            </div>
          </div>

          <div className="col-sm-6 col-md-3">
            <div className="input-block mb-3 form-focus select-focus">
              <Select
                placeholder="Select Month"
                onChange={setSelectedMonth}
                options={monthOptions}
                styles={customStyles}
                value={selectedMonth}
                isClearable
              />
              <label className="focus-label">Month</label>
            </div>
          </div>

          <div className="col-sm-6 col-md-3">
            <div className="input-block mb-3 form-focus select-focus">
              <Select
                placeholder="Select Year"
                onChange={setSelectedYear}
                options={yearOptions}
                styles={customStyles}
                value={selectedYear}
                isClearable
              />
              <label className="focus-label">Year</label>
            </div>
          </div>

          <div className="col-sm-6 col-md-3">
            <button type="submit" className="btn btn-success btn-block w-100">
              Search
            </button>
          </div>

          <div className="col-sm-6 col-md-3">
            <button 
              type="button" 
              className="btn btn-secondary w-100"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>

        <PaySlipReportTable data={filteredData} />
      </div>
    </div>
  );
};

export default PaySlipReports;