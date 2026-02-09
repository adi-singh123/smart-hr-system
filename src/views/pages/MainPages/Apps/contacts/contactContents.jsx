import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Dropdown, Menu, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const ContactContents = ({ searchTerm, selectedCategory }) => {
  const { clients } = useSelector((state) => state.client);
  const { employeeData } = useSelector((state) => state.employee);

  const allContacts = [...(clients || []), ...(employeeData?.users || [])];

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ").filter(Boolean);
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  const filteredContacts = allContacts.filter((contact) => {
    const isClient = !!contact.client_id;
    const isStaff = !!contact.id && !isClient;

    if (selectedCategory === "Client" && !isClient) {
      return false;
    }
    if (selectedCategory === "Staff" && !isStaff) {
      return false;
    }

    const nameToSearch = contact.company_name || contact.first_name || "";
    return nameToSearch.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="chat-contents">
      <div className="chat-content-wrap">
        <div className="chat-wrap-inner">
          <div className="contact-box">
            <div className="row">
              <div className="contact-cat col-sm-4 col-lg-3">
                <div className="roles-menu">
                  <ul>
                    {["All", "Client", "Staff"].map((cat) => (
                      <li key={cat} className={selectedCategory === cat ? "active" : ""}>
                        <Link
                          to="#"
                          onClick={() =>
                            window.dispatchEvent(
                              new CustomEvent("change-category", { detail: cat })
                            )
                          }
                        >
                          {cat}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="contacts-list col-sm-8 col-lg-9">
                <ul className="contact-list">
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact, index) => (
                      <li key={index} style={{ marginBottom: '10px' }}>
                        <div className="contact-cont" style={{ display: 'flex', alignItems: 'center' }}>
                          <div className="float-start user-img">
                            <Link
                              to="#"
                              onClick={(e) => e.preventDefault()}
                              className="avatar"
                            >
                              {contact.imageSrc?.trim() ? (
                                <img
                                  className="rounded-circle"
                                  alt={contact.company_name || `${contact.first_name} ${contact.last_name}`}
                                  src={contact.imageSrc}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "50%",
                                  }}
                                >
                                  {getInitials(contact.company_name || `${contact.first_name} ${contact.last_name}`)}
                                </div>
                              )}
                              <span className="status online" />
                            </Link>
                          </div>
                          <div className="contact-info">
                            <span
                              className="contact-name text-ellipsis"
                              style={{
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                display: "inline-block",
                                maxWidth: "140px",
                              }}
                            >
                              {contact.company_name || `${contact.first_name} ${contact.last_name}`}
                            </span>
                            <span
                              className="contact-date"
                              style={{
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                display: "inline-block",
                                maxWidth: "140px",
                              }}
                            >
                              {contact.jobTitle}
                            </span>
                          </div>
                          <ul className="contact-action" style={{ display: 'flex', alignItems: 'center' }}>
                            <Dropdown
                              trigger={["click"]}
                              placement="bottomRight"
                              overlay={
                                <Menu>
                                  <Menu.Item key="view">
                                    <Link to={`/profile/${contact.id}`}>
                                      <i className="fa fa-eye me-2" /> View
                                    </Link>
                                  </Menu.Item>
                                  {/* <Menu.Item
                                    key="edit"
                                    onClick={() => {
                                      // Logic to open edit modal
                                    }}
                                  >
                                    <i className="fa fa-pencil me-2" /> Edit
                                  </Menu.Item> */}
                                  {/* <Menu.Item
                                    key="delete"
                                    onClick={() => {
                                      // Logic to open delete modal
                                    }}
                                  >
                                    <i className="fa fa-trash me-2" /> Delete
                                  </Menu.Item> */}
                                </Menu>
                              }
                            >
                              <Button
                                type="link"
                                style={{ color: "#1890ff", fontSize: 22 }}
                              >
                                <i className="material-icons">more_vert</i>
                                <MoreOutlined />
                              </Button>
                            </Dropdown>
                          </ul>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center w-100">No contacts found</li>
                  )}
                </ul>
              </div>
              {/* <div className="contact-alphapets">
                <div className="alphapets-inner">
                  {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                    <Link key={letter} to="#">
                      {letter}
                    </Link>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactContents;