import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addSubCategory,
  getCategories,
  getSubCategories,
} from "../../../Redux/services/Category";
import { customAlert } from "../../../utils/Alert";

const AddSubCategory = () => {
  const dispatch = useDispatch();
  const { CategoryList } = useSelector((state) => state.category);
  useEffect(() => {
    const fetchCategories = async () => {
      await dispatch(getCategories());
    };
    fetchCategories();
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    if (data.image?.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      const response = await dispatch(addSubCategory(formData));

      if (response?.payload?.status) {
        await dispatch(getSubCategories());

        const closeButton = document.querySelector(
          "#add_sub_category .btn-close"
        );
        if (closeButton) {
          closeButton.click();
          reset();
        }

        customAlert(response.payload.message, "success");
      } else {
        customAlert(response.payload.message, "failed");
        console.error("Failed to add category:", response.payload.message);
      }
    } catch (error) {
      console.error("Error during add category:", error);
    }
  };

  return (
    <div
      id="add_sub_category"
      className="modal custom-modal fade"
      role="dialog"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Sub Category</h5>
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
                {/* Category Name */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Name</label>
                    <input
                      className="form-control"
                      type="text"
                      {...register("name", {
                        required: "Category name is required",
                      })}
                      placeholder="Enter sub category name"
                    />
                    {errors.name && (
                      <small className="text-danger">
                        {errors.name.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* Is Active */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Is Active</label>
                    <select
                      className="form-control"
                      {...register("is_active", {
                        required: "Is Active status is required",
                      })}
                    >
                      <option value="">Select Status</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                    {errors.is_active && (
                      <small className="text-danger">
                        {errors.is_active.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Image</label>
                    <input
                      className="form-control"
                      type="file"
                      {...register("image", { required: "Image is required" })}
                    />
                    {errors.image && (
                      <small className="text-danger">
                        {errors.image.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* Category Selection */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Category</label>
                    <select
                      className="form-control"
                      {...register("category_id", {
                        required: "Category is required",
                      })}
                    >
                      <option value="">Select Category</option>
                      {CategoryList.filter((item) => item.is_active).map(
                        (item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        )
                      )}
                    </select>
                    {errors.category_id && (
                      <small className="text-danger">
                        {errors.category_id.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategory;
