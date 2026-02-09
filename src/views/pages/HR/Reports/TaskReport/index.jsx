/** @format */

import React from "react";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import TaskReportTable from "./TaskReportTable";
import { taskData } from "./TaskReportData";

const TaskReport = () => {
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Task Reports"
          title="Dashboard"
          subtitle="Task Reports"
        />

        {/* Task Table */}
        <TaskReportTable data={taskData} />
      </div>
    </div>
  );
};

export default TaskReport;
