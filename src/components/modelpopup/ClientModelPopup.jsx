/** @format */

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addOrUpdateClient,
  fetchNewClientId,
} from "../../Redux/services/Client";
import { fetchNotifications } from "../../Redux/services/Notifications"; // ✅ import
import { customAlert } from "../../utils/Alert";

export const ClientModelPopup = ({ client, onSave }) => {
  const dispatch = useDispatch();

  const [formDataState, setFormDataState] = useState({
    id: "",
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    client_id: "",
    phone: "",
    company_name: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [errors, setErrors] = useState({});

  // 🔹 Reset form whenever client changes (edit or add)
  useEffect(() => {
    if (client) {
      // Edit mode
      setFormDataState({ ...client, password: "", confirmPassword: "" });
      setPreviewImageUrl(client.profile_image_url || null);
      setImageFile(null);
    } else {
      // Add mode: reset everything
      setFormDataState({
        id: "",
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        client_id: "",
        phone: "",
        company_name: "",
      });
      setPreviewImageUrl(null);
      setImageFile(null);

      // Fetch new client_id
      const fetchClientId = async () => {
        const response = await dispatch(fetchNewClientId());
        if (response?.payload?.status) {
          setFormDataState((prev) => ({
            ...prev,
            client_id: response.payload.data,
          }));
        }
      };
      fetchClientId();
    }
    setErrors({});
  }, [client, dispatch]);

  const handleChange = (e) => {
    setFormDataState({ ...formDataState, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImageUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formDataState.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formDataState.username.trim())
      newErrors.username = "Username is required";
    if (!formDataState.email.trim()) newErrors.email = "Email is required";
    if (!formDataState.client_id.trim())
      newErrors.client_id = "Client ID is required";
    if (formDataState.password !== formDataState.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = new FormData();
      Object.keys(formDataState).forEach((key) => {
        payload.append(key, formDataState[key]);
      });

      if (imageFile) {
        payload.append("profile_image", imageFile, imageFile.name);
      }

      const response = await dispatch(addOrUpdateClient(payload));

      if (response?.payload?.status) {
        onSave(formDataState);
        document.querySelector("#add_client .btn-close")?.click();
        customAlert(response.payload.message, "success");

        // ✅ Dispatch fetchNotifications every time client is added/updated
        dispatch(fetchNotifications());
      } else {
        customAlert(response.payload.message, "fail");
      }
    } catch (error) {
      console.error("Error in submitting client:", error);
      customAlert("Something went wrong", "fail");
    }
  };

  return (
    <div id="add_client" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {client ? "Edit Client" : "Add Client"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="row">
                {[
                  {
                    name: "first_name",
                    label: "First Name",
                    required: true,
                    placeholder: "Eg. John",
                  },
                  {
                    name: "last_name",
                    label: "Last Name",
                    placeholder: "Eg. Doe",
                  },
                  {
                    name: "username",
                    label: "Username",
                    required: true,
                    placeholder: "Eg. johndoe123",
                  },
                  {
                    name: "email",
                    label: "Email",
                    type: "email",
                    required: true,
                    placeholder: "Eg. johndoe123@gmail.com",
                  },
                  {
                    name: "password",
                    label: "Password",
                    type: "password",
                    placeholder: "*****",
                  },
                  {
                    name: "confirmPassword",
                    label: "Confirm Password",
                    type: "password",
                    placeholder: "*****",
                  },
                  {
                    name: "client_id",
                    label: "Client ID",
                    required: true,
                    placeholder: "Eg. CLT-123",
                  },
                  {
                    name: "phone",
                    label: "Phone",
                    placeholder: "Eg. 9896845869",
                  },
                  {
                    name: "company_name",
                    label: "Company Name",
                    placeholder: "Eg. XYZ",
                  },
                ].map(
                  ({ name, label, type = "text", required, placeholder }) => (
                    <div key={name} className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">
                          {label}
                          {required && <span className="text-danger"> *</span>}
                        </label>
                        <input
                          className="form-control"
                          type={type}
                          name={name}
                          value={formDataState[name] || ""}
                          onChange={handleChange}
                          disabled={name === "client_id"}
                          placeholder={placeholder}
                        />
                        {errors[name] && (
                          <small className="text-danger">{errors[name]}</small>
                        )}
                      </div>
                    </div>
                  )
                )}

                <div className="col-md-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Profile Image</label>
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {previewImageUrl && (
                      <div style={{ marginTop: "10px" }}>
                        <img
                          src={previewImageUrl}
                          alt="Profile Preview"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="submit-section">
                <button className="btn btn-primary submit-btn" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
