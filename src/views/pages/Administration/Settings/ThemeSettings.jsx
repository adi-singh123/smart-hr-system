import React, { useState } from "react";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Applogo } from "../../../../Routes/ImagePath";
import { toast } from "react-toastify";

const ThemeSettings = () => {
  const [websiteName, setWebsiteName] = useState("Dreamguy's Technologies");
  const [lightLogo, setLightLogo] = useState(null);
  const [favicon, setFavicon] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!websiteName.trim()) {
      newErrors.websiteName = "Website name is required";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix validation errors before saving.");
      return;
    }

    try {
      // Simulate API Save
      toast.success("Theme settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings.");
    }
  };

  return (
    <div className="page-wrapper">
      {/* Page Content */}
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2 box-align">
            <Breadcrumbs maintitle="Theme Settings" />
            <form onSubmit={handleSubmit} noValidate>
              {/* Website Name */}
              <div className="input-block row mb-3">
                <label className="col-lg-3 col-form-label">Website Name</label>
                <div className="col-lg-9">
                  <input
                    name="website_name"
                    className={`form-control ${errors.websiteName ? "is-invalid" : ""}`}
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                    type="text"
                  />
                  {errors.websiteName && (
                    <small className="text-danger">{errors.websiteName}</small>
                  )}
                </div>
              </div>

              {/* Light Logo */}
              <div className="input-block row mb-3">
                <label className="col-lg-3 col-form-label">Light Logo</label>
                <div className="col-lg-7">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setLightLogo(e.target.files[0])}
                  />
                  <span className="form-text text-muted">
                    Recommended image size is 40px x 40px
                  </span>
                </div>
                <div className="col-lg-2">
                  <div className="img-thumbnail float-end">
                    <img src={Applogo} alt="" width={40} height={40} />
                  </div>
                </div>
              </div>

              {/* Favicon */}
              <div className="input-block row mb-4">
                <label className="col-lg-3 col-form-label">Favicon</label>
                <div className="col-lg-7">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFavicon(e.target.files[0])}
                  />
                  <span className="form-text text-muted">
                    Recommended image size is 16px x 16px
                  </span>
                </div>
                <div className="col-lg-2">
                  <div className="settings-image img-thumbnail float-end">
                    <img
                      src={Applogo}
                      className="img-fluid"
                      width={16}
                      height={16}
                      alt="favicon preview"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="submit-section text-center">
                <button className="btn btn-primary submit-btn" type="submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default ThemeSettings;
