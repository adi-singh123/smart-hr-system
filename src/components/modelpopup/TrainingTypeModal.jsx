/** @format */

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { message } from "antd";
import * as bootstrap from "bootstrap"; // ✅ Fixes 'bootstrap is not defined'
import {
  addTrainingType,
  updateTrainingType,
} from "../../Redux/services/TrainingType"; // ✅ service calls

const TrainingTypeModal = ({ fetchData, editRecord, setEditRecord }) => {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  const selectOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff9b44",
      },
    }),
  };

  useEffect(() => {
    const resetForm = () => {
      setType("");
      setDescription("");
      setStatus("Active");
      setEditRecord(null);
    };

    if (editRecord) {
      setType(editRecord.type || "");
      setDescription(editRecord.description || "");
      setStatus(editRecord.status || "Active");
    } else {
      resetForm();
    }
  }, [editRecord, setEditRecord]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type || !description || !status) {
      message.error("Please fill all fields");
      return;
    }

    const payload = {
      type: type.trim(),
      description: description.trim(),
      status: typeof status === "string" ? status : status?.value,
    };

    try {
      if (editRecord?.id) {
        await updateTrainingType(editRecord.id, payload);
        message.success("Updated successfully");
      } else {
        await addTrainingType(payload);
        message.success("Added successfully");
      }

      fetchData();

      // ✅ Close modal using Bootstrap API
      const modalId = editRecord ? "edit_type" : "add_type";
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
      }

      // ✅ Extra cleanup
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("padding-right");
    } catch (err) {
      console.error(err);
      message.error("Operation failed");
    }
  };

  return (
    <>
      {/* Add Modal */}
      <div id="add_type" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Training Type</h5>
              <button
                type="button"
                className="btn btn-sm btn-danger"
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
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Type <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    placeholder="e.g., Leadership Training"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Add a description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">Status</label>
                  <Select
                    options={selectOptions}
                    styles={customStyles}
                    value={selectOptions.find((opt) => opt.value === status)}
                    onChange={(selected) => setStatus(selected.value)}
                    placeholder="Select status"
                  />
                </div>
                <div className="submit-section text-end">
                  <button type="submit" className="btn btn-primary submit-btn">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div id="edit_type" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Training Type</h5>
              <button
                type="button"
                className="btn btn-sm btn-danger"
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
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Type <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    placeholder="e.g., Technical Training"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Update description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">Status</label>
                  <Select
                    options={selectOptions}
                    styles={customStyles}
                    value={selectOptions.find((opt) => opt.value === status)}
                    onChange={(selected) => setStatus(selected.value)}
                    placeholder="Select status"
                  />
                </div>
                <div className="submit-section text-end">
                  <button type="submit" className="btn btn-primary submit-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainingTypeModal;
