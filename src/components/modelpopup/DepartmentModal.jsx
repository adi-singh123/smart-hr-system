/** @format */

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Add_department,
  edit_department_data,
  get_department_data, // 🔹 list refresh
} from "../../Redux/services/Department";
import { setDepartmentEditID } from "../../Redux/features/Department";
import { fetchNotifications } from "../../Redux/services/Notifications"; // ✅ import

const DepartmentModal = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const getEditDepartMentID = useSelector(
    (state) => state?.department?.departmentEditId
  );
  const getEditDepartMentData = useSelector(
    (state) => state?.department?.EditDepartmentData
  );

  // 🔹 Reset modal on outside click or new Add
  useEffect(() => {
    const modalEl = document.getElementById("department_modal");
    const handleHide = () => {
      dispatch(setDepartmentEditID(null));
      reset();
    };
    if (modalEl) {
      modalEl.addEventListener("hidden.bs.modal", handleHide);
    }
    return () => {
      if (modalEl) modalEl.removeEventListener("hidden.bs.modal", handleHide);
    };
  }, [dispatch, reset]);

  // On form submit
  const onSubmit = async (data) => {
    const payload = {
      ...data,
      is_active: data.is_active === "1",
    };

    if (getEditDepartMentID) {
      // 🔹 UPDATE
      payload.department_id = getEditDepartMentID;
    }

    const response = await dispatch(Add_department(payload));

    if (response?.payload?.status) {
      reset();
      dispatch(setDepartmentEditID(null));

      // 🔹 Modal close
      document.getElementById("closeDeptModal")?.click();

      // 🔹 List refresh
      dispatch(get_department_data());

      // ✅ Fetch notifications after add/update
      dispatch(fetchNotifications());
    }
  };

  // Fetch data if editing
  useEffect(() => {
    if (getEditDepartMentID) {
      dispatch(edit_department_data(getEditDepartMentID));
    } else {
      reset({ name: "", is_active: "" });
    }
  }, [getEditDepartMentID, dispatch, reset]);

  // Populate form when edit data arrives
  useEffect(() => {
    if (getEditDepartMentData && getEditDepartMentID) {
      setValue("name", getEditDepartMentData?.name || "");
      setValue("is_active", getEditDepartMentData?.is_active ? "1" : "0");
    }
  }, [getEditDepartMentData, getEditDepartMentID, setValue]);

  return (
    <div
      id="department_modal"
      className="modal custom-modal fade"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {getEditDepartMentID ? "Edit Department" : "Add Department"}
            </h5>
            <button
              id="closeDeptModal"
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                dispatch(setDepartmentEditID(null));
                reset();
              }}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "1.5rem",
                fontWeight: "bold",
                lineHeight: "1",
                color: "#000",
              }}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Department Name <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  placeholder="Enter Department"
                  type="text"
                  {...register("name", {
                    required: "Department Name is required",
                  })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>

              <div className="input-block mb-3">
                <label className="col-form-label">Is Active</label>
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

              <div className="submit-section">
                <button className="btn btn-primary submit-btn" type="submit">
                  {getEditDepartMentID ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;
