/**
 * eslint-disable react/no-unescaped-entities
 *
 * @format
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as bootstrap from "bootstrap";
import {
  avatar2,
  employeeimg,
  holidaycalendar,
} from "../../../../../Routes/ImagePath";
import Chart from "react-apexcharts";
import Slider from "react-slick";
import { ArrowRightCircle } from "react-feather";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { getFullUserById } from "../../../../../Redux/services/User";
import { useEffect } from "react";
import { HTTPURL } from "../../../../../Constent/Matcher";
import { getLeaveById } from "../../../../../Redux/services/EmployeeLeaves";
import { fetchProjects } from "../../../../../Redux/services/Project";
import { getName } from "../../../../../Redux/services/User";
import axios from "axios";
import PreviewPoliciesModal from "../../../../../components/modelpopup/PreviewPoliciesModel";
import EmployeeTimer from "./EmployeeTimer";
import { get_holidays } from "../../../../../Redux/services/Holiday";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  clearNotificationsByIds,
} from "../../../../../Redux/services/Notifications";
import { fetchEmployeeOfMonths } from "../../../../../Redux/services/EmployeeOfMonth.js";
import CommonAvatar from "../../../../../../src/CommanAvater.jsx";
import { getDepartmentById } from "../../../../../Redux/services/Department.js";
import { getWorkingHours } from "../../../../../Redux/services/EmployeeAttendance.js";
const EmployeeDashboard = () => {
  const [nameMap, setNameMap] = useState({});
  const [projectNameMap, setProjectNameMap] = useState({});
  const [policies, setPolicies] = useState([]);
  const [upcomingHoliday, setUpcomingHoliday] = useState(null);
  const [departmentName, setDepartmentName] = useState("");
  // Ye sirf projects ke leader/members ke naam rakhega

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.logUserID);
  const { workingHours, workingHoursLoading } = useSelector(
    (state) => state.employee_attendance
  );
  useEffect(() => {
    if (userId) {
      dispatch(getWorkingHours(userId));
    }
  }, [dispatch, userId]);
  const fullUserData = useSelector((state) => state.user.fullUserData);
  const leaveById = useSelector((state) => state.employee_leaves.leaveById);
  const allProjects = useSelector((state) => state.project.allProjects);

  const { notifications: allNotifications = [], loading } = useSelector(
    (state) => state.notifications || {}
  );


  const { employeeOfMonthList } = useSelector((state) => state.employeeOfMonth);

  // 🔹 Fetch notifications on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        // Fetch full user data
        //const userRes = dispatch(getFullUserById({ userId }));

        // Fetch leave by userId
        const leaveRes = await dispatch(getLeaveById({ userId }));
      };
      fetchData();
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(getFullUserById({ userId: userId }));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEmployeeOfMonths());
  }, [dispatch]);

  useEffect(() => {
    const fetchUpcomingHoliday = async () => {
      try {
        const res = await dispatch(get_holidays()).unwrap();
        const today = new Date();
        const futureHolidays = res.data
          .filter((h) => new Date(h.HolidayDate) > today)
          .sort((a, b) => new Date(a.HolidayDate) - new Date(b.HolidayDate));
        if (futureHolidays.length > 0) {
          setUpcomingHoliday(futureHolidays[0]);
        } else {
          setUpcomingHoliday(null);
        }
      } catch (err) {
        console.error("Error fetching holidays:", err);
      }
    };
    fetchUpcomingHoliday();
  }, [dispatch]);

  const userNotifications = allNotifications.filter(
    (n) => n.receiver_id === userId
  );
    const notificationTabData = userNotifications.filter(
      (n) =>
        n.receiver_id === userId &&
        !(n.type === "shift" && n.entity_type === "shift_roster")
    );

    // 🕒 Schedule tab (sirf shift wali)
    const scheduleTabData = userNotifications.filter(
      (n) =>
        n.receiver_id === userId &&
        n.type === "shift" &&
        n.entity_type === "shift_roster"
    );

  const [previewData, setPreviewData] = useState(null);

  const tooltip = <Tooltip id="tooltip-id">Lesley Grauer</Tooltip>;
  const tooltip1 = <Tooltip id="tooltip-id">Richard Miles</Tooltip>;
  const tooltip2 = <Tooltip id="tooltip-id">Loren Gatlin</Tooltip>;
  const tooltip3 = <Tooltip id="tooltip-id">Jeffery Lalor</Tooltip>;
  const tooltip4 = <Tooltip id="tooltip-id">Tarah Shropshire</Tooltip>;
  const tooltip5 = <Tooltip id="tooltip-id">Catherine Manseau</Tooltip>;
  const tooltip6 = <Tooltip id="tooltip-id">Richard Miles</Tooltip>;
  const tooltip7 = <Tooltip id="tooltip-id">Jeffery Lalor</Tooltip>;
  const tooltip8 = <Tooltip id="tooltip-id">Lesley Grauer</Tooltip>;
  const tooltip9 = <Tooltip id="tooltip-id">Loren Gatlin</Tooltip>;
  const tooltip10 = <Tooltip id="tooltip-id">Tarah Shropshire</Tooltip>;
  const tooltip11 = <Tooltip id="tooltip-id">John Smith"</Tooltip>;
  const tooltip12 = <Tooltip id="tooltip-id">Richard Miles</Tooltip>;
  const tooltip13 = <Tooltip id="tooltip-id">Jeffery Lalor</Tooltip>;
  const tooltip14 = <Tooltip id="tooltip-id">Lesley Grauer</Tooltip>;
  const tooltip15 = <Tooltip id="tooltip-id">Tarah Shropshire</Tooltip>;
  const tooltip16 = <Tooltip id="tooltip-id">Loren Gatlin</Tooltip>;
  // const [menu, setMenu] = useState(false);

  // const toggleMobileMenu = () => {
  //   setMenu(!menu);
  // };

  const employeeOfMonth = employeeOfMonthList?.length
    ? employeeOfMonthList[0]
    : null;

  useEffect(() => {
    const fetchDept = async () => {
      try {
        if (employeeOfMonth?.user?.department_id) {
          const res = await dispatch(
            getDepartmentById({ id: employeeOfMonth.user.department_id })
          ).unwrap();

          // 🔹 res.data me department_name hona chahiye (backend se)
          setDepartmentName(res?.name || "N/A");
        }
      } catch (err) {
        console.error("Error fetching department:", err);
        setDepartmentName("N/A");
      }
    };

    fetchDept();
  }, [dispatch, employeeOfMonth]);

  const labels = workingHours?.labels || ["S", "M", "T", "W", "T", "F", "S"];
  const data = workingHours?.data?.map((h) => Number(h.toFixed(2))) || [
    0, 0, 0, 0, 0, 0, 0,
  ];
  const chartOptions = {
    chart: {
      type: "bar",
      height: 210,
      stacked: true,
      zoom: { enabled: true },
    },
    colors: ["#55CE63"],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 6,
        columnWidth: "30%",
        endingShape: "rounded",
      },
    },
    dataLabels: { enabled: false },
    yaxis: {
      min: 0,
      max: 8,
      tickAmount: 4,
    },
    xaxis: {
      categories: labels,
    },
    fill: { opacity: 1 },
  };

  const series = [
    {
      name: "Working Hours",
      data: data,
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    marginrigth: 10,
  };
  const settingsprojectslide = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  const fetchUserName = async (employeeId) => {
    if (!employeeId) return "N/A";
    if (nameMap[employeeId]) return nameMap[employeeId]; // already stored

    try {
      const response = await dispatch(getName(employeeId)); // ✅ new API call
      const userName = response?.payload || "N/A"; // because getName returns fullName string
      setNameMap((prev) => ({ ...prev, [employeeId]: userName }));
      return userName;
    } catch (error) {
      console.error("Error fetching name:", error);
      setNameMap((prev) => ({ ...prev, [employeeId]: "N/A" }));
      return "N/A";
    }
  };

  useEffect(() => {
    const fetchNames = async () => {
      for (const project of allProjects) {
        // ✅ Correct field name
        await fetchUserName(project.project_leader_id);

        if (project.projectMembers) {
          let members = [];
          try {
            members =
              typeof project.projectMembers === "string"
                ? JSON.parse(project.projectMembers)
                : project.projectMembers;
          } catch (e) {}
          for (const id of members) await fetchUserName(id);
        }
      }
    };

    if (allProjects.length > 0) {
      fetchNames();
    }
  }, [allProjects]);

  const userProjects = allProjects.filter((project) => {
    let members = project.projectMembers;
    if (typeof members === "string") {
      try {
        members = JSON.parse(members);
      } catch (e) {
        members = [];
      }
    }
    return members.includes(userId); // sirf wahi projects jisme userId ho
  });
  const fetchPolicies = async () => {
    try {
      const res = await axios.get(`${HTTPURL}policies`);
      setPolicies(res.data.data || []);
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
  };
  useEffect(() => {
    fetchPolicies();
  }, []);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        {/* Page Content */}
        <div className="content container-fluid pb-0">
          {/* Leave Alert */}
          <div className="row">
            <div className="col-md-12">
              <div className="employee-alert-box">
                {/* <div className="alert alert-outline-success alert-dismissible fade show">
                  <div className="employee-alert-request">
                    <i className="far fa-circle-question" />
                    Your Leave Request on <span>“24th April 2024”</span> has
                    been Approved!!!
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  >
                    <i className="fas fa-xmark" />
                  </button>
                </div> */}
              </div>
            </div>
          </div>
          {/* /Leave Alert */}
          <div className="row">
            <div className="col-xxl-8 col-lg-12 col-md-12">
              <div className="row">
                {/* Employee Details */}
                <div className="col-lg-6 col-md-12">
                  <div className="card employee-welcome-card flex-fill">
                    <div className="card-body">
                      <div className="welcome-info">
                        <div className="welcome-content">
                          <h4>
                            Welcome Back {fullUserData?.first_name || ""}{" "}
                            {fullUserData?.last_name || ""}
                          </h4>
                          {/* <p>
                            You have <span>4 meetings</span> today,
                          </p> */}
                        </div>
                        <div className="welcome-img">
                          <CommonAvatar
                            imageUrl={
                              fullUserData?.profile_pic
                                ? `${HTTPURL}${fullUserData.profile_pic}`
                                : ""
                            }
                            alt={`${fullUserData?.first_name || ""} ${
                              fullUserData?.last_name || ""
                            }`}
                            size={60}
                          />
                        </div>
                      </div>
                      <div className="welcome-btn">
                        <Link to={`/profile/${userId}`} className="btn">
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="statistic-header">
                        <h4>Statistics</h4>
                        {/* <div className="dropdown statistic-dropdown">
                          <Link
                            className="dropdown-toggle"
                            data-bs-toggle="dropdown"
                            to="#"
                          >
                            Today
                          </Link>
                          <div className="dropdown-menu dropdown-menu-end">
                            <Link to="#" className="dropdown-item">
                              Week
                            </Link>
                            <Link to="#" className="dropdown-item">
                              Month
                            </Link>
                            <Link to="#" className="dropdown-item">
                              Year
                            </Link>
                          </div>
                        </div> */}
                      </div>

                      {/* 👇 Pure frontend timer */}
                      <EmployeeTimer />
                    </div>
                  </div>

                  <div className="card info-card flex-fill">
                    <div className="card-body">
                      <h4>Upcoming Holidays</h4>
                      {upcomingHoliday ? (
                        <div className="holiday-details">
                          <div className="holiday-calendar">
                            <div className="holiday-calendar-icon">
                              <img src={holidaycalendar} alt="Icon" />
                            </div>
                            <div className="holiday-calendar-content">
                              <h6>{upcomingHoliday.Title}</h6>
                              <p>
                                {new Date(
                                  upcomingHoliday.HolidayDate
                                ).toLocaleDateString("en-IN", {
                                  weekday: "short",
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="holiday-btn">
                            <Link to="/holidays" className="btn">
                              View All
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <p
                          style={{
                            color: "#ff4d4f", // bright red tone for visibility
                            fontWeight: "600",
                            background: "#fff5f5", // soft light red background
                            padding: "8px 12px",
                            borderRadius: "8px",
                            display: "inline-block",
                            marginTop: "12px",
                          }}
                        >
                          No upcoming holidays 🎉
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* /Employee Details */}
                {/* Attendance & Leaves */}
                <div className="col-lg-6 col-md-12">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="statistic-header">
                        <h4>Attendance &amp; Leaves</h4>
                        <div className="dropdown statistic-dropdown">
                          {/* <Link
                            className="dropdown-toggle"
                            data-bs-toggle="dropdown"
                            to="#"
                          >
                            2024
                          </Link> */}
                          {/* <div className="dropdown-menu dropdown-menu-end">
                            <Link to="#" className="dropdown-item">
                              2025
                            </Link>
                            <Link to="#" className="dropdown-item">
                              2026
                            </Link>
                            <Link to="#" className="dropdown-item">
                              2027
                            </Link>
                          </div> */}
                        </div>
                      </div>
                      <div className="attendance-list">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="attendance-details">
                              <h4 className="text-primary">
                                {leaveById?.[0]?.total_leaves || 0}
                              </h4>
                              <p>Total Leaves</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="attendance-details">
                              <h4 className="text-pink">
                                {leaveById?.[0]?.total_leaves_taken || 0}
                              </h4>
                              <p>Leaves Taken</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="attendance-details">
                              <h4 className="text-success">
                                {(leaveById?.[0]?.total_leaves || 0) -
                                  (leaveById?.[0]?.total_leaves_taken || 0)}
                              </h4>
                              <p>Leaves Remaining</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="attendance-details">
                              <h4 className="text-purple">0</h4>
                              <p>Pending Approval</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="attendance-details">
                              <h4 className="text-info">214</h4>
                              <p>Working Days</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="attendance-details">
                              <h4 className="text-danger">2</h4>
                              <p>Loss of Pay</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="view-attendance">
                        <Link to="/leaves-employee">
                          Apply Leave
                          <i className="fe fe-arrow-right-circle" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="statistic-header">
                        <h4>Working hours</h4>
                        <div className="dropdown statistic-dropdown">
                          <Link
                            className="dropdown-toggle"
                            data-bs-toggle="dropdown"
                            to="#"
                          >
                            This Week
                          </Link>
                          <div className="dropdown-menu dropdown-menu-end">
                            <Link to="#" className="dropdown-item">
                              Last Week
                            </Link>
                            <Link to="#" className="dropdown-item">
                              This Month
                            </Link>
                            <Link to="#" className="dropdown-item">
                              Last 30 Days
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="working-hour-info">
                        {workingHoursLoading ? (
                          <p>Loading...</p>
                        ) : (
                          <Chart
                            options={chartOptions}
                            series={series}
                            type="bar"
                            height={210}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Attendance & Leaves */}
              </div>
            </div>
            {/* Employee Notifications */}
            <div className="col-xxl-4 col-lg-12 col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="statistic-header d-flex justify-content-between align-items-center">
                    <h4>Important</h4>
                    <div className="important-notification">
                      <Link
                        to="/activities"
                        className="d-flex align-items-center"
                      >
                        <span className="me-1">View All</span>
                        <ArrowRightCircle size={15} />
                      </Link>
                    </div>
                  </div>

                  <div className="notification-tab mt-3">
                    <ul className="nav nav-tabs">
                      <li>
                        <Link
                          to="#"
                          className="active"
                          data-bs-toggle="tab"
                          data-bs-target="#notification_tab"
                        >
                          <i className="la la-bell" /> Notifications
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          data-bs-toggle="tab"
                          data-bs-target="#schedule_tab"
                        >
                          <i className="la la-list-alt" /> Schedules
                        </Link>
                      </li>
                    </ul>

                    <div className="tab-content">
                      {/* 🔹 Notifications Tab */}

                      {/* 🔹 Notifications Tab */}
                      <div className="tab-pane active" id="notification_tab">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">Your Notifications</h6>
                          {notificationTabData.length > 0 && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                const ids = notificationTabData.map(
                                  (n) => n.id
                                );
                                if (ids.length > 0) {
                                  dispatch(clearNotificationsByIds(ids));
                                }
                              }}
                            >
                              Clear All
                            </button>
                          )}
                        </div>

                        <div className="employee-noti-content">
                          {loading ? (
                            <p className="text-center text-muted">Loading...</p>
                          ) : notificationTabData.length === 0 ? (
                            <p className="text-center text-muted">
                              No notifications found.
                            </p>
                          ) : (
                            <ul className="employee-notification-list">
                              {notificationTabData.map((n) => (
                                <li
                                  className="employee-notification-grid"
                                  key={n.id || n._id}
                                >
                                  <div className="employee-notification-icon">
                                    <Link to="/activities">
                                      <span
                                        className={`badge-soft-${
                                          n.type === "HR"
                                            ? "danger"
                                            : n.type === "ER"
                                            ? "info"
                                            : n.type === "SM"
                                            ? "warning"
                                            : "primary"
                                        } rounded-circle`}
                                      >
                                        {n.sender_name
                                          ?.slice(0, 2)
                                          .toUpperCase() || "NA"}
                                      </span>
                                    </Link>
                                  </div>

                                  <div className="employee-notification-content">
                                    <h6>
                                      <Link to={n.redirectUrl}>
                                        {n.message}
                                      </Link>
                                    </h6>
                                    <ul className="nav">
                                      <li>
                                        {new Date(
                                          n.createdAt
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </li>
                                      <li>
                                        {new Date(
                                          n.createdAt
                                        ).toLocaleDateString()}
                                      </li>
                                    </ul>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* 🔹 Schedule Tab (Static for now) */}
                      <div className="tab-pane fade" id="schedule_tab">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">Your Schedules</h6>

                          {scheduleTabData.length > 0 && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                const ids = scheduleTabData.map((n) => n.id);
                                if (ids.length > 0) {
                                  dispatch(clearNotificationsByIds(ids));
                                }
                              }}
                            >
                              Clear All
                            </button>
                          )}
                        </div>

                        <div className="employee-noti-content">
                          {loading ? (
                            <p className="text-center text-muted">Loading...</p>
                          ) : scheduleTabData.length === 0 ? (
                            <p className="text-center text-muted">
                              No schedules found.
                            </p>
                          ) : (
                            <ul className="employee-notification-list">
                              {scheduleTabData.map((n) => (
                                <li
                                  className="employee-notification-grid"
                                  key={n.id || n._id}
                                >
                                  <div className="employee-notification-icon">
                                    <Link to="/activities">
                                      <span className="badge-soft-warning rounded-circle">
                                        SH
                                      </span>
                                    </Link>
                                  </div>

                                  <div className="employee-notification-content">
                                    <h6>
                                      <Link to={n.redirectUrl}>
                                        {n.message}
                                      </Link>
                                    </h6>
                                    <ul className="nav">
                                      <li>
                                        {new Date(
                                          n.createdAt
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </li>
                                      <li>
                                        {new Date(
                                          n.createdAt
                                        ).toLocaleDateString()}
                                      </li>
                                    </ul>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Employee Notifications */}
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-sm-8">
                      <div className="statistic-header">
                        <h4>On Going Projects</h4>
                      </div>
                    </div>
                    <div className="col-sm-4 text-sm-end">
                      <div className="owl-nav project-nav nav-control" />
                    </div>
                  </div>
                  <Slider
                    {...settingsprojectslide}
                    className="project-slider owl-carousel"
                  >
                    {allProjects.length > 0 ? (
                      userProjects.map((project) => {
                        // Parse team members (JSON string from DB)
                        let members = [];
                        try {
                          members =
                            typeof project.projectMembers === "string"
                              ? JSON.parse(project.projectMembers)
                              : project.projectMembers || [];
                        } catch (e) {
                          console.error(e);
                        }

                        return (
                          <div className="project-grid" key={project.id}>
                            <div className="project-top">
                              <h6>
                                <Link to="/project-view">
                                  Deadline :{" "}
                                  {project.endDate
                                    ? new Date(
                                        project.endDate
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </Link>
                              </h6>
                              <h5>
                                <Link to="/project-view">
                                  {project.projectName}
                                </Link>
                              </h5>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html:
                                    project.description ||
                                    "No description available",
                                }}
                              />
                            </div>

                            {/* <div className="project-middle">
                              <ul className="nav">
                                <li>
                                  <div className="project-tasks">
                                    <h4>{project.totalTasks || 0}</h4>
                                    <p>Total Tasks</p>
                                  </div>
                                </li>
                                <li>
                                  <div className="project-tasks">
                                    <h4>{project.completedTasks || 0}</h4>
                                    <p>Total Completed</p>
                                  </div>
                                </li>
                              </ul>
                            </div> */}

                            <div className="project-bottom">
                              <div className="project-leader">
                                <ul className="nav">
                                  <li>Project Leader :</li>
                                  <div className="text-muted small">
                                    {nameMap[project.project_leader_id] ||
                                      "Loading..."}
                                  </div>
                                </ul>
                              </div>
                              <div className="project-leader">
                                <ul className="nav">
                                  <li>Members :</li>
                                  <div className="text-muted small">
                                    {members.length > 0
                                      ? members.map((id, i) => (
                                          <div key={i}>
                                            {nameMap[id] || "..."}
                                          </div> // har member alag line me
                                        ))
                                      : "Loading..."}
                                  </div>
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center w-100">
                        No ongoing projects available
                      </p>
                    )}
                  </Slider>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {/* Employee Month */}
            <div className="col-xl-6 col-md-12 d-flex">
              <div className="card employee-month-card flex-fill">
                <div className="card-body">
                  {loading ? (
                    <p>Loading Employee of the Month...</p>
                  ) : employeeOfMonth ? (
                    <div className="row align-items-center">
                      <div className="col-lg-9 col-md-12">
                        <div className="employee-month-details">
                          <h4>Employee of the Month</h4>
                          <p>
                            {employeeOfMonth?.description ||
                              "Outstanding performance this month!"}
                          </p>
                        </div>

                        <div className="employee-month-content">
                          <h6>
                            Congrats,{" "}
                            {employeeOfMonth?.user
                              ? `${employeeOfMonth.user.first_name} ${employeeOfMonth.user.last_name}`
                              : "Employee"}
                          </h6>
                          <p>{departmentName}</p>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-12">
                        <div className="employee-month-img">
                          {employeeOfMonth.user.profile_pic ? (
                            <img
                              src={`${HTTPURL}${employeeOfMonth.user.profile_pic}`}
                              className="img-fluid"
                              alt="Employee"
                            />
                          ) : (
                            <CommonAvatar
                              imageUrl={
                                employeeOfMonth.user.profile_pi
                                  ? `${HTTPURL}${employeeOfMonth.user.profile_pic}`
                                  : ""
                              }
                              alt={`${employeeOfMonth.user.first_name || ""} ${
                                employeeOfMonth.user.last_name || ""
                              }`}
                              size={60}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>No Employee of the Month record found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* /Employee Month */}
            {/* Company Policy */}
            <div className="col-xl-6 col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-sm-8">
                      <div className="statistic-header">
                        <h4>Company Policy</h4>
                      </div>
                    </div>
                    <div className="col-sm-4 text-sm-end">
                      <div className="owl-nav company-nav nav-control" />
                    </div>
                  </div>

                  {policies.length > 0 ? (
                    <Slider
                      {...settings}
                      className="company-slider owl-carousel owl-loaded owl-drag"
                    >
                      {policies.map((policy, index) => {
                        const colorClasses = [
                          "tertiary",
                          "success",
                          "info",
                          "warning",
                          "danger",
                        ];
                        const color = colorClasses[index % colorClasses.length];

                        return (
                          <div
                            key={policy.id}
                            className="owl-item active"
                            style={{ width: "199.667px", marginRight: "20px" }}
                          >
                            <div
                              className={`company-grid company-soft-${color}`}
                            >
                              <div className="company-top">
                                <div className="company-icon">
                                  <span
                                    className={`company-icon-${color} rounded-circle`}
                                  >
                                    {policy.department_name
                                      ? policy.department_name
                                          .substring(0, 2)
                                          .toUpperCase()
                                      : "CP"}
                                  </span>
                                </div>
                                <div className="company-link">
                                  <Link to="/companies">
                                    {policy.policy_name || "Untitled Policy"}
                                  </Link>
                                </div>
                              </div>

                              <div className="company-bottom d-flex">
                                <ul>
                                  <li>
                                    Policy Name :{" "}
                                    {policy.description || "No description"}
                                  </li>
                                  <li>
                                    Updated on :{" "}
                                    {policy.created_at
                                      ? new Date(
                                          policy.created_at
                                        ).toLocaleDateString("en-IN")
                                      : "N/A"}
                                  </li>
                                </ul>
                                <div className="company-bottom-links">
                                  {policy.file_path ? (
                                    <>
                                      <Link
                                        to={`${HTTPURL.replace(
                                          /\/$/,
                                          ""
                                        )}/${policy.file_path.replace(
                                          /^\/+/,
                                          ""
                                        )}`}
                                        target="_blank"
                                      >
                                        <i className="la la-download" />
                                      </Link>
                                      <Link
                                        to="#"
                                        onClick={() => {
                                          setPreviewData(policy);
                                          document
                                            .getElementById("openPreviewModal")
                                            ?.click();
                                        }}
                                      >
                                        <i className="la la-eye" />
                                      </Link>
                                    </>
                                  ) : (
                                    <Link to="#">
                                      <i className="la la-ban" />
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </Slider>
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: "150px" }}
                    >
                      <p className="mb-0 text-muted fw-semibold">
                        No policies available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* /Company Policy */}
            <button
              id="openPreviewModal"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#preview_policy"
              style={{ display: "none" }}
            />

            {/* Preview Modal component */}
            <PreviewPoliciesModal data={previewData} />
          </div>
        </div>
        {/* /Page Content */}
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default EmployeeDashboard;
