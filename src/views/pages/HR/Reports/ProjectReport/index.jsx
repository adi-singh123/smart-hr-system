/** @format */

import React, { useState } from "react";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import { data as projectData } from "./ProjectReportData";
import ProjectReportTable from "./ProjectReportTable";

const ProjectReport = () => {
  const [filteredData, setFilteredData] = useState(projectData);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Project Reports"
          title="Dashboard"
          subtitle="Project Reports"
          modal="#"
          name="Create Invoice"
          link="/create-invoice"
        />

        <ProjectReportTable data={filteredData} />
      </div>
    </div>
  );
};

export default ProjectReport;
