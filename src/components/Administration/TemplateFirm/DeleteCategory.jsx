import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { customAlert } from "../../../utils/Alert";
import {
  deleteCategory,
  getCategories,
  getChildSubCategories,
  getSubCategories,
} from "../../../Redux/services/Category";

const DeleteCategory = ({ name, id }) => {
  const dispatch = useDispatch();
  const {
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    const formData = new FormData();

    formData.append("id", id);
    formData.append("category", name);

    try {
      const response = await dispatch(deleteCategory(formData));
      console.log("Response: ", response);

      // Check if the response is successful
      if (response?.payload?.status) {

        await dispatch(getCategories());
        await dispatch(getSubCategories());
        await dispatch(getChildSubCategories());

        const closeButton = document.querySelector(
          "#delete_category .btn-close"
        );
        if (closeButton) {
          closeButton.click();
          reset();
        }

        customAlert(response?.payload?.message, "success");
      } else {
        customAlert(response?.payload?.message, "failed");
        console.error("Failed to add categgory:", response?.payload?.message);
      }
    } catch (error) {
      console.error("Error during add category:", error);
    }
  };
  return (
    <div id="delete_category" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete {name}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this {name} ?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => onSubmit()}
            >
              Delete
            </button>
            <button
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
              className="btn btn-danger"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategory;
