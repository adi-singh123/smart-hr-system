import React, { useState } from "react";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import { Link } from "react-router-dom";
import UserReportTable from "./UserReportTable";
import { userData } from "./UserReportData";

const UserReport = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [filteredData, setFilteredData] = useState(userData);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = userData.filter(user => 
      user.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setNameFilter("");
    setFilteredData(userData);
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="User Report"
          title="Dashboard"
          subtitle="User Report"
        />

        <form className="row filter-row" onSubmit={handleSearch}>
          <div className="col-sm-6 col-md-3">
            <div className="input-block mb-3 form-focus">
              <input
                type="text"
                className="form-control floating"
                
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
              <label className="focus-label">Employee Name</label>
            </div>
          </div>

          <div className="col-sm-6 col-md-3">
            <button type="submit" className="btn btn-success w-100">
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

        <UserReportTable data={filteredData} />
      </div>
    </div>
  );
};

export default UserReport;  