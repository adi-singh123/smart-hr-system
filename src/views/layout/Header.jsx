/** @format */

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaRegBell, FaRegComment } from "react-icons/fa";
import { useLocation } from "react-router-dom/dist";
import message from "../../assets/json/message";
import { clearStateAndPersistedData } from "../../Redux/store";
import {
  Applogo,
  Avatar_02,
  lnEnglish,
  lnFrench,
  lnGerman,
  lnSpanish,
} from "../../Routes/ImagePath";
import { UserRole } from "../../utils/UserRole";
import { routingObjects } from "./SearchingData";
import {
  fetchNotifications,
  markNotificationsRead,
  clearAllNotifications,
} from "../../Redux/services/Notifications";

const Header = () => {
  const dispatch = useDispatch();
  const [notification, setNotifications] = useState(false);
  const [flag, setflag] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const [flagImage, setFlagImage] = useState(lnEnglish);
  const [showAll, setShowAll] = useState(false);
  const role = localStorage.getItem("role");

  let { notifications: allNotifications = [], loading } = useSelector(
    (state) => state.notifications
  );
  // 🔥 Filter karo: sirf global (receiver_id === null) wali hi rakho
  allNotifications = Array.isArray(allNotifications)
    ? allNotifications.filter((n) => !n.receiver_id)
    : [];

  const unreadCount = Array.isArray(allNotifications)
    ? allNotifications.filter((n) => !n.is_read).length
    : 0;
  const datas = message.message;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
  };
  const onMenuClik = () => {
    document.body.classList.toggle("slide-nav");
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setNotifications(false);
    setProfile(false);
    setflag(false);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [routes, setRoutes] = useState(routingObjects);

  const formatPathName = (path) =>
    path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const filteredRoutes = routes.filter(
    (route) =>
      route.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatPathName(route.path)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleNotification = () => {
    const newState = !notification; // toggle state
    setNotifications(newState);
    setflag(false);
    setIsOpen(false);
    setProfile(false);

    // ✅ Jab close hoga tab hi API call karega
    if (!newState && !loading && allNotifications.length > 0) {
      const unreadIds = allNotifications
        .filter((n) => !n.is_read)
        .map((n) => n.id);

      if (unreadIds.length > 0) {
        dispatch(markNotificationsRead(unreadIds));
      }
    }
  };

  const handleProfile = () => {
    setProfile(!profile);
    setNotifications(false);
    setflag(false);
    setIsOpen(false);
  };

  const location = useLocation();
  let pathname = location.pathname;
  const Credencial = localStorage.getItem("credencial");
  const Value = JSON.parse(Credencial);
  const UserName = Value?.email?.split("@")[0];

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setFlagImage(
      lng === "en"
        ? lnEnglish
        : lng === "fr"
        ? lnFrench
        : lng === "es"
        ? lnSpanish
        : lnGerman
    );
  };

  const logout = () => {
    clearStateAndPersistedData();
    localStorage.clear("");
  };
  const visibleNotifications = showAll
    ? allNotifications
    : allNotifications.slice(0, 10);

  return (
    <div className="header" style={{ right: "0px" }}>
      {/* Logo */}
      <div className="header-left">
        <Link to="/admin-dashboard" className="logo">
          <div className="page-title-box">
            <h3>Nebula Tech HR</h3>
          </div>
        </Link>
        <Link to="/admin-dashboard" className="logo2">
          <img src={Applogo} width={40} height={40} alt="img" />
        </Link>
      </div>
      {/* /Logo */}
      <Link
        id="toggle_btn"
        to="#"
        style={{
          display: pathname.includes("tasks")
            ? pathname.includes("compose")
            : pathname.includes("compose")
            ? "none"
            : "",
        }}
        onClick={handlesidebar}
      >
        <span className="bar-icon">
          <span />
          <span />
          <span />
        </span>
      </Link>
      {/* Header Title */}
      <div className="page-title-box">
        <h3>Nebula Tech</h3>
      </div>
      {/* /Header Title */}
      <Link
        id="mobile_btn"
        className="mobile_btn"
        to="#"
        onClick={() => onMenuClik()}
      >
        <i className="fa fa-bars" />
      </Link>
      {/* Header Menu */}
      <ul className="nav user-menu">
        {/* Search */}
        {/* {role == "Admin" && (
          <li className="nav-item position-relative">
            <div className="top-nav-search position-relative">
              <form>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search here"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button className="btn" type="btn">
                  <i className="fa fa-search" />
                </button>
              </form>
            </div>
          </li>
        )} */}
        {/* /Search */}
        {/* Flag */}
        {/* <li className="nav-item dropdown has-arrow flag-nav">
          <Link
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            to="#"
            role="button"
          >
            <img src={flagImage} alt="Flag" height="20" /> {t(i18n.language)}
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              to="#"
              className="dropdown-item"
              onClick={() => changeLanguage("en")}
            >
              <img src={lnEnglish} alt="Flag" height="16" /> English
            </Link>
            <Link
              to="#"
              className="dropdown-item"
              onClick={() => changeLanguage("fr")}
            >
              <img src={lnFrench} alt="Flag" height="16" /> French
            </Link>
            <Link
              to="#"
              className="dropdown-item"
              onClick={() => changeLanguage("es")}
            >
              <img src={lnSpanish} alt="Flag" height="16" /> Spanish
            </Link>
            <Link
              to="#"
              className="dropdown-item"
              onClick={() => changeLanguage("de")}
            >
              <img src={lnGerman} alt="Flag" height="16" /> German
            </Link>
          </div>
        </li> */}

        {/* /Flag */}
        {/* Notifications */}
        {role == "Admin" && (
          <li className="nav-item dropdown position-relative">
            <Link
              to="#"
              className="dropdown-toggle nav-link"
              onClick={handleNotification} // data-bs-toggle hata diya
            >
              <i>
                <FaRegBell />
              </i>{" "}
              {unreadCount > 0 && (
                <span className="badge badge-pill">{unreadCount}</span>
              )}
            </Link>
            <div
              className={`dropdown-menu notifications ${
                notification ? "show" : ""
              }`}
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                left: "auto",
                transform: "none",
              }}
            >
              <div className="topnav-dropdown-header">
                <span className="notification-title">Notifications</span>
                <Link
                  to="#"
                  className="clear-noti"
                  onClick={() => {
                    if (allNotifications.length > 0) {
                      dispatch(clearAllNotifications());
                    }
                  }}
                >
                  Clear All
                </Link>
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  {loading ? (
                    <li className="text-center p-3">Loading...</li>
                  ) : visibleNotifications.length > 0 ? (
                    [...visibleNotifications]
                      .sort((a, b) =>
                        a.is_read === b.is_read ? 0 : a.is_read ? 1 : -1
                      )
                      .map((val, index) => {
                        const isRead =
                          val.is_read === true || val.is_read === "true";
                        return (
                          <li
                            className={`notification-message d-flex align-items-center ${
                              isRead ? "" : "unread"
                            }`}
                            key={index}
                            style={{
                              background: isRead ? "" : "#f0f8ff",
                              padding: "8px 10px",
                            }}
                          >
                            {!isRead && (
                              <span
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: "green",
                                  display: "inline-block",
                                  marginRight: "10px",
                                  flexShrink: 0,
                                }}
                              ></span>
                            )}
                            <Link
                              to={val.redirectUrl}
                              className="flex-grow-1 text-decoration-none"
                              onClick={() => {
                                localStorage.setItem("minheight", "true");
                                setNotifications(false); // ✅ close popup
                                if (!isRead) {
                                  dispatch(markNotificationsRead([val.id])); // ✅ mark as read
                                }
                              }}
                            >
                              <div className="media d-flex">
                                <span className="avatar flex-shrink-0">
                                  <img alt="" src={Avatar_02} />
                                </span>
                                <div className="media-body ms-2">
                                  <p
                                    className="noti-details"
                                    style={{ fontWeight: isRead ? 400 : 600 }}
                                  >
                                    <span className="noti-title">
                                      {val.title}
                                    </span>{" "}
                                    {val.message}
                                  </p>
                                  <p className="noti-time">
                                    <span className="notification-time">
                                      {new Date(val.createdAt).toLocaleString()}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </li>
                        );
                      })
                  ) : (
                    <li className="text-center p-3 text-muted">
                      No Notifications
                    </li>
                  )}
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                {allNotifications.length > 10 && (
                  <Link to="#" onClick={() => setShowAll(!showAll)}>
                    {showAll ? "Show Less" : "View all Notifications"}
                  </Link>
                )}
              </div>
            </div>
          </li>
        )}
        {/* /Notifications */}
        {/* Message Notifications */}
        {/* <li className={`nav-item dropdown ${isOpen ? "show" : ""}`}>
          <Link
            to="#"
            className="dropdown-toggle nav-link"
            data-bs-toggle="dropdown"
            onClick={toggleDropdown}
          >
            <i>
              <FaRegComment />
            </i>{" "}
            <span className="badge badge-pill">8</span>
          </Link>
          <div
            className={`dropdown-menu dropdown-menu-end notifications ${
              isOpen ? "show" : ""
            }`}
          >
            <div className="topnav-dropdown-header">
              <span className="notification-title">Messages</span>
              <Link to="#" className="clear-noti">
                Clear All
              </Link>
            </div>
            <div className="noti-content">
              <ul className="notification-list">
                {datas.map((value, index) => (
                  <li className="notification-message" key={index}>
                    <Link
                      onClick={() => localStorage.setItem("minheight", "true")}
                      to="/conversation/chat"
                    >
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">
                            <img alt="" src={value.image} />
                          </span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">{value.name}</span>
                          <span className="message-time">{value.time}</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            {value.contents}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="topnav-dropdown-footer">
              <Link
                onClick={() => localStorage.setItem("minheight", "true")}
                to="/conversation/chat"
              >
                View all Messages
              </Link>
            </div>
          </div>
        </li>
        */}
        {/* /Message Notifications */}
        <li className="nav-item dropdown has-arrow main-drop">
          <Link
            to="#"
            className="dropdown-toggle nav-link"
            data-bs-toggle="dropdown"
            onClick={handleProfile}
          >
            <span className="user-img me-1">
              <img src={Avatar_02} alt="img" />
              <span className="status online" />
            </span>
            <span>{UserRole()}</span>
          </Link>
          <div
            className={`dropdown-menu dropdown-menu-end ${
              profile ? "show" : ""
            }`}
          >
            <Link className="dropdown-item" to="/" onClick={() => logout()}>
              Logout
            </Link>
          </div>
        </li>
      </ul>
      {/* /Header Menu */}
      {/* Mobile Menu */}
      <div className="dropdown mobile-user-menu">
        <Link
          to="#"
          className="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa fa-ellipsis-v" />
        </Link>
        <div className="dropdown-menu dropdown-menu-end dropdown-menu-right">
          {/*<Link className="dropdown-item" to="/company-settings">
            Settings
          </Link>*/}
          <Link className="dropdown-item" to="/login" onClick={() => logout()}>
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
