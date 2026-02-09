/** @format */

// File: components/modelpopup/PreviewPoliciesModal.jsx
import React from "react";
import { HTTPURL } from "../../Constent/Matcher";
const PreviewPoliciesModal = ({ data }) => {
  return (
    <div id="preview_policy" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">Preview Policy</h5>
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
                  <label className="form-label fw-bold">Policy Name:</label>
                  <p>{data.policy_name || "—"}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Description:</label>
                  <p>{data.description || "—"}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Department:</label>
                  <p>{data.department_name || data.department || "—"}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">File:</label>
                  {data.file_path ? (
                    <a
                      href={`${HTTPURL.replace(
                        /\/$/,
                        ""
                      )}/${data.file_path.replace(/^\/+/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View File
                    </a>
                  ) : (
                    <p>—</p>
                  )}
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
                    {data.status || "—"}
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Created At:</label>
                  <p>{data.created_at || "—"}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Updated At:</label>
                  <p>{data.updated_at || "—"}</p>
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

export default PreviewPoliciesModal;
