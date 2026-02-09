import React, { useState, useEffect } from "react";
import Select from "react-select";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { toast } from "react-toastify";

const Localization = () => {
  const [formState, setFormState] = useState({
    country: { label: "USA", value: "USA" },
    dateFormat: { label: "15 May 2023", value: "15 May 2023" },
    timezone: { label: "(UTC+05:30) Asia/Kolkata", value: "Asia/Kolkata" },
    language: { label: "English", value: "English" },
    currencyCode: { label: "USD", value: "USD" },
    currencySymbol: "$",
  });

  const [originalState, setOriginalState] = useState(formState);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    const changed = JSON.stringify(formState) !== JSON.stringify(originalState);
    setHasChanged(changed);
  }, [formState, originalState]);

  const handleSelectChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "currencySymbol" && value.length > 2) return;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      toast.success("Localization settings saved successfully!");
      setOriginalState(formState);
    } catch (error) {
      toast.error("Failed to save settings.");
    }
  };

  const selectCountry = [
    { label: "USA", value: "USA" },
    { label: "United Kingdom", value: "UK" },
    { label: "India", value: "India" },
  ];

  const selectDateFormats = [
    { label: "15/05/2023", value: "15/05/2023" },
    { label: "15.05.2023", value: "15.05.2023" },
    { label: "15-05-2023", value: "15-05-2023" },
    { label: "05/15/2023", value: "05/15/2023" },
    { label: "2023/05/15", value: "2023/05/15" },
    { label: "2023-05-15", value: "2023-05-15" },
    { label: "May 15 2023", value: "May 15 2023" },
    { label: "15 May 2023", value: "15 May 2023" },
  ];

  const selectTimezones = [
    { label: "(UTC-05:00) EST (New York)", value: "America/New_York" },
    { label: "(UTC+00:00) GMT (London)", value: "Europe/London" },
    { label: "(UTC+05:30) Asia/Kolkata", value: "Asia/Kolkata" },
    { label: "(UTC+08:00) Asia/Singapore", value: "Asia/Singapore" },
  ];

  const selectLanguages = [
    { label: "English", value: "English" },
    { label: "French", value: "French" },
    { label: "Spanish", value: "Spanish" },
  ];

  const selectCurrencies = [
    { label: "USD", value: "USD" },
    { label: "Pound", value: "GBP" },
    { label: "EURO", value: "EUR" },
    { label: "INR", value: "INR" },
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

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2 box-align">
            <Breadcrumbs maintitle="Basic Settings" />

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Default Country</label>
                    <Select
                      options={selectCountry}
                      value={formState.country}
                      onChange={(val) => handleSelectChange("country", val)}
                      styles={customStyles}
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Date Format</label>
                    <Select
                      options={selectDateFormats}
                      value={formState.dateFormat}
                      onChange={(val) => handleSelectChange("dateFormat", val)}
                      styles={customStyles}
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Timezone</label>
                    <Select
                      options={selectTimezones}
                      value={formState.timezone}
                      onChange={(val) => handleSelectChange("timezone", val)}
                      styles={customStyles}
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Default Language</label>
                    <Select
                      options={selectLanguages}
                      value={formState.language}
                      onChange={(val) => handleSelectChange("language", val)}
                      styles={customStyles}
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Currency Code</label>
                    <Select
                      options={selectCurrencies}
                      value={formState.currencyCode}
                      onChange={(val) => handleSelectChange("currencyCode", val)}
                      styles={customStyles}
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">
                      Currency Symbol{" "}
                      <span title="Enter one or two characters (e.g. $, ₹, €)">
                        <i className="fa fa-info-circle ms-1" />
                      </span>
                    </label>
                    <input
                      type="text"
                      name="currencySymbol"
                      maxLength={2}
                      placeholder="e.g. $"
                      className="form-control"
                      value={formState.currencySymbol}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="submit-section">
                    <button
                      type="submit"
                      className="btn btn-primary submit-btn"
                      disabled={!hasChanged}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Localization;
