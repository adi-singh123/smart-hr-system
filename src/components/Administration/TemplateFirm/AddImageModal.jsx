import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { addImages, getImages } from "../../../Redux/services/Image";
import { customAlert } from "../../../utils/Alert";

const AddImages = () => {
  const dispatch = useDispatch();
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

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    formData.append("category", "homePage");

    try {
      const response = await dispatch(addImages(formData));
      console.log("Response: ", response);

      if (response?.payload?.status) {
        await dispatch(getImages());

        const closeButton = document.querySelector("#add_image .btn-close");
        if (closeButton) {
          closeButton.click();
          reset();
        }

        customAlert(response?.payload?.message, "success");
      } else {
        customAlert(response?.payload?.message, "failed");
        console.error("Failed to add image:", response?.payload?.message);
      }
    } catch (error) {
      console.error("Error while adding image: ", error);
    }
  };

  return (
    <div id="add_image" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Image</h5>
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
                {/* Image Title */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Title</label>
                    <input
                      className="form-control"
                      type="text"
                      {...register("title", {
                        required: "Image Title is required",
                      })}
                      placeholder="Image Title"
                    />
                    {errors.title && (
                      <small className="text-danger">
                        {errors.title.message}
                      </small>
                    )}
                  </div>
                </div>
                {/* Image Description */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      {...register("description", {
                        required: "Image Description is required",
                      })}
                      placeholder="Image Description"
                    ></textarea>
                    {errors.description && (
                      <small className="text-danger">
                        {errors.description.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Image</label>
                    <input
                      className="form-control"
                      type="file"
                      {...register("image", {
                        required: "Image is required",
                      })}
                    />
                    {errors.image && (
                      <small className="text-danger">
                        {errors.image.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-sm-6">
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

export default AddImages;
