import React from "react";

const TrainerPreviewModal = ({ trainer = {} }) => {
  const {
    image = "https://via.placeholder.com/100",
    name = "John Doe",
    role = "Backend Trainer",
    email = "john.doe@company.com",
    mobile = "9876543001",
    status = "Active",
    description = "Expert in Node.js and backend systems",
  } = trainer;

  return (
    <div id="preview_trainer" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Preview Trainer</h5>
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
            <div className="row text-center mb-3">
              <div className="col-12">
                <img
                  src={image}
                  alt="Trainer"
                  className="rounded-circle mb-2"
                  width="100"
                  height="100"
                />
                <h4 className="mb-0">{name}</h4>
                <small className="text-muted">{role}</small>
              </div>
            </div>
            <div className="row text-start">
              <div className="col-sm-6">
                <p><strong>Email:</strong> {email}</p>
              </div>
              <div className="col-sm-6">
                <p><strong>Phone:</strong> {mobile}</p>
              </div>
              <div className="col-sm-6">
                <p><strong>Status:</strong> {status}</p>
              </div>
              <div className="col-sm-12">
                <p><strong>Description:</strong><br />{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerPreviewModal;
