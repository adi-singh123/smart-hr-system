import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Error500 = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    document.title = "Internal Server Error – Bilvaleaf";
  }, []);

  // Auto-redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate("/admin-dashboard");
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  // Log error internally (placeholder for backend log)
  useEffect(() => {
    const log = {
      path: window.location.pathname,
      time: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    console.error("Logged 500 Error:", log);
    // fetch("/api/log-error", { method: "POST", body: JSON.stringify(log) });
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
          {/* Image */}
          <img
            src="/assets/img/500.png"
            alt="Internal Server Error"
            style={{ maxWidth: "220px", marginBottom: "20px" }}
          />

          <h1 id="error-title">500</h1>
          <h3>
            <i className="fa-solid fa-triangle-exclamation text-danger" /> Oops! Internal Server Error
          </h3>

          <p id="error-description" className="text-muted">
            Something went wrong on our end. Please try again later.
          </p>

          <p className="text-muted small mb-2">
            <strong>Error Code:</strong> 500-DB-01
          </p>

          <p className="mb-3">
            You’ll be redirected to the dashboard in <strong>{countdown}</strong> seconds.
          </p>

          <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mb-3">
            <Link
              to="/admin-dashboard"
              className="btn btn-primary"
              style={{ fontWeight: "bold", padding: "0.6rem 1.5rem" }}
              aria-label="Return to Dashboard"
            >
              Back to Home
            </Link>

            <button
              className="btn btn-outline-secondary"
              onClick={() => window.location.reload()}
              aria-label="Try Again"
            >
              Try Again
            </button>

            <Link
              to="/contact"
              className="btn btn-outline-danger"
              aria-label="Report Problem"
            >
              Report Issue
            </Link>
          </div>

          <p className="text-muted small">
            If the problem continues, please contact{" "}
            <a href="mailto:support@bilvaleaf.in" className="text-decoration-underline">
              support@bilvaleaf.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error500;
