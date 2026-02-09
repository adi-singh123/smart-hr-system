import React, { useState } from "react";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationSettings = () => {
  const [notificationState, setNotificationState] = useState([
    {
      id: "staff_module",
      label: "Employee",
      checked: false,
      default: false,
    },
    {
      id: "holidays_module",
      label: "Holidays",
      checked: true,
      default: true,
    },
    {
      id: "leave_module",
      label: "Leaves",
      checked: true,
      default: true,
    },
    {
      id: "events_module",
      label: "Events",
      checked: true,
      default: true,
    },
    {
      id: "chat_module",
      label: "Chat",
      checked: true,
      default: true,
    },
    {
      id: "job_module",
      label: "Jobs",
      checked: false,
      default: false,
    },
  ]);

  const handleToggle = (index) => {
    const updated = [...notificationState];
    updated[index].checked = !updated[index].checked;
    setNotificationState(updated);
    toast.success(
      `${updated[index].label} notification ${updated[index].checked ? "enabled" : "disabled"}`
    );
  };

  const handleSave = () => {
    // Simulate saving to backend
    setTimeout(() => {
      toast.success("Notification settings saved successfully!");
    }, 500);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <Breadcrumbs maintitle="Notification Settings" />
              <ul className="list-group notification-list">
                {notificationState.map((item, index) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span>{item.label}</span>
                      <span className="text-muted ms-2">(Default: {item.default ? "ON" : "OFF"})</span>
                    </div>
                    <div className="status-toggle d-flex align-items-center">
                      <span
                        className={`badge me-2 ${
                          item.checked ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {item.checked ? "ON" : "OFF"}
                      </span>
                      <input
                        type="checkbox"
                        id={item.id}
                        className="check"
                        checked={item.checked}
                        onChange={() => handleToggle(index)}
                      />
                      <label htmlFor={item.id} className="checktoggle" />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="submit-section text-center mt-4">
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default NotificationSettings;
