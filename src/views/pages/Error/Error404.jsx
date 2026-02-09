import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(10);

  // Update page title
  useEffect(() => {
    document.title = "Page Not Found – Bilvaleaf";
  }, []);

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          navigate("/admin-dashboard");
          clearInterval(timer);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  // Log broken URL (can be connected to backend logger)
  useEffect(() => {
    console.warn("404 Not Found:", window.location.href);
    // Optionally send to server:
    // fetch("/api/log-404", { method: "POST", body: JSON.stringify({ url: window.location.href }) });
  }, []);

  return (
    <div
      className="error-page d-flex align-items-center justify-content-center"
      role="alert"
      aria-labelledby="error-title"
      aria-describedby="error-description"
      style={{ minHeight: "100vh", padding: "2rem", textAlign: "center" }}
    >
      <div className="main-wrapper">
        <div className="error-box">
          {/* Optional illustration */}
          <img
            src="/assets/img/404.png"
            alt="Page Not Found"
            style={{ maxWidth: "200px", marginBottom: "20px" }}
          />

          <h1 id="error-title">404</h1>
          <h3>
            <i className="fa-solid fa-triangle-exclamation text-warning" /> Oops! Page not found.
          </h3>
          <p id="error-description">
            The page <code>{location.pathname}</code> does not exist or was moved.
          </p>

          <p className="text-muted mb-4">
            You’ll be redirected in <strong>{countdown}</strong> seconds.
            If not, use the button below.
          </p>

          <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
            <Link
              to="/admin-dashboard"
              className="btn btn-primary"
              style={{
                fontWeight: "bold",
                padding: "0.6rem 1.5rem",
                minWidth: "150px",
              }}
              aria-label="Back to Dashboard"
            >
              Back to Home
            </Link>

            <Link
              to="/contact"
              className="btn btn-outline-secondary"
              aria-label="Contact Support"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
