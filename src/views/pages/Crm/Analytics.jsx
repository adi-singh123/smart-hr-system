import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  avatar16,
  avatar19,
  avatar20,
  avatar22,
  avatar23,
  avatar24,
  avatar25,
  company_icon_02,
  company_icon_03,
  company_icon_04,
  company_icon_05,
  company_icon_06,
  companyicon01,
} from "../../../Routes/ImagePath";
import Select from "react-select";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import ExportLeads from "../../../components/modelpopup/Crm/ExportLeads";
import AddContact from "../../../components/modelpopup/Crm/AddContact";
import DatePicker from "react-datepicker";
import AddActivity from "../../../components/modelpopup/Crm/AddActivity";

const Analytics = () => {
  const [selectedDate1, setSelectedDate1] = useState(null);
  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };
  const [selectedDate2, setSelectedDate2] = useState(null);
  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
  };

  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);

  const handleLabelClick = () => {
    setFocused(true);
  };
  const handleInputBlur = () => {
    if (inputValue === "") {
      setFocused(false);
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value !== "" && !focused) {
      setFocused(true);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "danger";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "secondary";
    }
  };
  //
  const activityData = [
  {
    title: "Call John and discuss about project planning and budget",
    date: "20 Apr 2024",
    time: "03:15 PM",
    type: "Calls",
    icon: "la-phone",
    badgeClass: "badge-bg-success", // Green for Calls
    avatar: avatar20,
    user: "Sharon Roy",
    statusOptions: [
      { value: "not_started", label: "Not Started" },
      { value: "in_progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
    ],
    priority: "High",
  },
  {
    title: "Built landing pages for campaign",
    date: "12 Mar 2024",
    time: "08:30 AM",
    type: "Email",
    icon: "la-envelope",
    badgeClass: "badge-bg-warning", // Yellow for Email
    avatar: avatar16,
    user: "Carol Thomas",
    statusOptions: [
      { value: "not_started", label: "Not Started" },
      { value: "in_progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
    ],
    priority: "Medium",
  },
  {
    title: "Finalize product roadmap for next quarter and align stakeholders",
    date: "15 May 2024",
    time: "11:45 AM",
    type: "Meeting",
    icon: "la-user-tie",
    badgeClass: "badge-bg-violet", // Purple for Meeting
    avatar: avatar19,
    user: "Brian Cooper",
    statusOptions: [
      { value: "not_started", label: "Not Started" },
      { value: "in_progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
    ],
    priority: "High",
  },
  {
    title: "Client feedback review and Jira ticket updates",
    date: "05 Jun 2024",
    time: "02:00 PM",
    type: "Task",
    icon: "la-tasks",
    badgeClass: "badge-bg-info", // Blue for Task
    avatar: avatar25,
    user: "Sneha D'Souza",
    statusOptions: [
      { value: "not_started", label: "Not Started" },
      { value: "in_progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
    ],
    priority: "Low",
  },
];


  const [inputValue1, setInputValue1] = useState("");

  const [focused1, setFocused1] = useState(false);

  const handleLabelClick1 = () => {
    setFocused1(true);
  };
  const handleInputBlur1 = () => {
    if (inputValue1 === "") {
      setFocused1(false);
    }
  };
  const handleInputChange1 = (e) => {
    const value = e.target.value;
    setInputValue1(value);
    if (value !== "" && !focused1) {
      setFocused1(true);
    }
  };
  //

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  const sortoption = [
    { value: "Last 30 days", label: "Last 30 days" },
    { value: "Last 3 month", label: "Last 3 month" },
    { value: "Last 6 month", label: "Last 6 month" },
  ];
  const sortoption1 = [
    { value: "Last 30 days", label: "Last 30 days" },
    { value: "Last 3 month", label: "Last 3 month" },
    { value: "Last 6 month", label: "Last 6 month" },
  ];
  const sortoption2 = [
    { value: "Last 30 days", label: "Last 30 days" },
    { value: "Last 3 month", label: "Last 3 month" },
    { value: "Last 6 month", label: "Last 6 month" },
  ];
  const pipelinelist = [
    { value: "Sales Pipeline", label: "Sales Pipeline" },
    { value: "Marketing Pipeline", label: "Marketing Pipeline" },
  ];
  const pipelinelist1 = [
    { value: "Sales Pipeline", label: "Sales Pipeline" },
    { value: "Marketing Pipeline", label: "Marketing Pipeline" },
  ];
  const duration = [
    { value: "Last 30 days", label: "Last 30 days" },
    { value: "Last 3 months", label: "Last 3 months" },
    { value: "Last 6 months", label: "Last 6 months" },
  ];
  const wondealsstage = [
    { value: "Marketing Pipeline", label: "Marketing Pipeline" },
    { value: "Pipeline", label: "Pipeline" },
  ];
  const wondealsstage2 = [
    { value: "Marketing Pipeline", label: "Marketing Pipeline" },
    { value: "Pipeline", label: "Pipeline" },
  ];
  const wondealsstage1 = [
    { value: "Marketing Pipeline", label: "Marketing Pipeline" },
    { value: "Pipeline", label: "Pipeline" },
  ];
  const days = [
    { value: "Last 30 days", label: "Last 30 days" },
    { value: "Last 15 days", label: "Last 15 days" },
    { value: "Last 7 days", label: "Last 7 days" },
  ];
  const days1 = [
    { value: "Last 30 days", label: "Last 30 days" },
    { value: "Last 15 days", label: "Last 15 days" },
    { value: "Last 7 days", label: "Last 7 days" },
  ];
  const days2 = [
    { value: "Last 30 days", label: "Last 30 days" },
    { value: "Last 15 days", label: "Last 15 days" },
    { value: "Last 7 days", label: "Last 7 days" },
  ];

  const daysandmonth = [
    { value: "select", label: "select" },
    { value: "Last 30 days", label: "Last 30 days" },
    { value: "Last 3 months", label: "Last 3 months" },
    { value: "Last 6 months", label: "Last 6 months" },
  ];
  const status = [
    { value: "Inprogress", label: "Inprogress" },
    { value: "Completed", label: "Completed" },
    { value: "Todo", label: "Todo" },
  ];
  const status1 = [
    { value: "Inprogress", label: "Inprogress" },
    { value: "Completed", label: "Completed" },
    { value: "Todo", label: "Todo" },
  ];
  const status2 = [
    { value: "Inprogress", label: "Inprogress" },
    { value: "Completed", label: "Completed" },
    { value: "Todo", label: "Todo" },
  ];
  const status3 = [
    { value: "Inprogress", label: "Inprogress" },
    { value: "Completed", label: "Completed" },
    { value: "Todo", label: "Todo" },
  ];
  const status4 = [
    { value: "Inprogress", label: "Inprogress" },
    { value: "Completed", label: "Completed" },
    { value: "Todo", label: "Todo" },
  ];
  const status5 = [
    { value: "Inprogress", label: "Inprogress" },
    { value: "Completed", label: "Completed" },
    { value: "Todo", label: "Todo" },
  ];
  const activity = [
    { value: "Meeting", label: "Meeting" },
    { value: "Calls", label: "Calls" },
    { value: "Email", label: "Email" },
    { value: "Task", label: "Task" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff9b44",
      },
    }),
  };
  const [chartOptions] = useState({
    series: [
      {
        name: "Sales",
        data: [
          { x: "In Pipeline", y: 400 }, // ✅ Fixed typo
          { x: "Follow Up", y: 30 },
          { x: "Schedule", y: 248 },
          { x: "Conversation", y: 470 },
          { x: "Won", y: 420 }, // ✅ Changed value to avoid duplication
          { x: "Lost", y: 180 },
        ],
      },
    ],
    chart: {
      type: "bar",
      height: 320, // ✅ Increased height for spacing
      toolbar: {
        show: true,
        tools: {
          download: false,
        },
        autoSelected: "zoom",
      },
      offsetY: 10,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "around",
        horizontal: true, // ✅ Horizontal bars reduce label clash
        barHeight: "55%", // ✅ Prevent value overlap
        dataLabels: {
          position: "top", // ✅ Places values above bars
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#000"], // ✅ Good contrast
        fontSize: "11px",
        fontWeight: 500,
      },
      offsetX: 10, // ✅ Slight offset to avoid overlap
      formatter: function (val) {
        return `${val}`; // ✅ Just the number
      },
    },
    colors: ["#FFC38F"],
    xaxis: {
      type: "category",
      labels: {
        style: {
          colors: "#000",
          fontSize: "12px",
          fontWeight: 600,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} deals`,
      },
    },
  });

  // At top of your component
  const chartRefWonChart = useRef(null);

  useEffect(() => {
    if (!chartRefWonChart.current) return;

    const chartData = [
      { label: "Conversation", value: 400, status: "open" },
      { label: "Follow Up", value: 122, status: "lost" },
      { label: "Inpipeline", value: 250, status: "won" },
    ];

    const statusColors = {
      won: "#28a745", // green
      lost: "#dc3545", // red
      open: "#17a2b8", // blue
      default: "#999999",
    };

    const options = {
      series: [
        {
          data: chartData.map((item) => item.value),
        },
      ],
      chart: {
        type: "bar",
        height: 150,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      colors: chartData.map(
        (item) => statusColors[item.status] || statusColors.default
      ),
      xaxis: {
        categories: chartData.map((item) => item.label),
      },
    };

    const chart = new ApexCharts(chartRefWonChart.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  const chartRefWonChart2 = useRef(null);
  useEffect(() => {
    const options = {
      series: [
        {
          data: [400, 122, 250],
        },
      ],
      chart: {
        type: "bar",
        height: 150,
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#77D882"],
      xaxis: {
        categories: ["Conversation", "Follow Up", "Inpipeline"],
      },
    };

    const chart = new ApexCharts(chartRefWonChart2.current, options);
    chart.render();

    // Cleanup the chart on component unmount
    return () => {
      chart.destroy();
    };
  }, []);
  const chartRefLostDeal = useRef(null);

  useEffect(() => {
    const options = {
      series: [
        {
          name: "Leads",
          data: [120, 240, 360], // Example data; replace with dynamic when backend is ready
        },
      ],
      chart: {
        type: "bar",
        height: 150,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#FF5C75"], // Red for "Lost"
      xaxis: {
        categories: ["Cold Leads", "Unqualified", "Disinterested"], // You can adjust categories
      },
    };

    const chart = new ApexCharts(chartRefLostDeal.current, options);
    chart.render();

    return () => {
      chart.destroy(); // Cleanup on unmount
    };
  }, []);
  const chartRefLostDeal2 = useRef(null);
  useEffect(() => {
    const options = {
      series: [
        {
          data: [400, 220, 448],
        },
      ],
      chart: {
        type: "bar",
        height: 150,
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      borderRadius: 50,
      colors: ["#F96C85"],
      xaxis: {
        categories: ["Conversation", "Follow Up", "Inpipeline"],
      },
    };

    const chart = new ApexCharts(chartRefLostDeal2.current, options);
    chart.render();

    // Cleanup the chart on component unmount
    return () => {
      chart.destroy();
    };
  }, []);
  // Leads By Stage Chart
  const [chartOptions1] = useState({
    series: [
      {
        name: "Sales",
        data: [
          { x: "Inpipeline", y: 400 },
          { x: "Follow Up", y: 30 },
          { x: "Schedule", y: 248 },
          { x: "Conversation", y: 470 },
          { x: "Won", y: 420 }, // ✅ Changed to avoid duplication
          { x: "Lost", y: 180 },
        ],
      },
    ],
    chart: {
      type: "bar",
      height: 300, // ✅ Increased height for spacing
      toolbar: {
        show: true,
        tools: {
          download: false,
        },
        autoSelected: "zoom",
      },
      offsetY: 10,
    },
    plotOptions: {
      bar: {
        borderRadius: 4, // ✅ Rounded bars for visual clarity
        horizontal: true, // ✅ Horizontal bars help avoid Y-axis label overlap
        barHeight: "60%", // ✅ Prevent tight stacking
      },
    },
    colors: ["#BEA4F2"],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category",
      labels: {
        style: {
          colors: "#000", // ✅ Improve contrast
          fontSize: "12px", // ✅ Improve readability
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} leads`,
      },
    },
  });

  const [isFullScreen, setFullScreen] = useState(false);
  const maximizeBtnRef = useRef(null);

  useEffect(() => {
    const handleClick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setFullScreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          setFullScreen(false);
        }
      }
    };

    const cleanup = () => {
      if (isFullScreen && document.exitFullscreen) {
        document.exitFullscreen();
        setFullScreen(false);
      }
    };

    const maximizeBtn = maximizeBtnRef.current;
    maximizeBtn.addEventListener("click", handleClick);

    // Cleanup function to remove the event listener and exit fullscreen on component unmount
    return () => {
      maximizeBtn.removeEventListener("click", handleClick);
      cleanup();
    };
  }, [isFullScreen]);

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col-md-4">
                <h3 className="page-title">Analytics</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin-dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Analytics</li>
                </ul>
              </div>
              <div className="col-md-8 float-end ms-auto">
                <div className="d-flex title-head">
                  <div className="view-icons">
                    <Link to="#" className="grid-view btn btn-link">
                      <i className="las la-redo-alt" />
                    </Link>
                    <Link
                      to="#"
                      className="list-view btn btn-link"
                      id="collapse-header"
                      ref={maximizeBtnRef}
                    >
                      <i className="las la-expand-arrows-alt" />
                    </Link>
                    <Link
                      to="#"
                      className={`list-view btn btn-link ${
                        isFilterVisible ? "active-filter" : ""
                      }`}
                      id="filter_search"
                      onClick={toggleFilterVisibility}
                    >
                      <i className="las la-filter" />
                    </Link>
                  </div>
                  <div className="form-sort">
                    <Link
                      to="#"
                      className="list-view btn btn-link"
                      data-bs-toggle="modal"
                      data-bs-target="#export"
                    >
                      <i className="las la-file-export" />
                      Export
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Search Filter */}
          <div
            className={`filter-filelds${isFilterVisible ? " visible" : ""}`}
            id="filter_inputs"
            style={{ display: isFilterVisible ? "block" : "none" }}
          >
            <div className="row filter-row">
              <div className="col-xl-2">
                <div
                  className={
                    focused || inputValue !== ""
                      ? "input-block mb-3 form-focus focused"
                      : "input-block mb-3 form-focus"
                  }
                >
                  <input
                    type="text"
                    className="form-control floating"
                    value={inputValue}
                    onFocus={handleLabelClick}
                    onBlur={handleInputBlur}
                    onChange={handleInputChange}
                  />
                  <label className="focus-label">Activity</label>
                </div>
              </div>
              <div className="col-xl-2">
                <div
                  className={
                    focused1 || inputValue1 !== ""
                      ? "input-block mb-3 form-focus focused"
                      : "input-block mb-3 form-focus"
                  }
                >
                  <input
                    type="text"
                    className="form-control floating"
                    value={inputValue1}
                    onFocus={handleLabelClick1}
                    onBlur={handleInputBlur1}
                    onChange={handleInputChange1}
                  />
                  <label className="focus-label">Owner</label>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="input-block mb-3 form-focus">
                  <div className="cal-icon">
                    <DatePicker
                      selected={selectedDate1}
                      onChange={handleDateChange1}
                      className="form-control floating datetimepicker"
                      type="date"
                      dateFormat="dd-MM-yyyy"
                    />
                  </div>
                  <label className="focus-label">Due Date</label>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="input-block mb-3 form-focus">
                  <div className="cal-icon">
                    <DatePicker
                      selected={selectedDate2}
                      onChange={handleDateChange2}
                      className="form-control floating datetimepicker"
                      type="date"
                      dateFormat="dd-MM-yyyy"
                    />
                  </div>
                  <label className="focus-label">Created at</label>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="input-block mb-3 form-focus select-focus">
                  <Select
                    options={activity}
                    placeholder="--Select--"
                    styles={customStyles}
                  />
                  <label className="focus-label">Activity Type</label>
                </div>
              </div>
              <div className="col-xl-2">
                <Link to="#" className="btn btn-success w-100">
                  {" "}
                  Search{" "}
                </Link>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-xl-6">
              <div className="card analytics-card">
                <div className="card-header d-flex justify-content-between align-items-center flex-wrap row-gap-3">
                  <h3>
                    Recently Created Contacts
                    <Link to="#">
                      <i className="la la-link" />
                    </Link>
                  </h3>
                  <div className="input-block mb-0">
                    <Select
                      className="select"
                      options={sortoption}
                      placeholder="Last 30 days"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-nowrap custom-table mb-0">
                      <thead>
                        <tr>
                          <th>Contact</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Created at</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <h2 className="table-avatar d-flex">
                              <Link to="/contact-details" className="avatar">
                                <img src={avatar16} alt="img" />
                              </Link>
                              <Link
                                to="/contact-details"
                                className="profile-split d-flex flex-column"
                              >
                                Carol Thomas<span>UI/UX Designer</span>
                              </Link>
                            </h2>
                          </td>
                          <td>carol.thomas@gmail.com</td>
                          <td>+1-124-547-845</td>
                          <td>12 Jan 2024,10:00 am</td>
                        </tr>
                        <tr>
                          <td>
                            <h2 className="table-avatar d-flex">
                              <Link to="/contact-details" className="avatar">
                                <img src={avatar22} alt="img" />
                              </Link>
                              <Link
                                to="/contact-details"
                                className="profile-split d-flex flex-column"
                              >
                                Dawn Mercha<span>IT Technician</span>
                              </Link>
                            </h2>
                          </td>
                          <td>dawn.mercha@yahoo.com</td>
                          <td>+1-478-845-447</td>
                          <td>20 Jan 2024,12:20 pm</td>
                        </tr>
                        <tr>
                          <td>
                            <h2 className="table-avatar d-flex">
                              <Link to="/contact-details" className="avatar">
                                <img src={avatar23} alt="img" />
                              </Link>
                              <Link
                                to="/contact-details"
                                className="profile-split d-flex flex-column"
                              >
                                Rachel Hampton<span>Software Engineer</span>
                              </Link>
                            </h2>
                          </td>
                          <td>rachel.hampton@outlook.com</td>
                          <td>+1-215-544-845</td>
                          <td>15 Feb 2024,08:30 am</td>
                        </tr>
                        <tr>
                          <td>
                            <h2 className="table-avatar d-flex">
                              <Link to="/contact-details" className="avatar">
                                <img src={avatar24} alt="img" />
                              </Link>
                              <Link
                                to="/contact-details"
                                className="profile-split d-flex flex-column"
                              >
                                Jonelle Curtiss
                                <span>Operations Supervisor</span>
                              </Link>
                            </h2>
                          </td>
                          <td>jonelle.curtiss@companymail.com</td>
                          <td>+1-121-145-471</td>
                          <td>24 Feb 2024,11:00 am</td>
                        </tr>
                        <tr>
                          <td>
                            <h2 className="table-avatar d-flex">
                              <Link to="/contact-details" className="avatar">
                                <img src={avatar23} alt="img" />
                              </Link>
                              <Link
                                to="/contact-details"
                                className="profile-split d-flex flex-column"
                              >
                                Jonathan<span>Team Lead - Development</span>
                              </Link>
                            </h2>
                          </td>
                          <td>jonathan.doe@devstudio.com</td>
                          <td>+1-321-454-789</td>
                          <td>10 Mar 2024,02:10 pm</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="card analytics-card">
                <div className="card-header d-flex justify-content-between card-selectsview flex-wrap row-gap-3 mb-0">
                  <h3 className="card-title mb-0">Won Deals Stage</h3>
                  <div className="card-select">
                    <ul>
                      <li>
                        <Select
                          className="select"
                          options={wondealsstage}
                          placeholder="Last 30 days"
                          styles={customStyles}
                        />
                      </li>
                      <li>
                        <Select
                          className="select"
                          options={days}
                          placeholder="Last 30 days"
                          styles={customStyles}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <div ref={chartRefWonChart} />
                </div>
              </div>

              <div className="card analytics-card">
                <div className="card-header d-flex justify-content-between align-items-center flex-wrap row-gap-3">
                  <h3>
                    Recently Created Deals
                    <Link to="#">
                      <i className="la la-link" />
                    </Link>
                  </h3>
                  <div className="input-block mb-0">
                    <Select
                      className="select"
                      options={daysandmonth}
                      placeholder="select"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-nowrap custom-table mb-0">
                      <thead>
                        <tr>
                          <th>Deal Name</th>
                          <th>Stage</th>
                          <th>Deal Value</th>
                          <th>Probability</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            name: "Collins",
                            stage: "Conversation",
                            value: 451000,
                            probability: 85,
                            status: "Open",
                          },
                          {
                            name: "Konopelski",
                            stage: "Pipeline",
                            value: 312500,
                            probability: 15,
                            status: "Lost",
                          },
                          {
                            name: "Adams",
                            stage: "Won",
                            value: 414800,
                            probability: 95,
                            status: "Won",
                          },
                          {
                            name: "Schumm",
                            stage: "Lost",
                            value: 914400,
                            probability: 47,
                            status: "Lost",
                          },
                          {
                            name: "Wisozk",
                            stage: "Follow Up",
                            value: 1114400,
                            probability: 98,
                            status: "Lost",
                          },
                        ].map((deal, index) => (
                          <tr key={index}>
                            <td>{deal.name}</td>
                            <td>{deal.stage}</td>
                            <td>
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                                maximumFractionDigits: 0,
                              }).format(deal.value)}
                            </td>
                            <td>{deal.probability} %</td>
                            <td>
                              <span
                                className={`badge ${
                                  deal.status === "Won"
                                    ? "badge-soft-success"
                                    : deal.status === "Lost"
                                    ? "badge-soft-danger"
                                    : "badge-soft-info"
                                }`}
                              >
                                {deal.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="card analytics-card">
                <div className="card-header d-flex justify-content-between card-selectsview mb-0 flex-wrap row-gap-3">
                  <h3 className="card-title mb-0">Lost Leads Stage</h3>
                  <div className="card-select">
                    <ul>
                      <li>
                        <Select
                          className="select"
                          options={wondealsstage1}
                          placeholder="Last 30 days"
                          styles={customStyles}
                        />
                      </li>
                      <li>
                        <Select
                          className="select"
                          options={days1}
                          placeholder="Select"
                          styles={customStyles}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <div ref={chartRefLostDeal} />
                </div>
              </div>
              <div className="card analytics-card">
                <div className="card-header d-flex justify-content-between align-items-center flex-wrap row-gap-3">
                  <h3>Leads By Stage</h3>
                  <div className="d-flex flex-wrap row-gap-3">
                    <div className="input-block mb-0 me-3">
                      <Select
                        className="select"
                        options={pipelinelist1}
                        placeholder="Sales Pipeline"
                        styles={customStyles}
                      />
                    </div>
                    <div className="input-block mb-0">
                      <Select
                        className="select"
                        options={sortoption1}
                        placeholder="Sales Pipeline"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <Chart
                    options={chartOptions1}
                    series={chartOptions1.series}
                    type="bar"
                    height={250}
                  />
                </div>
              </div>
              <div className="card analytics-card">
                <div className="card-header d-flex justify-content-between align-items-center flex-wrap row-gap-3">
                  <h3>
                    Recently Added Companies
                    <Link to="#">
                      <i className="la la-link" />
                    </Link>
                  </h3>
                  <div className="title-head d-flex">
                    <div className="input-block mb-0">
                      <Select
                        className="select"
                        options={sortoption2}
                        placeholder="Sales Pipeline"
                        styles={customStyles}
                      />
                    </div>
                    <Link
                      to="#"
                      className="btn add-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#add_contact"
                    >
                      <i className="la la-plus-circle" /> Add Company
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-nowrap custom-table mb-0">
                      <thead>
                        <tr>
                          <th>Company Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Created at</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <h2 className="table-avatar d-flex align-items-center">
                              <Link to="#" className="company-img">
                                <img src={companyicon01} alt="img" />
                              </Link>
                              <Link to="#" className="profile-split">
                                NovaWaveLLC
                              </Link>
                            </h2>
                          </td>
                          <td>Robertson@example.com</td>
                          <td>+1 875455453</td>
                          <td>12 Jan 2024,10:00 am</td>
                        </tr>
                        <tr>
                          <td>
                            <h2 className="table-avatar d-flex align-items-center">
                              <Link to="#" className="company-img">
                                <img src={company_icon_02} alt="img" />
                              </Link>
                              <Link to="#" className="profile-split">
                                SilverHawk
                              </Link>
                            </h2>
                          </td>
                          <td>Vaughan12@example.com</td>
                          <td>+1 546555455</td>
                          <td>20 Jan 2024,12:20 pm</td>
                        </tr>
                        <tr>
                          <td>
                            <h2 className="table-avatar d-flex align-items-center">
                              <Link to="#" className="company-img">
                                <img src={company_icon_03} alt="img" />
                              </Link>
                              <Link to="#" className="profile-split">
                                SummitPeak
                              </Link>
                            </h2>
                          </td>
                          <td>Jessica13@example.com</td>
                          <td>+1 454478787</td>
                          <td>15 Feb 2024,08:30 am</td>
                        </tr>
                        <tr>
                          <td>
                            <h2 className="table-avatar d-flex align-items-center">
                              <Link to="#" className="company-img">
                                <img src={company_icon_04} alt="img" />
                              </Link>
                              <Link to="#" className="profile-split">
                                RiverStone Ventur
                              </Link>
                            </h2>
                          </td>
                          <td>CarolTho3@example.com</td>
                          <td>+1 124547845</td>
                          <td>24 Feb 2024,11:00 am</td>
                        </tr>
                        <tr>
                          <td>
                            <h2 className="table-avatar d-flex align-items-center">
                              <Link to="#" className="company-img">
                                <img src={company_icon_05} alt="img" />
                              </Link>
                              <Link to="#" className="profile-split">
                                CoastalStar Co.
                              </Link>
                            </h2>
                          </td>
                          <td>Rachel@example.com</td>
                          <td>+1 215544845</td>
                          <td>10 Mar 2024,02:10 pm</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="card analytics-card">
                <div className="card-header d-flex justify-content-between align-items-center flex-wrap row-gap-3">
                  <h3>Deals By Stage</h3>
                  <div className="d-flex flex-wrap row-gap-3">
                    <div className="input-block mb-0 me-3">
                      <Select
                        className="select"
                        options={pipelinelist}
                        placeholder="Sales Pipeline"
                        styles={customStyles}
                      />
                    </div>
                    <div className="input-block mb-0">
                      <Select
                        className="select"
                        options={duration}
                        placeholder="Last 30 days"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="deals-chart" />
                  <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="bar"
                    height={250}
                  />
                </div>
              </div>
              <div className="card analytics-card">
                <div className="card-header d-flex justify-content-between align-items-center flex-wrap row-gap-3">
                  <h3>
                    Activities
                    <Link to="#">
                      <i className="la la-link" />
                    </Link>
                  </h3>
                  <div className="title-head d-flex flex-wrap gap-2">
                    <div className="input-block mb-0">
                      <Select
                        className="select"
                        options={sortoption}
                        placeholder="Sales Pipeline"
                        styles={customStyles}
                      />
                    </div>
                    <Link
                      to="#"
                      className="btn add-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#add_activity"
                    >
                      <i className="la la-plus-circle" /> Add Activity
                    </Link>
                  </div>
                </div>

                <div className="card-body">
                  <div className="activities-list">
                    <ul className="p-0 m-0">
                      {activityData.map((activity, idx) => (
                        <li key={idx} className="mb-3">
                          <div className="row align-items-center flex-wrap gx-3">
                            {/* Task Details */}
                            <div className="col-md-5">
                              <div className="activity-name">
                                <h5
                                  className="text-truncate"
                                  title={activity.title}
                                  style={{
                                    maxWidth: "100%",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {activity.title}
                                </h5>
                                <p>
                                  Due Date: {activity.date} {activity.time}{" "}
                                  {/* already 12h format */}
                                </p>
                                <div className="d-flex gap-2 align-items-center flex-wrap">
                                  <span
                                    className={`badge activity-badge ${activity.badgeClass}`}
                                    title={activity.type}
                                  >
                                    <i className={`la ${activity.icon}`} />{" "}
                                    {activity.type}
                                  </span>
                                  {activity.priority && (
                                    <span
                                      className={`badge text-white bg-${getPriorityColor(
                                        activity.priority
                                      )}`}
                                    >
                                      {activity.priority}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Assigned User */}
                            <div className="col-md-3 d-flex align-items-center gap-2">
                              <img
                                src={activity.avatar}
                                alt="User"
                                className="rounded-circle"
                                width={36}
                                height={36}
                              />
                              <h6 className="mb-0">{activity.user}</h6>
                            </div>

                            {/* Status Selector */}
                            <div className="col-md-4">
                              <div className="input-block mb-0">
                                <Select
                                  className="select"
                                  options={activity.statusOptions}
                                  placeholder="In Progress"
                                  styles={customStyles}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* 🟢 Color Legend */}
                    <div className="mt-3 d-flex flex-wrap gap-3 small text-muted">
                      <div>
                        <span className="badge badge-bg-violet me-1">
                          <i className="la la-user-tie" />
                        </span>{" "}
                        Meeting
                      </div>
                      <div>
                        <span className="badge badge-bg-warning me-1">
                          <i className="la la-envelope" />
                        </span>{" "}
                        Email
                      </div>
                      <div>
                        <span className="badge badge-bg-success me-1">
                          <i className="la la-phone" />
                        </span>{" "}
                        Call
                      </div>
                      <div>
                        <span className="badge badge-bg-info me-1">
                          <i className="la la-tasks" />
                        </span>{" "}
                        Task
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card analytics-card">
                <div className="card-header d-flex justify-content-between card-selectsview flex-wrap row-gap-3 mb-0">
                  <h3 className="card-title mb-0">Lost Leads Stage</h3>
                  <div className="card-select">
                    <ul>
                      <li>
                        <Select
                          className="select"
                          options={wondealsstage}
                          placeholder="Select"
                          styles={customStyles}
                        />
                      </li>
                      <li>
                        <Select
                          className="select"
                          options={days2}
                          placeholder="Select"
                          styles={customStyles}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <div ref={chartRefLostDeal2} />
                </div>
              </div>
              <div className="card analytics-card">
                <div className="card-header d-flex justify-content-between align-items-center flex-wrap row-gap-3">
                  <h3>
                    Recently Created Leads
                    <Link to="#">
                      <i className="la la-link" />
                    </Link>
                  </h3>
                  <div className="input-block mb-0">
                    <Select
                      className="select"
                      options={sortoption1}
                      placeholder="Sales Pipeline"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-nowrap custom-table mb-0">
                      <thead>
                        <tr>
                          <th>Lead Name</th>
                          <th>Company Name</th>
                          <th>Phone</th>
                          <th>Lead Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Collins</td>
                          <td>
                            <h2 className="table-avatar d-flex align-items-center">
                              <Link to="#" className="company-img">
                                <img src={companyicon01} alt="img" />
                              </Link>
                              <Link to="#" className="profile-split">
                                NovaWaveLLC{" "}
                                <span className="d-block">Newyork, USA</span>
                              </Link>
                            </h2>
                          </td>
                          <td>+1 875455453</td>
                          <td>
                            <span className="badge badge-soft-success">
                              Closed
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Konopelski</td>
                          <td>
                            <h2 className="table-avatar d-flex align-items-center">
                              <Link to="#" className="company-img">
                                <img src={company_icon_02} alt="img" />
                              </Link>
                              <Link to="#" className="profile-split">
                                BlueSky Industries{" "}
                                <span className="d-block">Winchester, KY</span>
                              </Link>
                            </h2>
                          </td>
                          <td>+1 989757485</td>
                          <td>
                            <span className="badge badge-soft-success">
                              Closed
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Adams</td>
                          <td>
                            <h2 className="table-avatar d-flex align-items-center">
                              <Link to="#" className="company-img">
                                <img src={company_icon_03} alt="img" />
                              </Link>
                              <Link to="#" className="profile-split">
                                SilverHawk{" "}
                                <span className="d-block">Jamestown, NY</span>
                              </Link>
                            </h2>
                          </td>
                          <td>+1 546555455</td>
                          <td>
                            <span className="badge badge-soft-info">
                              Not Contacted
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Schumm</td>
                          <td>
                            <h2 className="table-avatar d-flex align-items-center">
                              <Link to="#" className="company-img">
                                <img src={company_icon_04} alt="img" />
                              </Link>
                              <Link to="#" className="profile-split">
                                SummitPeak{" "}
                                <span className="d-block">Compton, RI</span>
                              </Link>
                            </h2>
                          </td>
                          <td>+1 454478787</td>
                          <td>
                            <span className="badge badge-soft-warning">
                              Contacted
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Wisozk</td>
                          <td>
                            <h2 className="table-avatar d-flex align-items-center">
                              <Link to="#" className="company-img">
                                <img src={company_icon_05} alt="img" />
                              </Link>
                              <Link to="#" className="profile-split">
                                RiverStone Ventur
                                <span className="d-block">Dayton, OH</span>
                              </Link>
                            </h2>
                          </td>
                          <td>+1 124547845</td>
                          <td>
                            <span className="badge badge-soft-success">
                              Closed
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Heller</td>
                          <td>
                            <h2 className="table-avatar d-flex align-items-center">
                              <Link to="#" className="company-img">
                                <img src={company_icon_06} alt="img" />
                              </Link>
                              <Link to="#" className="profile-split">
                                Bright Bridge Grp
                                <span className="d-block">Saybrook, IL</span>
                              </Link>
                            </h2>
                          </td>
                          <td>+1 478845447</td>
                          <td>
                            <span className="badge badge-soft-success">
                              Closed
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="card analytics-card">
                <div className="card-header d-flex justify-content-between card-selectsview flex-wrap row-gap-3 mb-0">
                  <h3 className="card-title mb-0">Won Leads Stage</h3>
                  <div className="card-select">
                    <ul>
                      <li>
                        <Select
                          className="select"
                          options={wondealsstage2}
                          placeholder="Select"
                          styles={customStyles}
                        />
                      </li>
                      <li>
                        <Select
                          className="select"
                          options={days2}
                          placeholder="Last 7 days"
                          styles={customStyles}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <div ref={chartRefWonChart2} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
      {/* /Page Wrapper */}
      <ExportLeads />
      <AddContact />
      <AddActivity />
    </div>
  );
};

export default Analytics;
