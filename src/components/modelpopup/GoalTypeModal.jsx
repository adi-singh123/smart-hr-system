/** @format */

import React, { useEffect, useState } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Ensure Bootstrap JS is available
import {
  addGoalType,
  updateGoalType,
} from "../../Redux/services/GoalTypeService";
const GoalTypeModal = ({ editingData, onClose, fetchGoalTypes }) => {
  const [goalType, setGoalType] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (editingData) {
      setGoalType(editingData.goal_type || "");
      setDescription(editingData.description || "");
      setStatus(editingData.status || "Active");
    } else {
      resetForm();
    }
  }, [editingData]);

  useEffect(() => {
    const modalEl = document.getElementById("goal_type_modal");
    if (!modalEl) return;

    const handleHidden = () => {
      resetForm(); // form reset ho jayega
      onClose(); // parent me editingData null ho jayega
    };

    modalEl.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalEl.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, [onClose]);

  const resetForm = () => {
    setGoalType("");
    setDescription("");
    setStatus("Active");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      goal_type: goalType,
      description,
      status: status.toLowerCase(),
    };

    if (!payload.goal_type || !payload.status) {
      alert("Please fill required fields.");
      return;
    }

    try {
      if (editingData?.id) {
        await updateGoalType(editingData.id, payload); // ✅ Using service
      } else {
        await addGoalType(payload); // ✅ Using service
      }

      await fetchGoalTypes(); // Refresh table
      resetForm();
      onClose();

      // Close Bootstrap modal
      const modalEl = document.getElementById("goal_type_modal");
      if (window.bootstrap && window.bootstrap.Modal) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
        modalInstance?.hide();
      } else {
        document.querySelector("#goal_type_modal .btn-close")?.click();
      }
    } catch (err) {
      console.error("Error submitting goal type:", err);
      alert("Failed to submit goal type.");
    }
  };

  return (
    <div id="goal_type_modal" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingData ? "Edit Goal Type" : "Add Goal Type"}
            </h5>
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
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Goal Type</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Revenue Goal"
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Description</label>
                <textarea
                  className="form-control"
                  placeholder="Add description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group mb-3">
                <label>Status</label>
                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="submit-section text-end">
                <button type="submit" className="btn btn-primary submit-btn">
                  {editingData ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalTypeModal;
