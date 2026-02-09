import React, { useState } from "react";
import Breadcrumbs from "../../../../components/Breadcrumbs";

const ToxboxSetting = () => {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [errors, setErrors] = useState({});
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [message, setMessage] = useState("");

  const validateFields = () => {
    const newErrors = {};
    if (!apiKey.trim()) {
      newErrors.apiKey = "API Key is required.";
    } else if (apiKey.length < 10 || apiKey.length > 64) {
      newErrors.apiKey = "API Key must be between 10 and 64 characters.";
    }

    if (!apiSecret.trim()) {
      newErrors.apiSecret = "API Secret is required.";
    } else if (apiSecret.length < 10 || apiSecret.length > 64) {
      newErrors.apiSecret = "API Secret must be between 10 and 64 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    // Simulate save
    setMessage("✅ ToxBox settings saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleReset = () => {
    setApiKey("");
    setApiSecret("");
    setErrors({});
    setMessage("");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setMessage("Copied to clipboard!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-6 offset-md-3 box-align">
            {/* Page Header */}
            <Breadcrumbs maintitle="ToxBox Settings" />
            {/* /Page Header */}

            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSave}>
              {/* ApiKey Field */}
              <div className="input-block mb-3 position-relative">
                <label className="col-form-label">
                  ApiKey <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type={showApiKey ? "text" : "password"}
                    className="form-control"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    maxLength={64}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowApiKey((prev) => !prev)}
                    title={showApiKey ? "Hide" : "Show"}
                  >
                    <i className={`fa ${showApiKey ? "fa-eye-slash" : "fa-eye"}`} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleCopy(apiKey)}
                    title="Copy API Key"
                  >
                    <i className="fa fa-copy" />
                  </button>
                </div>
                <span className="text-danger">{errors.apiKey}</span>
              </div>

              {/* ApiSecret Field */}
              <div className="input-block mb-3 position-relative">
                <label className="col-form-label">
                  ApiSecret <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type={showApiSecret ? "text" : "password"}
                    className="form-control"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    maxLength={64}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowApiSecret((prev) => !prev)}
                    title={showApiSecret ? "Hide" : "Show"}
                  >
                    <i className={`fa ${showApiSecret ? "fa-eye-slash" : "fa-eye"}`} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleCopy(apiSecret)}
                    title="Copy API Secret"
                  >
                    <i className="fa fa-copy" />
                  </button>
                </div>
                <span className="text-danger">{errors.apiSecret}</span>
              </div>

              {/* Security Note */}
              <div className="form-text text-muted mb-3">
                🔒 Your API credentials are encrypted and securely stored.
              </div>

              {/* Buttons */}
              <div className="submit-section d-flex gap-2">
                <button type="submit" className="btn btn-primary submit-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToxboxSetting;
