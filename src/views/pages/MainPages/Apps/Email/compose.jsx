// compose.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import DefaultEditor from "react-simple-wysiwyg";

const Compose = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleEditorChange = (e) => {
    setFormData({ ...formData, body: e.target.value });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!formData.to || !formData.subject || !formData.body) {
      alert("To, Subject, and Message Body are required.");
      return;
    }

    console.log("📤 Sent Email:", formData);
    alert("Message sent!");
    navigate("/email");
  };

  const handleSaveDraft = () => {
    console.log("💾 Draft saved:", formData);
    alert("Draft saved!");
  };

  const handleDelete = () => {
    setFormData({
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      body: "",
    });
    alert("Form cleared.");
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Compose</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin-dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Compose</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSend}>
                  <div className="input-block">
                    <input
                      type="email"
                      placeholder="To"
                      className="form-control"
                      value={formData.to}
                      onChange={handleChange("to")}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-block">
                        <input
                          type="email"
                          placeholder="Cc"
                          className="form-control"
                          value={formData.cc}
                          onChange={handleChange("cc")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block">
                        <input
                          type="email"
                          placeholder="Bcc"
                          className="form-control"
                          value={formData.bcc}
                          onChange={handleChange("bcc")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="input-block">
                    <input
                      type="text"
                      placeholder="Subject"
                      className="form-control"
                      value={formData.subject}
                      onChange={handleChange("subject")}
                      required
                    />
                  </div>
                  <div className="input-block">
                    <DefaultEditor value={formData.body} onChange={handleEditorChange} />
                  </div>

                  <div className="input-block mb-0">
                    <div className="text-center">
                      <button type="submit" className="btn btn-primary draft me-1">
                        <span>Send</span>{" "}
                        <i className="fa-solid fa-paper-plane m-l-5" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-success draft m-l-5 me-1"
                        onClick={handleSaveDraft}
                      >
                        <span>Draft</span>{" "}
                        <i className="fa-regular fa-floppy-disk m-l-5" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger m-l-5 me-1"
                        onClick={handleDelete}
                      >
                        <span>Clear</span>{" "}
                        <i className="fa-regular fa-trash-can m-l-5" />
                      </button>
                    </div>
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

export default Compose;
