import React, { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

const LeaveApproval = () => {
  const approverOptions = [
    { label: "Test Lead", value: "test_lead" },
    { label: "UI/UX Designer", value: "ui_ux" },
    { label: "Sox Analyst", value: "sox_analyst" },
  ];

  const [approvalType, setApprovalType] = useState("sim-approver");
  const [selectedApprover, setSelectedApprover] = useState(null);

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

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedApprover) {
      toast.error("Please select a leave approver.");
      return;
    }

    // Simulate backend save or localStorage
    toast.success("Leave approval settings saved.");
  };

  return (
    <div
      className="tab-pane"
      id="leave"
      role="tabpanel"
      aria-labelledby="profile-tab"
    >
      <form onSubmit={handleSave}>
        <div className="input-block mb-3 row">
          <label className="control-label col-form-label col-md-12">
            Default Leave Approval
          </label>
          <div className="col-md-12 approval-option">
            <label className="radio-inline me-4" title="Step-by-step approval in order">
              <input
                id="radio-seq-leave"
                className="me-2"
                value="seq-approver"
                checked={approvalType === "seq-approver"}
                onChange={() => setApprovalType("seq-approver")}
                type="radio"
                name="default_leave_approval"
              />
              Sequence Approval
              <sup>
                <span className="badge info-badge">
                  <i className="fa fa-info" aria-hidden="true" />
                </span>
              </sup>
            </label>
            <label className="radio-inline" title="All approvers receive at the same time">
              <input
                id="radio-sim-leave"
                className="me-2"
                value="sim-approver"
                checked={approvalType === "sim-approver"}
                onChange={() => setApprovalType("sim-approver")}
                type="radio"
                name="default_leave_approval"
              />
              Simultaneous Approval
              <sup>
                <span className="badge info-badge">
                  <i className="fa fa-info" aria-hidden="true" />
                </span>
              </sup>
            </label>
          </div>
        </div>

        <div className="input-block mb-3 row">
          <label className="control-label col-form-label col-sm-12">
            Leave Approver
          </label>
          <div className="col-sm-6">
            <Select
              options={approverOptions}
              value={selectedApprover}
              onChange={setSelectedApprover}
              placeholder="Select a leave approver"
              styles={customStyles}
            />
          </div>
        </div>

        <div className="m-t-30 row">
          <div className="col-md-12 submit-section">
            <button
              id="leave_approval_set_btn"
              type="submit"
              className="btn btn-primary submit-btn"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LeaveApproval;
