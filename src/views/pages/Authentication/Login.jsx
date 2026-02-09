import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Applogo } from "../../../Routes/ImagePath";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup.js";
import { useDispatch } from "react-redux";
import { login } from "../../../Redux/services/User";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters")
    .required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const [eye, seteye] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const showCaptcha = failedAttempts >= 3;

  const onEyeClick = () => {
    seteye(!eye);
  };

  const onSubmit = async (data) => {
    localStorage.setItem("layout", "vertical");
    localStorage.setItem("layoutwidth", "fixed");
    localStorage.setItem("layoutpos", "fluid");
    localStorage.setItem("topbartheme", "light");
    localStorage.setItem("layoutSized", "lg");
    localStorage.setItem("layoutStyling", "default");
    localStorage.setItem("layoutSidebarStyle", "dark");

    if (rememberMe) {
      localStorage.setItem("rememberMe", JSON.stringify(data.email));
    } else {
      localStorage.removeItem("rememberMe");
    }

    try {
      const response = await dispatch(login(data));
      if (response?.payload?.status === true) {
        // ✅ Save login payload so OTP resend can use it
        localStorage.setItem("loginPayload", JSON.stringify(data));

        setLoginError("");
        navigate("/otp");
      } else {
        setLoginError(response?.payload?.message || "Invalid credentials.");
        setFailedAttempts((prev) => prev + 1);
      }
    } catch (error) {
      setLoginError("An unexpected error occurred.");
      setFailedAttempts((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe");
    if (remembered) {
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="account-content">
          <div className="container">
            {/* Clickable Logo */}
            <div className="account-logo">
              <Link to="/">
                <img src={Applogo} alt="Dreamguy's Technologies" />
              </Link>
            </div>

            <div className="account-box">
              <div className="account-wrapper">
                <h3 className="account-title">Login</h3>
                <p className="account-subtitle">Access to our dashboard</p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  {/* Email */}
                  <div className="input-block mb-4">
                    <label className="col-form-label">Email Address</label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="email"
                          className={`form-control ${errors.email ? "error-input" : ""}`}
                          placeholder="Enter your email"
                          aria-label="Email address"
                          autoComplete="email"
                        />
                      )}
                    />
                    <span className="text-danger">{errors.email?.message}</span>
                  </div>

                  {/* Password */}
                  <div className="input-block mb-4">
                    <div className="row">
                      <div className="col">
                        <label className="col-form-label">Password</label>
                      </div>
                      <div className="col-auto">
                        {/* <Link className="text-muted" to="/forgot-password">
                          Forgot password?
                        </Link> */}
                      </div>
                    </div>
                    <div style={{ position: "relative" }}>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type={eye ? "password" : "text"}
                            className={`form-control ${errors.password ? "error-input" : ""}`}
                            placeholder="Enter your password"
                            aria-label="Password"
                            autoComplete="current-password"
                          />
                        )}
                      />
                      <span
                        className={`fa-solid ${eye ? "fa-eye-slash" : "fa-eye"}`}
                        style={{
                          position: "absolute",
                          right: "5%",
                          top: "30%",
                          cursor: "pointer",
                        }}
                        title={eye ? "Show Password" : "Hide Password"}
                        onClick={onEyeClick}
                      />
                    </div>
                    <span className="text-danger">{errors.password?.message}</span>
                  </div>

                  {/* Remember Me */}
                  <div className="input-block mb-3 d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label htmlFor="remember" style={{ marginBottom: 0 }}>
                      Remember Me
                    </label>
                  </div>

                  {/* Captcha (optional logic placeholder) */}
                  {showCaptcha && (
                    <div className="input-block mb-3">
                      <p className="text-warning">
                        CAPTCHA required after 3 failed attempts. (Demo placeholder)
                      </p>
                    </div>
                  )}

                  {/* Backend Error Message */}
                  {loginError && (
                    <div className="text-danger text-center mb-3">
                      {loginError}
                    </div>
                  )}

                  {/* Submit */}
                  <div className="input-block text-center">
                    <button
                      type="submit"
                      className="btn btn-primary account-btn"
                      aria-label="Login"
                    >
                      Login
                    </button>
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

export default Login;
