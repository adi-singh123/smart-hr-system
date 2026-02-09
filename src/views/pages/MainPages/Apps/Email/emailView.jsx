// emailView.jsx
import React from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar_02 } from "../../../../../Routes/ImagePath";

// Reuse the same mock data used in emailContent.jsx
const mockEmails = [
  {
    id: 1,
    from: "John Doe",
    to: "me, Richard, Paul",
    subject: "Meeting follow-up and next steps",
    body: `<p>Hello,</p><p>This is a follow-up to our meeting. Please review the notes and let me know if anything is missing.</p><p>Regards,<br/>John</p>`,
    starred: true,
    hasAttachment: true,
    time: "2025-07-16T13:14:00",
  },
  {
    id: 2,
    from: "Envato Account",
    to: "me",
    subject: "Security update – action required",
    body: `<p>We’ve detected suspicious activity. Please update your credentials.</p>`,
    starred: false,
    hasAttachment: false,
    time: "2025-07-15T08:42:00",
  },
  // Add others if needed
];

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" };
  return date.toLocaleDateString("en-GB", options);
};

const EmailView = () => {
  const { id } = useParams();
  const email = mockEmails.find((e) => e.id === parseInt(id));

  if (!email) {
    return (
      <div className="page-wrapper">
        <div className="content container-fluid">
          <h3>Email Not Found</h3>
          <Link to="/email" className="btn btn-primary mt-3">
            Back to Inbox
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">View Message</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin-dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">View Message</li>
              </ul>
            </div>
            <div className="col-auto float-end ms-auto">
              <Link to="/email/compose" className="btn add-btn">
                <i className="fa-solid fa-plus" /> Compose
              </Link>
            </div>
          </div>
        </div>
        {/* /Page Header */}

        <div className="row">
          <div className="col-sm-12">
            <div className="card mb-0">
              <div className="card-body">
                <div className="mailview-content">
                  <div className="mailview-header">
                    <div className="row">
                      <div className="col-sm-9">
                        <h4 className="mail-view-title">{email.subject}</h4>
                      </div>
                      <div className="col-sm-3 text-end">
                        <div className="btn-group">
                          <button className="btn btn-white btn-sm" title="Delete">
                            <i className="fa-regular fa-trash-can" />
                          </button>
                          <button className="btn btn-white btn-sm" title="Reply">
                            <i className="fa-solid fa-reply" />
                          </button>
                          <button className="btn btn-white btn-sm" title="Forward">
                            <i className="fa fa-share" />
                          </button>
                        </div>
                        <button className="btn btn-white btn-sm" title="Print">
                          <i className="fa-solid fa-print" />
                        </button>
                      </div>
                    </div>

                    <div className="sender-info mt-3 d-flex align-items-center">
                      <img src={Avatar_02} width={40} className="rounded-circle me-2" alt="Sender" />
                      <div>
                        <div className="fw-bold">{email.from}</div>
                        <div className="text-muted">
                          To: {email.to} | {formatDate(email.time)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mailview-inner mt-4">
                    <div dangerouslySetInnerHTML={{ __html: email.body }} />
                  </div>
                </div>

                <div className="mailview-footer mt-4 d-flex justify-content-between">
                  <div>
                    <button className="btn btn-white me-1">
                      <i className="fa-solid fa-reply" /> Reply
                    </button>
                    <button className="btn btn-white">
                      <i className="fa fa-share" /> Forward
                    </button>
                  </div>
                  <div>
                    <button className="btn btn-white me-1">
                      <i className="fa-solid fa-print" /> Print
                    </button>
                    <button className="btn btn-white">
                      <i className="fa-regular fa-trash-can" /> Delete
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailView;
