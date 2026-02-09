import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { customAlert } from "../../../utils/Alert";
import {
  addCategory,
  editCategory,
  getCategories,
} from "../../../Redux/services/Category";

const EditCategory = () => {
  const dispatch = useDispatch();
  const { editObject } = useSelector((state) => state?.category);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Update form values when editObject changes
  useEffect(() => {
    if (editObject) {
      reset({
        name: editObject?.name || "",
        is_active: editObject?.is_active ? "true" : "false",
      });
    }
  }, [editObject, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    formData.append("id", editObject?.id);

    try {
      const response = await dispatch(editCategory(formData));
      console.log("Response: ", response);

      if (response?.payload?.status) {
        await dispatch(getCategories());

        const closeButton = document.querySelector("#edit_category .btn-close");
        if (closeButton) {
          closeButton.click();
          reset();
        }

        customAlert(response?.payload?.message, "success");
      } else {
        customAlert(response?.payload?.message, "failed");
        console.error("Failed to edit category:", response?.payload?.message);
      }
    } catch (error) {
      console.error("Error during category edit:", error);
    }
  };

  return (
    <div id="edit_category" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Category</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                {/* Category Name */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Name</label>
                    <input
                      className="form-control"
                      type="text"
                      {...register("name", { required: "Category name is required" })}
                      placeholder="Enter category name"
                    />
                    {errors.name && <small className="text-danger">{errors.name.message}</small>}
                  </div>
                </div>
                {/* Is Active Status */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Is Active</label>
                    <select
                      className="form-control"
                      {...register("is_active", { required: "Is Active status is required" })}
                    >
                      <option value="">Select Status</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                    {errors.is_active && <small className="text-danger">{errors.is_active.message}</small>}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-success">
                Edit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
