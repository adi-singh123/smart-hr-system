import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import {
  createAsset,
  updateAsset,
  fetchAssets,
} from "../../../Redux/services/Assets";
import { getAllUsers } from "../../../Redux/services/User";

const AddAssetPopup = ({ editingData = null, existingAssets = [] }) => {
  const dispatch = useDispatch();
  const [staffOptions, setStaffOptions] = useState([]);
  const [editingAssetId, setEditingAssetId] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // 🔹 Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await dispatch(getAllUsers()).unwrap();
      if (response?.status && response?.data?.users) {
        setStaffOptions(
          response.data.users.map((u) => ({
            value: u.id,
            label: `${u.first_name} ${u.last_name} (${u.employee_id || "N/A"})`,
            employee_id: u.id,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 🔹 Set editing data
  useEffect(() => {
    if (editingData) {
      setEditingAssetId(editingData.id);
      reset({
        asset_id: editingData.asset_id,
        name: editingData.name,
        assigned_date: editingData.assigned_date
          ? editingData.assigned_date.split("T")[0]
          : "",
        assignee: editingData.assigneeUser?.id || null,
        employee_id: editingData.employee_id || "",
      });
    } else {
      reset({
        asset_id: "",
        name: "",
        assigned_date: "",
        assignee: null,
        employee_id: "",
      });
      setEditingAssetId(null);
    }
  }, [editingData, reset]);

  // 🔹 Submit Handler with duplicate check
  const onSubmitAsset = async (data) => {
    const inputAssetId = data.asset_id.trim();
    const inputName = data.name.trim().toLowerCase();

    // Check for duplicates (excluding current asset)
    const duplicate = existingAssets.find(
      (asset) =>
        asset.id !== editingAssetId &&
        (asset.asset_id.trim() === inputAssetId ||
          asset.name.trim().toLowerCase() === inputName)
    );

    if (duplicate) {
      alert("Duplicate Asset ID or Name found. Please use unique values.");
      return;
    }

    const payload = {
      asset_id: inputAssetId,
      name: data.name.trim(),
      assigned_date: data.assigned_date,
      assignee: data.assignee || null, // ✅ string ID
      employee_id: data.employee_id || null,
    };

    try {
      let response;
      if (editingAssetId) {
        response = await dispatch(
          updateAsset({ id: editingAssetId, formData: payload })
        );
      } else {
        response = await dispatch(createAsset(payload));
      }

      if (response?.payload?.success) {
        reset();
        await dispatch(fetchAssets());
        // close modal programmatically
        const closeButton = document.querySelector("#add_asset .btn-close");
        if (closeButton) closeButton.click();
      } else {
        console.error("Failed to submit asset:", response?.payload?.message);
      }
    } catch (error) {
      console.error("Asset submission error:", error);
    }
  };

  return (
    <div id="add_asset" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-md" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingAssetId ? "Edit Asset" : "Add Asset"}
            </h5>
            <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
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
            <form onSubmit={handleSubmit(onSubmitAsset)}>
              <div className="row">
                {/* Asset ID */}
                <div className="col-md-6 mb-3">
                  <label>Asset ID</label>
                  <input
                  placeholder="Ex-Ad56"
                    type="text"
                    className="form-control"
                    {...register("asset_id", { required: "Asset ID is required" })}
                  />
                  {errors.asset_id && (
                    <p className="text-danger">{errors.asset_id.message}</p>
                  )}
                </div>

                {/* Name */}
                <div className="col-md-6 mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Assets Name"
                    className="form-control"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-danger">{errors.name.message}</p>
                  )}
                </div>

                {/* Assigned Date */}
                <div className="col-md-6 mb-3">
                  <label>Assigned Date</label>
                  <input
                    type="date"
                    className="form-control"
                    {...register("assigned_date", { required: "Assigned Date is required" })}
                  />
                  {errors.assigned_date && (
                    <p className="text-danger">{errors.assigned_date.message}</p>
                  )}
                </div>

                {/* Employee ID */}
                <div className="col-md-6 mb-3">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("employee_id")}
                    readOnly
                  />
                </div>

                {/* Assignee */}
                <div className="col-md-12 mb-3">
                  <label>Assignee</label>
                  <Controller
                    name="assignee"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={staffOptions}
                        isClearable
                        placeholder="Select User"
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption?.value || null); // string ID
                          setValue("employee_id", selectedOption?.employee_id || "");
                        }}
                        value={staffOptions.find(opt => opt.value === field.value) || null}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="submit-section text-end">
                <button className="btn btn-primary me-2" type="submit">
                  {editingAssetId ? "Update Asset" : "Save Asset"}
                </button>
                <button className="btn btn-secondary" type="button" data-bs-dismiss="modal">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAssetPopup;
