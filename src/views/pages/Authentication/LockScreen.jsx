import React, { useState, useEffect } from "react";
import { Applogo, Avatar_02 } from "../../../Routes/ImagePath";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const LockScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [userAvatar, setUserAvatar] = useState(Avatar_02);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    // Simulate user info from localStorage
    const stored = JSON.parse(localStorage.getItem("userProfile"));
    if (stored?.name) setUserName(stored.name);
    if (stored?.image) setUserAvatar(stored.image);
  }, []);

  const onSubmit = (data) => {
    setLoading(true);
    setTimeout(() => {
      if (data.password === "123456") {
        toast.success("Unlocked successfully");
        navigate("/admin-dashboard");
      } else {
        toast.error("Incorrect password. Please try again.");
      }
      setLoading(false);
    }, 1200);
  };

  const passwordValue = watch("password");

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="account-content">
          <div className="container">
            {/* Logo */}
            <div className="account-logo">
              <Link to="/admin-dashboard">
                <img src={Applogo} alt="Dreamguy's Technologies" />
              </Link>
            </div>

            <div className="account-box">
              <div className="account-wrapper">
                {/* User Avatar */}
                <div className="lock-user text-center">
                  <img
                    src={userAvatar}
                    onError={(e) => (e.target.src = Avatar_02)}
                    alt="User Avatar"
                    className="rounded-circle"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                  <h4>{userName}</h4>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="input-block mb-3">
                    <label htmlFor="lockPassword" className="col-form-label">
                      Password
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        id="lockPassword"
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${errors.password ? "error-input" : ""}`}
                        placeholder="Enter your password"
                        autoComplete="off"
                        aria-label="Password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 4,
                            message: "Password must be at least 4 characters",
                          },
                        })}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Hide Password" : "Show Password"}
                        className={`fa toggle-password ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <span className="text-danger">{errors?.password?.message}</span>
                  </div>

                  <div className="input-block mb-3 text-center">
                    <button
                      className="btn btn-primary account-btn"
                      type="submit"
                      disabled={!isValid || loading}
                      aria-label="Unlock Screen"
                    >
                      {loading ? (
                        <>
                          <i className="fa fa-spinner fa-spin me-2" />
                          Unlocking...
                        </>
                      ) : (
                        "Enter"
                      )}
                    </button>
                  </div>

                  <div className="account-footer text-center">
                    <p>
                      Not you?{" "}
                      <Link to="/" aria-label="Switch user">
                        Click here to switch user
                      </Link>
                    </p>
                  </div>
                </form>
                {/* /Form */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
