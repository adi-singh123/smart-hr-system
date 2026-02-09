/** @format */

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  getGoals,
  addGoal,
  updateGoal,
} from "../../Redux/services/GoalService"; // ✅ goal services
import { getGoalTypes } from "../../Redux/services/GoalTypeService"; // ✅ goal type service

const GoalTrackingModal = ({ editingData, onClose, fetchGoals }) => {
  const [subject, setSubject] = useState("");
  const [targetAchievement, setTargetAchievement] = useState("");
  const [description, setDescription] = useState("");
  const [goalTypeId, setGoalTypeId] = useState("");
  const [status, setStatus] = useState("Active");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [goalTypes, setGoalTypes] = useState([]); // ✅ store goal types

  // Load goal types from API
  const fetchGoalTypes = async () => {
    try {
      const data = await getGoalTypes(); // service returns array directly
      setGoalTypes(data);
    } catch (err) {
      console.error("Failed to fetch goal types:", err);
    }
  };

  useEffect(() => {
    fetchGoalTypes();
  }, []);

  useEffect(() => {
    if (editingData) {
      setSubject(editingData.subject || "");
      setTargetAchievement(editingData.target_achievement || "");
      setDescription(editingData.description || "");
      setStatus(editingData.status || "Active");
      setStartDate(
        editingData.start_date ? new Date(editingData.start_date) : null
      );
      setEndDate(editingData.end_date ? new Date(editingData.end_date) : null);

      // Name se id find karo
      const matchedType = goalTypes.find(
        (t) => t.goal_type === editingData.goal_type_id // kyunki name hi aa raha hai
      );
      setGoalTypeId(matchedType ? matchedType.id : "");
    } else {
      resetForm();
    }
  }, [editingData, goalTypes]);

  // GoalTrackingModal.jsx ke andar
  useEffect(() => {
    const modalEl = document.getElementById("goal_tracking_modal");
    if (!modalEl) return;

    // Modal close hone par ye function chalega
    const handleHidden = () => {
      resetForm(); // form ke saare fields reset ho jayenge
      onClose(); // parent me setEditingData(null) call hoga
    };

    modalEl.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalEl.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, [onClose]); // dependency me sirf onClose

  const resetForm = () => {
    setSubject("");
    setTargetAchievement("");
    setDescription("");
    setGoalTypeId("");
    setStatus("Active");
    setStartDate(null);
    setEndDate(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedType = goalTypes.find((t) => t.id === goalTypeId);
    const payload = {
      subject,
      target_achievement: targetAchievement,
      description,
      goal_type_id: selectedType ? selectedType.goal_type : "",
      status,
      start_date: startDate?.toISOString().split("T")[0],
      end_date: endDate?.toISOString().split("T")[0],
    };

    if (
      !payload.subject ||
      !payload.target_achievement ||
      !payload.description ||
      !payload.goal_type_id ||
      !payload.start_date ||
      !payload.end_date
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      if (editingData?.id) {
        await updateGoal(editingData.id, payload); // ✅ use service
      } else {
        await addGoal(payload); // ✅ use service
      }

      await fetchGoals();
      resetForm();
      onClose();

      // Close Bootstrap modal
      const modalEl = document.getElementById("goal_tracking_modal");
      if (window.bootstrap && window.bootstrap.Modal) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
        modalInstance?.hide();
      } else {
        document.querySelector("#goal_tracking_modal .btn-close")?.click();
      }
    } catch (err) {
      console.error("Error submitting goal:", err);
      alert("Failed to submit goal.");
    }
  };

  return (
    <div
      id="goal_tracking_modal"
      className="modal custom-modal fade"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingData ? "Edit Goal Tracking" : "Add Goal Tracking"}
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
                <select
                  className="form-control"
                  value={goalTypeId}
                  onChange={(e) => setGoalTypeId(e.target.value)}
                  required
                >
                  <option value="">Select Goal Type</option>
                  {goalTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.goal_type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-3">
                <label>Subject</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Increase Revenue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Target Achievement</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., 15% done"
                  value={targetAchievement}
                  onChange={(e) => setTargetAchievement(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select start date"
                />
              </div>

              <div className="form-group mb-3">
                <label>End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select end date"
                />
              </div>

              <div className="form-group mb-3">
                <label>Description</label>
                <textarea
                  className="form-control"
                  placeholder="Add description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
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

export default GoalTrackingModal;
