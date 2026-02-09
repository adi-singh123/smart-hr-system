/** @format */

import React from "react";
import { useDispatch } from "react-redux";
import { deleteHistorian } from "../../Redux/services/Historian.js";
import { get_historian_data } from "../../Redux/services/Historian.js";
import { getSubCategories } from "../../Redux/services/common";

const DeleteModal = ({ id, onClose }) => {
  const dispatch = useDispatch();

  const submit = async (id) => {
    try {
      const response = await dispatch(deleteHistorian(id)); // API call to delete

      console.log("Delete Response: ", response);
      if (response?.payload?.status === true) {
        await dispatch(get_historian_data()); // Refresh list after delete
        await dispatch(getSubCategories());

        const closeButton = document.querySelector(".modal .btn-close");
        if (closeButton) {
        }
        closeButton.click(); // Close modal after delete

        onClose(); // Ensure modal closes properly
      }
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

  return (
    <div
      className="modal custom-modal fade"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Historian</h5>
            <button
              type="button"
              className="btn-close btn-light"
              onClick={onClose}
            >
              <i className="fa fa-times"></i> {/* Visible cross icon */}
            </button>
          </div>
          <div className="modal-body text-center">
            <div className="form-header">
              <h3>Delete Confirmation</h3>
              <p className="mb-4">Are you sure you want to delete this item?</p>
              {/* Added margin-bottom (mb-4) to reduce gap */}
            </div>

            <div className="row d-flex justify-content-center mt-3">
              {/* Added mt-3 to reduce space */}
              <div className="col-6 col-md-4">
                <button
                  className="btn btn-danger continue-btn w-100"
                  onClick={() => submit(id)}
                >
                  Delete
                </button>
              </div>
              <div className="col-6 col-md-4">
                <button
                  className="btn btn-secondary cancel-btn w-100"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
