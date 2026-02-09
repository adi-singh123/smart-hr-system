/** @format */

import React, { useEffect, useState, useRef } from "react";
import { get_employee_data } from "../../Redux/services/Employee";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { get_all_active_departments } from "../../Redux/services/Department";
import { get_all_active_designation } from "../../Redux/services/Designation";
import { getRoles } from "../../Redux/services/common";
import {
  Add_employee,
  edit_employee_data,
} from "../../Redux/services/Employee";
import { fetchNotifications } from "../../Redux/services/Notifications"; // ✅ import
import { useDispatch, useSelector } from "react-redux";

const AllEmployeeAddPopup = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const modalRef = useRef(null);
  const ActiveDepartments = useSelector(
    (state) => state?.department?.ActiveDepartments
  );
  const ActiveDesignation = useSelector(
    (state) => state?.designation?.ActiveDesignation
  );
  const RolesList = useSelector((state) => state?.common?.getRolesData);
  const selectedDepartmentId = watch("department_id");


const today = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
);

const maxDate = today;
const minDate = new Date(1900, 0, 1);


  const [dob, setDob] = useState(null);
  const [files, setFiles] = useState([]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("first_name", data?.first_name);
    formData.append("last_name", data?.last_name);
    formData.append("phone", data?.phone);
    formData.append("password", data?.password);
    formData.append("email", data?.email);
    formData.append("user_name", data?.user_name);
    if (dob) {
  const year = dob.getFullYear();
  const month = String(dob.getMonth() + 1).padStart(2, "0");
  const day = String(dob.getDate()).padStart(2, "0");

  formData.append("date_of_birth", `${year}-${month}-${day}`);
}

    formData.append("designation_id", data?.designation_id);
    formData.append("department_id", data?.department_id);
    formData.append("is_active", data?.is_active);
    formData.append("role_id", data?.role_id);

    if (files && files.length > 0) {
      formData.append("profile_pic", files[0]);
    }

    try {
      // Determine whether to add or edit employee based on presence of ID
      let response;
      if (data?.id) {
        response = await dispatch(edit_employee_data(formData));
      } else {
        response = await dispatch(Add_employee(formData));
      }

      if (response?.payload?.status === true) {
        // ✅ Refresh employee list
        dispatch(get_employee_data());

        // ✅ Fetch notifications after add/edit
        dispatch(fetchNotifications());
        reset(); // ✅ reset form
        setDob(null);
        setFiles([]);
        // Close modal
        modalRef.current?.click();
      }
    } catch (error) {
      console.error("Error during add/edit employee:", error);
    }
  };

  useEffect(() => {
    dispatch(getRoles());
    dispatch(get_all_active_departments());
    if (selectedDepartmentId) {
      dispatch(get_all_active_designation(selectedDepartmentId));
    }
  }, [selectedDepartmentId]);

  useEffect(() => {
    const modalEl = document.getElementById("add_employee");

    const handleModalClose = () => {
      reset(); // reset all form fields
      setDob(null); // reset date
      setFiles([]); // clear uploaded files
    };

    if (modalEl) {
      modalEl.addEventListener("hidden.bs.modal", handleModalClose);
    }

    return () => {
      if (modalEl) {
        modalEl.removeEventListener("hidden.bs.modal", handleModalClose);
      }
    };
  }, [reset]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  return (
    <>
      <div id="add_employee" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Employee</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={modalRef}
              >
                <span aria-hidden="true">X</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  {/* First Name */}
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        placeholder="Enter First Name"
                        type="text"
                        {...register("first_name", {
                          required: "First name is required",
                        })}
                      />
                      {errors.first_name && (
                        <small className="text-danger">
                          {errors.first_name.message}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Last Name</label>
                      <input
                        className="form-control"
                        placeholder="Enter Last Name"
                        type="text"
                        {...register("last_name", {
                          required: "Last name is required",
                        })}
                      />
                      {errors.last_name && (
                        <small className="text-danger">
                          {errors.last_name.message}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Username */}
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Username <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        placeholder="Enter Username"
                        type="text"
                        {...register("user_name", {
                          required: "User name is required",
                        })}
                      />
                      {errors.user_name && (
                        <small className="text-danger">
                          {errors.user_name.message}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        placeholder="Enter Email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email address",
                          },
                        })}
                      />
                      {errors.email && (
                        <small className="text-danger">
                          {errors.email.message}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Password <span className="text-danger">*</span>
                      </label>

                      <input
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        placeholder="Enter strong password"
                        type="password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message:
                              "Password must be at least 8 characters long",
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message:
                              "Password must include uppercase, lowercase, number and special character",
                          },
                        })}
                      />

                      {errors.password && (
                        <small className="text-danger">
                          {errors.password.message}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        placeholder="Enter Confirm Password"
                        type="password"
                        {...register("confirm_password", {
                          required: "Confirm Password is required",
                          validate: (value) =>
                            value === watch("password") ||
                            "Passwords do not match",
                        })}
                        autoCapitalize="new-password"
                      />
                      {errors.confirm_password && (
                        <small className="text-danger">
                          {errors.confirm_password.message}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Profile Pic */}
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Profile Pic</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  {/* DOB */}
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        DOB <span className="text-danger">*</span>
                      </label>
                      <div className="cal-icon">
                    <DatePicker
  selected={dob}
  onChange={(date) => setDob(date)}
  className="form-control datetimepicker"
  placeholderText="Select DOB"
  dateFormat="dd-MM-yyyy"
  minDate={new Date(1900, 0, 1)}
  maxDate={new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  )}
  showMonthDropdown
  showYearDropdown
  scrollableYearDropdown
  yearDropdownItemNumber={120}
/>

                        {errors.date_of_birth && (
                          <small className="text-danger">
                            {errors.date_of_birth.message}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Phone<span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        placeholder="Enter Phone Number"
                        type="text"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^\d{10}$/,
                            message: "Phone number must be exactly 10 digits",
                          },
                        })}
                      />
                      {errors.phone && (
                        <small className="text-danger">
                          {errors.phone.message}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Is Active */}
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Is Active <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control form-select"
                        {...register("is_active", {
                          required: "Is Active is required",
                        })}
                      >
                        <option value="">Select Status</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                      {errors.is_active && (
                        <small className="text-danger">
                          {errors.is_active.message}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Department */}
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Department <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control form-select"
                        {...register("department_id", {
                          required: "Department is required",
                          onChange: (e) =>
                            setValue("department_id", e.target.value),
                        })}
                      >
                        <option value="">Select Department</option>
                        {ActiveDepartments?.map((ele) => (
                          <option key={ele.id} value={ele.id}>
                            {ele.name}
                          </option>
                        ))}
                      </select>
                      {errors.department_id && (
                        <small className="text-danger">
                          {errors.department_id.message}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Designation */}
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Designation <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control form-select"
                        {...register("designation_id", {
                          required: "Designation is required",
                        })}
                      >
                        <option value="">Select Designation</option>
                        {ActiveDesignation?.map((ele) => (
                          <option key={ele.id} value={ele.id}>
                            {ele.name}
                          </option>
                        ))}
                      </select>
                      {errors.designation_id && (
                        <small className="text-danger">
                          {errors.designation_id.message}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Role <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control form-select"
                        {...register("role_id", {
                          required: "Role is required",
                        })}
                      >
                        <option value="">Select Role</option>
                        {RolesList?.map((ele) => (
                          <option key={ele.id} value={ele.id}>
                            {ele.name}
                          </option>
                        ))}
                      </select>
                      {errors.role_id && (
                        <small className="text-danger">
                          {errors.role_id.message}
                        </small>
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
    </>
  );
};

export default AllEmployeeAddPopup;
