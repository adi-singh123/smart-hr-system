/** @format */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Dropdown, Menu, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import AllEmployeeAddPopup from "../../../components/modelpopup/AllEmployeeAddPopup";
import AllEmployeeEditPopup from "../../../components/modelpopup/AllEmployeeEditPopup";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import { useSelector, useDispatch } from "react-redux";
import {
  get_employee_data,
  get_user_id,
} from "../../../Redux/services/Employee";
import { HTTPURL } from "../../../Constent/Matcher";
import { fetchAsset } from "../../../Redux/services/Profile";
import { UserRole } from "../../../utils/UserRole";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const AllEmployeeData = useSelector((state) => state?.employee?.employeeData);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  console.log(selectedEmployeeId);
  const [id, setId] = useState(null);

  // 🔹 search box state
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // fetch employees (with pagination)
  useEffect(() => {
    dispatch(get_employee_data({ page: currentPage }));
  }, [dispatch, currentPage]);

  // fetch assets
  useEffect(() => {
    dispatch(fetchAsset());
  }, [dispatch]);

  // fetch user id
  useEffect(() => {
    dispatch(get_user_id())
      .unwrap()
      .then((data) => {
        setId(data.data.id);
      })
      .catch((err) => {
        console.error("get_user_id failed:", err);
      });
  }, [dispatch]);

  // 🔹 filter employees (role + search)
  const filteredEmployees = AllEmployeeData?.users
    ?.filter((employee) => {
      return UserRole() !== "Internship" || employee.id === id;
    })
    ?.filter((employee) => {
      if (!searchTerm) return true;
      const fullName =
        `${employee?.first_name} ${employee?.last_name}`.toLowerCase();
      const empId = employee?.employee_id?.toLowerCase() || "";
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        empId.includes(searchTerm.toLowerCase())
      );
    });

  // 🔹 data mapping with profile pic fallback
  const data = filteredEmployees?.map((employee) => ({
    id: employee?.id,
    name: `${employee?.first_name} ${employee?.last_name}`,
    employee_id: employee?.employee_id || "—",
    email: employee?.email || "—",
    phone: employee?.phone || "—",
    role: employee?.role?.name || "—",
    profile_pic:
      employee?.profile_pic && employee?.profile_pic !== ""
        ? `${HTTPURL}${employee?.profile_pic}`
        : "/assets/img/profiles/avatar-02.jpg", // fallback avatar
    originalData: employee,
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="d-flex align-items-center">
          <Link to={`/profile/${record.id}`} className="avatar me-2">
            <img
              src={record.profile_pic}
              alt={text}
              className="rounded-circle"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          </Link>
          <Link
            to={`/profile/${record.id}`}
            className="text-primary fw-semibold"
          >
            {text}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      sorter: (a, b) => a.employee_id.localeCompare(b.employee_id),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Mobile",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          overlay={
            <Menu>
              {/* 🔹 View option */}
              <Menu.Item key="view">
                <Link to={`/profile/${record.id}`}>
                  <i className="fa fa-eye me-2" /> View
                </Link>
              </Menu.Item>

              {/* 🔹 Edit option */}
              <Menu.Item
                key="edit"
                onClick={() => {
                  setSelectedEmployee(record.originalData);
                  setIsEditOpen(true);
                }}
              >
                <i className="fa fa-pencil me-2" /> Edit
              </Menu.Item>

              {/* 🔹 Delete option */}
              <Menu.Item
                key="delete"
                onClick={() => {
                  setSelectedEmployeeId(record.id);
                }}
              >
                <span
                  data-bs-toggle="modal"
                  data-bs-target="#delete"
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-trash me-2" /> Delete
                </span>
              </Menu.Item>
            </Menu>
          }
        >
          <Button type="link" style={{ fontSize: 22 }}>
            <i className="material-icons">more_vert</i>
            <MoreOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Employee"
            title="Dashboard"
            subtitle="Employee"
            modal="#add_employee"
            name="Add Employee"
            Linkname="/employees"
            Linkname1="/employees-list"
          />

          {/* 🔹 Search box */}
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Employee ID or Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <Table
                  className="table-striped"
                  columns={columns}
                  dataSource={data}
                  rowKey={(record) => record.id}
                  pagination={{
                    current: currentPage,
                    pageSize: 10,
                    total: AllEmployeeData?.totalNoPages * 10 || 0,
                    onChange: (page) => setCurrentPage(page),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AllEmployeeAddPopup />
      <AllEmployeeEditPopup
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        employee={selectedEmployee}
      />
      <DeleteModal Name="Delete Employee" Id={selectedEmployeeId} />
    </div>
  );
};

export default EmployeeList;
