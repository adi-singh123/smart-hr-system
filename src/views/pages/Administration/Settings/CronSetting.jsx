import React, { useState } from "react";
import Breadcrumbs from "../../../../components/Breadcrumbs";

const CronSetting = () => {
  const [cronKey, setCronKey] = useState("");
  const [autoBackup, setAutoBackup] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cronKey.trim()) {
      setError("Cron Key is required.");
      return;
    }
    if (cronKey.length < 10 || cronKey.length > 50) {
      setError("Cron Key must be between 10 and 50 characters.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to save these changes?"
    );
    if (!confirmed) return;

    // Simulate success
    setError("");
    setMessage("✅ Settings updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-6 offset-md-3 box-align">
            {/* Page Header */}
            <Breadcrumbs maintitle="Cron Settings" />
            {/* /Page Header */}

            {message && (
              <div className="alert alert-success mt-2">{message}</div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Cron Key */}
              <div className="input-block mb-3">
                <label className="col-form-label d-flex align-items-center justify-content-between">
                  <span>
                    Cron Key <span className="text-danger">*</span>
                  </span>
                  <span
                    className="text-muted small"
                    title="Unique key to trigger Cron job"
                    style={{ cursor: "help" }}
                  >
                    <i className="fa fa-info-circle" />
                  </span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Min 10, Max 50 characters"
                  value={cronKey}
                  onChange={(e) => setCronKey(e.target.value)}
                  maxLength={50}
                />
                <span className="text-danger">{error}</span>
                <div className="form-text text-muted mt-1">
                  ⚠️ Keep your Cron Key secure. Do not share it with anyone.
                </div>
              </div>

              {/* Auto Backup */}
              <div className="input-block mb-4">
                <label className="col-form-label d-flex justify-content-between align-items-center">
                  <span>
                    Auto Backup Database <span className="text-danger">*</span>
                  </span>
                  <label className="switch mb-0">
                    <input
                      type="checkbox"
                      checked={autoBackup}
                      onChange={(e) => setAutoBackup(e.target.checked)}
                      name="auto_backup_db"
                    />
                    <span />
                  </label>
                </label>
              </div>

              {/* Save */}
              <div className="submit-section">
                <button className="btn btn-primary submit-btn" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CronSetting;
  