/** @format */

import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { HTTPURL } from "../../../../../Constent/Matcher";

const InternshipApplicationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({}); // ✅ Field-level errors

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    emailAddress: "",
    internshipCategory: "",
    internshipDuration: "",
    resumeFile: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file && file.type !== "application/pdf") {
        setErrors({ ...errors, resumeFile: "Resume must be a PDF file only." });
        return;
      } else {
        setErrors({ ...errors, resumeFile: null });
      }
      setFormData({ ...formData, [name]: file });
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: null }); // Clear error on input change
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.contactNumber)
      newErrors.contactNumber = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contactNumber))
      newErrors.contactNumber = "Contact number must be exactly 10 digits";

    if (!formData.emailAddress) newErrors.emailAddress = "Email is required";
    else if (!validateEmail(formData.emailAddress))
      newErrors.emailAddress = "Please enter a valid email address";

    if (!formData.internshipCategory)
      newErrors.internshipCategory = "Please select an internship category";

    if (!formData.internshipDuration)
      newErrors.internshipDuration = "Please select an internship duration";

    if (!formData.resumeFile) newErrors.resumeFile = "Resume file is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    try {
      const data = new FormData();
      const backendMap = {
        firstName: "first_name",
        lastName: "last_name",
        contactNumber: "contact_number",
        emailAddress: "email_address",
        internshipCategory: "internship_category",
        internshipDuration: "internship_duration",
        resumeFile: "resume_file",
      };

      Object.entries(formData).forEach(([key, value]) => {
        data.append(backendMap[key], value);
      });

      const res = await axios.post(`${HTTPURL}internship-form`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setSubmitStatus({
          type: "success",
          message: "Application submitted successfully!",
        });
        setIsSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          contactNumber: "",
          emailAddress: "",
          internshipCategory: "",
          internshipDuration: "",
          resumeFile: null,
        });
        setErrors({});
      } else {
        setSubmitStatus({ type: "danger", message: res.data.message });
      }
    } catch (error) {
      setSubmitStatus({
        type: "danger",
        message: error.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (isSubmitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <Card
          style={{
            textAlign: "center",
            padding: "40px",
            border: "none",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              backgroundColor: "#e8f5e9",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 20px",
            }}
          >
            <span style={{ color: "#4caf50", fontSize: "30px" }}>✓</span>
          </div>
          <h3>Your form has been submitted.</h3>
          <p>Team connect you soon...</p>
          <p className="mt-3">
            <a
              href="https://bilvaleaf.com/"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              Visit our website
            </a>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <Container className="my-4">
      <Card className="shadow-sm p-4 mb-4">
        <h4>🌿 About Bilvaleaf Private Limited</h4>
        <p style={{ marginTop: "10px" }}>
          Bilvaleaf Private Limited is a technology-driven company focusing on
          software development, digital solutions, internships, and professional
          training programs designed to empower young talent.
        </p>
        <p>
          Transforming Ideas Into Powerful Digital Solutions We specialize in:
          Web & App Development, Web Portals, UI/UX Design, Digital Marketing,
          Visual Designing, BPO/KPO Services
        </p>

        <Form.Check
          type="checkbox"
          label={
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              ✔ Are you interested in applying for Internship
            </span>
          }
          className="mt-3"
          onChange={(e) => setShowForm(e.target.checked)}
        />
      </Card>

      {showForm && (
        <Card className="shadow-sm p-4">
          <Card.Title className="text-center mb-4">
            Internship Application Form
          </Card.Title>

          {submitStatus && (
            <Alert variant={submitStatus.type}>{submitStatus.message}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="6">
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  name="firstName"
                  placeholder="Enter First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  name="lastName"
                  placeholder="Enter Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6">
                <Form.Label>Contact Number *</Form.Label>
                <Form.Control
                  name="contactNumber"
                  placeholder="10-digit Contact Number"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  isInvalid={!!errors.contactNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contactNumber}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>Email Address *</Form.Label>
                <Form.Control
                  type="email"
                  name="emailAddress"
                  placeholder="Enter Email Address"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  isInvalid={!!errors.emailAddress}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.emailAddress}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6">
                <Form.Label>Internship Category *</Form.Label>
                <Form.Select
                  name="internshipCategory"
                  value={formData.internshipCategory}
                  onChange={handleInputChange}
                  isInvalid={!!errors.internshipCategory}
                >
                  <option value="">Select Category</option>
                  <option value="web-development">Web Development</option>
                  <option value="ui-ux">UI/UX Design</option>
                  <option value="ai-ml">AI ML</option>
                  <option value="marketing">Digital Marketing</option>
                  <option value="app developer">App development</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.internshipCategory}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>Internship Duration *</Form.Label>
                <Form.Select
                  name="internshipDuration"
                  value={formData.internshipDuration}
                  onChange={handleInputChange}
                  isInvalid={!!errors.internshipDuration}
                >
                  <option value="">Select Duration</option>
                  <option value="1 month">1 Month</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.internshipDuration}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Upload Resume (PDF Only) *</Form.Label>
              <Form.Control
                type="file"
                name="resumeFile"
                onChange={handleInputChange}
                isInvalid={!!errors.resumeFile}
              />
              <Form.Control.Feedback type="invalid">
                {errors.resumeFile}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </Form>
        </Card>
      )}
    </Container>
  );
};

export default InternshipApplicationForm;
