/** @format */

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  getImages,
  updateImage,
  deleteImage,
} from "../../../Redux/services/Image";
import { customAlert } from "../../../utils/Alert";

export const EditImage = () => {
  const dispatch = useDispatch();
  const { editImage } = useSelector((state) => state.image);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editImage) {
      setValue("title", editImage.title || "");
      setValue("description", editImage.description || "");

      const statusValue =
        editImage.is_active === "Yes" || editImage.is_active === true
          ? "true"
          : "false";
      setValue("is_active", statusValue);
    }
  }, [editImage, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }
    formData.append("id", editImage.id);
    formData.append("category", "homePage");

    try {
      const response = await dispatch(updateImage(formData));

      if (response?.payload?.status) {
        await dispatch(getImages());

        // Close the modal properly
        const closeButton = document.querySelector("#edit_image .btn-close");
        if (closeButton) {
          closeButton.click();
          reset();
        }

        customAlert(response?.payload?.message, "success");
      } else {
        customAlert(response?.payload?.message, "failed");
      }
    } catch (error) {
      console.error("Error while updating image: ", error);
    }
  };

  return (
    <div id="edit_image" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Image</h5>
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
                    <label className="col-form-label">
                      Image (No need to reupload if you don't want to change)
                    </label>

                    {/* Existing image preview */}
                    {editImage?.imageUrl && (
                      <div style={{ marginBottom: "8px" }}>
                        <img
                          src={editImage.imageUrl}
                          alt={editImage.title}
                          style={{
                            width: "120px", // chhoti image
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                          }}
                        />
                      </div>
                    )}

                    {/* File input */}
                    <input
                      className="form-control"
                      type="file"
                      {...register("image")}
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
                Edit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DeleteImageModal = ({ id }) => {
  const dispatch = useDispatch();

  const onSubmit = async () => {
    if (!id) {
      customAlert("No image selected for deletion", "failed");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("category", "homePage");

    try {
      const response = await dispatch(deleteImage(id));

      if (response?.payload?.status) {
        await dispatch(getImages());
        const closeButton = document.querySelector("#delete_image .btn-close");
        if (closeButton) closeButton.click();
        customAlert(response?.payload?.message, "success");
      } else {
        customAlert(response?.payload?.message, "failed");
      }
    } catch (error) {
      console.error("Error while deleting image:", error);
    }
  };

  return (
    <div id="delete_image" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Image</h5>
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
            <p>Are you sure you want to delete this image?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-success"
              onClick={onSubmit}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ViewImageModal = () => {
  const { editImage } = useSelector((state) => state.image);

  return (
    <div id="view_image" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">View Image</h5>
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
            {editImage ? (
              <div className="row">
                {/* Title */}
                <div className="col-sm-12 mb-3">
                  <strong>Title:</strong>
                  <p>{editImage.title || "-"}</p>
                </div>

                {/* Description */}
                <div className="col-sm-12 mb-3">
                  <strong>Description:</strong>
                  <p>{editImage.description || "-"}</p>
                </div>

                {/* Image Preview */}
                <div className="col-sm-12 mb-3">
                  <strong>Preview:</strong>
                  <div>
                    {editImage.imageUrl ? (
                      <div style={{ textAlign: "left" }}>
                        <img
                          src={editImage.imageUrl}
                          alt={editImage.title}
                          style={{
                            maxWidth: "400px",
                            maxHeight: "300px",
                            width: "100%",
                            height: "auto",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </div>
                    ) : (
                      <p>No Image Available</p>
                    )}
                  </div>
                </div>

                {/* Active Status */}
                <div className="col-sm-12 mb-3">
                  <strong>Is Active:</strong>
                  <p>{editImage.is_active ? "True" : "False"}</p>
                </div>
              </div>
            ) : (
              <p>No image selected for viewing</p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
