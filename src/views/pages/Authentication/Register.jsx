/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Applogo } from "../../../Routes/ImagePath";
import { emailrgx } from "../Authentication/RegEx";
import { toast } from "react-toastify";

const schema = yup.object({
  email: yup
    .string()
    .matches(emailrgx, "Invalid email format")
    .required("Email is required")
    .trim(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters")
    .required("Password is required")
    .trim(),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Repeat Password is required"),
  agree: yup
    .boolean()
    .oneOf([true], "You must agree to the terms and privacy policy"),
});

const Register = () => {
  const navigate = useNavigate();
  const [passwordEye, setPasswordEye] = useState(true);
  const [repeatPasswordEye, setRepeatPasswordEye] = useState(true);
  const [emailExists, setEmailExists] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
      agree: false,
    },
  });

  const passwordValue = watch("password");
  const agree = watch("agree");

  const storedData = localStorage.getItem("loginDetails");
  const loginInfo = JSON.parse(storedData) || [];

  const onSubmit = (data) => {
    const userExists = loginInfo?.some((user) => user?.email === data?.email);
    if (userExists) {
      setEmailExists(true);
      return;
    } else {
      const newUser = { email: data.email, password: data.password };
      localStorage.setItem("loginDetails", JSON.stringify([...loginInfo, newUser]));
      setEmailExists(false);
      toast.success("Registered successfully!");
      navigate("/");
    }
  };

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="account-content">
          <div className="container">
            <div className="account-logo">
              <Link to="/admin-dashboard">
                <img src={Applogo} alt="Dreamguy's Technologies" />
              </Link>
            </div>

            <div className="account-box">
              <div className="account-wrapper">
                <h3 className="account-title">Register</h3>
                <p className="account-subtitle">Access to our dashboard</p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  {/* Email */}
                  <div className="input-block mb-3">
                    <label className="col-form-label">Email</label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`form-control ${errors.email ? "error-input" : ""}`}
                          type="text"
                          placeholder="Enter your email"
                          autoComplete="off"
                          aria-label="Email address"
                        />
                      )}
                    />
                    <span className="text-danger">{errors?.email?.message}</span>
                    {emailExists && (
                      <span className="text-danger">This email is already registered</span>
                    )}
                  </div>

                  {/* Password */}
                  <div className="input-block mb-3">
                    <label className="col-form-label">Password</label>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <div className="pass-group" style={{ position: "relative" }}>
                          <input
                            {...field}
                            type={passwordEye ? "password" : "text"}
                            className={`form-control ${errors.password ? "error-input" : ""}`}
                            placeholder="Enter password"
                            autoComplete="off"
                            aria-label="Password"
                          />
                          <span
                            onClick={() => setPasswordEye(!passwordEye)}
                            title={passwordEye ? "Show Password" : "Hide Password"}
                            style={{
                              position: "absolute",
                              right: "5%",
                              top: "30%",
                              cursor: "pointer",
                            }}
                            className={`fa toggle-password ${passwordEye ? "fa-eye-slash" : "fa-eye"}`}
                          />
                        </div>
                      )}
                    />
                    <div className="form-text">Minimum 6 characters, maximum 20.</div>
                    <span className="text-danger">{errors?.password?.message}</span>
                  </div>

                  {/* Repeat Password */}
                  <div className="input-block mb-3">
                    <label className="col-form-label">Repeat Password</label>
                    <Controller
                      name="repeatPassword"
                      control={control}
                      render={({ field }) => (
                        <div className="pass-group" style={{ position: "relative" }}>
                          <input
                            {...field}
                            type={repeatPasswordEye ? "password" : "text"}
                            className={`form-control ${errors.repeatPassword ? "error-input" : ""}`}
                            placeholder="Repeat password"
                            autoComplete="off"
                            aria-label="Repeat password"
                          />
                          <span
                            onClick={() => setRepeatPasswordEye(!repeatPasswordEye)}
                            title={repeatPasswordEye ? "Show Password" : "Hide Password"}
                            style={{
                              position: "absolute",
                              right: "5%",
                              top: "30%",
                              cursor: "pointer",
                            }}
                            className={`fa toggle-password ${repeatPasswordEye ? "fa-eye-slash" : "fa-eye"}`}
                          />
                        </div>
                      )}
                    />
                    <span className="text-danger">{errors?.repeatPassword?.message}</span>
                  </div>

                  {/* Agree to Terms */}
                  <div className="input-block mb-3 form-check">
                    <Controller
                      name="agree"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <input
                            {...field}
                            type="checkbox"
                            className="form-check-input"
                            id="agreeCheck"
                            aria-label="Agree to terms"
                          />
                          <label className="form-check-label" htmlFor="agreeCheck">
                            I agree to the <Link to="/terms">terms.</Link> 
                          </label>
                        </div>
                      )}
                    />
                    <span className="text-danger">{errors?.agree?.message}</span>
                  </div>

                  {/* CAPTCHA placeholder (demo only) */}
                  {/* Uncomment below line when you want to add real CAPTCHA */}
                  {/* <div className="input-block mb-3"><RecaptchaComponent /></div> */}
                  {false && (
                    <div className="input-block mb-3">
                      <p className="text-warning">
                        CAPTCHA Required (placeholder logic only)
                      </p>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="input-block text-center">
                    <button
                      type="submit"
                      className="btn btn-primary account-btn"
                      aria-label="Register account"
                      disabled={!isValid || !agree}
                    >
                      Register
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="account-footer">
                  <p>
                    Already have an account? <Link to="/">Login</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
