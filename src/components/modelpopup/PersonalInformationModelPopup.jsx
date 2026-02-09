/** @format */

import React, { useState, useEffect, useRef } from "react";
import { Avatar_02 } from "../../Routes/ImagePath";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import {
  setSelectedEducation,
  setSelectedExperience,
} from "../../Redux/features/Employee.js";
import {
  submitPersonalInfo,
  submit_emergency_contact,
  fetchPersonalInfo,
  fetchEmergencyContact,
  submit_bank_details,
  submit_family_information,
  submit_education_information,
  fetchBankDetails,
  fetchFamilyInfo,
  submit_exp_details,
  fetchEducationInfo,
  fetchExperienceInfo,
  submitProfileInfo,
  fetchProfileInfo,
} from "./../../Redux/services/Profile.js";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { getAllUsers } from "../../Redux/services/User.js";
const PersonalInformationModelPopup = () => {
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  let selectedEducation = useSelector(
    (state) => state?.employee?.selectedEducation
  );
  const selectedExperience = useSelector(
    (state) => state.employee?.selectedExperience ?? null
  );

  console.log("personaleducationinfo", selectedEducation);
  const personalInfo = useSelector(
    (state) => state?.employee?.personalInformation
  );
  console.log("personalExperienceinfo", selectedExperience);

  const emergencyContact = useSelector(
    (state) => state?.employee?.emergencyContact
  );
  const bankDetails = useSelector((state) => state?.employee?.bankdetails);
  const profileInfo = useSelector(
    (state) => state?.employee?.addressInformation
  );
  const familyInfo = useSelector((state) => state?.employee?.familyInformation);
  const { userId: paramUserId } = useParams();
  const allUsers = useSelector((state) => state?.employee?.employeeData.users);
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  useEffect(() => {
    console.log("useEffect Rerun");
    if (paramUserId) {
      console.log("Prams mai hai");
      // URL has user ID → use it directly
      setUserId(paramUserId);
    } else if (allUsers.length > 0) {
      console.log("user se nikal lo");
      // No URL param → pick the admin
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
  const {
    control: controlForm2,
    handleSubmit: handleSubmitForm2,
    setValue: setValueForm2,
    register: registerForm2,
    formState: { errors: errorsForm2 },
  } = useForm();
  const {
    setValue: setValueForm3,
    register: registerForm3,
    handleSubmit: handleSubmitForm3,
    formState: { errors: errorsForm3 },
  } = useForm();
  const {
    register: registerExperience,
    handleSubmit: handleExperienceSubmit,
    control: experienceControl,
    setValue: setExperienceValue,
    formState: { errors: experienceErrors },
    reset: experienceReset,
  } = useForm();
  const {
    register: registerForm4,
    handleSubmit: handleSubmitForm4,
    setValue: setValueForm4,
    formState: { errors: errorsForm4 },
  } = useForm();

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    data.employee_id = userId;

    if (data.passport_exp_date) {
      const d = new Date(data.passport_exp_date);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      data.passport_exp_date = d.toISOString().split("T")[0];
    }

    const response = await dispatch(submitPersonalInfo(data));

    if (response?.payload?.status) {
      await dispatch(fetchPersonalInfo(userId));
      const closeButton = document.querySelector(
        "#personal_info_modal .btn-close"
      );
      if (closeButton) closeButton.click();
    }
  };

  const submit = async (data) => {
    try {
      data.employee_id = userId;
      const response = await dispatch(submit_emergency_contact(data));
      if (response?.payload?.status === true) {
        await dispatch(fetchEmergencyContact(userId));
        const closeButton = document.querySelector(
          "#emergency_contact_modal .btn-close"
        );
        if (closeButton) {
          closeButton.click();
        }
      } else {
        console.error(
          "Failed to submit emergency contact:",
          response?.payload?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("An error occurred during submission:", error);
    }
  };
  const submitFamily = async (data) => {
    try {
      data.employee_id = userId;
      const response = await dispatch(submit_family_information(data));
      if (response?.payload?.status === true) {
        await dispatch(fetchFamilyInfo(userId));
        const closeButton = document.querySelector(
          "#family_info_modal .btn-close"
        );
        if (closeButton) {
          closeButton.click();
        }
      } else {
        console.error(
          "Failed to submit family information:",
          response?.payload?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("An error occurred during family info submission:", error);
    }
  };
  const submit3 = async (data) => {
    try {
      data.employee_id = userId;
      const response = await dispatch(submit_bank_details(data));
      if (response?.payload?.status === true) {
        await dispatch(fetchBankDetails(userId));
        const closeButton = document.querySelector(
          "#bank_info_modal .btn-close"
        );
        if (closeButton) {
          closeButton.click();
        }
      } else {
        console.error(
          "Failed to submit bank details:",
          response?.payload?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("An error occurred during bank details submission:", error);
    }
  };

  const submitExperience = async (data) => {
    try {
      console.log(data);
      data.employee_id = userId;
      if (selectedExperience) {
        data.selectedid = selectedExperience.id;
      }
      const response = await dispatch(submit_exp_details(data));
      dispatch(setSelectedExperience(null));
      if (response?.payload?.status === true) {
        await dispatch(fetchExperienceInfo(userId));
        const closeButton = document.querySelector(
          "#experience_info .btn-close"
        );
        if (closeButton) {
          closeButton.click();
        }
      } else {
        console.error(
          "Failed to submit experience details:",
          response?.payload?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error(
        "An error occurred during experience details submission:",
        error
      );
    }
  };

  const formatToMonthYear = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${month}`;
  };

  const EducationSubmit = async (data) => {
    try {
      // Validation: End date must not be before start date
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        if (end < start) {
          alert("Complete date cannot be before Start date");
          return;
        }
      }

      data.employee_id = userId;
      if (selectedEducation) {
        data.selectedid = selectedEducation.id;
      }

      // Format Month/Year
      data.startDate = formatToMonthYear(data.startDate);
      data.endDate = formatToMonthYear(data.endDate);

      const response = await dispatch(submit_education_information(data));
      dispatch(setSelectedEducation(null));

      if (response?.payload?.status === true) {
        await dispatch(fetchEducationInfo(userId));
        const closeButton = document.querySelector(
          "#education_info .btn-close"
        );
        if (closeButton) closeButton.click();
        educationReset();
        reset();
        setStartDate(null);
        setEndDate(null);
      } else {
        console.error(
          "Failed to submit education information:",
          response?.payload?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error(
        "An error occurred during education information submission:",
        error
      );
    }
  };
  // const EducationSubmit = async (data) => {
  //   try {
  //     educationReset();
  //     console.log(data);
  //     data.employee_id = userId;
  //     if (selectedEducation) {
  //       data.selectedid = selectedEducation.id;
  //     }
  //     const response = await dispatch(submit_education_information(data));
  //     dispatch(setSelectedEducation(null));
  //     if (response?.payload?.status === true) {
  //       await dispatch(fetchEducationInfo(userId));
  //       const closeButton = document.querySelector(
  //         "#education_info .btn-close"
  //       );
  //       if (closeButton) {
  //         closeButton.click();
  //       }
  //     } else {
  //       console.error(
  //         "Failed to submit education information:",
  //         response?.payload?.message || "Unknown error"
  //       );
  //     }
  //   } catch (error) {
  //     console.error(
  //       "An error occurred during education information submission:",
  //       error
  //     );
  //   }
  // };

  useEffect(() => {
    dispatch(fetchPersonalInfo(userId));
  }, [userId]);
  useEffect(() => {
    dispatch(fetchProfileInfo(userId));
  }, [userId]);

  useEffect(() => {
    dispatch(fetchEmergencyContact(userId));
  }, [userId]);

  useEffect(() => {
    dispatch(fetchBankDetails(userId));
  }, [userId]);
  const formatDate = (date) => {
    if (!date) return ""; // Handle null/undefined
    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    // Jab personalInfo store update ho
    if (personalInfo) {
      setValue("passport_no", personalInfo.passport_no || "");
      setValue("tel", personalInfo.tel || "");
      setValue("nationality", personalInfo.nationality || "");
      setValue("employment_of_spouse", personalInfo.employment_of_spouse || "");
      setValue("no_of_children", personalInfo.no_of_children || "");
      setValue("religion", personalInfo.religion || "");
      setValue("marital_status", personalInfo.marital_status || "");

      // Date field
      setValue(
        "passport_exp_date",
        personalInfo.passport_exp_date
          ? new Date(personalInfo.passport_exp_date)
          : null
      );
    }
  }, [personalInfo, setValue]);
  useEffect(() => {
    if (familyInfo) {
      setValueForm4("primaryName", familyInfo?.primaryName || "");
      setValueForm4(
        "primaryRelationship",
        familyInfo?.primaryRelationship || ""
      );
      setValueForm4("primaryPhone", familyInfo?.primaryPhone || "");

      // ✅ Fix: Convert ISO date safely for <input type="date">
      if (familyInfo?.dob) {
        const dob = new Date(familyInfo.dob);
        // Adjust for timezone offset
        const local = new Date(dob.getTime() - dob.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];
        setValueForm4("dob", local);
      } else {
        setValueForm4("dob", "");
      }
    }
  }, [familyInfo, setValueForm4]);

  useEffect(() => {
    if (emergencyContact) {
      console.log("Emergency contact data received:", emergencyContact);

      setValueForm2("employee_id", emergencyContact?.employee_id);
      setValueForm2("primaryName", emergencyContact?.primaryName);
      setValueForm2("primaryPhone", emergencyContact?.primaryPhone);
      setValueForm2("primaryPhone2", emergencyContact?.primaryPhone2);
      setValueForm2(
        "primaryRelationship",
        emergencyContact?.primaryRelationship
      );
      setValueForm2("secondaryName", emergencyContact?.secondaryName);
      setValueForm2("secondaryPhone", emergencyContact?.secondaryPhone);
      setValueForm2("secondaryPhone2", emergencyContact?.secondaryPhone2);
      setValueForm2(
        "secondaryRelationship",
        emergencyContact?.secondaryRelationship
      );
    }
  }, [emergencyContact, setValueForm2]);
  useEffect(() => {
    setProfileValue("address", profileInfo?.address);
    setProfileValue("pinCode", profileInfo?.pinCode);
    setProfileValue("state", profileInfo?.state);
    setProfileValue("country", profileInfo?.country);
    setProfileValue("employee_id", profileInfo?.employee_id);
  }, [setValue, profileInfo]);

  const {
    control: educationControl,
    handleSubmit: handleEducationSubmit,
    formState: { errors: educationErrors },
    reset: resetEducationForm,
    setValue: setEducationValue,
    reset: educationReset,
  } = useForm();
  useEffect(() => {
    // Use optional chaining and defaults: if selectedEducation is null, use empty defaults
    setEducationValue("institution", selectedEducation?.institution || "");
    setEducationValue("degree", selectedEducation?.degree || "");
    setEducationValue("subject", selectedEducation?.subject || "");
    setEducationValue(
      "startDate",
      selectedEducation?.starting_date ? selectedEducation.starting_date : null
    );
    setEducationValue(
      "endDate",
      selectedEducation?.complete_date ? selectedEducation.complete_date : ""
    );
    setEducationValue("grade", selectedEducation?.grade || "");
  }, [selectedEducation, setEducationValue]);

  useEffect(() => {
    setExperienceValue("company", selectedExperience?.company || "");
    setExperienceValue("location", selectedExperience?.location || "");
    setExperienceValue("jobPosition", selectedExperience?.jobPosition || "");
    setExperienceValue(
      "startDate",
      selectedExperience?.startDate ? selectedExperience.startDate : null
    );
    setExperienceValue(
      "endDate",
      selectedExperience?.endDate ? selectedExperience.endDate : null
    );
  }, [selectedExperience, setExperienceValue]);

  useEffect(() => {
    if (bankDetails) {
      console.log("Bank details data received:", bankDetails);
      setValueForm3("employee_id", bankDetails?.employee_id);
      setValueForm3("accountNumber", bankDetails?.bank_account_no);
      setValueForm3("bankName", bankDetails?.bank_name);
      setValueForm3("ifscCode", bankDetails?.ifsc_code);
      setValueForm3("panNumber", bankDetails?.pan_no);
    }
  }, [bankDetails, setValueForm3]);

  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
    setValue("passport_exp_date", date);
  };
  const domain = [
    { value: 1, label: "Select Department" },
    { value: 2, label: "Web Development+" },
    { value: 3, label: "IT Management" },
    { value: 4, label: "Marketing" },
  ];
  const developer = [
    { value: 1, label: "Select Department" },
    { value: 2, label: "Web Development+" },
    { value: 3, label: "IT Management" },
    { value: 4, label: "Marketing" },
  ];
  const reporter = [
    { value: 2, label: "Wilmer Deluna" },
    { value: 3, label: "Lesley Grauer" },
    { value: 4, label: "Jeffery Lalor" },
  ];
  const status = [
    { value: 1, label: "Single" },
    { value: 2, label: "Married" },
  ];
  const gender = [
    { value: 1, label: "Male" },
    { value: 2, label: "Female" },
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
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
  } = useForm();
  const ProfileSubmit = async (data) => {
    try {
      console.log("Profile Data Submitted:", data);
      data.employee_id = userId;
      const response = await dispatch(submitProfileInfo(data));
      if (response?.payload?.status === true) {
        await dispatch(fetchProfileInfo(userId));
        const closeButton = document.querySelector("#profile_info .btn-close");
        if (closeButton) {
          closeButton.click();
        }
      } else {
        console.error(
          "Failed to submit profile information:",
          response?.payload?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("An error occurred during profile submission:", error);
    }
  };
  useEffect(() => {
    // Clear selectedEducation and reset form fields on mount
    dispatch(setSelectedEducation(null));
    educationReset(); // Reset the form fields

    const modalElement = document.getElementById("education_info");

    const handleModalHide = () => {
      dispatch(setSelectedEducation(null));
      educationReset(); // Reset form when modal closes
    };

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalHide);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalHide);
      }
    };
  }, [dispatch, educationReset]);

  useEffect(() => {
    // Immediately clear selectedExperience on mount
    dispatch(setSelectedExperience(null));
    experienceReset();
    const modalElement = document.getElementById("experience_info");
    const handleModalHide = () => {
      dispatch(setSelectedExperience(null)); // ✅ Clear on modal close
    };

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalHide);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalHide);
      }
    };
  }, [dispatch, experienceReset]);

  return (
    <>
      <div id="profile_info" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" type="button">
                Profile Information
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true"> ×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitProfile(ProfileSubmit)}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        {...registerProfile("address", {
                          required: "Address is required",
                        })}
                      />
                      {profileErrors.address && (
                        <p className="text-danger">
                          {profileErrors.address.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Pin Code</label>
                      <input
                        type="text"
                        className="form-control"
                        {...registerProfile("pinCode", {
                          required: "Pin Code is required",
                        })}
                      />
                      {profileErrors.pinCode && (
                        <p className="text-danger">
                          {profileErrors.pinCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        {...registerProfile("state", {
                          required: "State is required",
                        })}
                      />
                      {profileErrors.state && (
                        <p className="text-danger">
                          {profileErrors.state.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        {...registerProfile("country", {
                          required: "Country is required",
                        })}
                      />
                      {profileErrors.country && (
                        <p className="text-danger">
                          {profileErrors.country.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        id="emergency_contact_modal"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Personal Information</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitForm2(submit)}>
                {/* Primary Contact Form */}
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Primary Contact</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label
                            htmlFor="primaryName"
                            className="col-form-label"
                          >
                            Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="primaryName"
                            {...registerForm2("primaryName", {
                              required: "This field is required",
                            })}
                          />
                          {errorsForm2.primaryName && (
                            <p className="text-danger">
                              {errorsForm2.primaryName.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label
                            htmlFor="primaryRelationship"
                            className="col-form-label"
                          >
                            Relationship <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="primaryRelationship"
                            {...registerForm2("primaryRelationship", {
                              required: "This field is required",
                            })}
                          />
                          {errorsForm2.primaryRelationship && (
                            <p className="text-danger">
                              {errorsForm2.primaryRelationship.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label
                            htmlFor="primaryPhone"
                            className="col-form-label"
                          >
                            Phone <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="primaryPhone"
                            {...registerForm2("primaryPhone", {
                              required: "This field is required",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message:
                                  "Please enter a valid 10-digit phone number",
                              },
                              minLength: {
                                value: 10,
                                message:
                                  "Phone number should be exactly 10 digits",
                              },
                              maxLength: {
                                value: 10,
                                message:
                                  "Phone number should be exactly 10 digits",
                              },
                            })}
                          />
                          {errorsForm2.primaryPhone && (
                            <p className="text-danger">
                              {errorsForm2.primaryPhone.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label
                            htmlFor="primaryPhone2"
                            className="col-form-label"
                          >
                            Phone 2
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="primaryPhone2"
                            {...registerForm2("primaryPhone2", {
                              validate: (value) => {
                                if (value && !/^[0-9]{10}$/.test(value)) {
                                  return "Please enter a valid 10-digit phone number";
                                }
                                return true;
                              },
                            })}
                          />
                          {errorsForm2.primaryPhone2 && (
                            <p className="text-danger">
                              {errors.primaryPhone2.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Contact Form */}
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Secondary Contact</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label
                            htmlFor="secondaryName"
                            className="col-form-label"
                          >
                            Name <span className="text-danger">Optional</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="secondaryName"
                            {...registerForm2("secondaryName", {
                              // required: "This field is required",
                            })}
                          />
                          {errorsForm2.secondaryName && (
                            <p className="text-danger">
                              {errorsForm2.secondaryName.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label
                            htmlFor="secondaryRelationship"
                            className="col-form-label"
                          >
                            Relationship{" "}
                            <span className="text-danger">Optional</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="secondaryRelationship"
                            {...registerForm2("secondaryRelationship", {
                              // required: "This field is required",
                            })}
                          />
                          {errorsForm2.secondaryRelationship && (
                            <p className="text-danger">
                              {errorsForm2.secondaryRelationship.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label
                            htmlFor="secondaryPhone"
                            className="col-form-label"
                          >
                            Phone <span className="text-danger">Optional</span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="secondaryPhone"
                            {...registerForm2("secondaryPhone", {
                              // required: "This field is required",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message:
                                  "Please enter a valid 10-digit phone number",
                              },
                              minLength: {
                                value: 10,
                                message:
                                  "Phone number should be exactly 10 digits",
                              },
                              maxLength: {
                                value: 10,
                                message:
                                  "Phone number should be exactly 10 digits",
                              },
                            })}
                          />
                          {errorsForm2.secondaryPhone && (
                            <p className="text-danger">
                              {errorsForm2.secondaryPhone.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label
                            htmlFor="secondaryPhone2"
                            className="col-form-label"
                          >
                            Phone 2
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="secondaryPhone2"
                            {...registerForm2("secondaryPhone2", {
                              validate: (value) => {
                                if (value && !/^[0-9]{10}$/.test(value)) {
                                  return "Please enter a valid 10-digit phone number";
                                }
                                return true;
                              },
                            })}
                          />
                          {errorsForm2.secondaryPhone2 && (
                            <p className="text-danger">
                              {errorsForm2.secondaryPhone2.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit and Reset Buttons */}
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info Modal */}
      <div
        id="personal_info_modal"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Personal Information</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Passport No</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("passport_no", {
                          required: "Passport No is required",
                        })}
                      />
                      {errors.passportNo && (
                        <p className="text-danger">
                          {errors.passportNo.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Passport Expiry Date
                      </label>
                      <Controller
                        control={control}
                        name="passport_exp_date"
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            className="form-control"
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select Expiry Date"
                          />
                        )}
                      />
                      {errors.passport_exp_date && (
                        <p className="text-danger">
                          {errors.passport_exp_date.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Tel</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("tel", {
                          required: "Telephone number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message:
                              "Please enter a valid 10-digit phone number",
                          },
                          minLength: {
                            value: 10,
                            message: "Phone number should be exactly 10 digits",
                          },
                          maxLength: {
                            value: 10,
                            message: "Phone number should be exactly 10 digits",
                          },
                        })}
                      />
                      {errors.tel && (
                        <p className="text-danger">{errors.tel.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Nationality</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("nationality", {
                          required: "Nationality is required",
                        })}
                      />
                      {errors.nationality && (
                        <p className="text-danger">
                          {errors.nationality.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Religion</label>
                      <Controller
                        name="religion"
                        control={control}
                        rules={{ required: "Religion is required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            className="form-control"
                            placeholder="Enter religion"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Marital Status</label>
                      <Controller
                        name="marital_status"
                        control={control}
                        rules={{ required: "Marital status is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={status}
                            placeholder="-"
                            styles={customStyles}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption.label);
                            }}
                            value={
                              status.find(
                                (option) => option.label === field.value
                              ) || ""
                            }
                          />
                        )}
                      />
                      {errors.marital_status && (
                        <p className="text-danger">
                          {errors.marital_status.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Employment of Spouse
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("employment_of_spouse", {
                          required: "Spouse's employment status is required",
                        })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">No. of Children</label>
                     <input
  type="number"
  className="form-control"
  placeholder="Not more than 4"
  min={0}
  max={4}
  step={1}
  {...register("no_of_children", {
    required: "Number of children is required",
    valueAsNumber: true,
    validate: (value) => {
      if (value < 0) return "Negative numbers are not allowed";
      if (value > 4) return "Maximum allowed value is 4";
      if (!Number.isInteger(value)) return "Only integer values allowed";
      return true;
    },
  })}
  onInput={(e) => {
    let value = e.target.value;

    // Remove minus sign
    if (value.includes("-")) {
      e.target.value = value.replace("-", "");
    }

    // Force max value 4
    if (Number(value) > 4) {
      e.target.value = 4;
    }
  }}
  onKeyDown={(e) => {
    // Block invalid keys
    if (["-", "e", "E", "+"].includes(e.key)) {
      e.preventDefault();
    }
  }}
/>

                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Personal Info Modal */}

      <div
        id="education_info"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Education Information</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEducationSubmit(EducationSubmit)}>
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Education Information</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block mb-3 mb-3 form-focus focused">
                          <Controller
                            control={educationControl}
                            name="institution"
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className="form-control floating"
                              />
                            )}
                          />
                          <label className="focus-label">Institution</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3 mb-3 form-focus focused">
                          <Controller
                            control={educationControl}
                            name="subject"
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className="form-control floating"
                              />
                            )}
                          />
                          <label className="focus-label">Subject</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3 mb-3 form-focus focused">
                          <Controller
                            control={educationControl}
                            name="startDate"
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                selected={startDate}
                                onChange={(date) => {
                                  setStartDate(date); //
                                  field.onChange(date); //
                                }}
                                className="form-control floating datetimepicker"
                                type="date"
                                dateFormat="dd-MM-yyyy"
                              />
                            )}
                          />
                          <label className="focus-label">Starting Date</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3 mb-3 form-focus focused">
                          <Controller
                            control={educationControl}
                            name="endDate"
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                selected={endDate}
                                onChange={(date) => {
                                  setEndDate(date);
                                  field.onChange(date);
                                }}
                                className="form-control floating datetimepicker"
                                type="date"
                                dateFormat="dd-MM-yyyy"
                              />
                            )}
                          />
                          <label className="focus-label">Complete Date</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3 mb-3 form-focus focused">
                          <Controller
                            control={educationControl}
                            name="degree"
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className="form-control floating"
                              />
                            )}
                          />
                          <label className="focus-label">Degree</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3 mb-3 form-focus focused">
                          <Controller
                            control={educationControl}
                            name="grade"
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className="form-control floating"
                              />
                            )}
                          />
                          <label className="focus-label">Grade</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Education Modal */}

      {/* Experience Modal */}
      <div
        id="experience_info"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Experience Information</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleExperienceSubmit(submitExperience)}>
                <div className="row">
                  {/* Company Name */}
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        {...registerExperience("company", {
                          required: "Company is required",
                        })}
                      />
                      {experienceErrors.company && (
                        <p className="text-danger">
                          {experienceErrors.company.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        {...registerExperience("location", {
                          required: "Location is required",
                        })}
                      />
                      {experienceErrors.location && (
                        <p className="text-danger">
                          {experienceErrors.location.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Job Position */}
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Job Position</label>
                      <input
                        type="text"
                        className="form-control"
                        {...registerExperience("jobPosition", {
                          required: "Job Position is required",
                        })}
                      />
                      {experienceErrors.jobPosition && (
                        <p className="text-danger">
                          {experienceErrors.jobPosition.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Period From</label>
                      <Controller
                        name="startDate"
                        control={experienceControl}
                        rules={{ required: "Start Date is required" }}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            className="form-control floating datetimepicker"
                            dateFormat="dd-MM-yyyy"
                          />
                        )}
                      />
                      {experienceErrors.startDate && (
                        <p className="text-danger">
                          {experienceErrors.startDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Period To</label>
                      <Controller
                        name="endDate"
                        control={experienceControl}
                        rules={{ required: "End Date is required" }}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            className="form-control floating datetimepicker"
                            dateFormat="dd-MM-yyyy"
                          />
                        )}
                      />
                      {experienceErrors.endDate && (
                        <p className="text-danger">
                          {experienceErrors.endDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Experience Modal */}

      {/* Family Info Modal */}
      <div
        id="family_info_modal"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Family Information</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitForm4(submitFamily)}>
                <div className="form-scroll">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">Family Member </h3>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="input-block mb-3">
                            <label className="col-form-label">
                              Name <span className="text-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              {...registerForm4("primaryName", {
                                required: "Name is required",
                              })}
                            />
                            {errorsForm4.primaryName && (
                              <span className="text-danger">
                                {errorsForm4.primaryName.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3">
                            <label className="col-form-label">
                              Relationship{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              {...registerForm4("primaryRelationship", {
                                required: "Relationship is required",
                              })}
                            />
                            {errorsForm4.primaryRelationship && (
                              <span className="text-danger">
                                {errorsForm4.primaryRelationship.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3">
                            <label className="col-form-label">
                              Date of Birth{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="date"
                              {...registerForm4("dob", {
                                required: "Date of birth is required",
                              })}
                            />
                            {errorsForm4.dob && (
                              <span className="text-danger">
                                {errorsForm4.dob.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3">
                            <label className="col-form-label">
                              Phone <span className="text-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="tel"
                              {...registerForm4("primaryPhone", {
                                required: "Phone is required",
                              })}
                            />
                            {errorsForm4.primaryPhone && (
                              <span className="text-danger">
                                {errorsForm4.primaryPhone.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* /Family Info Modal */}
      <div
        id="bank_info_modal"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Bank Information</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitForm3(submit3)}>
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Bank Details</h3>
                    <div className="row">
                      {/* Bank Name */}
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label htmlFor="bankName" className="col-form-label">
                            Bank Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="bankName"
                            {...registerForm3("bankName", {
                              required: "This field is required",
                            })}
                          />
                          {errorsForm3.bankName && (
                            <p className="text-danger">
                              {errorsForm3.bankName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bank Account Number */}
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label
                            htmlFor="accountNumber"
                            className="col-form-label"
                          >
                            Account Number{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="accountNumber"
                            {...registerForm3("accountNumber", {
                              required: "Account number is required",
                              pattern: {
                                value: /^[0-9]{9,18}$/,
                                message:
                                  "Account number must be 9 to 18 digits",
                              },
                            })}
                          />
                          {errorsForm3.accountNumber && (
                            <p className="text-danger">
                              {errorsForm3.accountNumber.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* IFSC Code */}
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label htmlFor="ifscCode" className="col-form-label">
                            IFSC Code <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="ifscCode"
                            {...registerForm3("ifscCode", {
                              required: "IFSC code is required",
                              pattern: {
                                value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                message:
                                  "Invalid IFSC code (e.g., SBIN0001234)",
                              },
                            })}
                          />
                          {errorsForm3.ifscCode && (
                            <p className="text-danger">
                              {errorsForm3.ifscCode.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* PAN Number */}
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label htmlFor="panNumber" className="col-form-label">
                            PAN Number <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="panNumber"
                            {...registerForm3("panNumber", {
                              required: "PAN number is required",
                              pattern: {
                                value: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
                                message:
                                  "Invalid PAN number (e.g., ABCDE1234F)",
                              },
                            })}
                          />
                          {errorsForm3.panNumber && (
                            <p className="text-danger">
                              {errorsForm3.panNumber.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalInformationModelPopup;
