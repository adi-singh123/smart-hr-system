/** @format */

import React from "react";
import { Link } from "react-router-dom";
import PersonalInformationModelPopup from "../../../components/modelpopup/PersonalInformationModelPopup";
import { ListItem, ProjectDetails } from "./ProfileContent";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedEducation,
  setSelectedExperience,
} from "../../../Redux/features/Employee.js";
import {
  fetchPersonalInfo,
  fetchEmergencyContact,
  fetchBankDetails,
  fetchFamilyInfo,
  update_family_information,
  fetchExperienceInfo,
  fetchEducationInfo,
} from "../../../Redux/services/Profile.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllUsers } from "../../../Redux/services/User.js";

const ProfileTab = () => {
  const { userId: paramUserId } = useParams();
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state?.employee?.employeeData.users);
  const LoggenInuserId = useSelector((state) => state.user.logUserID);
  const [userId, setUserId] = useState(null);
  const LogInuserRole = localStorage.getItem("role");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // 2️⃣ Determine which user ID to load
  useEffect(() => {
    console.log("useEffect Rerun");
    if (paramUserId) {
      console.log("Prams mai hai");
      setUserId(paramUserId);
    } else if (allUsers.length > 0) {
      console.log("user se nikal lo");
      const adminUser = allUsers.find(
        (user) => user?.role?.name?.toLowerCase() === "admin"
      );
      if (adminUser) {
        setUserId(adminUser.id);
      } else {
        console.warn("⚠️ No admin user found!");
      }
    }
  }, [paramUserId, allUsers]);

  const personalInfo = useSelector(
    (state) => state?.employee?.personalInformation
  );
  const emergencyContact = useSelector(
    (state) => state?.employee?.emergencyContact
  );
  const experienceInfo = useSelector(
    (state) => state?.employee?.experienceInformation
  );
  const educationInfo = useSelector(
    (state) => state?.employee?.educationInformation
  );
  const familyInfo = useSelector((state) => state?.employee?.familyInformation);
  const bankDetails = useSelector((state) => state?.employee?.bankdetails);

  const [isDataFetched, setIsDataFetched] = useState(false);
  useEffect(() => {
    dispatch(fetchFamilyInfo(userId));
  }, [userId]);
  useEffect(() => {
    dispatch(fetchEducationInfo(userId));
  }, [userId]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const handleEditClick = (item) => {
    setEditId(item.id);
    setEditData(item);
  };

  const handleSave = async (id) => {
    if (!editData) return;

    const updatedData = { ...editData, id };

    try {
      await dispatch(update_family_information(updatedData)).unwrap();
      dispatch(fetchFamilyInfo(userId));
      setEditId(null);
    } catch (error) {
      console.error("Failed to update family information:", error);
    }
  };

  useEffect(() => {
    if (
      userId &&
      (!personalInfo || personalInfo?.userId !== userId) &&
      !isDataFetched
    ) {
      dispatch(fetchPersonalInfo(userId));
      setIsDataFetched(true);
    }
  }, [userId, isDataFetched]);
  useEffect(() => {
    dispatch(fetchExperienceInfo(userId));
  }, [userId]);
  useEffect(() => {
    dispatch(fetchEmergencyContact(userId));
  }, [userId]);
  useEffect(() => {
    dispatch(fetchBankDetails(userId));
  }, [userId]);

  const formatDate = (date) => {
    if (!date) return "Not Provided";
    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const personalInfoData = [
    {
      id: 1,
      title: "Passport No.",
      text: personalInfo?.passport_no || "Not Provided",
    },
    {
      id: 2,
      title: "Passport Exp Date.",
      text: formatDate(personalInfo?.passport_exp_date) || "Not Provided",
    },
    { id: 3, title: "Tel", text: personalInfo?.tel || "Not Provided" },
    {
      id: 4,
      title: "Nationality",
      text: personalInfo?.nationality || "Not Provided",
    },
    {
      id: 5,
      title: "Religion",
      text: personalInfo?.religion || "Not Provided",
    },
    {
      id: 6,
      title: "Marital status",
      text: personalInfo?.marital_status || "Not Provided",
    },
    {
      id: 7,
      title: "Employment of spouse",
      text: personalInfo?.employment_of_spouse || "Not Provided",
    },
    {
      id: 8,
      title: "No. of children",
      text:
        personalInfo?.no_of_children != null
          ? personalInfo.no_of_children
          : "Not Provided",
    },
  ];

  const primaryContactData = [
    {
      id: 1,
      title: "Name",
      text: emergencyContact?.primaryName || "Not Provided",
    },
    {
      id: 2,
      title: "Relationship",
      text: emergencyContact?.primaryRelationship || "Not Provided",
    },
    {
      id: 3,
      title: "Phone",
      text: `${emergencyContact?.primaryPhone || "Not Provided"}${
        emergencyContact?.primaryPhone2
          ? `, ${emergencyContact?.primaryPhone2}`
          : ""
      }`,
    },
  ];

  const secondaryContactData = [
    {
      id: 1,
      title: "Name",
      text: emergencyContact?.secondaryName || "Not Provided",
    },
    {
      id: 2,
      title: "Relationship",
      text: emergencyContact?.secondaryRelationship || "Not Provided",
    },
    {
      id: 3,
      title: "Phone",
      text: `${emergencyContact?.secondaryPhone || "Not Provided"}${
        emergencyContact?.secondaryPhone2
          ? `, ${emergencyContact?.secondaryPhone2}`
          : ""
      }`,
    },
  ];

  const bankInfoData = [
    {
      id: 1,
      title: "Bank name",
      text: bankDetails?.bank_name || "Not Provided",
    },
    {
      id: 2,
      title: "Bank account No.",
      text: bankDetails?.bank_account_no || "Not Provided",
    },
    {
      id: 3,
      title: "IFSC Code",
      text: bankDetails?.ifsc_code || "Not Provided",
    },
    {
      id: 4,
      title: "PAN No",
      text: bankDetails?.pan_no || "Not Provided",
    },
  ];

  // ✅ Access Control Conditions
  const isOwnProfile = paramUserId === LoggenInuserId;
  const isAdmin = LogInuserRole?.toLowerCase() === "admin";
  const canSeeAll = isOwnProfile || isAdmin;

  return (
    <>
      {canSeeAll && (
        <div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div
                  id="emp_profile"
                  className="pro-overview tab-pane fade show active"
                >
                  {/* PERSONAL + EMERGENCY */}
                  <div className="row">
                    {canSeeAll && (
                      <div className="col-md-6 d-flex">
                        <div className="card profile-box flex-fill">
                          <div className="card-body">
                            <h3 className="card-title">
                              Personal Informations
                              <Link
                                to="#"
                                className="edit-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#personal_info_modal"
                              >
                                <i className="fa fa-pencil" />
                              </Link>
                            </h3>
                            <ul className="personal-info">
                              {personalInfoData.map((item, index) => (
                                <ListItem
                                  id={item.id}
                                  key={index}
                                  title={item.title}
                                  text={item.text}
                                />
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Emergency contact - Always visible */}
                    <div className="col-md-6 d-flex">
                      <div className="card profile-box flex-fill">
                        <div className="card-body">
                          <h3 className="card-title">
                            Emergency Contact{" "}
                            {canSeeAll && (
                              <Link
                                to="#"
                                className="edit-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#emergency_contact_modal"
                              >
                                <i className="fa fa-pencil" />
                              </Link>
                            )}
                          </h3>
                          <h5 className="section-title">Primary</h5>
                          <ul className="personal-info">
                            {primaryContactData.map((item, index) => (
                              <ListItem
                                id={item.id}
                                key={index}
                                title={item.title}
                                text={item.text}
                              />
                            ))}
                          </ul>
                          <hr />
                          <h5 className="section-title">Secondary</h5>
                          <ul className="personal-info">
                            {secondaryContactData.map((item, index) => (
                              <ListItem
                                id={item.id}
                                key={index}
                                title={item.title}
                                text={item.text}
                              />
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BANK + FAMILY */}
                  {canSeeAll && (
                    <div className="row">
                      <div className="col-md-6 d-flex">
                        <div className="card profile-box flex-fill">
                          <div className="card-body">
                            <h3 className="card-title">
                              Bank Information
                              <Link
                                to="#"
                                className="edit-icon ms-2"
                                data-bs-toggle="modal"
                                data-bs-target="#bank_info_modal"
                              >
                                <i className="fas fa-edit"></i>{" "}
                              </Link>
                            </h3>
                            <ul className="personal-info">
                              {bankInfoData.map((item, index) => (
                                <ListItem
                                  id={item.id}
                                  key={index}
                                  title={item.title}
                                  text={item.text}
                                />
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 d-flex">
                        <div className="card profile-box flex-fill">
                          <div className="card-body">
                            <h3 className="card-title">
                              Family Informations{" "}
                              <Link
                                to="#"
                                className="edit-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#family_info_modal"
                              >
                                <i className="fa fa-pencil" />
                              </Link>
                            </h3>
                            <div className="table-responsive">
                              <table className="table table-nowrap">
                                <thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>Relationship</th>
                                    <th>Date of Birth</th>
                                    <th>Phone</th>
                                    <th />
                                  </tr>
                                </thead>
                                <tbody>
                                  {familyInfo && familyInfo.length > 0 ? (
                                    familyInfo.map((item) => (
                                      <tr key={item.id}>
                                        <td>
                                          {editId === item.id ? (
                                            <input
                                              type="text"
                                              value={editData.name}
                                              onChange={(e) =>
                                                setEditData({
                                                  ...editData,
                                                  name: e.target.value,
                                                })
                                              }
                                            />
                                          ) : (
                                            item.name
                                          )}
                                        </td>
                                        <td>
                                          {editId === item.id ? (
                                            <input
                                              type="text"
                                              value={editData.relationship}
                                              onChange={(e) =>
                                                setEditData({
                                                  ...editData,
                                                  relationship: e.target.value,
                                                })
                                              }
                                            />
                                          ) : (
                                            item.relationship
                                          )}
                                        </td>
                                        <td>
                                          {editId === item.id ? (
                                            <input
                                              type="date"
                                              value={
                                                editData.date_of_birth
                                                  ? new Date(
                                                      new Date(
                                                        editData.date_of_birth
                                                      ).getTime() -
                                                        new Date(
                                                          editData.date_of_birth
                                                        ).getTimezoneOffset() *
                                                          60000
                                                    )
                                                      .toISOString()
                                                      .split("T")[0]
                                                  : ""
                                              }
                                              onChange={(e) =>
                                                setEditData({
                                                  ...editData,
                                                  date_of_birth: e.target.value,
                                                })
                                              }
                                            />
                                          ) : item.date_of_birth ? (
                                            new Date(
                                              item.date_of_birth
                                            ).toLocaleDateString("en-GB")
                                          ) : (
                                            "Not Provided"
                                          )}
                                        </td>
                                        <td>
                                          {editId === item.id ? (
                                            <input
                                              type="text"
                                              value={editData.phone}
                                              onChange={(e) =>
                                                setEditData({
                                                  ...editData,
                                                  phone: e.target.value,
                                                })
                                              }
                                            />
                                          ) : (
                                            item.phone
                                          )}
                                        </td>
                                        <td className="text-end">
                                          <div className="dropdown dropdown-action">
                                            <Link
                                              aria-expanded="false"
                                              data-bs-toggle="dropdown"
                                              className="action-icon dropdown-toggle"
                                              to="#"
                                            ></Link>
                                            <div className="dropdown-menu dropdown-menu-right">
                                              {editId === item.id ? (
                                                <>
                                                  <Link
                                                    to="#"
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                      handleSave(item.id)
                                                    }
                                                  >
                                                    <i className="fa fa-save m-r-5" />{" "}
                                                    Save
                                                  </Link>
                                                  <Link
                                                    to="#"
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                      setEditId(null)
                                                    }
                                                  >
                                                    <i className="fa fa-times m-r-5" />{" "}
                                                    Cancel
                                                  </Link>
                                                </>
                                              ) : (
                                                <Link
                                                  to="#"
                                                  className="dropdown-item"
                                                  onClick={() =>
                                                    handleEditClick(item)
                                                  }
                                                >
                                                  <i className="fa fa-pencil m-r-5" />{" "}
                                                  Edit
                                                </Link>
                                              )}
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="5" className="text-center">
                                        No family information available
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EDUCATION + EXPERIENCE */}
                  <div className="row">
                    <div className="col-md-6 d-flex">
                      <div className="card profile-box flex-fill">
                        <div className="card-body">
                          <h3 className="card-title">
                            Education{" "}
                            {canSeeAll && (
                              <Link
                                to="#"
                                className="edit-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#education_info"
                              >
                                <i className="fa fa-pencil" />
                              </Link>
                            )}
                          </h3>
                          <div className="experience-box">
                            <ul className="experience-list">
                              {educationInfo && educationInfo.length > 0 ? (
                                educationInfo.map((item) => (
                                  <li key={item.id}>
                                    <div className="experience-user">
                                      <div className="before-circle" />
                                    </div>
                                    <div className="experience-content">
                                      <div className="timeline-content">
                                        <Link
                                          to="#"
                                          className="name"
                                          data-bs-toggle={
                                            canSeeAll ? "modal" : ""
                                          }
                                          data-bs-target={
                                            canSeeAll
                                              ? "#education_info"
                                              : undefined
                                          }
                                          onClick={() =>
                                            canSeeAll &&
                                            dispatch(setSelectedEducation(item))
                                          }
                                        >
                                          {item.institution}
                                        </Link>
                                        <div>
                                          {item.degree} {item.subject}
                                        </div>

                                        <span className="time">
                                          {`${new Date(
                                            item.starting_date
                                          ).getFullYear()} - ${
                                            item.complete_date
                                              ? new Date(
                                                  item.complete_date
                                                ).getFullYear()
                                              : "Present"
                                          }`}
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                ))
                              ) : (
                                <li>
                                  <div className="experience-content">
                                    <div className="timeline-content">
                                      <p>No education information available</p>
                                    </div>
                                  </div>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 d-flex">
                      <div className="card profile-box flex-fill">
                        <div className="card-body">
                          <h3 className="card-title">
                            Experience{" "}
                            {canSeeAll && (
                              <Link
                                to="#"
                                className="edit-icon"
                                data-bs-toggle="modal"
                                data-bs-target="#experience_info"
                              >
                                <i className="fa fa-pencil" />
                              </Link>
                            )}
                          </h3>
                          <div className="experience-box">
                            {experienceInfo && experienceInfo.length > 0 ? (
                              <ul className="experience-list">
                                {experienceInfo.map((item) => (
                                  <li key={item.id}>
                                    <div className="experience-user">
                                      <div className="before-circle" />
                                    </div>
                                    <div className="experience-content">
                                      <div className="timeline-content ">
                                        <Link
                                          to="#"
                                          className="name"
                                          data-bs-toggle={
                                            canSeeAll ? "modal" : ""
                                          }
                                          data-bs-target={
                                            canSeeAll
                                              ? "#experience_info"
                                              : undefined
                                          }
                                          onClick={() =>
                                            canSeeAll &&
                                            dispatch(
                                              setSelectedExperience(item)
                                            )
                                          }
                                        >
                                          {item.jobPosition} {" at "}{" "}
                                          {item.company}
                                        </Link>

                                        <span className="time">
                                          {formatDate(item.startDate)} -{" "}
                                          {item.endDate
                                            ? formatDate(item.endDate)
                                            : "Present"}
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="no-experience-message">
                                No experience available
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <ProjectDetails />
              </div>
            </div>
          </div>
        </div>
      )}
      <PersonalInformationModelPopup />
    </>
  );
};

export default ProfileTab;
