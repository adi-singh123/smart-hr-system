/** @format */

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { edit_employee_data } from "../../Redux/services/Employee";
import { getRoles } from "../../Redux/services/common";
import { get_all_active_departments } from "../../Redux/services/Department";
import { get_all_active_designation } from "../../Redux/services/Designation";
import { HTTPURL } from "../../Constent/Matcher";
import { fetchNotifications } from "../../Redux/services/Notifications";
const AllEmployeeEditPopup = ({ isOpen, setIsOpen, employee }) => {
  // console.log(employee);
  const closeButtonRef = useRef(null);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  // Selector data
  const ActiveDepartments = useSelector(
    (state) => state?.department?.ActiveDepartments
  );
  // console.log("ActiveDepartment", ActiveDepartments);
  const ActiveDesignation = useSelector(
    (state) => state?.designation?.ActiveDesignation
  );
  // console.log("design", ActiveDesignation);
  const RolesList = useSelector((state) => state?.common?.getRolesData);
  // console.log("role", RolesList);
  const getEditUserID = useSelector((state) => state?.common?.editUserId);
  const [files, setFiles] = useState([]);
  const selectedDepartmentId = watch("department_id");

  const currentDate = new Date();
  let minDate = new Date();
  minDate.setFullYear(currentDate.getFullYear() - 18);
  const maxDate = currentDate;

  // submit
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("first_name", data?.first_name);
    formData.append("last_name", data?.last_name);
    formData.append("phone", data?.phone);
    formData.append("email", data?.email);
    formData.append("user_name", data?.user_name);
    formData.append("password", data?.password);
    formData.append("date_of_birth", data?.date_of_birth);
    formData.append("designation_id", data?.designation_id);
    formData.append("department_id", data?.department_id);
    formData.append("is_active", data?.is_active);
    formData.append("role_id", data?.role_id);
    if (employee?.id) {
      formData.append("id", employee.id);
    }
    if (getEditUserID?.length > 0) {
      formData.append("user_table_id", getEditUserID);
    }

    if (files[0]) {
      formData.append("profile_pic", files[0]);
    }

    try {
      const response = await dispatch(edit_employee_data(formData));
      if (response?.payload?.status === true) {
        reset();
        setIsOpen(false); // close modal
        dispatch(fetchNotifications());
      }
    } catch (error) {
      console.error("Error during edit employee:", error);
    }
  };

  // fetch roles/departments/designations when open
  useEffect(() => {
    if (isOpen && getEditUserID?.length > 0) {
      dispatch(getRoles());
      dispatch(get_all_active_departments());
      dispatch(get_all_active_designation());
    }
  }, [isOpen, dispatch, getEditUserID]);

  // set employee values in form
  useEffect(() => {
    if (employee) {
      setValue("first_name", employee?.first_name);
      setValue("last_name", employee?.last_name);
      setValue("email", employee?.email);
      setValue("phone", employee?.phone);
      setValue("user_name", employee?.user_name);
      setValue("employee_id", employee?.employee_id);
      setValue("date_of_birth", employee?.date_of_birth);
      setValue("is_active", employee?.is_active === true ? "1" : "0");
      setValue("profile_pic", employee?.profile_pic);
      setValue("designation_id", employee?.designation_id);
      setValue("department_id", employee?.department_id);
      setValue("role_id", employee?.role?.id);
    }
  }, [employee, setValue]);

  return (
    <div
      id="edit_employee"
      className={`modal custom-modal fade ${isOpen ? "show d-block" : ""}`}
      role="dialog"
      style={{ background: isOpen ? "rgba(0,0,0,0.5)" : "transparent" }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Employee</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              ref={closeButtonRef}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                {/* First Name */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">First Name</label>
                    <input
                      className="form-control"
                      type="text"
                      {...register("first_name")}
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Last Name</label>
                    <input
                      className="form-control"
                      type="text"
                      {...register("last_name")}
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Username</label>
                    <input
                      className="form-control"
                      type="text"
                      {...register("user_name")}
                    />
                  </div>
                </div>
                {/*Password */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Password</label>
                    <input
                      className="form-control"
                      type="text"
                      {...register("password")}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      {...register("email")}
                    />
                  </div>
                </div>

                {/* Profile Pic */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Profile Pic</label>
                    <div className="d-flex align-items-center gap-2">
                      {employee?.profile_pic && !files[0] && (
                        <img
                          src={`${HTTPURL}${employee.profile_pic}`}
                          alt="Profile"
                          className="rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      {files[0] && (
                        <img
                          src={URL.createObjectURL(files[0])}
                          alt="Selected"
                          className="rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <input
                        type="file"
                        name="profile_pic"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setFiles(e.target.files)}
                      />
                    </div>
                  </div>
                </div>

                {/* DOB */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">DOB</label>
                    <input
                      className="form-control"
                      type="date"
                      {...register("date_of_birth")}
                      max={maxDate.toISOString().split("T")[0]}
                      min={minDate.toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Phone</label>
                    <input
                      className="form-control"
                      type="text"
                      {...register("phone")}
                    />
                  </div>
                </div>

                {/* Is Active */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Is Active</label>
                    <select
                      className="form-control form-select"
                      {...register("is_active")}
                    >
                      <option value="">Select</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </div>
                </div>

                {/* Department */}
                <div className="col-md-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Department</label>
                    <select
                      className="form-control form-select"
                      {...register("department_id")}
                    >
                      <option value="">Select</option>
                      {employee?.department_id &&
                        !ActiveDepartments.some(
                          (d) => d.id === employee.department_id
                        ) && (
                          <option value={employee.department_id} hidden>
                            {employee.department_name || "Current Department"}
                          </option>
                        )}
                      {ActiveDepartments?.map((ele) => (
                        <option key={ele?.id} value={ele?.id}>
                          {ele?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Designation */}
                <div className="col-md-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Designation</label>
                    <select
                      className="form-control form-select"
                      {...register("designation_id")}
                    >
                      <option value="">Select</option>
                      {employee?.designation_id &&
                        !ActiveDesignation.some(
                          (d) => d.id === employee.designation_id
                        ) && (
                          <option value={employee.designation_id} hidden>
                            {employee.designation_name || "Current Designation"}
                          </option>
                        )}
                      {ActiveDesignation?.map((ele) => (
                        <option key={ele?.id} value={ele?.id}>
                          {ele?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Role */}
                <div className="col-md-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Role</label>
                    <select
                      className="form-control form-select"
                      {...register("role_id")}
                    >
                      <option value="">Select</option>
                      {employee?.role?.id &&
                        !RolesList.some((r) => r.id === employee.role?.id) && (
                          <option value={employee.role.id} hidden>
                            {employee.role.name || "Current Role"}
                          </option>
                        )}
                      {RolesList?.map((role) => (
                        <option key={role?.id} value={role?.id}>
                          {role?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllEmployeeEditPopup;
