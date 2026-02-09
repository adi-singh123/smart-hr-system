/** @format */

import React from "react";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import LeaveReportTable from "./LeaveReportTable";

const LeaveReport = () => {
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Leave Report"
          title="Dashboard"
          subtitle="Leave Report"
        />

        {/* Only table is shown, all filter/search inputs removed */}
        <LeaveReportTable />
      </div>
    </div>
  );
};

export default LeaveReport;
