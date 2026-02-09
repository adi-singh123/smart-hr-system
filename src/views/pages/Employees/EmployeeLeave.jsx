/** @format */

import { Table, Dropdown, Menu, message } from "antd";
import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import EmployeeLeaveModelPopup from "../../../components/modelpopup/EmployeeLeaveModelPopup";
import { useSelector, useDispatch } from "react-redux";
import {
  getLeaves,
  updateLeave as updateLeaveAdmin, // kept for compatibility if used elsewhere
  updateLeaveStatus, // <-- make sure this thunk exists in your services file
} from "../../../Redux/services/EmployeeLeaves";

import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { fetchNotifications } from "../../../Redux/services/Notifications";

const EmployeeLeave = () => {
  const { Leaves } = useSelector((state) => state.employee_leaves);
  const LogInuserRole = localStorage.getItem("role");
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState(null); // 🔹 delete modal ke liye
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getLeaves());
  }, [dispatch]);

  // Ensure bootstrap dropdown toggles work reliably (like in GoalTracking)
  useEffect(() => {
    const dropdownElements = document.querySelectorAll(
      '[data-bs-toggle="dropdown"]'
    );
    dropdownElements.forEach((el) => {
      const instance = bootstrap.Dropdown.getOrCreateInstance(el);
      el.onclick = (e) => {
        e.stopPropagation();
        instance.toggle();
      };
    });

    return () => {
      dropdownElements.forEach((el) => {
        const instance = bootstrap.Dropdown.getInstance(el);
        if (instance) instance.dispose();
        el.onclick = null;
      });
    };
    // re-run when Leaves changes so new dropdowns get bound
  }, [Leaves]);

  // 🔹 View
  const handleView = (data) => {
    setSelectedLeave(data);
    setModalMode("view");
    document.getElementById("openEmployeeLeaveModal")?.click();
  };

  // 🔹 Edit
  const handleEdit = (data) => {
    setSelectedLeave(data);
    setModalMode("edit");
    document.getElementById("openEmployeeLeaveModal")?.click();
  };

  // 🔹 Delete
  const handleDelete = (id) => {
    setDeleteId(id); // modal ke liye id set karo
    document.getElementById("openDeleteModal")?.click(); // modal open karo
  };

  // 🔹 Update status (dispatch thunk)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await dispatch(updateLeaveStatus({ id, status: newStatus }));
      // if you return { status: true } style from backend, check accordingly
      if (
        res?.payload?.status ||
        res?.payload?.success ||
        res?.meta?.requestStatus === "fulfilled"
      ) {
        message.success("Status updated successfully");
        // Refresh list
        dispatch(fetchNotifications());
        dispatch(getLeaves());
      } else {
        // fallback: show message from payload if present
        const msg =
          res?.payload?.message ||
          res?.payload?.error ||
          "Failed to update status";
        message.error(msg);
      }
    } catch (err) {
      console.error("Status update failed:", err);
      message.error("Failed to update status");
    }
  };

  // 🔹 Apply filter + search
  const filteredLeaves = Leaves?.filter((leave) => {
    const typeMatch = selectedType ? leave.leave_type === selectedType : true;
    const searchMatch = searchTerm
      ? leave.leave_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leave_reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.employee_name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return typeMatch && searchMatch;
  });

  const userElements = filteredLeaves?.map((user, index) => ({
    key: index,
    id: user.id,
    employee_name: user.employee_name,
    leave_type: user.leave_type,
    from: user.from,
    to: user.to,
    no_of_days: user.no_of_days,
    leave_reason: user.leave_reason,
    status: user.status,
    remaining_leaves: user.remaining_leaves,
  }));

  const columns = [
    { title: "Employee", dataIndex: "employee_name" },
    { title: "Leave Type", dataIndex: "leave_type" },
    { title: "From", dataIndex: "from" },
    { title: "To", dataIndex: "to" },
    { title: "No Of Days", dataIndex: "no_of_days" },
    // { title: "Reason", dataIndex: "leave_reason" },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        // Admin: show dropdown like GoalTracking (can change status)
        if (LogInuserRole === "Admin") {
          return (
            <div className="dropdown action-label training-dropdown">
              <button
                type="button"
                className="btn btn-white btn-sm btn-rounded dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <i
                  className={`far fa-dot-circle ${
                    text?.toLowerCase() === "pending"
                      ? "text-warning"
                      : text?.toLowerCase() === "inactive" ||
                        text?.toLowerCase() === "rejected"
                      ? "text-danger"
                      : "text-success"
                  }`}
                />{" "}
                {text || "Unknown"}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleUpdateStatus(record.id, "approved")}
                  >
                    <i className="far fa-dot-circle text-success"></i> Approve
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleUpdateStatus(record.id, "rejected")}
                  >
                    <i className="far fa-dot-circle text-danger"></i> Reject
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleUpdateStatus(record.id, "pending")}
                  >
                    <i className="far fa-dot-circle text-warning"></i> Pending
                  </button>
                </li>
              </ul>
            </div>
          );
        }

        // Non-admin: simple badge (no update)
        const lower = (text || "").toLowerCase();
        const badgeClass =
          lower === "approved"
            ? "success"
            : lower === "rejected" || lower === "inactive"
            ? "danger"
            : lower === "pending"
            ? "warning"
            : "secondary";

        return (
          <span className={`badge rounded-pill bg-${badgeClass}`}>
            {lower.charAt(0).toUpperCase() + lower.slice(1)}
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      className: "text-end",
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
          <Dropdown overlay={menu} trigger={["click"]}>
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
            name="Add New"
            forceShowButton={true}
          />

          {/* Filter + Search */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <select
                className="form-select w-auto"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Leave Types</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Medical Leave">Medical Leave</option>
                <option value="Loss of Pay">Loss of Pay</option>
              </select>
            </div>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Employee, Leave Type or Reason"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="button" className="btn btn-outline-secondary ms-2">
                <i className="fa fa-search" />
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <Table
              columns={columns}
              dataSource={userElements}
              className="table-striped"
              pagination={{ pageSize: 10 }}
            />
          </div>
        </div>
      </div>

      {/* 🔹 Add / Edit / View Modal */}
      <EmployeeLeaveModelPopup
        mode={modalMode}
        leaveData={selectedLeave}
        onClose={() => {
          setSelectedLeave(null);
          setModalMode("add");
        }}
      />

      <button
        id="openEmployeeLeaveModal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#add_leave"
        style={{ display: "none" }}
      />

      {/* 🔹 Hidden trigger for DeleteModal */}
      <button
        id="openDeleteModal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#delete"
        style={{ display: "none" }}
      />

      {/* 🔹 Delete Modal */}
      <DeleteModal Name="Delete Leaves" Id={deleteId} />
    </>
  );
};

export default EmployeeLeave;
