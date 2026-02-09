/** @format */

import React, { useState, useEffect } from "react";
import Select from "react-select";
import { HTTPURL } from "../../Constent/Matcher";
import axios from "axios";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { customAlert } from "../../utils/Alert";
const AddandEditPolicy = ({ editingData, onClose, fetchPolicies }) => {
  const [policyId, setPolicyId] = useState(null);
  const [policyName, setPolicyName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState(null);
  const [file, setFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [status, setStatus] = useState({ value: "active", label: "Active" });
  // 🔹 Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${HTTPURL}all-departments`);
        const deptOptions = res?.data?.data?.departments?.map((dept) => ({
          value: dept.id,
          label: dept.name,
        }));
        setDepartments(deptOptions);
      } catch (err) {
        console.error(
          "Error fetching departments:",
          err.response?.data || err.message
        );
      }
    };
    fetchDepartments();
  }, []);

  // 🔹 Prefill form when editingData changes
  useEffect(() => {
    if (editingData) {
      setPolicyId(editingData.id);
      setPolicyName(editingData.policy_name || "");
      setDescription(editingData.description || "");
      setDepartment(
        editingData.department_name
          ? {
              value: editingData.department_id,
              label: editingData.department_name || "",
            }
          : null
      );
      setStatus(
        editingData.status
          ? { value: editingData.status, label: editingData.status }
          : { value: "active", label: "Active" }
      );
      setFile(null);
    } else {
      // reset form when adding new
      setPolicyId(null);
      setPolicyName("");
      setDescription("");
      setDepartment(null);
      setStatus({ value: "active", label: "Active" });
      setFile(null);
    }
  }, [editingData]);

  // 🔹 Reset form on modal close
  useEffect(() => {
    const modalElement = document.getElementById(
      policyId ? "edit_policy" : "add_policy"
    );

    const handleModalClose = () => {
      setPolicyId(null);
      setPolicyName("");
      setDescription("");
      setDepartment(null);
      setStatus({ value: "active", label: "Active" });
      setFile(null);
      if (onClose) onClose();
    };

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalClose);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
      }
    };
  }, [policyId, onClose]);

  // 🔹 Submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("policy_name", policyName);
      formData.append("description", description);
      formData.append("department_name", department?.label || "");
      formData.append("status", status?.value || "active");
      if (file) formData.append("file", file);
      let response;
      if (policyId) {
        response = await axios.put(`${HTTPURL}policies/${policyId}`, formData);
      } else {
        response = await axios.post(`${HTTPURL}policies`, formData);
      }
      if (response.data?.success) {
        customAlert(response.data.message, "success");
      } else {
        customAlert(response.data.message || "Something went wrong", "error");
      }

      fetchPolicies();

      // ✅ close modal programmatically
      document.getElementById("closeAdd")?.click();

      if (onClose) onClose();
    } catch (err) {
      alert("❌ Duplicate Policies");
      console.error("Error saving policy:", err);
    }
  };

  // 🔹 Dropdown style
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
    }),
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div
      id={policyId ? "edit_policy" : "add_policy"}
      className="modal custom-modal fade"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {policyId ? "Edit Policy" : "Add Policy"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeAdd"
                onClick={onClose}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="col-form-label">
                  Policy Name <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  placeholder="Enter Policy Name"
                  type="text"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="col-form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  placeholder="Enter Description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="col-form-label">Department</label>
                <Select
                  placeholder="Select Department"
                  options={departments}
                  value={department}
                  onChange={setDepartment}
                  className="select"
                  styles={customStyles}
                />
              </div>

              {/* 🔹 New Status Dropdown */}
              <div className="mb-3">
                <label className="col-form-label">Status</label>
                <Select
                  placeholder="Select Status"
                  options={statusOptions}
                  value={status}
                  onChange={setStatus}
                  className="select"
                  styles={customStyles}
                />
              </div>

              <div className="mb-3">
                <label className="col-form-label">
                  Upload Policy{" "}
                  {policyId ? "" : <span className="text-danger">*</span>}
                </label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                  required={!policyId}
                />
                {policyId && editingData?.file_path && (
                  <p className="mt-2">
                    Current File:{" "}
                    <a
                      href={`${HTTPURL}${editingData.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary submit-btn" type="submit">
                {policyId ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddandEditPolicy;
