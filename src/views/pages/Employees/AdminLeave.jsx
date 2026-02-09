/** @format */

// AdminLeave.jsx
import React, { useEffect, useState, useRef } from "react";
import { Table, Dropdown, Menu } from "antd";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SearchBox from "../../../components/SearchBox";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllLeaves,
  deleteLeave,
} from "../../../Redux/services/EmployeeLeaves";
import { AdminLeaveAddModelPopup } from "../../../components/modelpopup/AdminLeaveModelPopup";
import { customAlert } from "../../../utils/Alert";
import DeleteModal from "../../../components/modelpopup/DeleteModal"; // ✅ Added
import * as bootstrap from "bootstrap";

const AdminLeave = () => {
  const LogInuserRole = localStorage.getItem("role");
  const dispatch = useDispatch();
  const { allLeaves } = useSelector((state) => state.employee_leaves);

  const [searchText, setSearchText] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // ✅ Added for DeleteModal
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(getAllLeaves());
  }, [dispatch]);

  // Close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = (leave) => {
    setSelectedLeave(leave);
    setIsEditing(true);
    setIsViewing(false);
    document.getElementById("openAdminLeaveModal")?.click();
    setActiveDropdown(null);
  };

  const handleView = (leave) => {
    setSelectedLeave(leave);
    setIsEditing(false);
    setIsViewing(true);
    document.getElementById("openAdminLeaveModal")?.click();
    setActiveDropdown(null);
  };

  // ✅ Delete handler using DeleteModal
  const handleDelete = (leaveId) => {
    setDeleteId(leaveId);
    document.getElementById("openDeleteModal")?.click();
  };

  const filteredLeaves = allLeaves.filter((leave) => {
    const fullName = `${leave.first_name} ${leave.last_name}`.toLowerCase();
    return fullName.includes(searchText.toLowerCase());
  });

  const tableData = filteredLeaves.map((item) => ({
    key: item.id,
    id: item.id,
    first_name: item.first_name,
    last_name: item.last_name,
    name: item.admin_name,
    leave_type: item.leave_type,
    from: item.from,
    to: item.to,
    no_of_days: item.no_of_days,
    leave_reason:
      item.leave_reason.charAt(0).toUpperCase() + item.leave_reason.slice(1),
    status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    remaining_leaves: item.remaining_leaves,
  }));

  const columns = [
    {
      title: "Employee",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    { title: "Leave Type", dataIndex: "leave_type" },
    {
      title: "From",
      dataIndex: "from",
      sorter: (a, b) => new Date(a.from) - new Date(b.from),
    },
    {
      title: "To",
      dataIndex: "to",
      sorter: (a, b) => new Date(a.to) - new Date(b.to),
    },
    {
      title: "No Of Days",
      dataIndex: "no_of_days",
      sorter: (a, b) => parseInt(a.no_of_days) - parseInt(b.no_of_days),
    },
    { title: "Reason", dataIndex: "leave_reason" },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span
          className={`btn btn-white btn-sm btn-rounded ${
            text === "New"
              ? "text-purple"
              : text === "Pending"
              ? "text-info"
              : text === "Approved"
              ? "text-success"
              : "text-danger"
          }`}
        >
          <i className="far fa-dot-circle me-1" /> {text}
        </span>
      ),
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" onClick={() => handleView(record)}>
              <i className="fa fa-eye me-2" /> View
            </Menu.Item>
            {LogInuserRole === "Admin" && (
              <>
                <Menu.Item key="edit" onClick={() => handleEdit(record)}>
                  <i className="fa fa-pencil me-2" /> Edit
                </Menu.Item>
                <Menu.Item key="delete" onClick={() => handleDelete(record.id)}>
                  <i className="fa fa-trash me-2" /> Delete
                </Menu.Item>
              </>
            )}
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]} ref={dropdownRef}>
            <i className="material-icons" style={{ cursor: "pointer" }}>
              more_vert
            </i>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Leaves"
            title="Dashboard"
            subtitle="Leaves"
            modal="#add_leave"
            name="Add Leave"
          />
          <div className="row">
            <div className="col-md-12">
              <SearchBox
                placeholder="Search Employee"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={tableData}
                  className="table-striped"
                  rowKey={(record) => record.key}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit/View Leave Modal */}
        <AdminLeaveAddModelPopup
          isEditing={isEditing}
          isViewing={isViewing}
          leaveData={selectedLeave}
          onClose={() => {
            setSelectedLeave(null);
            setIsEditing(false);
            setIsViewing(false);
            dispatch(getAllLeaves());
          }}
        />

        {/* ✅ Custom Delete Modal */}
        <DeleteModal Name="Delete AdminLeave" Id={deleteId} />

        {/* Hidden trigger buttons */}
        <button
          id="openAdminLeaveModal"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#add_leave"
          style={{ display: "none" }}
        />
        <button
          id="openDeleteModal"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#delete"
          style={{ display: "none" }}
        />
      </div>
    </>
  );
};

export default AdminLeave;
