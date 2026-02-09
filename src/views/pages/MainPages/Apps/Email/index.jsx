// index.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import EmailContent from "./emailContent";

const Email = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const folder = queryParams.get("folder") || "inbox";

  const handleFolderChange = (newFolder) => {
    navigate(`/email?folder=${newFolder}`);
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title text-capitalize">{folder} Emails</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin-dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">{folder}</li>
              </ul>
            </div>
            <div className="col-auto float-end ms-auto">
              <Link to="/email/compose" className="btn add-btn">
                <i className="fa fa-plus" /> Compose
              </Link>
            </div>
          </div>
        </div>
        {/* /Page Header */}

        {/* Folder Filters */}
        <div className="mb-3 d-flex gap-3">
          {["inbox", "starred", "draft", "trash"].map((f) => (
            <button
              key={f}
              className={`btn btn-sm ${folder === f ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => handleFolderChange(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <EmailContent folder={folder} />
      </div>
    </div>
  );
};

export default Email;
