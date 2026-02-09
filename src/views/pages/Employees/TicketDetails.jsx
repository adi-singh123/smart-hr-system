import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import {
  Avatar_05,
  Avatar_08,
  Avatar_09,
  Avatar_10,
  Avatar_11,
  avatar1,
  avatar27,
  avatar28,
} from "../../../Routes/ImagePath";
import { getName } from "../../../Redux/services/User";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTicketChat, addTicketChat } from "../../../Redux/services/Ticket";
const TicketDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(
    location.state?.ticketData || null
  );

  const [fullName, setFullName] = useState("");
  const [name, setName] = useState("");
  const [userNames, setUserNames] = useState({});
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const baseUrl = "https://api.bilvaleaf.in"; // API Base URL
  // const socket = io(baseUrl);
  console.log("Ticket Data", ticketData);
  const fileName =
    ticketData?.file_upload?.split("uploads/tickets/")[1] || "No file";
  // const baseUrl = "https://api.bilvaleaf.in";
  const fileUrl = ticketData?.file_upload
    ? `${baseUrl}/${ticketData.file_upload}`
    : null;
  const fetchUserName = async (userId) => {
    try {
      const result = await dispatch(getName(userId)).unwrap();
      console.log("result", result);
      setFullName(result);
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  const fetchUserName2 = async (userId) => {
    if (!userId || userNames[userId]) return; // Skip if already fetched

    try {
      const result = await dispatch(getName(userId)).unwrap();
      setUserNames((prev) => ({ ...prev, [userId]: result })); // Cache username
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };
  useEffect(() => {
    const uniqueUserIds = [...new Set(message.map((msg) => msg.user_id))]; // Get unique IDs

    uniqueUserIds.forEach((userId) => {
      fetchUserName2(userId);
    });
  }, [message]);

  useEffect(() => {
    if (!ticketData) {
      navigate("/tickets");
      return;
    }
    if (ticketData?.created_by) {
      fetchUserName(ticketData.created_by);
    }
  });

  useEffect(() => {
    console.log("Message State Updated: ", message);
  }, [message]);
  useEffect(() => {
    const socket = io("https://api.bilvaleaf.in");

    if (ticketData?.ticket_id) {
      dispatch(getTicketChat(ticketData?.ticket_id))
        .unwrap()
        .then((data) => setMessage(data));

      socket.emit("joinTicket", ticketData?.ticket_id);
    }

    socket.on("newTicketChat", (newMessage) => {
      console.log("Received new message:", newMessage); // Debugging
      setMessage((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketData?.ticket_id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const chatData = {
      ticket_id: ticketData?.ticket_id,
      message: newMessage,
    };

    console.log("Sending Message:", chatData);

    try {
      await dispatch(addTicketChat(chatData)).unwrap(); // Ensure message is added

      // Fetch updated messages after adding new message
      const updatedChat = await dispatch(
        getTicketChat(ticketData?.ticket_id)
      ).unwrap();

      console.log("Updated Messages:", updatedChat.messages);

      setMessage(updatedChat); // Set only the messages array
      setNewMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl, {
        mode: "cors",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = ticketData.file_upload.split("/").pop();
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <>
      {}
      <div className="page-wrapper">
        <div className="content container-fluid">
          {}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col-md-4">
                <h3 className="page-title mb-0">Ticket Detail</h3>
              </div>
            </div>
          </div>
          {}
          <hr />
          <div className="row">
            <div className="col-xl-8 col-lg-7">
              <div className="ticket-detail-head">
                <div className="row">
                  <div className="col-xxl-3 col-md-6">
                    <div className="ticket-head-card">
                      <span className="ticket-detail-icon">
                        <i className="la la-stop-circle" />
                      </span>
                      <div className="detail-info">
                        <h6>Status</h6>
                        <span className="badge badge-soft-warning">
                          <span>
                            {ticketData?.status || "No Status Available"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-3 col-md-6">
                    <div className="ticket-head-card">
                      <span className="ticket-detail-icon bg-danger-lights">
                        <i className="la la-user" />
                      </span>
                      <div className="detail-info info-two">
                        <h6>Created By</h6>
                        <span>{fullName ? fullName : "Unknown "}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-3 col-md-6">
                    <div className="ticket-head-card">
                      <span className="ticket-detail-icon bg-warning-lights">
                        <i className="la la-calendar" />
                      </span>
                      <div className="detail-info info-two">
                        <h6>Created Date</h6>
                        <span>
                          <span>
                            {ticketData?.created_date
                              ? format(
                                  new Date(ticketData.created_date),
                                  "dd-MMM-yyyy"
                                )
                              : "N/A"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-3 col-md-6">
                    <div className="ticket-head-card">
                      <span className="ticket-detail-icon bg-purple-lights">
                        <i className="la la-info-circle" />
                      </span>
                      <div className="detail-info">
                        <h6>Priority</h6>
                        <span className="badge badge-soft-danger">
                          {ticketData?.priority || "Null"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ticket-purpose">
                <h4>{ticketData?.ticket_subject || "Null"}</h4>
                <p>{ticketData?.description || "Null"}</p>

                {}
              </div>
              <div className="attached-files-info">
                <div className="row">
                  <div className="col-xxl-6">
                    <div className="attached-files">
                      <ul>
                        <li>
                          <div className="d-flex align-items-center">
                            <span className="file-icon">
                              <i className="la la-file-pdf" />
                            </span>
                            <p>{fileName}</p>
                          </div>
                          <div className="file-download">
                            <button
                              onClick={handleDownload}
                              className="btn btn-primary"
                            >
                              <i className="la la-download me-2" /> Download
                              File
                            </button>
                          </div>
                        </li>
                        {}
                      </ul>
                    </div>
                  </div>
                  {}
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-5 theiaStickySidebar">
              <div className="stickybar">
                <div className="ticket-chat">
                  <div className="ticket-chat-head">
                    <h4>Ticket Chat</h4>
                    <div className="chat-post-box">
                      <form onSubmit={handleSendMessage}>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                        />
                        <div className="files-attached d-flex justify-content-between align-items-center">
                          <button type="submit">Send</button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="ticket-chat-body">
                    <ul className="created-tickets-info">
                      {message.length > 0 ? (
                        message.map((msg, index) => {
                          console.log("Message Data:", msg); // Debugging
                          console.log("Created At (Raw):", msg.created_at); // Debugging

                          const parsedDate = Date.parse(msg.created_at)
                            ? new Date(msg.created_at)
                            : null;

                          const formattedDate = parsedDate
                            ? parsedDate.toLocaleString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              })
                            : "Just now"; // Fallback

                          return (
                            <li key={index}>
                              <div className="ticket-created-user">
                                <span className="avatar">
                                  <span
                                    className="avatar-text"
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      backgroundColor: "black",
                                      color: "white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: "bold",
                                      borderRadius: "50%",
                                      fontSize: "18px",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {(userNames[msg.user_id] || "U")
                                      .charAt(0)
                                      .toUpperCase()}
                                  </span>
                                </span>
                                <div className="user-name">
                                  <h5>
                                    <span>
                                      {userNames[msg.user_id] || "User"}
                                    </span>{" "}
                                  </h5>
                                  <span>{formattedDate}</span>
                                </div>
                              </div>
                              <p className="details-text">{msg?.message}</p>
                            </li>
                          );
                        })
                      ) : (
                        <li>
                          <p>No messages yet.</p>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {}
        <div id="edit_ticket" className="modal custom-modal fade" role="dialog">
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Ticket</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Ticket Subject</label>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue="Laptop Issue"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Ticket Id</label>
                        <input
                          className="form-control"
                          type="text"
                          readOnly=""
                          defaultValue="TKT-0001"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Assign Staff</label>
                        <select className="select">
                          <option>-</option>
                          <option selected="">Mike Litorus</option>
                          <option>John Smith</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Client</label>
                        <select className="select">
                          <option>-</option>
                          <option>Delta Infotech</option>
                          <option selected="">
                            International Software Inc
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Priority</label>
                        <select className="select">
                          <option>High</option>
                          <option selected="">Medium</option>
                          <option>Low</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">CC</label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Assign</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">
                          Ticket Assignee
                        </label>
                        <div className="project-members">
                          <Link
                            title="John Smith"
                            data-bs-toggle="tooltip"
                            to="#"
                          >
                            <img src={Avatar_10} alt="img" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Add Followers</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">
                          Ticket Followers
                        </label>
                        <div className="project-members">
                          <Link
                            title="Richard Miles"
                            data-bs-toggle="tooltip"
                            to="#"
                            className="avatar"
                          >
                            <img src={Avatar_09} alt="img" />
                          </Link>
                          <Link
                            title="John Smith"
                            data-bs-toggle="tooltip"
                            to="#"
                            className="avatar"
                          >
                            <img src={Avatar_10} alt="img" />
                          </Link>
                          <Link
                            title="Mike Litorus"
                            data-bs-toggle="tooltip"
                            to="#"
                            className="avatar"
                          >
                            <img src={Avatar_05} alt="img" />
                          </Link>
                          <Link
                            title="Wilmer Deluna"
                            data-bs-toggle="tooltip"
                            to="#"
                            className="avatar"
                          >
                            <img src={Avatar_11} alt="img" />
                          </Link>
                          <span className="all-team">+2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          defaultValue={""}
                        />
                      </div>
                      <div className="input-block mb-3">
                        <label className="col-form-label">Upload Files</label>
                        <input className="form-control" type="file" />
                      </div>
                    </div>
                  </div>
                  <div className="submit-section">
                    <button className="btn btn-primary submit-btn">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {}
        {}
        <div
          className="modal custom-modal fade"
          id="delete_ticket"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Ticket</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <Link to="#" className="btn btn-primary continue-btn">
                        Delete
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link
                        to="#"
                        data-bs-dismiss="modal"
                        className="btn btn-primary cancel-btn"
                      >
                        Cancel
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {}
        {}
        <div id="assignee" className="modal custom-modal fade" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign to this task</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="input-group m-b-30">
                  <input
                    placeholder="Search to add"
                    className="form-control search-input"
                    type="text"
                  />
                  <button className="btn btn-primary">Search</button>
                </div>
                <div>
                  <ul className="chat-user-list">
                    <li>
                      <Link to="#">
                        <div className="chat-block d-flex">
                          <span className="avatar">
                            <img src={Avatar_11} alt="img" />
                          </span>
                          <div className="media-body align-self-center text-nowrap">
                            <div className="user-name">Richard Miles</div>
                            <span className="designation">Web Developer</span>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <div className="chat-block d-flex">
                          <span className="avatar">
                            <img src={Avatar_10} alt="img" />
                          </span>
                          <div className="media-body align-self-center text-nowrap">
                            <div className="user-name">John Smith</div>
                            <span className="designation">
                              Android Developer
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <div className="chat-block d-flex">
                          <span className="avatar">
                            <img src={Avatar_10} alt="img" />
                          </span>
                          <div className="media-body align-self-center text-nowrap">
                            <div className="user-name">Jeffery Lalor</div>
                            <span className="designation">Team Leader</span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Assign</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {}
        {}
        <div
          id="task_followers"
          className="modal custom-modal fade"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add followers to this task</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="input-group m-b-30">
                  <input
                    placeholder="Search to add"
                    className="form-control search-input"
                    type="text"
                  />
                  <button className="btn btn-primary">Search</button>
                </div>
                <div>
                  <ul className="chat-user-list">
                    <li>
                      <Link to="#">
                        <div className="chat-block d-flex">
                          <span className="avatar">
                            <img src={Avatar_10} alt="img" />
                          </span>
                          <div className="media-body media-middle text-nowrap">
                            <div className="user-name">Jeffery Lalor</div>
                            <span className="designation">Team Leader</span>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <div className="chat-block d-flex">
                          <span className="avatar">
                            <img src={Avatar_08} alt="img" />
                          </span>
                          <div className="media-body media-middle text-nowrap">
                            <div className="user-name">Catherine Manseau</div>
                            <span className="designation">
                              Android Developer
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <div className="chat-block d-flex">
                          <span className="avatar">
                            <img src={Avatar_11} alt="img" />
                          </span>
                          <div className="media-body media-middle text-nowrap">
                            <div className="user-name">Wilmer Deluna</div>
                            <span className="designation">Team Leader</span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">
                    Add to Follow
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {}
      </div>
      {}
    </>
  );
};

export default TicketDetails;
