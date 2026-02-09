/** @format */
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clockin } from "../../../../../Routes/ImagePath";
import { getAllPunchData } from "../../../../../Redux/services/EmployeeAttendance";

const EmployeeTimer = () => {
  const dispatch = useDispatch();
  const { punchData } = useSelector((state) => state.employee_attendance);
  console.log("puncheData", punchData);

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(9 * 60 * 60);
  const [breakHours, setBreakHours] = useState(0);
  const timerRef = useRef(null);

  // ✅ Redux se Punch data fetch
  useEffect(() => {
    dispatch(getAllPunchData());
  }, [dispatch]);

  // ✅ Restore timer state on reload
  useEffect(() => {
    const storedClockedIn = localStorage.getItem("isClockedIn") === "true";
    const storedStartTime = localStorage.getItem("clockInTime");

    if (storedClockedIn && storedStartTime) {
      setIsClockedIn(true);
      const elapsed = Math.floor((Date.now() - storedStartTime) / 1000);
      setWorkSeconds(elapsed);
      setRemainingSeconds(9 * 60 * 60 - elapsed);
    }
  }, []);

  // ✅ Break hours calculate from Redux data (today)
  useEffect(() => {
    if (!isClockedIn || !Array.isArray(punchData)) return;

    const today = new Date().toLocaleDateString("en-CA");
    const todayPunch = punchData.find((item) => {
      if (!item?.punch_in) return false;
      const punchDate = new Date(item.punch_in).toLocaleDateString("en-CA");
      return punchDate === today;
    });

    if (todayPunch) {
      setBreakHours(parseFloat(todayPunch.break_hours || 0));
    } else {
      setBreakHours(0);
    }
  }, [punchData, isClockedIn]);

  // ✅ Format Work Time
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs} Hrs : ${mins} Min : ${secs} Sec`;
  };

  // ✅ Format Break Hours
  const formatBreakHours = (decimalHours) => {
    const hrs = Math.floor(decimalHours);
    const mins = Math.round((decimalHours - hrs) * 60);
    return `${hrs} Hrs ${mins} Min`;
  };

  // ✅ Clock-In → save to localStorage
  const handleClockIn = () => {
    const startTime = Date.now();
    localStorage.setItem("clockInTime", startTime);
    localStorage.setItem("isClockedIn", "true");
    setIsClockedIn(true);
    setWorkSeconds(0);
    setRemainingSeconds(9 * 60 * 60);
    dispatch(getAllPunchData());
  };

  // ✅ Clock-Out → clear from localStorage
  const handleClockOut = () => {
    setIsClockedIn(false);
    clearInterval(timerRef.current);
    setBreakHours(0);
    setWorkSeconds(0); // ✅ Reset work time
    setRemainingSeconds(9 * 60 * 60); // ✅ Reset remaining time
    localStorage.removeItem("clockInTime");
    localStorage.removeItem("isClockedIn");
  };

  // ✅ Timer logic
  useEffect(() => {
    if (isClockedIn) {
      timerRef.current = setInterval(() => {
        setWorkSeconds((prev) => prev + 1);
        setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isClockedIn]);

  return (
    <div className="card flex-fill">
      <div className="card-body">
        {/* Clock Info */}
        <div className="clock-in-info">
          <div className="clock-in-content">
            <p>Work Time</p>
            <h4>{formatTime(workSeconds)}</h4>
          </div>

          <div className="clock-in-btn">
            {isClockedIn ? (
              <button onClick={handleClockOut} className="btn btn-danger">
                <img src={clockin} alt="Icon" /> Clock-Out
              </button>
            ) : (
              <button onClick={handleClockIn} className="btn btn-primary">
                <img src={clockin} alt="Icon" /> Clock-In
              </button>
            )}
          </div>
        </div>

        {/* Remaining & Break */}
        <div className="clock-in-list">
          <ul className="nav">
            <li>
              <p>Remaining</p>
              <h6>{formatTime(remainingSeconds)}</h6>
            </li>
            <li>
              <p>Break</p>
              <h6>{formatBreakHours(breakHours)}</h6>
            </li>
          </ul>
        </div>

        {/* View Attendance */}
        <div className="view-attendance">
          <Link to="/adminattendance">
            View Attendance <i className="fe fe-arrow-right-circle" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTimer;
