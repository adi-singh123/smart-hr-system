import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Applogo } from "../../../Routes/ImagePath";
import { forgotPassword } from "../../../Redux/services/User";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailrgx } from "../Authentication/RegEx";
import { toast } from "react-toastify";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailrgx, "Invalid email format")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await dispatch(forgotPassword(data));
      if (response?.payload?.status) {
        toast.success("Password reset link sent to your email.");
        navigate("/change-password");
      } else {
        toast.error(response?.payload?.message || "Email not registered.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="account-content">
          <div className="container">
            <div className="account-logo">
              <Link to="/app/main/dashboard">
                <img src={Applogo} alt="Dreamguy's Technologies" />
              </Link>
            </div>
            <div className="account-box">
              <div className="account-wrapper">
                <h3 className="account-title">Forgot Password?</h3>
                <p className="account-subtitle">
                  Enter your email to get a password reset link
                </p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  {/* Email Field */}
                  <div className="input-block mb-4">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={`form-control ${errors.email ? "error-input" : ""}`}
                      placeholder="Enter your email"
                      autoComplete="email"
                      aria-label="Email address"
                    />
                    <span className="text-danger">{errors.email?.message}</span>
                  </div>

                  {/* CAPTCHA Placeholder (real one can be integrated here) */}
                  {false && (
                    <div className="input-block mb-4">
                      <p className="text-warning">
                        CAPTCHA required (placeholder only)
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="input-block text-center">
                    <button
                      className="btn btn-primary account-btn"
                      type="submit"
                      disabled={!isValid || loading}
                      aria-label="Reset Password"
                    >
                      {loading ? (
                        <span>
                          <i className="fa fa-spinner fa-spin me-2"></i> Sending...
                        </span>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="account-footer text-center mt-3">
                    <p>
                      Remember your password? <Link to="/">Login</Link>
                    </p>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
