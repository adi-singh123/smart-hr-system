/** @format */

import React, { useEffect, useState } from "react";
import { Table, Pagination, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../../../../Redux/services/User";
import { get_all_active_departments } from "../../../../../Redux/services/Department";
import { get_designation_data } from "../../../../../Redux/services/Designation";

const PAGE_SIZE = 10;

// Helper to get initials from name
const getInitials = (firstName, lastName) => {
  const f = firstName || "";
  const l = lastName || "";
  if (!f && !l) return "";
  if (!l) return f[0].toUpperCase();
  return f[0].toUpperCase() + l[0].toUpperCase();
};

// Format date for sorting
const formatDate = (dateStr) => {
  if (!dateStr || dateStr === "null") return null;
  return new Date(dateStr).getTime();
};

const EmployeeReportTable = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state?.employee?.employeeData || []);
  const departments = useSelector(
    (state) => state.department.ActiveDepartments || []
  );
  const designations = useSelector(
    (state) => state?.designation?.AllDesignation
  );
  console.log("designation", designations);
  const [current, setCurrent] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Fetch users, departments, designations
  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(get_all_active_departments());
    dispatch(get_designation_data());
  }, [dispatch]);

  // Map department_id -> name
  const getDepartmentName = (id) => {
    if (!id) return "-";
    const dept = departments.find((d) => d.id === id);
    return dept ? dept.name : "-";
  };

  // Map designation_id -> name
  // Map designation_id -> name
  const getDesignationName = (id) => {
    if (!id || !designations || !designations.designation) return "-";
    const desigObj = designations.designation.find((d) => d.id === id);
    return desigObj ? desigObj.name : "-";
  };

  // Filter users based on search
  useEffect(() => {
    if (!users || users.length === 0) {
      setFilteredData([]);
      return;
    }

    const filtered = users.filter((u) => {
      const name = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
      const empId = (u.employee_id || "").toLowerCase();
      const designation = getDesignationName(u.designation_id).toLowerCase();
      const department = getDepartmentName(u.department_id).toLowerCase();
      const text = searchText.toLowerCase();

      return (
        name.includes(text) ||
        empId.includes(text) ||
        designation.includes(text) ||
        department.includes(text)
      );
    });

    setFilteredData(filtered);
    setCurrent(1);
  }, [searchText, users, departments, designations]);

  const paginatedData = filteredData.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE
  );

  const itemRender = (currentPage, type, originalElement) => {
    if (type === "prev") {
      return (
        <button
          className="ant-pagination-item-link"
          disabled={currentPage === 1}
          style={{
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
            border: "none",
            background: "none",
          }}
        >
          Previous
        </button>
      );
    }
    if (type === "next") {
      const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
      return (
        <button
          className="ant-pagination-item-link"
          disabled={currentPage === totalPages}
          style={{
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
            border: "none",
            background: "none",
          }}
        >
          Next
        </button>
      );
    }
    return originalElement;
  };

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "first_name",
      render: (text, record) => {
        const name =
          `${record.first_name || ""} ${record.last_name || ""}`.trim() || "-";
        return (
          <div className="table-avatar d-flex align-items-center">
            <Link
              to="/profile"
              className="avatar me-2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#e0e3e6",
                  color: "#3b3f5c",
                  fontWeight: 600,
                  fontSize: 16,
                  marginRight: 0,
                  border: "1px solid #d1d5db",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {getInitials(record.first_name, record.last_name)}
              </span>
            </Link>
            <Link to="/profile" className="text-primary">
              {name}
            </Link>
          </div>
        );
      },
      sorter: (a, b) =>
        `${a.first_name || ""} ${a.last_name || ""}`.localeCompare(
          `${b.first_name || ""} ${b.last_name || ""}`
        ),
    },
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      render: (text) => text || "-",
      sorter: (a, b) =>
        (a.employee_id || "").localeCompare(b.employee_id || ""),
    },
    {
      title: "Employee Type",
      dataIndex: "role",
      render: (role) => role?.name || "-",
      sorter: (a, b) => (a.role?.name || "").localeCompare(b.role?.name || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) =>
        text ? (
          <a href={`mailto:${text}`} className="text-info">
            {text}
          </a>
        ) : (
          "-"
        ),
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: "Department",
      dataIndex: "department_id",
      render: (id) => getDepartmentName(id),
      sorter: (a, b) =>
        getDepartmentName(a.department_id).localeCompare(
          getDepartmentName(b.department_id)
        ),
    },
    {
      title: "Designation",
      dataIndex: "designation_id",
      render: (id) => getDesignationName(id),
      sorter: (a, b) =>
        getDesignationName(a.designation_id).localeCompare(
          getDesignationName(b.designation_id)
        ),
    },
    {
      title: "Joining Date",
      dataIndex: "created_date",
      render: (text) => (text && text !== "null" ? text.split("T")[0] : "-"),
      sorter: (a, b) => formatDate(a.created_date) - formatDate(b.created_date),
    },
    {
      title: "DOB",
      dataIndex: "date_of_birth",
      render: (text) => (text && text !== "null" ? text : "-"),
      sorter: (a, b) =>
        formatDate(a.date_of_birth) - formatDate(b.date_of_birth),
    },
    {
      title: "Marital Status",
      dataIndex: "maritalstatus",
      render: (text) => text || "-",
      sorter: (a, b) =>
        (a.maritalstatus || "").localeCompare(b.maritalstatus || ""),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      render: (text) => text || "-",
      sorter: (a, b) => (a.gender || "").localeCompare(b.gender || ""),
    },
    {
      title: "Experience",
      dataIndex: "experience",
      render: (text) => text || "-",
      sorter: (a, b) => (a.experience || "").localeCompare(b.experience || ""),
    },
    {
      title: "Status",
      render: (record) => (
        <button
          className={`btn btn-sm ${
            record.is_active ? "btn-outline-success" : "btn-outline-danger"
          }`}
        >
          {record.is_active ? "Active" : "Inactive"}
        </button>
      ),
    },
  ];

  return (
    <div className="row">
      <div className="col-md-12 mb-3">
        <Input
          placeholder="Search by Name, Employee ID, Designation, Department"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="col-md-12">
        <div className="table-responsive">
          <Table
            className="table-striped"
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={paginatedData}
            rowKey={(record) => record.id}
            pagination={false}
            scroll={{ x: true }}
          />
        </div>
        <div className="d-flex justify-content-end mt-3">
          <Pagination
            current={current}
            pageSize={PAGE_SIZE}
            total={filteredData.length}
            onChange={setCurrent}
            showSizeChanger={false}
            itemRender={itemRender}
            showTotal={(total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`
            }
            style={{
              display: filteredData.length > PAGE_SIZE ? "block" : "none",
            }}
          />
          {filteredData.length <= PAGE_SIZE && (
            <div
              className="text-muted small ms-2"
              style={{ alignSelf: "center" }}
            >
              Only 1 page of results
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeReportTable;
