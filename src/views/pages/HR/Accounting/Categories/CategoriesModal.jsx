import React, { useState } from "react";
import { customAlert } from "../../../../../utils/Alert";

const CategoriesModal = () => {
  // List of existing categories (Hardware, Material, Vehicle)
  const existingCategories = ["Hardware", "Material", "Vehicle"];

  const handleSubmit = (e, isEditMode = false) => {
    e.preventDefault();
    
    // Get the input value
    const input = e.target.closest('form').querySelector('input[type="text"]');
    const categoryName = input.value.trim();

    // Check if empty
    if (!categoryName) {
      alert("Category name cannot be empty!");
      return;
    }

    // Check if category already exists (case-insensitive)
    const isDuplicate = existingCategories.some(
      (cat) => cat.toLowerCase() === categoryName.toLowerCase()
    );

    if (isDuplicate) {
      customAlert("Category already exists!","error");
    } else {
      customAlert("Category added successfully!","success");
      input.value = ""; // Clear input
      
      // Close modal (if needed)
      const modalId = isEditMode ? "edit_categories" : "add_categories";
      const closeBtn = document.getElementById(modalId).querySelector('[data-bs-dismiss="modal"]');
      closeBtn.click();
    }
  };

  return (
    <>
      <div className="modal custom-modal fade" id="add_categories" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Categories</h5>
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
              <form onSubmit={(e) => handleSubmit(e, false)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Categories Name <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" type="text" placeholder="Eg. Hardware, Material, etc" />
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal custom-modal fade" id="edit_categories" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Categories</h5>
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
              <form onSubmit={(e) => handleSubmit(e, true)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Categories Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue="Hardware"
                  />
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesModal;