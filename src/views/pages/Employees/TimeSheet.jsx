/** @format */

import React, { useEffect, useState, useRef } from "react";
import { Table, Tag, Dropdown, Menu } from "antd";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SearchBox from "../../../components/SearchBox";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import * as bootstrap from "bootstrap";

import { get_all_timesheets } from "../../../Redux/services/Timesheet";
import { useDispatch, useSelector } from "react-redux";
import { update_timesheet } from "../../../Redux/services/Timesheet";
import { AddTimeSheetModelPopup } from "../../../components/modelpopup/AddTimeSheetModelPopup";
import { HTTPURL } from "../../../Constent/Matcher";

const TimeSheet = () => {
  const dispatch = useDispatch();
  const LogInuserRole = localStorage.getItem("role");
  const AllTimeSheet = useSelector((state) => state?.timesheet?.AllTimesheets);
  const LogInuserId = useSelector((state) => state.user.logUserID);
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedForNotes, setSelectedForNotes] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(get_all_timesheets());
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open Edit
  const handleEdit = (row) => {
    setSelectedRow(row);
    setIsEditing(true);
    setIsViewing(false);

    document.getElementById("openTimeSheetModal")?.click();
  };

  // Open View
  const handleView = (row) => {
    setSelectedRow(row);
    setIsEditing(false);
    setIsViewing(true);

    document.getElementById("openTimeSheetModal")?.click();
  };

  // Open Delete Modal
  const handleDelete = (id) => {
    setDeleteId(id);
    document.getElementById("openDeleteModal")?.click();
  };

  // Mapping Table Data
  const mappedData = AllTimeSheet?.map((item, index) => {
    // Project dates
    const start = new Date(item?.project?.start_date);
    const end = new Date(item?.project?.end_date);

    // Hours calculation between two dates
    const diffMs = end - start; // milliseconds difference
    const diffDays = diffMs / (1000 * 60 * 60 * 24); // convert to days
    const totalHoursBetween = diffDays * 24; // convert days to hours
    console.log("totalHoursBetween", totalHoursBetween);
    return {
      key: item?.id,
      serial: index + 1,
      project: item?.project.project_name,
      project_id: item?.project_id,
      user: `${item?.user?.first_name} ${item?.user?.last_name}`,
      user_id: item?.user_id,
      work_date: item?.work_date,

      // 👇 Your required value
      total_hour: totalHoursBetween,

      hours: parseInt(item?.hours) || 0,
      description: item?.description,
      profile_pic: item?.user?.profile_pic,
      notes: item?.notes,
    };
  });

  const data =
    LogInuserRole === "Admin"
      ? mappedData
      : mappedData?.filter((item) => item.user_id == LogInuserId);

  const filteredData = data?.filter(
    (item) =>
      item?.project?.toLowerCase().includes(searchText.toLowerCase()) ||
      item?.user?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpenNotes = (row) => {
    setSelectedForNotes(row);
    setIsNotesModalOpen(true);

    document.getElementById("openNotesModal")?.click();
  };

  const handleSaveNotes = async () => {
    if (!selectedForNotes) return;

    const payload = {
      notes: selectedForNotes.notes,
    };

    await dispatch(
      update_timesheet({
        timesheet_id: selectedForNotes.key,
        formData: payload,
      })
    );

    // Modal close
    document.querySelector("#notes_modal .btn-close")?.click();

    setSelectedForNotes(null);

    dispatch(get_all_timesheets());
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "user",
      render: (text, record) => {
        const fullName = record.user;
        const initials = fullName
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();
        return (
          <span className="table-avatar d-flex align-items-center">
            <span className="avatar">
              {record?.profile_pic ? (
                <img alt={fullName} src={`${HTTPURL}${record.profile_pic}`} />
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#007bff22",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "#007bff",
                  }}
                >
                  {initials}
                </div>
              )}
            </span>

            <span className="ms-2">
              {fullName}
              <span className="text-muted d-block">{record.role}</span>
            </span>
          </span>
        );
      },
      sorter: (a, b) => a.user.localeCompare(b.user),
    },

    {
      title: "Project",
      dataIndex: "project",
      sorter: (a, b) => a.project.localeCompare(b.project),
    },

    {
      title: "Work Date",
      dataIndex: "work_date",
    },

    {
      title: "Total Hours",
      dataIndex: "total_hour",
      align: "center",
    },

    {
      title: "Working Hours",
      dataIndex: "hours",
      align: "center",
    },

    {
      title: "Action",
      align: "center",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" onClick={() => handleView(record)}>
              <i className="fa fa-eye me-2"></i> View
            </Menu.Item>

            {LogInuserRole === "Admin" && (
              <Menu.Item key="notes" onClick={() => handleOpenNotes(record)}>
                <i className="las la-file me-2"></i> Notes
              </Menu.Item>
            )}

            <>
              <Menu.Item key="edit" onClick={() => handleEdit(record)}>
                <i className="fa fa-pencil me-2"></i> Edit
              </Menu.Item>

              <Menu.Item key="delete" onClick={() => handleDelete(record.key)}>
                <i className="fa fa-trash me-2"></i> Delete
              </Menu.Item>
            </>
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
            maintitle="Time Sheets"
            title="Dashboard"
            subtitle="Time Sheets"
            modal="#time_sheet_modal"
            name="Add Time Sheet"
            hideButton={localStorage.getItem("role") === "Admin"}
            forceShowButton={true}
          />

          <div className="d-flex mb-2">
            <SearchBox
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <Table
              columns={columns}
              dataSource={filteredData || []}
              pagination={{ pageSize: 10 }}
            />
          </div>
        </div>

        {/* Add/Edit/View Modal */}
        <AddTimeSheetModelPopup
          isEditing={isEditing}
          isViewing={isViewing}
          data={selectedRow}
          onClose={() => {
            setSelectedRow(null);
            setIsEditing(false);
            setIsViewing(false);
            dispatch(get_all_timesheets());
          }}
        />

        {/* Notes Modal */}
        <div
          className="modal fade"
          id="notes_modal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Notes</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>

              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Enter notes..."
                  value={selectedForNotes?.notes || ""}
                  onChange={(e) =>
                    setSelectedForNotes({
                      ...selectedForNotes,
                      notes: e.target.value,
                    })
                  }
                ></textarea>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveNotes}
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        <DeleteModal Name="Delete TimeSheet" Id={deleteId} />

        {/* Hidden Triggers */}
        <button
          id="openTimeSheetModal"
          data-bs-toggle="modal"
          data-bs-target="#time_sheet_modal"
          style={{ display: "none" }}
        />

        <button
          id="openDeleteModal"
          data-bs-toggle="modal"
          data-bs-target="#delete"
          style={{ display: "none" }}
        />

        <button
          id="openNotesModal"
          data-bs-toggle="modal"
          data-bs-target="#notes_modal"
          style={{ display: "none" }}
        />
      </div>
    </>
  );
};

export default TimeSheet;
