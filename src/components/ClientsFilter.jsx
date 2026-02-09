import React, { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

const ClientsFilter = ({ onSearch }) => {
  const [clientId, setClientId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [company, setCompany] = useState(null);

  const companies = [
    { value: "global", label: "Global Technologies" },
    { value: "delta", label: "Delta InfoTech" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff9b44",
        color: "#fff",
      },
    }),
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ clientId, employeeName, company: company?.label || "" });
    }
  };

  return (
    <div className="row filter-row">
      <div className="col-sm-6 col-md-3">
        <div className="input-block form-focus">
          <input
            type="text"
            className="form-control floating"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Eg. CLT-000"
          />
          <label className="focus-label">Client ID</label>
        </div>
      </div>

      <div className="col-sm-6 col-md-3">
        <div className="input-block form-focus">
          <input
            type="text"
            className="form-control floating"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder="Eg. John Doe"
          />
          <label className="focus-label">Employee Name</label>
        </div>
      </div>

      <div className="col-sm-6 col-md-3">
        <div className="input-block form-focus select-focus">
          <Select
            options={companies}
            placeholder="Select Companies"
            styles={customStyles}
            value={company}
            onChange={(opt) => setCompany(opt)}
          />
          <label className="focus-label">Company</label>
        </div>
      </div>

      <div className="col-sm-6 col-md-3">
        <button
          type="button"
          onClick={handleSearch}
          className="btn btn-success btn-block w-100"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default ClientsFilter;
