/** @format */

import React from "react";

const PreviewPromotionModal = ({ data }) => {
  return (
    <div
      id="preview_promotion"
      className="modal custom-modal fade"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Promotion Preview</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">X</span>
            </button>
          </div>
          <div className="modal-body">
            {data ? (
              <div>
                <p>
                  <strong>Employee:</strong> {data.name}
                </p>
                <p>
                  <strong>Role:</strong> {data.role}
                </p>
                <p>
                  <strong>Department:</strong> {data.department}
                </p>
                <p>
                  <strong>From Designation:</strong> {data.from_designation}
                </p>
                <p>
                  <strong>To Designation:</strong> {data.to_designation}
                </p>
                <p>
                  <strong>Promotion Date:</strong> {data.promotion_date}
                </p>
                <p>
                  <strong>Status:</strong> {data.status}
                </p>
              </div>
            ) : (
              <p className="text-muted">No data to preview.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPromotionModal;
