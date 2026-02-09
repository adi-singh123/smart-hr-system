import React from "react";
import SearchBox from "../../../../components/SearchBox";
import { Table } from "antd";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import DeleteModal from "../../../../components/modelpopup/DeleteModal";
import LeaveTypeModal from "../../../../components/modelpopup/LeaveTypeModal";

const LeaveType = () => {
  // Updated data with status and meaningful leavedays
  const data = [
    { id: 1, leavetype: "Medical Leave", leavedays: "12 days", status: "active" },
    { id: 2, leavetype: "Loss of Pay", leavedays: "0 days", status: "inactive" },
    { id: 3, leavetype: "Casual Leave", leavedays: "12 days", status: "active" },
  ];

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Leave Type",
      dataIndex: "leavetype",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.leavetype.localeCompare(b.leavetype),
    },
    {
      title: "Leave Days",
      dataIndex: "leavedays",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.leavedays.length - b.leavedays.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className={`badge ${status === "active" ? "bg-success" : "bg-secondary"}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      sorter: false,
      className: "text-end",
      render: () => (
        <div className="dropdown dropdown-action text-end">
          <Link
            to="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            title="Actions"
          >
            <i className="material-icons">more_vert</i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_leavetype"
              title="Edit Leave Type"
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
              title="Delete Leave Type"
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs
            maintitle="Leave Type"
            title="Dashboard"
            subtitle="Leave Type"
            modal="#add_leavetype"
            name="Add Leave Type"
          />
          {/* /Page Header */}

          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <SearchBox />
                <Table
                  columns={columns}
                  dataSource={data}
                  rowKey={(record) => record.id}
                  pagination={{ pageSize: 10 }} // ✅ Enables pagination
                />
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}

        {/* Modals */}
        <LeaveTypeModal />
        <DeleteModal Name="Delete Leave Type" />
      </div>
    </>
  );
};

export default LeaveType;
