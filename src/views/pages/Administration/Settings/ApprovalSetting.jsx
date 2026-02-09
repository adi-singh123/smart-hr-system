import React, { useState } from "react";
import Select from "react-select";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Link } from "react-router-dom";
import LeaveApproval from "./LeaveApproval";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const selectOptions = [
  { label: "CEO", value: "ceo" },
  { label: "Direct Manager", value: "direct_manager" },
  { label: "Development Manager", value: "dev_manager" },
  { label: "Finance", value: "finance" },
];

const ApprovalSetting = () => {
  const [approvers, setApprovers] = useState([null, null, null]);

  const handleChange = (selectedOption, index) => {
    const updated = [...approvers];
    updated[index] = selectedOption;
    setApprovers(updated);
  };

  const isDuplicate = () => {
    const values = approvers.map((a) => a?.value).filter(Boolean);
    return new Set(values).size !== values.length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selected = approvers.filter(Boolean);

    if (selected.length === 0) {
      toast.error("Please select at least one approver.");
      return;
    }

    if (isDuplicate()) {
      toast.error("Approvers must be unique.");
      return;
    }

    // Simulate saving
    toast.success("Approval settings saved successfully.");
    // Optionally send to backend here
  };

  const filteredOptions = (index) => {
    const selectedValues = approvers.map((a) => a?.value);
    return selectOptions.filter(
      (opt) => !selectedValues.includes(opt.value) || approvers[index]?.value === opt.value
    );
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs maintitle="Approval Settings" />

        <ul className="nav nav-tabs nav-tabs-bottom">
          <li className="nav-item">
            <Link className="nav-link active" data-bs-toggle="tab" to="#expenses">
              Expenses Approval
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" data-bs-toggle="tab" to="#leave">
              Leave Approval
            </Link>
          </li>
        </ul>

        <div className="tab-content">
          <div className="tab-pane active" id="expenses">
            <form onSubmit={handleSubmit}>
              <h4>Expense Approval Settings</h4>

              <div className="mb-3">
                <label className="form-label">Approval Type</label>
                <div>
                  <label className="me-3" title="Step-by-step approval in order">
                    <input type="radio" name="approval_type" defaultChecked /> Sequence
                  </label>
                  <label title="All approvers receive at the same time">
                    <input type="radio" name="approval_type" className="ms-3" /> Simultaneous
                  </label>
                </div>
              </div>

              {[0, 1, 2].map((index) => (
                <div className="row align-items-center mb-3" key={index}>
                  <div className="col-md-6">
                    <label>Approver {index + 1}</label>
                    <Select
                      options={filteredOptions(index)}
                      placeholder="Select an approver from the list"
                      value={approvers[index]}
                      onChange={(selected) => handleChange(selected, index)}
                    />
                  </div>
                </div>
              ))}

              <div className="submit-section">
                <button className="btn btn-primary" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <LeaveApproval />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ApprovalSetting;
