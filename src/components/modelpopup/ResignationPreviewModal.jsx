import React from "react";

const ResignationPreviewModal = ({ data }) => {
  return (
    <div id="view_resignation" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">View Resignation</h5>
            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <ul className="list-group">
              <li className="list-group-item">
                <strong>Resigning Employee:</strong> {data?.name || "John Doe"}
              </li>
              <li className="list-group-item">
                <strong>Department:</strong> {data?.department || "Web Development"}
              </li>
              <li className="list-group-item">
                <strong>Notice Date:</strong> {data?.noticedate || "09 Jan 2023"}
              </li>
              <li className="list-group-item">
                <strong>Resignation Date:</strong> {data?.resignationdate || "09 Jan 2023"}
              </li>
              <li className="list-group-item">
                <strong>Reason:</strong> {data?.reason || "Lorem ipsum dolor sit amet..."}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResignationPreviewModal;
