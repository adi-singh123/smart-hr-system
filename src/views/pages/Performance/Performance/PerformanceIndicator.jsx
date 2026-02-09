/* eslint-disable no-undef */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Pagination } from "antd";
import SearchBox from "../../../../components/SearchBox";
import {
  Avatar_02,
  Avatar_05,
  Avatar_10,
  Avatar_11,
  Avatar_12,
} from "../../../../Routes/ImagePath/index";
import PerformanceIndicatorModal from "../../../../components/modelpopup/PerformanceIndicatorModal";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import DeleteModal from "../../../../components/modelpopup/DeleteModal";

const data = [
  {
    id: 1,
    employeeId: "EMP001",
    image: Avatar_02,
    name: "John Doe",
    designation: "IOS Developer",
    department: "IOS",
    createdDate: "1 Jan 2023",
    status: "Active",
    role: "Senior Developer",
  },
  {
    id: 2,
    employeeId: "EMP002",
    image: Avatar_05,
    name: "Richard Miles",
    designation: "Web Designer - UI/UX",
    department: "Design",
    createdDate: "18 Mar 2014",
    status: "Active",
    role: "Lead Designer",
  },
  {
    id: 3,
    employeeId: "EMP003",
    image: Avatar_11,
    name: "John Smith",
    designation: "Android Developer",
    department: "Android",
    createdDate: "1 Apr 2014",
    status: "Inactive",
    role: "Junior Developer",
  },
  {
    id: 4,
    employeeId: "EMP004",
    image: Avatar_10,
    name: "Jeffrey Warden",
    designation: "Web Designer - Frontend",
    department: "Design",
    createdDate: "16 Jun 2023",
    status: "Active",
    role: "Mid-level Designer",
  },
  {
    id: 5,
    employeeId: "EMP005",
    image: Avatar_12,
    name: "Bernardo Galaviz",
    designation: "Web Designer - Graphics",
    department: "Design",
    createdDate: "1 Jan 2023",
    status: "Active",
    role: "Graphics Specialist",
  },
];

const PerformanceIndicator = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sorter: (a, b) => a.designation.localeCompare(b.designation),
      render: (text) => (
        <div>
          {text}
          <div className="text-muted small">ID: {data.find(item => item.designation === text)?.employeeId}</div>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      title: "Added By",
      dataIndex: "name",
      render: (text, record) => (
        <div className="table-avatar">
          <Link to="/profile" className="avatar">
            <img alt="" src={record.image} />
          </Link>
          <Link to="/profile">
            {text} 
            <span className="d-block text-muted small">{record.role} (ID: {record.employeeId})</span>
          </Link>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Date Created",
      dataIndex: "createdDate",
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div className="dropdown action-label">
          <Link
            className="btn btn-white btn-sm btn-rounded dropdown-toggle"
            to="#"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i
              className={
                text === "Inactive"
                  ? "far fa-dot-circle text-danger"
                  : "far fa-dot-circle text-success"
              }
            />{" "}
            <span className="status-text">{text}</span>
            <span className="sr-only">(current status: {text.toLowerCase()})</span>
          </Link>
          <div className="dropdown-menu">
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-success" /> Active
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-danger" /> Inactive
            </Link>
          </div>
        </div>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      sorter: false,
      className: "text-end",
      render: (_, record) => (
        <div className="dropdown dropdown-action text-end">
          <Link
            to="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-icons">more_vert</i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_indicator"
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  // Pagination logic
  const paginatedData = data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <div className="page-wrapper">
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs
            maintitle="Performance Indicator"
            title="Dashboard"
            subtitle="Performance"
            modal="#add_indicator"
            name="Add New"
          />
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <SearchBox />
                <Table
                  className="table-striped custom-table"
                  style={{ overflowX: "auto" }}
                  columns={columns}
                  dataSource={paginatedData}
                  rowKey={(record) => record.id}
                  pagination={false}
                />
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, data.length)} of {data.length} entries
                  </div>
                  <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={data.length}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
      <PerformanceIndicatorModal />
      <DeleteModal Name="Delete Performance Indicator List" />
    </>
  );
};

export default PerformanceIndicator;