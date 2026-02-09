/** @format */

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { get_employee_data } from "../../../Redux/services/Employee";
import { get_all_active_departments } from "../../../Redux/services/Department";
import { getAllPunchData } from "../../../Redux/services/EmployeeAttendance";
import { get_holidays } from "../../../Redux/services/Holiday"; // your holiday service
import { HTTPURL } from "../../../Constent/Matcher";
import AttendenceModelPopup from "../../../components/modelpopup/AttendenceModelPopup"; // keep existing popup if present

const TableAvatar = () => {
  const dispatch = useDispatch();

  // redux state
  const AllEmployeeData = useSelector((s) => s?.employee?.employeeData);
  const { ActiveDepartments } = useSelector((s) => s.department);
  const { punchData } = useSelector((s) => s.employee_attendance);
  const { holidays } = useSelector((s) => s.holiday || {});

  // UI state
  const [searchName, setSearchName] = useState("");

  // today info
  const todayMoment = moment();
  const currentYear = todayMoment.year();
  const currentMonth = todayMoment.month();
  const monthYearTitle = todayMoment.format("MMMM YYYY");

  // Days of month dynamically
  const daysInMonth = useMemo(() => {
    const days = moment({
      year: currentYear,
      month: currentMonth,
    }).daysInMonth();
    return Array.from({ length: days }, (_, i) => i + 1);
  }, [currentMonth]);

  // FETCH DATA
  useEffect(() => {
    dispatch(get_employee_data());
    dispatch(get_all_active_departments());
    dispatch(getAllPunchData());
    dispatch(get_holidays());
  }, [dispatch]);

  // Filter employees (remove admin)
  const employees = useMemo(() => {
    const list = AllEmployeeData?.users || [];
    return list.filter((u) => u?.role?.name?.toLowerCase() !== "admin");
  }, [AllEmployeeData]);

  // Punch MAP: employee_id -> {YYYY-MM-DD: true}
  const punchMap = useMemo(() => {
    const map = {};
    if (!Array.isArray(punchData)) return map;

    for (const p of punchData) {
      const empId = p.employee_id;
      const date = moment(p.date).format("YYYY-MM-DD");

      if (!map[empId]) map[empId] = {};
      map[empId][date] = true;
    }
    return map;
  }, [punchData]);

  // Holiday dates set
  const holidaySet = useMemo(() => {
    const set = new Set();
    if (!Array.isArray(holidays)) return set;

    holidays.forEach((h) => {
      if (h.HolidayDate) {
        set.add(moment.utc(h.HolidayDate).format("YYYY-MM-DD"));
      }
    });

    return set;
  }, [holidays]);

  // STATUS ICON
  const getStatusIcon = (status, dateStr) => {
    const map = {
      Present: { icon: "fa-check", color: "text-success" },
      Absent: { icon: "fa-close", color: "text-danger" },
      Leave: { icon: "fa-plane", color: "text-warning" },
      Holiday: { icon: "fa-umbrella", color: "text-primary" },
      Weekend: { icon: "fa-calendar", color: "text-muted" },
      Future: { icon: "fa-minus", color: "text-muted" },
    };

    const { icon, color } = map[status] || map.Absent;

    if (status === "Future") return <span className="text-muted">—</span>;

    return (
      <Link
        to="#"
        data-bs-toggle="modal"
        data-bs-target="#attendance_info"
        title={status}
      >
        <i className={`fa ${icon} ${color}`} />
      </Link>
    );
  };

  // BUILD ROW DATA
  const rows = useMemo(() => {
    const deptMap = {};
    (ActiveDepartments || []).forEach((d) => (deptMap[d.id] = d.name));

    return employees
      .filter((emp) =>
        (emp.first_name + " " + emp.last_name)
          .toLowerCase()
          .includes(searchName.toLowerCase())
      )
      .map((emp) => {
        const empId = emp.id;
        const fullName = `${emp.first_name || ""} ${
          emp.last_name || ""
        }`.trim();

        const image = emp.profile_pic
          ? `${HTTPURL}${emp.profile_pic}`
          : "/assets/img/default-avatar.png";

        // Create daily cells
        const dayCells = daysInMonth.map((day) => {
          const dateStr = moment({
            year: currentYear,
            month: currentMonth,
            day,
          }).format("YYYY-MM-DD");

          const dateMoment = moment(dateStr);

          // FUTURE DATE
          if (dateMoment.isAfter(todayMoment, "day"))
            return { day, status: "Future", dateStr };

          // HOLIDAY
          if (holidaySet.has(dateStr))
            return { day, status: "Holiday", dateStr };

          // WEEKEND
          const dow = dateMoment.day();
          if (dow === 0)
            // only Sunday
            return { day, status: "Weekend", dateStr };

          // PRESENT/ABSENT
          const present = punchMap[empId] && punchMap[empId][dateStr];
          return {
            day,
            status: present ? "Present" : "Absent",
            dateStr,
          };
        });

        return {
          id: empId,
          name: fullName,
          department: deptMap[emp.department_id] || "-",
          image,
          employee_id: emp.employee_id,
          dayCells,
        };
      });
  }, [
    employees,
    daysInMonth,
    searchName,
    punchMap,
    holidaySet,
    ActiveDepartments,
  ]);

  return (
    <>
      {/* Month Heading */}
      <h4 className="mb-3">Attendance - {monthYearTitle}</h4>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search employee..."
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />

      {/* Legend */}
      <div className="mb-3">
        <strong>Legend:</strong>{" "}
        <span className="me-2 text-success">
          <i className="fa fa-check" /> Present
        </span>
        <span className="me-2 text-danger">
          <i className="fa fa-close" /> Absent
        </span>
        <span className="me-2 text-warning">
          <i className="fa fa-plane" /> Leave
        </span>
        <span className="me-2 text-primary">
          <i className="fa fa-umbrella" /> Holiday
        </span>
        <span className="me-2 text-muted">
          <i className="fa fa-calendar" /> Weekend
        </span>
      </div>

      {/* Attendance Table */}
      <table className="table table-striped custom-table table-nowrap mb-0">
        <thead>
          <tr>
            <th>Employee</th>
            {daysInMonth.map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <h2 className="table-avatar">
                  <Link className="avatar avatar-xs" to={`/profile/${row.id}`}>
                    <img src={row.image} alt={row.name} />
                  </Link>
                  <Link to={`/profile/${row.id}`}>
                    {row.name}{" "}
                    <span className="text-muted">({row.employee_id})</span>
                  </Link>
                  <div className="text-muted small">{row.department}</div>
                </h2>
              </td>

              {row.dayCells.map((cell) => (
                <td key={cell.dateStr} style={{ textAlign: "center" }}>
                  {getStatusIcon(cell.status, cell.dateStr)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <AttendenceModelPopup />
    </>
  );
};

export default TableAvatar;
