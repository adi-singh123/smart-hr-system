import React, { useRef, useState } from "react";
import { Applogo } from "../../../Routes/ImagePath";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../Redux/services/User";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const password = useRef({});
  password.current = watch("password", "");

  const [showPassword, setShowPassword] = useState({
    old: false,
    password: false,
    confirm: false,
  });

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data) => {
    const payload = {
      oldPassword: data.old_password,
      password: data.password,
    };
    try {
      const response = await dispatch(resetPassword(payload));
      if (response?.payload?.status) {
        toast.success("Password updated successfully!");
        navigate("/");
      } else {
        toast.error(response?.payload?.message || "Failed to update password");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="account-content">
          {/* Logo */}
          <div className="account-logo">
            <Link to="/admin-dashboard">
              <img src={Applogo} alt="Dreamguy's Technologies" />
            </Link>
          </div>

          <div className="account-box">
            <div className="account-wrapper">
              <h3 className="account-title">Change Password</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Old Password */}
                <div className="input-block mb-3">
                  <label className="col-form-label">Old Password</label>
                  <div className="position-relative">
                    <input
                      type={showPassword.old ? "text" : "password"}
                      className="form-control"
                      {...register("old_password", {
                        required: "Old password is required",
                      })}
                    />
                    <span
                      className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"
                      onClick={() => toggleVisibility("old")}
                    >
                      <i className={`fa ${showPassword.old ? "fa-eye-slash" : "fa-eye"}`} />
                    </span>
                  </div>
                  <span className="text-danger">{errors.old_password?.message}</span>
                </div>

                {/* New Password */}
                <div className="input-block mb-3">
                  <label className="col-form-label">New Password</label>
                  <div className="position-relative">
                    <input
                      type={showPassword.password ? "text" : "password"}
                      className="form-control"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        validate: {
                          strong: (val) =>
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(val) ||
                            "Must contain uppercase, lowercase, number, and special character",
                        },
                      })}
                    />
                    <span
                      className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"
                      onClick={() => toggleVisibility("password")}
                    >
                      <i className={`fa ${showPassword.password ? "fa-eye-slash" : "fa-eye"}`} />
                    </span>
                  </div>
                  <small className="form-text text-muted">
                    Must be 8+ characters, include uppercase, lowercase, number & special symbol.
                  </small>
                  <span className="text-danger">{errors.password?.message}</span>
                </div>

                {/* Confirm Password */}
                <div className="input-block mb-3">
                  <label className="col-form-label">Confirm Password</label>
                  <div className="position-relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      className="form-control"
                      {...register("confirm_password", {
                        required: "Confirm password is required",
                        validate: (value) =>
                          value === password.current || "Passwords do not match",
                      })}
                    />
                    <span
                      className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"
                      onClick={() => toggleVisibility("confirm")}
                    >
                      <i className={`fa ${showPassword.confirm ? "fa-eye-slash" : "fa-eye"}`} />
                    </span>
                  </div>
                  <span className="text-danger">{errors.confirm_password?.message}</span>
                </div>

                {/* Buttons */}
                <div className="submit-section mb-3 d-flex justify-content-between">
                  <Link to="/admin-dashboard" className="btn btn-light">
                    <i className="fa fa-arrow-left me-1" /> Back
                  </Link>
                  <button className="btn btn-primary submit-btn">Update Password</button>
                </div>
              </form>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
