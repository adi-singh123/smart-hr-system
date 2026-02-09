// emailContent.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options); // e.g., 17 Jul 2025
};

const mockEmails = [
  {
    id: 1,
    from: "John Doe",
    subject: "Meeting follow-up and next steps",
    starred: true,
    hasAttachment: true,
    time: "2025-07-16T13:14:00",
    isUnread: true,
    folder: "inbox",
  },
  {
    id: 2,
    from: "Envato Account",
    subject: "Security update – action required",
    starred: false,
    hasAttachment: false,
    time: "2025-07-15T08:42:00",
    isUnread: true,
    folder: "inbox",
  },
  {
    id: 3,
    from: "Draft Mail",
    subject: "Incomplete message draft",
    starred: false,
    hasAttachment: false,
    time: "2025-07-10T10:00:00",
    isUnread: false,
    folder: "draft",
  },
  {
    id: 4,
    from: "Old Trash",
    subject: "Deleted email",
    starred: false,
    hasAttachment: false,
    time: "2025-06-20T12:00:00",
    isUnread: false,
    folder: "trash",
  },
  {
    id: 5,
    from: "Starred Note",
    subject: "Pinned message content",
    starred: true,
    hasAttachment: false,
    time: "2025-06-11T09:15:00",
    isUnread: false,
    folder: "starred",
  },
  // Add more emails as needed
];

const EmailContent = ({ folder }) => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    // simulate fetch with a timeout
    setTimeout(() => {
      const inbox = mockEmails.filter((e) => e.folder === folder);
      setEmails(inbox);
    }, 300);
  }, [folder]);

  useEffect(() => {
    const results = emails.filter(
      (e) =>
        e.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.from.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(results);
    setPage(1); // reset to page 1 on search
  }, [searchTerm, emails]);

  const handleRowClick = (id) => {
    navigate(`/email/${id}`);
  };

  const handleStarToggle = (id) => {
    const updated = emails.map((e) =>
      e.id === id ? { ...e, starred: !e.starred } : e
    );
    setEmails(updated);
  };

  const handleRefresh = () => {
    setEmails([...mockEmails.filter((e) => e.folder === folder)]);
  };

  const start = (page - 1) * perPage;
  const pagedEmails = filtered.slice(start, start + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card mb-0">
          <div className="card-body">
            {/* Header */}
            <div className="email-header">
              <div className="row">
                <div className="col top-action-left d-flex align-items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search Messages"
                    className="form-control search-message"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    type="button"
                    title="Refresh"
                    onClick={handleRefresh}
                    className="btn btn-white"
                  >
                    <i className="fa fa-refresh" />
                  </button>
                </div>
                <div className="col-auto top-action-right text-end">
                  <div className="btn-group">
                    <button
                      className="btn btn-white"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <i className="fa fa-angle-left" />
                    </button>
                    <button
                      className="btn btn-white"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <i className="fa fa-angle-right" />
                    </button>
                  </div>
                  <div>
                    <span className="text-muted d-none d-md-inline-block">
                      Page {page} of {totalPages}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Table */}
            <div className="email-content">
              <div className="table-responsive">
                <table className="table table-inbox table-hover">
                  <thead>
                    <tr>
                      <th colSpan={6}>
                        <input type="checkbox" className="checkbox-all" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedEmails.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No results found.
                        </td>
                      </tr>
                    ) : (
                      pagedEmails.map((email) => (
                        <tr
                          key={email.id}
                          className={`clickable-row ${email.isUnread ? "unread" : ""}`}
                          onClick={() => handleRowClick(email.id)}
                        >
                          <td>
                            <input type="checkbox" className="checkmail" />
                          </td>
                          <td
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStarToggle(email.id);
                            }}
                          >
                            <span className="mail-important">
                              <i
                                className={
                                  email.starred
                                    ? "fa fa-star starred"
                                    : "far fa-star"
                                }
                              />
                            </span>
                          </td>
                          <td className="name">{email.from}</td>
                          <td className="subject">{email.subject}</td>
                          <td>{email.hasAttachment && <i className="fa fa-paperclip" />}</td>
                          <td className="mail-date">{formatDate(email.time)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailContent;
