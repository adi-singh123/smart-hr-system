/** @format */

import React from "react";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import EmployeeReportTable from "./EmployeeReportTable";

const EmployeeReport = () => {
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Employee Report"
          title="Dashboard"
          subtitle="Employee Report"
        />

        {/* Employee table */}
        <EmployeeReportTable />
      </div>
    </div>
  );
};

export default EmployeeReport;
