import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { HTTPURL } from "../../../../../Constent/Matcher";

const JobApplicationForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    nationality: "",
    religion: "",
    maritalStatus: "",
    dob: "",
    permanentAddress: "",
    currentAddress: "",
    phoneNumber: "",
    email: "",
    gender: "male",
    emergencyContact: "",
    aadharFile: null,
    photoFile: null,
    educationFiles: [],
    resumeFile: null,
    experienceFiles: [],
    highestEducation: "",
    socialMediaUrl: "",
    appliedFor: "",
    otherAppliedFor: "",
    passportFile: null,
    panCardFile: null,
    hasBankDetails: false,
    bankFullName: "",
    bankName: "",
    branchName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    accountType: "",
    ifscCode: "",
    accountHolderName: "",
    additionalComments: "",
  });

  const [isSameAddress, setIsSameAddress] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // ✅ added

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      if (!files || files.length === 0) return;

      const multipleFileFields = ["educationFiles", "experienceFiles"];

      if (multipleFileFields.includes(name)) {
        const selectedFiles = Array.from(files);

        // File validation for multiple files
        const validFileTypes = {
          educationFiles: ["application/pdf"],
          experienceFiles: ["application/pdf"],
        };

        const allowedTypes = validFileTypes[name];
        for (let file of selectedFiles) {
          if (allowedTypes && !allowedTypes.includes(file.type)) {
            alert(
              `${name.replace("Files", "").toUpperCase()} must be in PDF format`
            );
            return;
          }
        }

        // ✅ Save all files as an array
        setFormData({
          ...formData,
          [name]: [...formData[name], ...selectedFiles]
        });
      } else {
        // Single file handling
        const file = files[0];
        const validFileTypes = {
          aadharFile: ["application/pdf"],
          resumeFile: ["application/pdf"],
          photoFile: ["image/jpeg", "image/png"],
          passportFile: ["application/pdf"],
          panCardFile: ["application/pdf"],
        };

        const allowedTypes = validFileTypes[name];
        if (allowedTypes && !allowedTypes.includes(file.type)) {
          alert(
            `${name.replace("File", "").toUpperCase()} must be in ${allowedTypes[0].includes("pdf") ? "PDF" : "JPG/PNG"
            } format`
          );
          return;
        }

        setFormData({ ...formData, [name]: file });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleAddressCopy = (e) => {
    const checked = e.target.checked;
    setIsSameAddress(checked);
    setFormData({
      ...formData,
      currentAddress: checked ? formData.permanentAddress : "",
    });
  };

  const handlePermanentAddressChange = (e) => {
    const newAddress = e.target.value;
    setFormData({
      ...formData,
      permanentAddress: newAddress,
      currentAddress: isSameAddress ? newAddress : formData.currentAddress,
    });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: all required except middleName and experienceFile
    const requiredFields = [
      "firstName",
      "lastName",
      "fatherName",
      "motherName",
      "nationality",
      "religion",
      "maritalStatus",
      "dob",
      "email",
      "gender",
      "phoneNumber",
      "emergencyContact",
      "permanentAddress",
      "currentAddress",
      "appliedFor",
      "highestEducation",
      "socialMediaUrl",
      "aadharFile",
      "photoFile",
      "educationFiles",
      "resumeFile",
      "panCardFile",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill or upload the required field: ${field}`);
        return;
      }
    }

    if (!formData.appliedFor) {
      alert("Please select the position you are applying for.");
      return;
    }

    // ✅ Check if "Other" is selected
    if (formData.appliedFor === "Other" && !formData.otherAppliedFor.trim()) {
      alert("Please specify the other position you are applying for.");
      return;
    }


    if (formData.hasBankDetails) {
      const bankRequired = [
        "bankFullName", "bankName", "branchName", "accountNumber",
        "confirmAccountNumber", "accountType", "ifscCode", "accountHolderName"
      ];
      for (let field of bankRequired) {
        if (!formData[field]) {
          alert(`Please fill the required bank field: ${field}`);
          return;
        }
      }
      if (formData.accountNumber !== formData.confirmAccountNumber) {
        alert("Account numbers do not match.");
        return;
      }
    }





    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsLoading(true); // ✅ Show loader here

    try {
      const data = new FormData();
      let appliedForValue = formData.appliedFor;
      if (appliedForValue === "Other" && formData.otherAppliedFor) {
        appliedForValue = formData.otherAppliedFor;
      }
      const submitData = { ...formData, appliedFor: appliedForValue };
      Object.entries(submitData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== "otherAppliedFor") {
          const backendKey = key
            .replace("firstName", "first_name")
            .replace("middleName", "middle_name")
            .replace("lastName", "last_name")
            .replace("fatherName", "father_name")
            .replace("motherName", "mother_name")
            .replace("nationality", "nationality")
            .replace("religion", "religion")
            .replace("maritalStatus", "marital_status")
            .replace("dob", "dob")
            .replace("gender", "gender")
            .replace("email", "email")
            .replace("phoneNumber", "phone_number")
            .replace("emergencyContact", "emergency_contact")
            .replace("permanentAddress", "permanent_address")
            .replace("currentAddress", "current_address")
            .replace("appliedFor", "applied_for")
            .replace("highestEducation", "highest_education")
            .replace("socialMediaUrl", "social_media_url")
            .replace("aadharFile", "aadhar_file")
            .replace("photoFile", "photo_file")
            .replace("educationFiles", "education_files")
            .replace("resumeFile", "resume_file")
            .replace("experienceFiles", "experience_files")
            .replace("passportFile", "passport_file")
            .replace("panCardFile", "pan_card_file")
            .replace("hasBankDetails", "has_bank_details")
            .replace("bankFullName", "bank_full_name")
            .replace("bankName", "bank_name")
            .replace("branchName", "branch_name")
            .replace("accountNumber", "account_number")
            .replace("confirmAccountNumber", "confirm_account_number")
            .replace("accountType", "account_type")
            .replace("ifscCode", "ifsc_code")
            .replace("accountHolderName", "account_holder_name")
            .replace("additionalComments", "additional_comments");
          // ✅ handle multiple files properly
          if (Array.isArray(value)) {
            value.forEach((file) => data.append(backendKey, file));
          } else {
            data.append(backendKey, value);
          }
        }
      });
      const response = await axios.post(`${HTTPURL}job-form`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setSubmitStatus({ type: "success", message: "Application submitted successfully!" });
        setIsSubmitted(true); // ✅ show success screen
        // Reset form
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          fatherName: "",
          motherName: "",
          nationality: "",
          religion: "",
          maritalStatus: "",
          dob: "",
          permanentAddress: "",
          currentAddress: "",
          phoneNumber: "",
          email: "",
          gender: "male",
          emergencyContact: "",
          aadharFile: null,
          photoFile: null,
          educationFiles: [],
          resumeFile: null,
          experienceFiles: [],
          highestEducation: "",
          socialMediaUrl: "",
          appliedFor: "",
          passportFile: null,
          panCardFile: null,
          hasBankDetails: false,
          bankFullName: "",
          bankName: "",
          branchName: "",
          accountNumber: "",
          confirmAccountNumber: "",
          accountType: "",
          ifscCode: "",
          accountHolderName: "",
        });
        setIsSameAddress(false);
      } else {
        setSubmitStatus({ type: "danger", message: response.data.message || "Failed to submit application." });
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus({ type: "danger", message: err.response?.data?.message || "Something went wrong!" });
    }finally {
    setIsLoading(false); // ✅ Hide loader in both success/error
  }
  };

  // ✅ Success confirmation screen
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
        <Card style={{ textAlign: "center", padding: "40px", border: "none", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
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
          <p className="mt-3">
            <a href="https://bilvaleaf.com/" style={{ color: "#007bff", textDecoration: "none" }}>
              Visit our website
            </a>
          </p>
          <p style={{ marginTop: "30px", fontSize: "14px", color: "#777" }}>
            Powered by <a href="https://bilvaleaf.com/" target="_blank" rel="noreferrer">Bilvaleaf</a>.
          </p>
        </Card>
      </div>
    );
  }

  // ✅ Loader block goes here (just above return)
if (isLoading) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw", height: "100vh",
      background: "rgba(255,255,255,0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}>
      <div className="spinner-border text-primary" role="status" style={{ width: "4rem", height: "4rem" }}>
      </div>
    </div>
  );
}

  return (
    <div style={{ backgroundColor: "#c9bfbfde", minHeight: "100vh", padding: "30px 0" }}>
      <Container className="my-4">
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Card.Title as="h2" className="text-center mb-5 mt-2">Employee Onboarding & Personal Details Form</Card.Title>

            {submitStatus && <Alert variant={submitStatus.type}>{submitStatus.message}</Alert>}

            <Form noValidate onSubmit={handleSubmit}>
              {/* --- all your original form fields below remain untouched --- */}

              {/* Personal Information */}
              <h4 className="mb-3">Personal Information</h4>
              <Row className="mb-3">
                <Form.Group as={Col} md="4">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control placeholder="Middle Name" name="middleName" value={formData.middleName} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                {/* <Form.Group as={Col} md="6">
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    placeholder="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </Form.Group> */}
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="6">
                  <Form.Label>Father's Name *</Form.Label>
                  <Form.Control placeholder="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleInputChange} />
                </Form.Group> <Form.Group as={Col} md="6">
                  <Form.Label>Mother's Name *</Form.Label>
                  <Form.Control placeholder="Mother's Name" name="motherName" value={formData.motherName} onChange={handleInputChange} />
                </Form.Group> </Row> <Row className="mb-3"> <Form.Group as={Col} md="4">
                  <Form.Label>Nationality *</Form.Label> <Form.Control placeholder="Nationality" name="nationality" value={formData.nationality} onChange={handleInputChange} />
                </Form.Group> <Form.Group as={Col} md="4"> <Form.Label>Religion *</Form.Label> <Form.Control placeholder="Religion" name="religion" value={formData.religion} onChange={handleInputChange} />
                </Form.Group> <Form.Group as={Col} md="4"> <Form.Label>Marital Status *</Form.Label>
                  <Form.Select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange}> <option value="">Select Status</option> <option value="single">Single</option> <option value="married">Married</option> <option value="divorced">Divorced</option> <option value="widowed">Widowed</option> </Form.Select>
                </Form.Group> </Row> <Row className="mb-4"> <Form.Group as={Col} md="6"> <Form.Label>Date of Birth *</Form.Label> <Form.Control type="date" name="dob" value={formData.dob} onChange={handleInputChange} /> </Form.Group>
                <Form.Group as={Col} md="6"> <Form.Label>Gender *</Form.Label> <div> <Form.Check inline type="radio" label="Male" name="gender" value="male" checked={formData.gender === "male"} onChange={handleInputChange} /> <Form.Check inline type="radio" label="Female" name="gender" value="female" checked={formData.gender === "female"} onChange={handleInputChange} />
                  <Form.Check inline type="radio" label="Other" name="gender" value="other" checked={formData.gender === "other"} onChange={handleInputChange} /> </div> </Form.Group> </Row> {/* Contact Info */} <h4 className="mb-3">Contact Information</h4> <Row className="mb-3"> <Form.Group as={Col} md="6"> <Form.Label>Phone Number *</Form.Label> <Form.Control placeholder="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                  </Form.Group> <Form.Group as={Col} md="6"> <Form.Label>Emergency Contact *</Form.Label> <Form.Control placeholder="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} /> </Form.Group> </Row> {/* Address */} <h4 className="mb-3">Address Details</h4> <Form.Group className="mb-3"> <Form.Label>Permanent Address *</Form.Label>
                <Form.Control as="textarea" rows={3} name="permanentAddress" value={formData.permanentAddress} onChange={handlePermanentAddressChange} /> </Form.Group> <Form.Check className="mb-3" type="checkbox" label="My current address is same as permanent" checked={isSameAddress} onChange={handleAddressCopy} /> <Form.Group className="mb-4"> <Form.Label>Current Address *</Form.Label> <Form.Control as="textarea" rows={3} name="currentAddress" value={formData.currentAddress} onChange={handleInputChange} disabled={isSameAddress} />
              </Form.Group> {/* Job Applied For */} <h4 className="mb-3">Job Details</h4> <Form.Group className="mb-3"> <Form.Label>Applied For *</Form.Label> <Form.Select name="appliedFor" value={formData.appliedFor} onChange={handleInputChange}> <option value="">Select Position</option> <option value="Software Engineer">Software Engineer</option> <option value="Frontend Developer">Frontend Developer</option> <option value="Backend Developer">Backend Developer</option> <option value="Full Stack Developer">Full Stack Developer</option> <option value="UI/UX Designer">UI/UX Designer</option> <option value="HR Executive">HR Executive</option> <option value="Project Manager">Project Manager</option> <option value="BDE">BDE</option> <option value="Other">Other</option>
              </Form.Select> </Form.Group>
              {/* Show input if "Other" is selected */}
              {formData.appliedFor === "Other" && (
                <Form.Group className="mb-3">
                  <Form.Label>Specify Other Position *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter the position"
                    name="otherAppliedFor"
                    value={formData.otherAppliedFor || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              )}

              {/* Education & Files */} <h4 className="mb-3">Education & Professional Details</h4> <Form.Group className="mb-3"> <Form.Label>Highest Education *</Form.Label> <Form.Control placeholder="Highest Qualification" name="highestEducation" value={formData.highestEducation} onChange={handleInputChange} /> </Form.Group>
              <Row className="mb-4"> <Form.Group as={Col} md="6"> <Form.Label>Resume Upload (.pdf, Max 2 MB)*</Form.Label> <Form.Control type="file" name="resumeFile" onChange={handleInputChange} /> </Form.Group>
                <Form.Group as={Col} md="6"> <Form.Label>Education Document (.pdf | Max: 3MB) *
</Form.Label> <Form.Control type="file" name="educationFiles" onChange={handleInputChange} multiple /> </Form.Group> </Row> <Row className="mb-4"> <Form.Group as={Col} md="6"> <Form.Label>Identity Proof (Aadhaar .pdf | Max: 1MB) *
</Form.Label>
                  <Form.Control type="file" name="aadharFile" onChange={handleInputChange} /> </Form.Group> <Form.Group as={Col} md="6"> <Form.Label>Passport Size Photo (.png | Max: 500KB) *
</Form.Label> <Form.Control type="file" name="photoFile" onChange={handleInputChange} /> </Form.Group> </Row> <Row className="mb-4"> <Form.Group as={Col} md="12"> <Form.Label>Previous Experience Letter (.pdf  | option)</Form.Label> <Form.Control type="file" name="experienceFiles" onChange={handleInputChange} multiple /> </Form.Group> </Row> <Form.Group className="mb-4"> <Form.Label>Social Media URL (LinkedIn) *</Form.Label> <Form.Control placeholder="LinkedIn Profile URL" name="socialMediaUrl" value={formData.socialMediaUrl} onChange={handleInputChange} /> </Form.Group>
              {/* Additional Document Uploads */}
              <h4 className="mb-3">Additional Documents</h4>
              <Row className="mb-4">
                <Form.Group as={Col} md="6">
                  <Form.Label>Passport Upload (.pdf | Max: 2MB, Optional)
</Form.Label>
                  <Form.Control type="file" name="passportFile" onChange={handleInputChange} />
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>PAN Card Upload (.pdf | Max: 2MB) *
</Form.Label>
                  <Form.Control type="file" name="panCardFile" onChange={handleInputChange} />
                </Form.Group>
              </Row>

              {/* Bank Details */}
              <h4 className="mb-3">Bank Details</h4>
              <Form.Check
                type="checkbox"
                label="Have Bank Details?"
                checked={formData.hasBankDetails}
                onChange={(e) => setFormData({ ...formData, hasBankDetails: e.target.checked })}
              />

              {formData.hasBankDetails && (
                <div className="p-3 border rounded mt-3" style={{ backgroundColor: "#f8f9fa" }}>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                      <Form.Label>Full Name (as per bank record) *</Form.Label>
                      <Form.Control
                        name="bankFullName"
                        placeholder="Full Name"
                        value={formData.bankFullName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>Bank Name *</Form.Label>
                      <Form.Control
                        name="bankName"
                        placeholder="Bank Name"
                        value={formData.bankName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                      <Form.Label>Branch Name *</Form.Label>
                      <Form.Control
                        name="branchName"
                        placeholder="Branch Name"
                        value={formData.branchName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>Account Type *</Form.Label>
                      <Form.Select
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Type</option>
                        <option value="saving">Saving</option>
                        <option value="current">Current</option>
                        <option value="salary">Salary</option>
                      </Form.Select>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                      <Form.Label>Account Number *</Form.Label>
                      <Form.Control
                        name="accountNumber"
                        placeholder="Account Number"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>Confirm Account Number *</Form.Label>
                      <Form.Control
                        name="confirmAccountNumber"
                        placeholder="Confirm Account Number"
                        value={formData.confirmAccountNumber}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                      <Form.Label>IFSC Code *</Form.Label>
                      <Form.Control
                        name="ifscCode"
                        placeholder="IFSC Code"
                        value={formData.ifscCode}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>Name of Account Holder *</Form.Label>
                      <Form.Control
                        name="accountHolderName"
                        placeholder="Ensure it matches your bank passbook"
                        value={formData.accountHolderName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                  </Row>
                </div>
              )}
              <h4 className="mb-3 mt-3">Additional Comments (Optional)</h4>
              <Form.Group className="mb-4">
                <Form.Label>Any Comments</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter any additional information..."
                  name="additionalComments"
                  value={formData.additionalComments}
                  onChange={handleInputChange}
                />
              </Form.Group>


              <div className="d-grid">
                <Button type="submit" variant="primary" size="lg">Submit Application</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default JobApplicationForm;
