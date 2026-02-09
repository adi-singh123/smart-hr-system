/** @format */

import React, { useState, useEffect } from "react";
import { Table, Pagination, Button } from "antd";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { get_all_active_departments } from "../../../../../Redux/services/Department";
import { getAllPunchData } from "../../../../../Redux/services/EmployeeAttendance"; // adjust if your file path differs
import moment from "moment";
import { get_employee_data } from "../../../../../Redux/services/Employee";
import { HTTPURL } from "../../../../../Constent/Matcher";
import { UserRole } from "../../../../../utils/UserRole";
const PAGE_SIZE = 10;

const DailyReports = () => {
  const dispatch = useDispatch();

  // Redux data
  const AllEmployeeData = useSelector((state) => state?.employee?.employeeData);
  const { ActiveDepartments } = useSelector((state) => state.department);
  const { punchData } = useSelector((state) => state.employee_attendance);
  const user = useSelector((state) => state?.auth?.userData);

  // Local filter states
  const [formEmployeeName, setFormEmployeeName] = useState("");
  const [formDepartment, setFormDepartment] = useState(null);
  const [formStatus, setFormStatus] = useState(null);
  const [focused, setFocused] = useState(false);

  const [employeeName, setEmployeeName] = useState("");
  const [department, setDepartment] = useState(null);
  const [status, setStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(get_employee_data());
    dispatch(get_all_active_departments());
    dispatch(getAllPunchData());
  }, [dispatch]);

  const today = moment().format("DD MMM YYYY");

  // Filter non-admin employees
  const employees =
    AllEmployeeData?.users?.filter((emp) => emp.role.name !== "Admin") || [];

  const filteredPunchData =
    punchData?.filter((p) => {
      const user = AllEmployeeData?.users?.find(
        (emp) => emp.id === p.employee_id
      );
      return user && user.role?.name !== "Admin";
    }) || [];

  // Punch-in users for today
  const todayPunchUsers =
    filteredPunchData?.filter(
      (p) => moment(p.date).format("DD MMM YYYY") === today && p.punch_in
    ) || [];
  // Summary values
  const totalEmployees = employees.length;
  const totalPresent = todayPunchUsers.length;
  const totalAbsent = totalEmployees - totalPresent;

  // Merge punch data with employee data
  const formattedData = employees.map((emp) => {
    const isPresent = todayPunchUsers.some((p) => p.employee_id === emp.id);

    return {
      id: emp.id,
      image: emp.profile_pic
        ? `${HTTPURL}${emp.profile_pic}`
        : "/assets/img/default-avatar.png",
      name: `${emp.first_name || ""} ${emp.last_name || ""}`.trim() || "-",
      number: emp.employee_id || "-",
      date: today,
      department:
        ActiveDepartments?.find((d) => d.id === emp.department_id)?.name || "-",
      status: isPresent ? "Present" : "Absent",
    };
  });

  // Filter logic
  useEffect(() => {
    if (!search) {
      setFilteredData(formattedData);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = formattedData.filter(
        (row) =>
          row.name.toLowerCase().includes(lowerSearch) ||
          row.number.toLowerCase().includes(lowerSearch) ||
          row.department.toLowerCase().includes(lowerSearch) ||
          row.status.toLowerCase().includes(lowerSearch)
      );
      setFilteredData(filtered);
    }
  }, [search, formattedData]);

  // Apply filters
  const handleSearch = (e) => {
    e.preventDefault();
    setEmployeeName(formEmployeeName);
    setDepartment(formDepartment);
    setStatus(formStatus);
  };

  // Reset filters
  const handleReset = () => {
    setFormEmployeeName("");
    setFormDepartment(null);
    setFormStatus(null);
    setEmployeeName("");
    setDepartment(null);
    setStatus(null);
  };

  // Export to CSV
  // const handleExport = () => {
  //   const headers = ["Employee Name", "Emp ID", "Date", "Department", "Status"];
  //   const rows = filteredData.map((row) => [
  //     row.name,
  //     row.number,
  //     row.date,
  //     row.department,
  //     row.status,
  //   ]);
  //   let csvContent =
  //     "data:text/csv;charset=utf-8," +
  //     headers.join(",") +
  //     "\n" +
  //     rows.map((e) => e.join(",")).join("\n");
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", "daily_report.csv");
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // Select dropdown options
  const departmentOptions =
    ActiveDepartments?.map((d) => ({
      value: d.id,
      label: d.name,
    })) || [];

  const statusOptions = [
    { value: 1, label: "Present" },
    { value: 2, label: "Absent" },
  ];

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
          maintitle="Daily Report"
          title="Dashboard"
          subtitle="Daily Report"
        />
        <div className="row justify-content-center">
          {[
            {
              id: 1,
              title: "Total Employees",
              value: totalEmployees,
              class: "none",
            },
            {
              id: 2,
              title: "Today Present",
              value: totalPresent,
              class: "text-success",
            },
            {
              id: 3,
              title: "Today Absent",
              value: totalAbsent,
              class: "text-danger",
            },
          ].map((item) => (
            <div className="col-md-3 col-sm-6" key={item.id}>
              <div className="card">
                <div className="card-body text-center">
                  <h3 className={item.class}>
                    <b>{item.value}</b>
                  </h3>
                  <p>{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Employee ID, Name, Department, or Status"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        {/* <form className="row filter-row space" onSubmit={handleSearch}>
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
                onChange={(e) => setFormEmployeeName(e.target.value)}
              />
              <label className="focus-label">Employee Name</label>
            </div>
          </div>

          {/* <div className="col-sm-6 col-md-3">
            <div className="input-block form-focus select-focus">
              <Select
                placeholder="Select Department"
                onChange={setFormDepartment}
                options={departmentOptions}
                className="select floating"
                styles={customStyles}
                value={formDepartment}
                isClearable
              />
              <label className="focus-label">Department</label>
            </div>
          </div> 

          <div className="col-sm-6 col-md-3">
            <div className="input-block form-focus select-focus">
              <Select
                placeholder="Select Status"
                onChange={setFormStatus}
                options={statusOptions}
                className="select floating"
                styles={customStyles}
                value={formStatus}
                isClearable
              />
              <label className="focus-label">Status</label>
            </div>
          </div>

          <div className="col-sm-6 col-md-3">
            <button type="submit" className="btn btn-success w-100">
              Search
            </button>
          </div>

          <div className="col-sm-6 col-md-3 mt-2 mt-md-0">
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form> */}

        {/* <div className="d-flex justify-content-end mb-3">
          <Button type="primary" onClick={handleExport}>
            Export CSV
          </Button>
        </div> */}
        <DailyReportTable data={filteredData} />
      </div>
    </div>
  );
};

const DailyReportTable = ({ data }) => {
  const [current, setCurrent] = useState(1);

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="table-avatar">
          <Link to="/profile" className="avatar">
            <img alt="" src={record.image} />
          </Link>
          <Link to="/profile">{text}</Link>
        </div>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Emp ID",
      dataIndex: "number",
      sorter: (a, b) => a.number.localeCompare(b.number),
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: (a, b) => a.department.length - b.department.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div className="dropdown dropdown-action">
          <button
            className={`btn btn-outline-${
              text === "Absent"
                ? "danger"
                : text === "Week off"
                ? "warning"
                : "info"
            } btn-sm`}
            style={
              text === "Week off"
                ? {
                    fontWeight: 700,
                    color: "#fa8c16",
                    borderColor: "#fa8c16",
                    background: "#fffbe6",
                  }
                : {}
            }
          >
            {text}
          </button>
        </div>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  const paginatedData = data.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE
  );

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="table-responsive">
          <Table
            className="table-striped"
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={paginatedData}
            rowKey={(record) => record.id}
            pagination={false}
          />
        </div>
        <div className="d-flex justify-content-end mt-3">
          <Pagination
            current={current}
            pageSize={PAGE_SIZE}
            total={data.length}
            onChange={setCurrent}
            showSizeChanger={false}
            showTotal={(total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DailyReports;
