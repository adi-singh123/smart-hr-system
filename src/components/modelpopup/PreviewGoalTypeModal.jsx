// File: components/modelpopup/PreviewGoalTypeModal.jsx
import React from "react";

const PreviewGoalTypeModal = ({ data }) => {
  return (
    <div id="preview_goal_type" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Preview Goal Type</h5>
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
                  <p>{data.goal_type || "—"}</p>
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
                        data.status === "Inactive" ? "text-danger" : "text-success"
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

export default PreviewGoalTypeModal;
