/** @format */
import React, { useEffect, useMemo, useState } from "react";
import { Table, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Breadcrumbs from "../../../components/Breadcrumbs";
import {
  getAllPunchData,
  getBreakHours,
  getPunchData,
  getPunchType,
  punch,
} from "../../../Redux/services/EmployeeAttendance";
import { get_employee_data } from "../../../Redux/services/Employee";
import { customAlert } from "../../../utils/Alert";

const AttendanceEmployee = () => {
  const todayDate = new Date().toLocaleDateString("en-GB");
  const todayKey = `activityLog_${todayDate}`;
  const dispatch = useDispatch();
  const { punchData } = useSelector((state) => state.employee_attendance);
  const [month] = useState(new Date().getMonth() + 1);
  const [year] = useState(new Date().getFullYear());
  const [elapsedTime, setElapsedTime] = useState("0h 0m 0s");
  const [breakTime, setBreakTime] = useState("0h 0m 0s");
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [cumulativeBreakMs, setCumulativeBreakMs] = useState(0);
  const [activity, setActivity] = useState([]);
  const [employees, setEmployees] = useState([]); // ✅ admin employee list
  const [selectedEmployee, setSelectedEmployee] = useState(null); // ✅ admin selected employee
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role");

  // Initial fetch
  useEffect(() => {
    dispatch(getPunchType());
    dispatch(getPunchData({ month, year }));
    dispatch(getAllPunchData());
    dispatch(getBreakHours());
  }, [dispatch, month, year]);

  // ✅ Fetch employees if admin
  useEffect(() => {
    if (role?.toLowerCase() === "admin") {
      const fetchEmployees = async () => {
        const res = await dispatch(get_employee_data());
        const users = res?.payload?.data?.users || [];
        const filtered = users.filter(
          (user) => user?.role?.name && user.role.name.toLowerCase() !== "admin"
        );
        setEmployees(filtered);
      };
      fetchEmployees();
    }
  }, [dispatch, role]);

  // Load saved states
  useEffect(() => {
    const savedPunch = localStorage.getItem("punchInTime");
    const savedBreak = localStorage.getItem("breakStartTime");
    const savedCumulative = localStorage.getItem("cumulativeBreakMs");
    const savedActivity = localStorage.getItem(todayKey);

    if (savedPunch && !punchOutTime) setPunchInTime(new Date(savedPunch));
    if (savedBreak) {
      setBreakStartTime(new Date(savedBreak));
      setIsOnBreak(true);
    }
    if (savedCumulative) setCumulativeBreakMs(parseInt(savedCumulative, 10));
    if (savedActivity) setActivity(JSON.parse(savedActivity));
  }, []);

  // Default activity
  useEffect(() => {
    if (!punchInTime && activity.length === 0) {
      setActivity([
        {
          key: Date.now(),
          label: "Not punched in yet",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  }, [punchInTime, activity.length]);

  // Persist states
  useEffect(() => {
    if (punchInTime && !punchOutTime)
      localStorage.setItem("punchInTime", punchInTime.toISOString());
    else localStorage.removeItem("punchInTime");
  }, [punchInTime, punchOutTime]);

  useEffect(() => {
    if (isOnBreak && breakStartTime)
      localStorage.setItem("breakStartTime", breakStartTime.toISOString());
    else localStorage.removeItem("breakStartTime");
  }, [isOnBreak, breakStartTime]);

  useEffect(() => {
    localStorage.setItem("cumulativeBreakMs", cumulativeBreakMs.toString());
  }, [cumulativeBreakMs]);

  useEffect(() => {
    localStorage.setItem(todayKey, JSON.stringify(activity));
  }, [activity, todayKey]);

  // Filter today's punches
  const filteredTodayPunches = useMemo(() => {
    if (!Array.isArray(punchData)) return [];
    const now = new Date();
    return punchData.filter((p) => {
      const ts =
        p.punch_in || p.punch_out || p.break_start || p.break_end || null;
      if (!ts) return false;
      const date = new Date(ts);
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
      );
    });
  }, [punchData]);
  const getPunchDate = (p) => {
    if (!p.punch_in) return "--";
    return new Date(p.punch_in).toLocaleDateString("en-GB");
  };

  const filteredPunches = useMemo(() => {
    if (!Array.isArray(punchData)) return [];

    if (!search.trim()) return punchData;

    const s = search.toLowerCase();

    return punchData.filter((p) => {
      const name = (p.user_name || "").toLowerCase();
      const email = (p.email || "").toLowerCase();

      // yahi exact format match karega (27/11/2025)
      const punchDate = getPunchDate(p).toLowerCase();

      return name.includes(s) || email.includes(s) || punchDate.includes(s);
    });
  }, [punchData, search]);

  const tableData = filteredPunches.map((item, index) => {
    const name = item.user_name || "Unknown User";
    const email = item.email || "Email";
    const totalSeconds = Math.max(
      0,
      Math.round((item.break_hours || 0) * 3600)
    );
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    let wh = "--:--";
    if (item.work_hours !== null && item.work_hours !== undefined) {
      const totalMinutes = Math.round(item.work_hours * 60);
      const whHrs = Math.floor(totalMinutes / 60);
      const whMins = totalMinutes % 60;
      wh = `${String(whHrs).padStart(2, "0")}:${String(whMins).padStart(
        2,
        "0"
      )}`;
    }

    return {
      key: index + 1,
      Name: name,
      Email: email,
      Date: getPunchDate(item),
      PunchIn: item.punch_in
        ? new Date(item.punch_in).toLocaleTimeString()
        : "--",
      PunchOut: item.punch_out
        ? new Date(item.punch_out).toLocaleTimeString()
        : "--",
      Break: `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
      WorkHours: wh,
    };
  });

  const punchIn = filteredTodayPunches.find((p) => p.punch_in);
  const punchOut = filteredTodayPunches.find((p) => p.punch_out);

  // ✅ Disable Punch In if already punched out today (non-admin)
  const disablePunchInToday =
    role?.toLowerCase() !== "admin" && punchOut && !punchInTime;

  // Timer for work hours
  useEffect(() => {
    let interval;
    const formatTime = (ms) => {
      const hrs = Math.floor(ms / (1000 * 60 * 60));
      const mins = Math.floor((ms / (1000 * 60)) % 60);
      const secs = Math.floor((ms / 1000) % 60);
      return `${hrs}h ${mins}m ${secs}s`;
    };

    if (punchInTime && !punchOutTime) {
      interval = setInterval(() => {
        const now = new Date();
        const currentBreak =
          isOnBreak && breakStartTime ? now - breakStartTime : 0;
        const total = now - punchInTime - cumulativeBreakMs - currentBreak;
        setElapsedTime(formatTime(total));
      }, 1000);
    } else {
      setElapsedTime("0h 0m 0s");
    }

    return () => clearInterval(interval);
  }, [punchInTime, punchOutTime, isOnBreak, breakStartTime, cumulativeBreakMs]);

  // Break Timer
  useEffect(() => {
    let interval;
    if (isOnBreak && breakStartTime) {
      interval = setInterval(() => {
        const diff = new Date() - breakStartTime;
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setBreakTime(`${hrs}h ${mins}m ${secs}s`);
      }, 1000);
    } else {
      setBreakTime("0h 0m 0s");
    }
    return () => clearInterval(interval);
  }, [isOnBreak, breakStartTime]);

  const addActivity = (label) => {
    const newEntry = {
      key: Date.now(),
      label,
      time: new Date().toLocaleTimeString(),
    };
    setActivity((prev) => [newEntry, ...prev]);
  };

  // Handle Punch
  const handlePunchClick = async () => {
    if (isOnBreak) {
      customAlert(
        "Cannot punch in or out during a break. End the break first.",
        "fail"
      );
      return;
    }

    if (disablePunchInToday) {
      customAlert(
        "You have already punched out today. You can punch in again tomorrow.",
        "fail"
      );
      return;
    }

    try {
      const nextType = punchInTime && !punchOutTime ? "out" : "in";
      const now = new Date();

      if (nextType === "in") {
        setPunchInTime(now);
        setPunchOutTime(null);
        setElapsedTime("0h 0m 0s");
        setCumulativeBreakMs(0);
        addActivity("Punched In at");
      } else {
        addActivity("Punched Out at");
        setPunchOutTime(now);
        // ✅ turant disable karne ke liye punchInTime reset
        setPunchInTime(null);
      }

      const payload =
        role?.toLowerCase() === "admin"
          ? { punch_type: nextType, user_id: selectedEmployee }
          : { punch_type: nextType };

      const response = await dispatch(punch(payload));

      if (response?.payload?.status) {
        dispatch(getPunchData({ month, year }));
        dispatch(getAllPunchData());
        dispatch(getPunchType());
        dispatch(getBreakHours());
        if (role?.toLowerCase() === "admin" && nextType === "out") {
          setSelectedEmployee(null);
        }
      }
    } catch (err) {
      console.error(err);
      customAlert("Error while punching.", "fail");
    }
  };

  // Handle Break
  const handleBreakClick = async () => {
    const nextType = isOnBreak ? "break_end" : "break_start";

    if (!isOnBreak) {
      setBreakStartTime(new Date());
      setIsOnBreak(true);
      addActivity("Break Started at");
    } else {
      const breakDuration = new Date() - breakStartTime;
      setCumulativeBreakMs((prev) => prev + breakDuration);
      setBreakStartTime(null);
      setIsOnBreak(false);
      setBreakTime("0h 0m 0s");
      addActivity("Break Ended at");
    }

    try {
      const payload =
        role?.toLowerCase() === "admin"
          ? { punch_type: nextType, user_id: selectedEmployee }
          : { punch_type: nextType };

      const response = await dispatch(punch(payload));

      if (response?.payload?.status && response?.payload?.data) {
        dispatch(getPunchData({ month, year }));
        dispatch(getAllPunchData());
        dispatch(getPunchType());
        dispatch(getBreakHours());
      }
    } catch (err) {
      console.error(err);
      customAlert("Error updating break.", "fail");
    }
  };

  // ✅ Map punch data
  const userElements = punchData?.length
    ? punchData.map((item, index) => {
        const name = item.user_name || "Unknown User";
        const email = item.user_email || "Email";
        const totalSeconds = Math.max(
          0,
          Math.round((item.break_hours || 0) * 3600)
        );
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        let wh = "--:--";

        if (item.work_hours !== null && item.work_hours !== undefined) {
          const totalMinutes = Math.round(item.work_hours * 60);
          const whHrs = Math.floor(totalMinutes / 60);
          const whMins = totalMinutes % 60;

          wh = `${String(whHrs).padStart(2, "0")}:${String(whMins).padStart(
            2,
            "0"
          )}`;
        }

        return {
          key: index + 1,
          Name: name,
          Email: email,
          Date: item.punch_in
            ? new Date(item.punch_in).toLocaleDateString("en-GB")
            : "--",
          PunchIn: item.punch_in
            ? new Date(item.punch_in).toLocaleTimeString()
            : "--",
          PunchOut: item.punch_out
            ? new Date(item.punch_out).toLocaleTimeString()
            : "--",
          Break: `${hrs.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
          WorkHours: wh,
        };
      })
    : [];

  const columns = [
    { title: "Sr No.", dataIndex: "key", width: 90 },
    { title: "Name", dataIndex: "Name" },
    { title: "Email", dataIndex: "Email" },
    { title: "Date", dataIndex: "Date" },
    { title: "Punch In", dataIndex: "PunchIn" },
    { title: "Punch Out", dataIndex: "PunchOut" },
    { title: "Break (hh:mm:ss)", dataIndex: "Break" },
    { title: "Work Hours", dataIndex: "WorkHours" },
  ];

  const disableBreakToday =
    role?.toLowerCase() !== "admin" &&
    punchOut &&
    new Date(punchOut.punch_out).toDateString() === new Date().toDateString();
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Attendance"
          title="Dashboard"
          subtitle="Attendance"
        />
        <input
          type="text"
          placeholder="Search by Name, Email or Date..."
          className="form-control mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="row">
          <div className="col-md-4">
            <div className="card punch-status">
              <div className="card-body">
                <h5 className="card-title">
                  Timesheet <small className="text-muted">{todayDate}</small>
                </h5>

                <div className="punch-det">
                  {punchInTime || punchIn ? (
                    <>
                      <h6>Punched In at</h6>
                      <p>
                        {punchInTime
                          ? punchInTime.toLocaleTimeString()
                          : new Date(punchIn.punch_in).toLocaleTimeString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <h6 className="text-muted">
                        User has not punched in yet
                      </h6>
                    </>
                  )}
                  {role?.toLowerCase() !== "admin" && (
                    <p style={{ color: "red", marginTop: "5px" }}>
                      Note: Once you punch out, you cannot punch in again on the
                      same day.
                    </p>
                  )}
                </div>

                <div className="punch-info text-center my-3">
                  <div
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      border: "4px solid #ccc",
                      margin: "0 auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {elapsedTime}
                  </div>
                </div>

                {/* ✅ Show dropdown if admin */}
                {role?.toLowerCase() === "admin" && (
                  <div className="text-center mb-3">
                    <Select
                      showSearch
                      placeholder="Select Employee"
                      style={{ width: "100%" }}
                      value={selectedEmployee}
                      onChange={(value) => setSelectedEmployee(value)}
                      options={employees.map((emp) => ({
                        label: `${emp.first_name || ""} ${
                          emp.last_name || ""
                        } (${emp.role?.name || ""})`,
                        value: emp.id,
                      }))}
                    />
                  </div>
                )}

                <div className="text-center mt-3">
                  <button
                    className="btn btn-primary me-2"
                    onClick={handlePunchClick}
                    disabled={
                      isOnBreak ||
                      (role?.toLowerCase() === "admin"
                        ? false
                        : disablePunchInToday)
                    }
                  >
                    {punchInTime && !punchOutTime ? "Punch Out" : "Punch In"}
                  </button>
                  <button
                    className={`btn ${
                      isOnBreak ? "btn-success" : "btn-warning"
                    }`}
                    onClick={handleBreakClick}
                    disabled={
                      disableBreakToday ||
                      (!punchInTime && !punchIn) ||
                      (role?.toLowerCase() === "admin" && !selectedEmployee)
                    }
                  >
                    {isOnBreak ? "Break End" : "Break"}
                  </button>
                </div>

                <div className="text-center mt-3">
                  <h6>Break Timer</h6>
                  <p>{breakTime}</p>
                </div>

                <div className="card recent-activity mt-3">
                  <div className="card-body">
                    <h5 className="card-title">Today Activity</h5>
                    <ul className="res-activity-list">
                      {activity.length > 0 ? (
                        activity.map((a) => (
                          <li key={a.key}>
                            <p className="mb-0">{a.label}</p>
                            <p className="res-activity-time">
                              <i className="fa-regular fa-clock"></i> {a.time}
                            </p>
                          </li>
                        ))
                      ) : (
                        <p className="text-muted">No activity today</p>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Punch Table */}
          <div className="col-lg-8">
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={tableData}
                className="table-striped"
                pagination={{ pageSize: 10 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceEmployee;
