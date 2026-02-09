/** @format */

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { get_all_active_departments } from "../../Redux/services/Department";
import {
  Add_designation,
  get_designation_data,
} from "../../Redux/services/Designation";
import { customAlert } from "../../utils/Alert";
import { fetchNotifications } from "../../Redux/services/Notifications"; // ✅ import

export const AddDesingnationModelPopup = ({
  isEditing,
  isViewing = false,
  designationData,
  onClose,
}) => {
  const dispatch = useDispatch();
  const ActiveDepartments = useSelector(
    (state) => state?.department?.ActiveDepartments
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // 🔹 Load active departments
  useEffect(() => {
    dispatch(get_all_active_departments());
  }, [dispatch]);

  // 🔹 Reset modal on outside click
  useEffect(() => {
    const modalEl = document.getElementById("add_designation");
    const handleHide = () => {
      reset({ department_id: "", name: "", is_active: "1" });
      if (onClose) onClose();
    };
    if (modalEl) {
      modalEl.addEventListener("hidden.bs.modal", handleHide);
    }
    return () => {
      if (modalEl) modalEl.removeEventListener("hidden.bs.modal", handleHide);
    };
  }, [reset, onClose]);

  // 🔹 Prefill fields for edit/view
  useEffect(() => {
    if ((isEditing || isViewing) && designationData) {
      setValue("name", designationData.designation || "");
      setValue("department_id", designationData.department_id || "");
      setValue("is_active", designationData.is_active === "true" ? "1" : "0");
    } else {
      reset({ department_id: "", name: "", is_active: "1" });
    }
  }, [isEditing, isViewing, designationData, setValue, reset]);

  const onSubmit = async (data) => {
    if (isViewing) return;

    if (!data.name || data.name.trim().length < 2) {
      customAlert("Please enter a valid designation name");
      return;
    }
    if (!data.department_id) {
      customAlert("Please select a department");
      return;
    }

    const payload = { ...data };
    if (isEditing && designationData?.key) {
      payload.designation_id = designationData.key;
    }

    try {
      const res = await dispatch(Add_designation(payload));
      if (res?.payload?.status) {
        reset({ department_id: "", name: "", is_active: "1" });
        document.getElementById("closeAddDesignation")?.click();
        if (onClose) onClose();

        // 🔹 Refresh designation list
        dispatch(get_designation_data());

        // ✅ Fetch notifications after add/edit
        dispatch(fetchNotifications());
      } else {
        customAlert(res?.payload?.message || "Error");
      }
    } catch (err) {
      console.error(err);
      customAlert("Server error");
    }
  };

  const modalTitle = isViewing
    ? "View Designation"
    : isEditing
    ? "Edit Designation"
    : "Add Designation";

  return (
    <div
      id="add_designation"
      className="modal custom-modal fade"
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modalTitle}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="closeAddDesignation"
              onClick={() => {
                reset({ department_id: "", name: "", is_active: "1" });
                if (onClose) onClose();
              }}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Department */}
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Department <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control form-select"
                  {...register("department_id", {
                    required: "Department is required",
                  })}
                  disabled={isViewing}
                >
                  <option value="">-- Select Department --</option>
                  {ActiveDepartments?.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department_id && (
                  <small className="text-danger">
                    {errors.department_id.message}
                  </small>
                )}
              </div>

              {/* Designation Name */}
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Designation Name <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="e.g., Software Engineer"
                  {...register("name", {
                    required: "Designation Name is required",
                    minLength: { value: 2, message: "Minimum 2 chars" },
                  })}
                  disabled={isViewing}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>

              {/* Is Active */}
              <div className="input-block mb-3">
                <label className="col-form-label">Is Active</label>
                <select
                  className="form-control form-select"
                  {...register("is_active", { required: "Status required" })}
                  disabled={isViewing}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
                {errors.is_active && (
                  <small className="text-danger">
                    {errors.is_active.message}
                  </small>
                )}
              </div>

              {/* Submit */}
              {!isViewing && (
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    {isEditing ? "Update" : "Add"} Designation
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
