/** @format */

import React, { useEffect, useState } from "react";
import { Avatar_16 } from "../../../Routes/ImagePath";
import { Link, useParams } from "react-router-dom";
import ProfileTab from "./ProfileTab";
import { useSelector, useDispatch } from "react-redux";
import { formatDate } from "../../../utils/formatDate";
import { HTTPURL } from "../../../Constent/Matcher";
import { getFullUserById, getAllUsers } from "../../../Redux/services/User";
import { ProjectDetails } from "./ProfileContent";
import CommonAvatar from "../../../../src/CommanAvater.jsx";
const Profile = () => {
  const { userId: paramUserId } = useParams();
  const dispatch = useDispatch();

  const profileData = useSelector((state) => state?.user?.fullUserData);
  const allUsers = useSelector((state) => state?.employee?.employeeData.users);

  const [finalUserId, setFinalUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  const LoggenInuserId = useSelector((state) => state.user.logUserID);
  const LogInuserRole = localStorage.getItem("role");

  // 1️⃣ Fetch all users (needed to find admin if no param)
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // 2️⃣ Determine which user ID to load
  useEffect(() => {
    console.log("useEffect Rerun");
    if (paramUserId) {
      console.log("Prams mai hai");
      // URL has user ID → use it directly
      setFinalUserId(paramUserId);
    } else if (allUsers.length > 0) {
      console.log("user se nikal lo");
      // No URL param → pick the admin
      const adminUser = allUsers.find(
        (user) => user?.role?.name?.toLowerCase() === "admin"
      );
      if (adminUser) {
        setFinalUserId(adminUser.id);
      } else {
        console.warn("⚠️ No admin user found!");
      }
    }
  }, [paramUserId, allUsers]);

  // 3️⃣ Fetch full profile for selected user
  useEffect(() => {
    if (finalUserId) {
      dispatch(getFullUserById({ userId: finalUserId }));
    }
  }, [finalUserId, dispatch]);

  const userData = {
    gender: "Not provided",
    supervisor: {
      name: "Not assigned",
      avatar: Avatar_16,
    },
  };
  const isOwnProfile = paramUserId === LoggenInuserId;
  const isAdmin = LogInuserRole?.toLowerCase() === "admin";
  const canSeeAll = isOwnProfile || isAdmin;

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row mb-2 align-items-center">
            <div className="col-12">
              <h3 className="page-title mb-2">Employee</h3>
            </div>
            <div className="col-12 d-flex">
              <ul className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link
                    to={
                      LogInuserRole === "Admin"
                        ? "/admin-dashboard"
                        : "/employee-dashboard"
                    }
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="breadcrumb-item ">Employee</li>
              </ul>
            </div>
            <div className="col text-end">
              <Link to="/employees" className="btn btn-secondary">
                <i className="fa fa-arrow-left"></i> Back
              </Link>
            </div>
          </div>

          {/* Profile Card */}
          <div className="card mb-0">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="profile-view">
                    <div className="profile-img-wrap">
                      <div className="profile-img">
                        <Link to="#">
                          <CommonAvatar
                            imageUrl={
                              profileData?.profile_pic
                                ? `${HTTPURL}${profileData.profile_pic}`
                                : ""
                            }
                            alt={`${profileData?.first_name || ""} ${
                              profileData?.last_name || ""
                            }`}
                            size={100}
                          />
                        </Link>
                      </div>
                    </div>

                    <div className="profile-basic">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="staff-id">
                            <div className="profile-info-left">
                              <h3 className="user-name m-t-0 mb-0">
                                {profileData?.first_name || ""}{" "}
                                {profileData?.last_name || ""}
                              </h3>
                              <h6 className="text-muted">
                                {profileData?.designation?.name || ""} {"("}
                                {profileData?.role?.name || ""} {")"}
                              </h6>
                              <small className="text-muted block">
                                Employee ID :{" "}
                                {profileData?.employee_id || "Not provided"}
                              </small>
                            </div>
                            <div className="small doj text-muted">
                              Date of Join :{" "}
                              {profileData?.created_date
                                ? formatDate(profileData.created_date)
                                : ""}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-7">
                          <ul className="personal-info">
                            <li>
                              <div className="title">Phone:</div>
                              <div className="text">
                                <Link to={`tel:${profileData?.phone}`}>
                                  {profileData?.phone || "Not provided"}
                                </Link>
                              </div>
                            </li>
                            <li>
                              <div className="title">Email:</div>
                              <div className="text">
                                <Link to={`mailto:${profileData?.email}`}>
                                  {profileData?.email || "Not provided"}
                                </Link>
                              </div>
                            </li>
                            <li>
                              <div className="title">Birthday:</div>
                              <div className="text">
                                {profileData?.date_of_birth
                                  ? formatDate(profileData.date_of_birth)
                                  : "Not provided"}
                              </div>
                            </li>
                            {canSeeAll && (
                              <li>
                                <div className="title">Address:</div>
                                <div className="text">
                                  {profileData?.address || "Not provided"}
                                </div>
                              </li>
                            )}
                            <li>
                              <div className="title">Gender:</div>
                              <div className="text">{userData.gender}</div>
                            </li>
                            <li>
                              <div className="title">Reports to:</div>
                              <div className="text">
                                <div className="avatar-box">
                                  <div className="avatar avatar-xs">
                                    <img
                                      src={userData.supervisor.avatar}
                                      alt="Supervisor"
                                    />
                                  </div>
                                </div>
                                <Link to="#">{userData.supervisor.name}</Link>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    {canSeeAll && (
                      <div className="pro-edit">
                        <Link
                          data-bs-target="#profile_info"
                          data-bs-toggle="modal"
                          className="edit-icon"
                          to="#"
                        >
                          <i className="fa-solid fa-pencil"></i>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          {canSeeAll && (
            <div className="card tab-box">
              <div className="row user-tabs">
                <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                  <ul className="nav nav-tabs nav-tabs-bottom">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "profile" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("profile")}
                      >
                        Profile
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "projects" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("projects")}
                      >
                        Projects
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "bank" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("bank")}
                      >
                        Bank &amp; Statutory
                        <small className="text-danger ms-1">(Admin Only)</small>
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "assets" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("assets")}
                      >
                        Assets
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {/* Conditional Rendering */}
          {activeTab === "profile" && <ProfileTab />}
          <div className={activeTab === "projects" ? "d-block" : "d-none"}>
            <ProjectDetails showProjects={true} />
          </div>
          {activeTab === "bank" && <ProjectDetails showBank={true} />}
          {activeTab === "assets" && <ProjectDetails showAssets={true} />}
        </div>
      </div>
    </>
  );
};

export default Profile;
