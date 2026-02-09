/** @format */

import React, { useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { Table, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { get_all_shift_rosters } from "../../../Redux/services/ShiftRoster";

import DeleteModal from "../../../components/modelpopup/DeleteModal";
import ShiftModelPopup from "../../../components/modelpopup/ShiftModelPopup";
import ScheduleModelPopup from "../../../components/modelpopup/ScheduleModelPopup";
import SearchBox from "../../../components/SearchBox";
import { useState } from "react";

const ShiftList = () => {
  const dispatch = useDispatch();

  const loggedInUserId = useSelector((state) => state.user.logUserID);
  const shiftRosters =
    useSelector((state) => state?.shiftRoster?.AllShiftRosters) || [];

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(get_all_shift_rosters());
  }, [dispatch]);

  // -----------------------------
  // FILTER ONLY LOGGED-IN USER DATA
  // -----------------------------
  const filteredData = shiftRosters
    .filter((shift) => {
      return (
        Array.isArray(shift.attendance_ids) &&
        shift.attendance_ids.includes(loggedInUserId)
      );
    })
    .filter((shift) => {
      if (!search) return true;

      const term = search.toLowerCase();
      const shiftName = shift.shift_type?.toLowerCase() || "";
      const shiftDate = shift.shift_date || "";
      const createdAt = shift.createdAt || "";

      return (
        shiftName.includes(term) ||
        shiftDate.includes(term) ||
        createdAt.includes(term)
      );
    })
    .map((shift) => {
      const userAttendance = shift.attendance?.find(
        (att) => att.employee_id === loggedInUserId
      );

      return {
        id: shift.id,
        shift_type: shift.shift_type,
        shift_date: shift.shift_date,
        punch_in: userAttendance?.punch_in || "-",
        punch_out: userAttendance?.punch_out || "-",
        break_hours: userAttendance?.break_hours || "-",
        work_hours: userAttendance?.work_hours || "-",
        created_at: shift.createdAt,
      };
    });

  // -----------------------------
  // TABLE COLUMNS
  // -----------------------------
  const columns = [
    {
      title: "Sr No.",
      render: (_, __, index) => index + 1,
      width: 90,
    },
    {
      title: "Shift Name",
      dataIndex: "shift_type",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    // { title: "Min Start Time", dataIndex: "min_start_time" },
    // { title: "Max Start Time", dataIndex: "max_start_time" },
    // { title: "Min End Time", dataIndex: "min_end_time" },
    // { title: "Max End Time", dataIndex: "max_end_time" },
    {
      title: "Start Time",
      render: (_, r) =>
        r.punch_in ? new Date(r.punch_in).toLocaleTimeString() : "-",
    },
    {
      title: "End Time",
      render: (_, r) =>
        r.punch_out ? new Date(r.punch_out).toLocaleTimeString() : "-",
    },
    {
      title: "Break Time",
      render: (_, r) => r.break_hours || "0",
    },
    {
      title: "Duration",
      render: (_, r) => (
        <span>
          {r.work_hours || "0"} hrs{" "}
          {r.work_hours > 12 && <Tag color="volcano">Exceeds 12 hrs</Tag>}
        </span>
      ),
    },
    {
      title: () => <div className="text-end">Status</div>,
      render: () => (
        <div className="text-end">
          {" "}
          <Link
            className="btn btn-white btn-sm btn-rounded dropdown-toggle"
            to="#"
            data-bs-toggle="dropdown"
          >
            {" "}
            <i className="far fa-dot-circle text-success" /> Active{" "}
          </Link>{" "}
          <div className="dropdown-menu dropdown-menu-right">
            {" "}
            <Link to="#" className="dropdown-item">
              {" "}
              <i className="far fa-dot-circle text-success" /> Active{" "}
            </Link>{" "}
            <Link to="#" className="dropdown-item">
              {" "}
              <i className="far fa-dot-circle text-danger" /> Inactive{" "}
            </Link>{" "}
          </div>{" "}
        </div>
      ),
    },
    // {
    //   // Action Column
    //   title: "Action",
    //   render: () => (
    //     <div className="dropdown dropdown-action">

    //       {/* Action Menu Trigger */}
    //       <Link
    //         to="#"
    //         className="action-icon dropdown-toggle"
    //         data-bs-toggle="dropdown"
    //       >
    //         <i className="material-icons">more_vert</i>
    //       </Link>

    //       {/* Dropdown Menu */}
    //       <div className="dropdown-menu dropdown-menu-right">

    //         {/* Edit Button */}
    //         <Link
    //           className="dropdown-item"
    //           to="#"
    //           data-bs-toggle="modal"
    //           data-bs-target="#edit_shift"
    //         >
    //           <i className="fa fa-pencil m-r-5" /> Edit
    //         </Link>

    //         {/* Delete Button */}
    //         <Link
    //           className="dropdown-item"
    //           to="#"
    //           data-bs-toggle="modal"
    //           data-bs-target="#delete"
    //         >
    //           <i className="fa fa-trash m-r-5" /> Delete
    //         </Link>

    //       </div>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Shift List</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin-dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Employees</Link>
                </li>
                <li className="breadcrumb-item active">Shift List</li>
              </ul>
            </div>
            {/* <div className="col-auto float-end ms-auto">
              <Link
                to="#"
                className="btn add-btn m-r-5"
                data-bs-toggle="modal"
                data-bs-target="#add_shift"
              >
                Add Shifts
              </Link>
              <Link
                to="#"
                className="btn add-btn m-r-5"
                data-bs-toggle="modal"
                data-bs-target="#add_schedule"
              >
                Assign Shifts
              </Link>
            </div> */}
          </div>
        </div>

        {/* Search Box */}
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex align-items-center mb-2">
              <div className="flex-grow-1">
                <input
                  type="text"
                  placeholder="Search by Shift Name or Date (YYYY-MM-DD)"
                  className="form-control w-50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary ms-2"
                title="Search"
              >
                <i className="fa fa-search" />
              </button>
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              <Table
                className="table-striped"
                columns={columns}
                dataSource={filteredData}
                rowKey={(record) => record.id}
                pagination={{ pageSize: 10 }}
              />
            </div>
          </div>
        </div>
      </div>

      <ScheduleModelPopup />
      <ShiftModelPopup />
      <DeleteModal Name="Delete Shift" />
    </div>
  );
};

export default ShiftList;
