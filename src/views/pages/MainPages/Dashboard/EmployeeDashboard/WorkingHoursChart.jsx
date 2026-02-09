/**
 * @format
 */
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { getWorkingHours } from "../../../../../Redux/services/EmployeeAttendance";

const WorkingHoursChart = ({ employeeId }) => {
  const dispatch = useDispatch();
  const { workingHours, workingHoursLoading } = useSelector(
    (state) => state.employee_attendance
  );

  const [chartKey, setChartKey] = useState(0); // 🔹 force re-render when data changes
  const [chartOptions, setChartOptions] = useState({
    series: [{ name: "Working Hours", data: [0, 0, 0, 0, 0, 0, 0] }],
    colors: ["#55CE63"],
    chart: {
      type: "bar",
      height: 210,
      stacked: false,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 6,
        columnWidth: "35%",
        endingShape: "rounded",
      },
    },
    dataLabels: { enabled: false },
    yaxis: {
      min: 0,
      max: 8,
      forceNiceScale: true,
      title: { text: "Hours" },
      labels: {
        formatter: (val) =>
          val < 1 ? `${Math.round(val * 60)}m` : `${val.toFixed(1)}h`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) =>
          val < 1 ? `${Math.round(val * 60)} minutes` : `${val.toFixed(2)} hours`,
      },
    },
    xaxis: {
      categories: ["S", "M", "T", "W", "T", "F", "S"],
    },
    legend: { show: false },
    fill: { opacity: 1 },
  });

  // 🔹 Fetch working hours
  useEffect(() => {
    if (employeeId) {
      console.log("🔹 Fetching working hours for employee:", employeeId);
      dispatch(getWorkingHours(employeeId));
    }
  }, [dispatch, employeeId]);

  // 🔹 Update chart when data changes
  useEffect(() => {
    if (!workingHours || !workingHours.data) return;

    console.log("✅ Working hours data received:", workingHours);

    const labels =
      workingHours?.data?.labels || ["S", "M", "T", "W", "T", "F", "S"];
    const values =
      workingHours?.data?.data && Array.isArray(workingHours.data.data)
        ? workingHours.data.data
        : [0, 0, 0, 0, 0, 0, 0];

    const maxVal = Math.max(...values, 8); // Dynamic Y-axis

    setChartOptions((prev) => ({
      ...prev,
      series: [{ name: "Working Hours", data: values }],
      xaxis: { categories: labels },
      yaxis: { ...prev.yaxis, max: Math.ceil(maxVal) },
    }));

    // 🔹 Force chart re-render (ApexCharts needs this sometimes)
    setChartKey((prev) => prev + 1);
  }, [workingHours]);

  if (workingHoursLoading) {
    return <p className="text-center text-muted">Loading chart...</p>;
  }

  const totalHours = Array.isArray(workingHours?.data?.data)
    ? workingHours.data.data.reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="p-3 bg-white shadow-sm rounded-3 position-relative">
      {/* 🟢 Header */}
      <div className="d-flex justify-content-end align-items-center mb-2">
        <div className="dropdown statistic-dropdown">
          <button
            className="btn btn-light btn-sm dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            This Week
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button className="dropdown-item">Last Week</button>
            </li>
            <li>
              <button className="dropdown-item">This Month</button>
            </li>
            <li>
              <button className="dropdown-item">Last 30 Days</button>
            </li>
          </ul>
        </div>
      </div>

      {/* 🟢 Chart */}
      <Chart
        key={chartKey} // 🔹 ensures fresh render
        options={chartOptions}
        series={chartOptions.series}
        type="bar"
        height={210}
      />

      {/* 🟢 Summary */}
      <p className="text-center text-muted mt-2 mb-0">
        Total this week: <strong>{totalHours.toFixed(2)} hrs</strong>
      </p>
    </div>
  );
};

export default WorkingHoursChart;
