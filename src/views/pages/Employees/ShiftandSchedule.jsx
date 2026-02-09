/**
 * eslint-disable no-undef
 *
 * @format
 */

/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Avatar_02,
  Avatar_05,
  Avatar_09,
  Avatar_10,
  Avatar_11,
  Avatar_12,
  Avatar_13,
} from "../../../Routes/ImagePath";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ScheduleModelPopup from "../../../components/modelpopup/ScheduleModelPopup";
import ShiftSchedulingFilter from "../../../components/ShiftSchedulingFilter";
import { useDispatch, useSelector } from "react-redux";
import { get_employee_data } from "../../../Redux/services/Employee";
import { get_all_shift_rosters } from "../../../Redux/services/ShiftRoster";
import { HTTPURL } from "../../../Constent/Matcher";

dayjs.extend(customParseFormat);

const FALLBACK_AVATARS = [
  Avatar_02,
  Avatar_05,
  Avatar_09,
  Avatar_10,
  Avatar_11,
  Avatar_12,
  Avatar_13,
];

const ShiftScheduling = () => {
  // ---------- Hooks (always top) ----------
  const dispatch = useDispatch();
  const LogInUserRole = localStorage.getItem("role");
  // employees and rosters from redux (call selectors at top)
  const AllEmployeeData = useSelector((state) => state?.employee?.employeeData);
  const employees = AllEmployeeData?.users || [];

  const rosters =
    useSelector((state) => state?.shiftRoster?.AllShiftRosters) || [];

  // ---------- Local modal state ----------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const filteredEmployees = useMemo(() => {
    if (!searchText)
      return employees.filter(
        (emp) => emp.role?.name?.toLowerCase() !== "admin"
      );

    const text = searchText.toLowerCase();

    return employees
      .filter((emp) => emp.role?.name?.toLowerCase() !== "admin") // ❌ admin remove
      .filter((emp) => {
        const name = `${emp.first_name || ""} ${
          emp.last_name || ""
        }`.toLowerCase();

        const shifts = rosters.filter(
          (r) =>
            Array.isArray(r.attendance_ids) && r.attendance_ids.includes(emp.id)
        );
        const shiftMatch = shifts.some((r) =>
          (r.shift_type || "").toLowerCase().includes(text)
        );

        return name.includes(text) || shiftMatch;
      });
  }, [searchText, employees, rosters]);

  const getInitials = (firstName, lastName) => {
    const f = (firstName || "").trim();
    const l = (lastName || "").trim();

    if (!f && !l) return "";
    if (!l) return f[0].toUpperCase();
    return f[0].toUpperCase() + l[0].toUpperCase();
  };

  // ---------- Fetch on mount ----------
  useEffect(() => {
    dispatch(get_employee_data());
    dispatch(get_all_shift_rosters());
  }, [dispatch]);

  // ---------- Compute current week (Mon -> Sat) dynamic ----------
  // Find Monday of current week, then Mon..Sat (6 days)
  const weekDays = useMemo(() => {
    const today = dayjs();
    const dayOfWeek = today.day(); // Sun=0, Mon=1 ...
    const monday = today.subtract((dayOfWeek + 6) % 7, "day"); // move to Monday
    const arr = [];
    for (let i = 0; i < 6; i++) {
      const dt = monday.add(i, "day");
      arr.push({
        iso: dt.format("YYYY-MM-DD"),
        labelDay: dt.format("ddd"), // Mon/Tue...
        labelDate: dt.format("DD"), // 01..31
        fullLabel: `${dt.format("ddd")} ${dt.format("DD")}`, // e.g. Mon 24
      });
    }
    return arr;
  }, []);

  // ---------- map rosters by date -> attendance id set for quick lookups ----------
  const rosterIndex = useMemo(() => {
    // map: rosterIndex[date] = array of roster objects for that date
    const idx = {};
    for (const r of rosters || []) {
      if (!r) continue;
      const date = r.shift_date; // expecting YYYY-MM-DD
      if (!idx[date]) idx[date] = [];
      idx[date].push(r);
    }
    return idx;
  }, [rosters]);

  // ---------- helpers ----------
  const openAddModal = (emp, dateIso) => {
    // open modal to add roster — preselect employee & date
    const init = {
      department_id: emp.department_id || null,
      attendance_ids: [emp.id],
      shift_date: dateIso,
      shift_type: null, // user will select shift
    };
    setModalInitialData(init);
    setIsModalOpen(true);
  };

  const openEditModal = (roster) => {
    // roster is expected to contain: id, department_id, attendance_ids[], shift_date, shift_type
    const init = {
      id: roster.id,
      department_id: roster.department_id,
      attendance_ids: roster.attendance_ids || [],
      shift_date: roster.shift_date,
      shift_type: roster.shift_type,
    };
    setModalInitialData(init);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalInitialData(null);
    setIsModalOpen(false);
    // refresh rosters after close (in case of add/update)
    dispatch(get_all_shift_rosters());
  };

  // ---------- Render ----------
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Shift Roster</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin-dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/employees">Employees</Link>
                  </li>
                  <li className="breadcrumb-item active">Shift Scheduling</li>
                </ul>
              </div>
              <div className="col-auto float-end ms-auto">
                {LogInUserRole != "Admin" && (
                  <Link to="/shift-list" className="btn add-btn m-r-5">
                    Shifts
                  </Link>
                )}
                {LogInUserRole == "Admin" && (
                  <Link
                    to="#"
                    className="btn add-btn m-r-5"
                    onClick={() => {
                      setModalInitialData(null);
                      setIsModalOpen(true);
                    }}
                  >
                    Assign Shifts
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* /Page Header */}

          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search employee or shift..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <table className="table table-striped custom-table">
                  <thead>
                    <tr>
                      <th>Scheduled Shift</th>
                      {weekDays.map((d) => (
                        <th key={d.iso}>
                          {d.labelDay} {d.labelDate}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp, empIndex) => (
                      <tr key={emp.id}>
                        <td>
                          <h2 className="table-avatar">
                            <Link to={`/profile/${emp.id}`} className="avatar">
                              {emp.profile_pic ? (
                                <img
                                  src={`${HTTPURL}${emp.profile_pic}`}
                                  alt="img"
                                />
                              ) : (
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
                                    border: "1px solid #d1d5db",
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                  }}
                                >
                                  {getInitials(emp.first_name, emp.last_name)}
                                </span>
                              )}
                            </Link>

                            <Link to={`/profile/${emp.id}`}>
                              {emp.first_name} {emp.last_name}{" "}
                              <span>
                                ({emp.designation || emp.role?.name || ""})
                              </span>
                            </Link>
                          </h2>
                        </td>

                        {/* For each day cell */}
                        {weekDays.map((d) => {
                          const dateIso = d.iso;
                          // find rosters for this date that include this employee
                          const dayRosters = rosterIndex[dateIso] || [];
                          const assignedForEmployee = dayRosters.filter((r) =>
                            Array.isArray(r.attendance_ids)
                              ? r.attendance_ids.includes(emp.id)
                              : false
                          );

                          return (
                            <td key={`${emp.id}-${dateIso}`}>
                              <div className="user-add-shedule-list">
                                {assignedForEmployee.length > 0 ? (
                                  // show first match(s) — render boxes for each roster that includes this employee
                                  assignedForEmployee.map((r) => (
                                    <h2 key={r.id}>
                                      <Link
                                        to="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          openEditModal(r);
                                        }}
                                        style={{
                                          border: "2px dashed #1eb53a",
                                          display: "inline-block",
                                        }}
                                      >
                                        <span className="username-info m-b-10">
                                          {r.shift_type
                                            ? r.shift_type
                                                .charAt(0)
                                                .toUpperCase() +
                                              r.shift_type.slice(1)
                                            : ""}
                                        </span>
                                        <span className="userrole-info">
                                          {/* optional subtext */}
                                        </span>
                                      </Link>
                                    </h2>
                                  ))
                                ) : (
                                  // no assignment -> show plus icon (same design)
                                  <Link
                                    to="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      openAddModal(emp, dateIso);
                                    }}
                                  >
                                    <span>
                                      <i className="fa fa-plus" />
                                    </span>
                                  </Link>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
      {/* /Page Wrapper */}

      {/* Controlled Schedule Modal (autofill for edit or add) */}
      <ScheduleModelPopup
        isOpen={isModalOpen}
        initialData={modalInitialData}
        onClose={closeModal}
      />
    </>
  );
};

export default ShiftScheduling;
