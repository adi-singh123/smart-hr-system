// components/modelpopup/TrainingTypePreviewModal.jsx
import React from "react";

const TrainingTypePreviewModal = ({ type }) => {
  if (!type) {
    return (
      <div
        id="preview_training_type"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Preview Training Type</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  lineHeight: "1",
                  color: "#000",
                }}
              ></button>
            </div>
            <div className="modal-body">
              <p>No training type selected.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { type: trainingType, description, status } = type;

  return (
    <div
      id="preview_training_type"
      className="modal custom-modal fade"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Preview Training Type</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{
                border: "none",
                background: "transparent",
                fontSize: "1.5rem",
                fontWeight: "bold",
                lineHeight: "1",
                color: "#000",
              }}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <strong>Type:</strong> {trainingType}
            </div>
            <div className="mb-2">
              <strong>Status:</strong>{" "}
              <span
                className={`badge ${
                  status?.toLowerCase() === "active"
                    ? "bg-success"
                    : "bg-danger"
                }`}
              >
                {status}
              </span>
            </div>
            <div>
              <strong>Description:</strong>
              <div>{description || "No description available"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingTypePreviewModal;
