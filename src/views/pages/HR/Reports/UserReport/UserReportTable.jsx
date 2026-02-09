import { Table, Pagination } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const PAGE_SIZE = 10; // Number of items per page

// Helper to get initials from name
const getInitials = (name) => {
  if (!name) return "";
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0][0] ? words[0][0].toUpperCase() : "";
  }
  return (
    (words[0][0] ? words[0][0].toUpperCase() : "") +
    (words[words.length - 1][0] ? words[words.length - 1][0].toUpperCase() : "")
  );
};

const UserReportTable = ({ data }) => {
  const [current, setCurrent] = useState(1); // Current page state

  // Calculate paginated data
  const paginatedData = data.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // Custom pagination item render
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
      const totalPages = Math.ceil(data.length / PAGE_SIZE);
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
      title: "#",
      dataIndex: "id",
      sorter: (a, b) => {
        const aId = isNaN(Number(a.id)) ? a.id : Number(a.id);
        const bId = isNaN(Number(b.id)) ? b.id : Number(b.id);
        if (typeof aId === "number" && typeof bId === "number") {
          return aId - bId;
        }
        return String(a.id).localeCompare(String(b.id));
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="table-avatar">
          <Link to="#" className="avatar">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#e0e3e6",
                color: "#3a3a3a",
                fontWeight: 600,
                fontSize: 15,
                textTransform: "uppercase",
                userSelect: "none",
              }}
            >
              {getInitials(text)}
            </span>
          </Link>
          <Link to="#">
            {text}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Company",
      dataIndex: "company",
      sorter: (a, b) => a.company.localeCompare(b.company),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Role",
      dataIndex: "type",
      render: (text) => (
        <span
          className={
            text === "Client"
              ? "badge bg-inverse-success"
              : text === "Admin"
              ? "badge bg-inverse-danger"
              : "badge bg-primary"
          }>
          {text}
        </span>
      ),
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: "Designation",
      dataIndex: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
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
            aria-expanded="false">
            <i
              className={
                text === "Inactive"
                  ? "far fa-dot-circle text-danger"
                  : "far fa-dot-circle text-success"
              }
            />{" "}
            {text}
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
  ];
  
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
            itemRender={itemRender}
            showTotal={(total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`
            }
            style={{ display: data.length > PAGE_SIZE ? "block" : "none" }}
          />
          {data.length <= PAGE_SIZE && (
            <div className="text-muted small ms-2" style={{ alignSelf: "center" }}>
              Only 1 page of results
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReportTable;