/** @format */

import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Applogo } from "../../../Routes/ImagePath";
import { VerifyOtp, login } from "../../../Redux/services/User";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Otp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  const loginUserId =
    useSelector((state) => state?.user?.logUserID) ||
    localStorage.getItem("loginUserId");

  const inputRefs = useRef([]);

  // Cooldown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setErrorMsg("");

      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pasted.forEach((char, i) => {
      if (/^\d$/.test(char) && i < 6) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);
    setTimeout(() => {
      const filledLength = pasted.length;
      if (filledLength < 6) inputRefs.current[filledLength].focus();
      else inputRefs.current[5].blur();
    }, 0);
  };

  const onSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6 || otp.includes("")) {
      setErrorMsg("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await dispatch(
        VerifyOtp({ id: loginUserId, otp: otpCode })
      );

      if (response?.payload?.status) {
        const role = response?.payload?.data?.role?.name;
        if (role === "Employee" || role === "Internship") {
          navigate("/employee-dashboard");
        } else {
          navigate("/admin-dashboard");
        }
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP using same login API with saved credentials
  const handleResendOtp = async () => {
    if (resendCooldown === 0) {
      const storedPayload = localStorage.getItem("loginPayload");

      if (!storedPayload) {
        toast.error("Login details not found. Please login again.");
        return;
      }

      try {
        setLoading(true);
        const payload = JSON.parse(storedPayload);

        const response = await dispatch(login(payload));

        if (response?.payload?.status) {
          toast.success("OTP resent successfully!");
          setResendCooldown(60);
        } else {
          toast.error(response?.payload?.message || "Failed to resend OTP");
        }
      } catch (error) {
        toast.error("Something went wrong while resending OTP");
      } finally {
        setLoading(false);
      }
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
                <h3 className="account-title">OTP</h3>
                <p className="account-subtitle">Verify your account</p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div
                    className="otp-wrap"
                    onPaste={handlePaste}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type={showOtp ? "text" : "password"}
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        aria-label={`OTP digit ${index + 1}`}
                        placeholder="•"
                        className="otp-input"
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(el) => (inputRefs.current[index] = el)}
                      />
                    ))}
                  </div>

                  {/* Toggle visibility */}
                  <div className="text-center mt-2">
                    <small
                      onClick={() => setShowOtp(!showOtp)}
                      style={{ cursor: "pointer", color: "#007bff" }}
                    >
                      {showOtp ? "Hide OTP" : "Show OTP"}
                    </small>
                  </div>

                  {errorMsg && (
                    <div className="text-danger text-center mt-2">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit button */}
                  <div className="input-block mb-4 text-center">
                    <button
                      className="btn btn-primary account-btn"
                      type="submit"
                      aria-label="Verify OTP"
                      disabled={otp.join("").length < 6 || loading}
                    >
                      {loading ? (
                        <>
                          <i className="fa fa-spinner fa-spin me-2" />
                          Verifying...
                        </>
                      ) : (
                        "Enter"
                      )}
                    </button>
                  </div>

                  {/* Resend link */}
                  <div className="account-footer text-center">
                    <p>
                      Not yet received?{" "}
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendCooldown > 0 || loading}
                        className="btn btn-link p-0"
                        aria-label="Resend OTP"
                      >
                        {resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : "Resend OTP"}
                      </button>
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

export default Otp;
