import React, { useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../../../../components/modelpopup/DeleteModal";
import RolesPermissionsModal from "../../../../components/modelpopup/RolesPermissionsModal";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { toast } from "react-toastify";

const RolesPermissions = () => {
  const [moduleAccess, setModuleAccess] = useState({
    staff_module: false,
    holidays_module: true,
    leave_module: true,
    events_module: true,
    chat_module: false,
    job_module: false,
  });

  const [roles, setRoles] = useState([
    "Administrator",
    "CEO",
    "Manager",
    "Team Leader",
    "Accountant",
    "Web Developer",
    "Web Designer",
    "HR",
    "UI/UX Developer",
    "SEO Analyst",
  ]);

  const tableData = [
    {
      category: "Employee",
      items: [true, true, true, true, true, true],
    },
    {
      category: "Holidays",
      items: [true, false, false, true, false, true],
    },
    {
      category: "Leaves",
      items: [false, false, true, false, false, false],
    },
    {
      category: "Events",
      items: [true, true, true, true, false, true],
    },
  ];

  const handleModuleToggle = (id) => {
    setModuleAccess((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      toast.success(`Permission updated for ${id.replace("_module", "")}`);
      return updated;
    });
  };

  const handleSave = () => {
    toast.success("All permissions saved successfully.");
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs maintitle="Roles & Permissions" />

        <div className="row">
          {/* Left Side Role List with Scroll */}
          <div className="col-sm-4 col-md-4 col-lg-4 col-xl-3">
            <Link
              to="#"
              className="btn btn-primary btn-block w-100"
              data-bs-toggle="modal"
              data-bs-target="#add_role"
            >
              <i className="fa fa-plus" /> Add Roles
            </Link>
            <div
              className="roles-menu mt-3"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <ul>
                {roles.map((role, index) => (
                  <li key={index} className={index === 0 ? "active" : ""}>
                    <Link to="#">
                      {role}
                      <span className="role-action">
                        <span
                          className="action-circle large me-1"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_role"
                        >
                          <i className="material-icons">edit</i>
                        </span>
                        <span
                          className="action-circle large delete-btn"
                          data-bs-toggle="modal"
                          data-bs-target="#delete"
                        >
                          <i className="material-icons">delete</i>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side Permissions Table */}
          <div className="col-sm-8 col-md-8 col-lg-8 col-xl-9">
            <h6 className="card-title mb-3">Module Access</h6>
            <ul className="list-group notification-list mb-4">
              {Object.keys(moduleAccess).map((key) => (
                <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{key.replace("_module", "").replace("_", " ").toUpperCase()}</span>
                  <div className="status-toggle">
                    <input
                      type="checkbox"
                      id={key}
                      className="check"
                      checked={moduleAccess[key]}
                      onChange={() => handleModuleToggle(key)}
                    />
                    <label htmlFor={key} className="checktoggle">checkbox</label>
                  </div>
                </li>
              ))}
            </ul>

            <div className="table-responsive">
              <table className="table table-striped custom-table">
                <thead>
                  <tr>
                    <th>Module Permission</th>
                    <th className="text-center" title="Allows viewing content">Read</th>
                    <th className="text-center" title="Allows editing content">Write</th>
                    <th className="text-center" title="Allows creating new entries">Create</th>
                    <th className="text-center" title="Allows deleting entries">Delete</th>
                    <th className="text-center" title="Allows importing data">Import</th>
                    <th className="text-center" title="Allows exporting data">Export</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((categoryData, index) => {
                    const moduleKey = `${categoryData.category.toLowerCase()}_module`;
                    const isModuleEnabled = moduleAccess[moduleKey] ?? true;
                    return (
                      <tr key={index}>
                        <td>{categoryData.category}</td>
                        {categoryData.items.map((checked, i) => (
                          <td key={i} className="text-center">
                            <label className="custom_check" title="Permission checkbox">
                              <input
                                type="checkbox"
                                defaultChecked={checked}
                                disabled={!isModuleEnabled}
                              />
                              <span className="checkmark" />
                            </label>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="text-end mt-4">
              <button className="btn btn-primary submit-btn" type="submit" onClick={handleSave}>
                  Save
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RolesPermissionsModal />
      <DeleteModal Name="Role" />
    </div>
  );
};

export default RolesPermissions;
