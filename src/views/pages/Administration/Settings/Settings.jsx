/** @format */

import React, { useState, useEffect } from "react";
import Select from "react-select";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import axios from "axios";
import { message } from "antd";
import { HTTPURL } from "../../../../Constent/Matcher.jsx";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Settings = () => {
  const [formData, setFormData] = useState({
    id: null, // to track update
    companyName: "",
    contactPerson: "",
    address: "",
    country: "",
    city: "",
    state: "",
    postalCode: "",
    email: "",
    phone: "",

    website: "",
  });

  const [errors, setErrors] = useState({});

  const selectCountries = [
    { label: "USA", value: "USA" },
    { label: "United Kingdom", value: "UK" },
  ];

  const selectStates = [
    { label: "California", value: "California" },
    { label: "Alaska", value: "Alaska" },
    { label: "Alabama", value: "Alabama" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
    }),
  };

  const token = useSelector((state) => state.auth?.token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // Sanitize numeric fields
  const sanitizeNumber = (value, maxLength = 15) =>
    value.replace(/\D/g, "").substring(0, maxLength);

  // ✅ Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim())
      newErrors.companyName = "Company Name is required.";
    if (!formData.contactPerson.trim())
      newErrors.contactPerson = "Contact Person is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal Code is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email.";
    }
    if (!String(formData.phone).trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{1,10}$/.test(String(formData.phone))) {
      newErrors.phone = "Phone should be max 10 digits.";
    }
    if (!formData.website.trim())
      newErrors.website = "Website URL is required.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";
    if (!formData.state.trim()) newErrors.state = "State is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // =====================
  // GET company settings on load
  // =====================
  const fetchCompanySettings = async () => {
    try {
      const res = await axios.get(`${HTTPURL}getCompany-Setting`, config);
      if (res.data?.data?.length > 0) {
        const data = res.data.data[0]; // assuming single company setting
        setFormData({
          id: data.id || null,
          companyName: data.company_name || "",
          contactPerson: data.contact_person || "",
          address: data.address || "",
          country: data.country || "",
          city: data.city || "",
          state: data.state_province || "",
          postalCode: data.postal_code || "",
          email: data.email || "",
          phone: data.phone ? String(data.phone) : "", // <- convert to string
          // <- convert to string

          website: data.website_url || "",
        });
      }
    } catch (err) {
      console.error(err.response?.data?.message || "Failed to fetch");
    }
  };

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  // =====================
  // Save or Update
  // =====================
  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors above.");
      return;
    }

    try {
      if (formData.id) {
        // Update
        await axios.put(
          `${HTTPURL}company-settings/${formData.id}`,
          {
            company_name: formData.companyName,
            contact_person: formData.contactPerson,
            address: formData.address,
            country: formData.country,
            city: formData.city,
            state_province: formData.state,
            postal_code: formData.postalCode,
            email: formData.email,
            phone: formData.phone,

            website_url: formData.website,
          },
          config
        );
        message.success("Company settings updated successfully");
      } else {
        // Create
        const res = await axios.post(
          `${HTTPURL}company-settings`,
          {
            company_name: formData.companyName,
            contact_person: formData.contactPerson,
            address: formData.address,
            country: formData.country,
            city: formData.city,
            state_province: formData.state,
            postal_code: formData.postalCode,
            email: formData.email,
            phone: formData.phone,

            website_url: formData.website,
          },
          config
        );
        message.success("Company settings saved successfully");
        setFormData({ ...formData, id: res.data.data.id });
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to save");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2 box-align">
            <Breadcrumbs maintitle="Company Settings" />

            <form onSubmit={handleSaveOrUpdate} noValidate>
              <div className="row">
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label>Company Name *</label>
                    <input
                      className="form-control"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                    <span className="text-danger">{errors.companyName}</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label>Contact Person *</label>
                    <input
                      className="form-control"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                    />
                    <span className="text-danger">{errors.contactPerson}</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="row">
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label>Address *</label>
                    <input
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    <span className="text-danger">{errors.address}</span>
                  </div>
                </div>
              </div>

              {/* Country / City / State / Postal */}
              <div className="row">
                <div className="col-sm-3">
                  <div className="input-block mb-3">
                    <label>Country *</label>
                    <Select
                      options={selectCountries}
                      styles={customStyles}
                      value={selectCountries.find(
                        (opt) => opt.value === formData.country
                      )}
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          country: selected.value,
                        }))
                      }
                      placeholder="Select Country"
                    />
                    <span className="text-danger">{errors.country}</span>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="input-block mb-3">
                    <label>City *</label>
                    <input
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                    <span className="text-danger">{errors.city}</span>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="input-block mb-3">
                    <label>State/Province *</label>
                    <Select
                      options={selectStates}
                      styles={customStyles}
                      value={selectStates.find(
                        (opt) => opt.value === formData.state
                      )}
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          state: selected.value,
                        }))
                      }
                      placeholder="Select State"
                    />
                    <span className="text-danger">{errors.state}</span>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="input-block mb-3">
                    <label>Postal Code *</label>
                    <input
                      className="form-control"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                    <span className="text-danger">{errors.postalCode}</span>
                  </div>
                </div>
              </div>

              {/* Email / Phone / Fax */}
              <div className="row">
                <div className="col-sm-4">
                  <div className="input-block mb-3">
                    <label>Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <span className="text-danger">{errors.email}</span>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="input-block mb-3">
                    <label>Phone *</label>
                    <input
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value
                            .replace(/\D/g, "")
                            .substring(0, 10),
                        }))
                      }
                      placeholder="Enter phone number"
                    />
                    <span className="text-danger">{errors.phone}</span>
                  </div>
                </div>
              </div>

              {/* Mobile / Website */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label>Website URL *</label>
                    <input
                      className="form-control"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                    />
                    <span className="text-danger">{errors.website}</span>
                  </div>
                </div>
              </div>

              <div className="submit-section">
                <button className="btn btn-primary submit-btn" type="submit">
                  {formData.id ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
