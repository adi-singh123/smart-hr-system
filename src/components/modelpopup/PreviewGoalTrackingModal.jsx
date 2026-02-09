/** @format */

// File: components/modelpopup/PreviewGoalTrackingModal.jsx
import React from "react";

const PreviewGoalTrackingModal = ({ data }) => {
  return (
    <div
      id="preview_goal_tracking"
      className="modal custom-modal fade"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Preview Goal Tracking</h5>
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
            {data ? (
              <div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Goal Type:</label>
                  <p>{data.goal_type_id || "—"}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Subject:</label>
                  <p>{data.subject || "—"}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Target Achievement:
                  </label>
                  <p>
                    {data.target_achievement
                      ? `${data.target_achievement}%`
                      : "—"}
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Start Date:</label>
                  <p>{data.start_date || "—"}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">End Date:</label>
                  <p>{data.end_date || "—"}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Description:</label>
                  <p>{data.description || "—"}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Status:</label>
                  <p>
                    <i
                      className={`far fa-dot-circle ${
                        data.status === "Inactive"
                          ? "text-danger"
                          : "text-success"
                      }`}
                    />{" "}
                    {data.status}
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

export default PreviewGoalTrackingModal;
