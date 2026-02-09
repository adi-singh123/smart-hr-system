/** @format */

import React from "react";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import InvoiceReportTable from "./InvoiceReportTable";

const InvoiceReport = () => {
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Invoice Report"
          title="Dashboard"
          subtitle="Invoice Report"
        />

        <InvoiceReportTable />
      </div>
    </div>
  );
};

export default InvoiceReport;
