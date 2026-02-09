// TrainingViewModal.jsx
import React from "react";

const TrainingViewModal = ({ viewRecord }) => {
  return (
    <div
      className="modal fade"
      id="view_training"
      tabIndex="-1"
      aria-labelledby="viewTrainingLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="viewTrainingLabel">
              Training Details
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {viewRecord ? (
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-4 fw-bold">Training Type:</div>
                  <div className="col-sm-8">{viewRecord.traning_type_id || "—"}</div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-4 fw-bold">Trainer:</div>
                  <div className="col-sm-8">{viewRecord.trainer_id || "—"}</div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-4 fw-bold">Employee:</div>
                  <div className="col-sm-8">{viewRecord.employees_id || "—"}</div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-4 fw-bold">Training Period:</div>
                  <div className="col-sm-8">
                    {viewRecord.start_date} - {viewRecord.end_date}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-4 fw-bold">Description:</div>
                  <div className="col-sm-8">{viewRecord.description || "—"}</div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-4 fw-bold">Cost:</div>
                  <div className="col-sm-8">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(viewRecord.training_cost || 0)}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-4 fw-bold">Status:</div>
                  <div className="col-sm-8">
                    <span
                      className={`badge ${
                        viewRecord.status === "Active" ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {viewRecord.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p>No data available</p>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
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

export default TrainingViewModal;
