/** @format */
import React from "react";

const TerminationPreviewModal = ({ data, isOpen, setIsOpen }) => {
  if (!isOpen) return null; // ✅ only render modal if open

  return (
    <div
      className="modal show fade d-block"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Preview Termination</h5>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
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
            >
              &times;
            </button>
          </div>
          <div
            className="modal-body"
            style={{
              maxHeight: "70vh", // limit modal height
              overflowY: "auto", // scroll if content is too long
              wordBreak: "break-word", // wrap long words
            }}
          >
            {data ? (
              <>
                <p>
                  <strong>Employee:</strong> {data.terminated_employee || "—"}
                </p>
                <p>
                  <strong>Department:</strong> {data.department || "—"}
                </p>
                <p>
                  <strong>Termination Type:</strong>{" "}
                  {data.termination_type || "—"}
                </p>
                <p>
                  <strong>Termination Date:</strong>{" "}
                  {data.termination_date || "—"}
                </p>
                <p>
                  <strong>Notice Date:</strong> {data.notice_date || "—"}
                </p>
                <p>
                  <strong>Reason:</strong> {data.reason || "—"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      data.status === "Active" ? "text-success" : "text-danger"
                    }
                  >
                    {data.status || "—"}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-muted">No data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminationPreviewModal;
