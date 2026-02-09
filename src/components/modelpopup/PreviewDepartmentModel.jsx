// File: components/modelpopup/PreviewDepartmentModal.jsx
import React from "react";

const PreviewDepartmentModal = ({ data }) => {
  return (
    <div
      id="department_preview"
      className="modal custom-modal fade"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">Preview Department</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">X</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            {data ? (
              <div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Department Name:</label>
                  <p>{data.department || "—"}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Status:</label>
                  <p>
                    <i
                      className={`far fa-dot-circle ${
                        data.is_active === "true"
                          ? "text-success"
                          : "text-danger"
                      }`}
                    />{" "}
                    {data.is_active === "true" ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted">No data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewDepartmentModal;
