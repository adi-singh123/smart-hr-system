/** @format */

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useSelector, useDispatch } from "react-redux";
import { customAlert } from "../../utils/Alert";
import { fetchNotifications } from "../../Redux/services/Notifications";
import { add_holiday, update_holiday } from "../../Redux/services/Holiday"; // ✅ Redux services import
import "react-datepicker/dist/react-datepicker.css";

export const AddHoliday = ({
  onHolidayAdded,
  isEditing,
  holidayData,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const [holidayName, setHolidayName] = useState("");

  // 🔑 Redux tokens
  const token = useSelector((state) => state.auth.token);
  const refreshToken = useSelector((state) => state.auth.refreshToken);

  // 🔹 Pre-fill fields in edit mode
  useEffect(() => {
    if (isEditing && holidayData) {
      setHolidayName(holidayData.Title || "");
      setSelectedDate(
        holidayData.HolidayDate ? new Date(holidayData.HolidayDate) : null
      );
    } else {
      setHolidayName("");
      setSelectedDate(null);
    }
  }, [isEditing, holidayData]);

  // 🔹 Reset form on modal close
  useEffect(() => {
    const modalElement = document.getElementById("add_holiday");

    const handleModalClose = () => {
      setHolidayName("");
      setSelectedDate(null);
      if (onClose) onClose();
    };

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalClose);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
      }
    };
  }, [onClose]);

  // 🔹 Date change handler
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // 🔹 Submit handler (add or update via Redux)
  const handleSubmit = async () => {
    if (!holidayName || holidayName.trim().length < 4) {
      customAlert("Please enter a complete holiday title");
      return;
    }
    if (!selectedDate) {
      customAlert("Please select a holiday date.");
      return;
    }

   const year = selectedDate.getFullYear();
 const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
const day = String(selectedDate.getDate()).padStart(2, "0");

const payload = {
  Title: holidayName,
  HolidayDate: `${year}-${month}-${day}`,
};


    try {
      if (isEditing && holidayData?.id) {
        // 🔹 Update holiday
        const res = await dispatch(
          update_holiday({ id: holidayData.id, formData: payload })
        ).unwrap();

        if (res?.status) {
        } else {
        }
      } else {
        // 🔹 Add new holiday
        const res = await dispatch(add_holiday(payload)).unwrap();

        if (res?.status) {
          customAlert("Holiday added successfully!", "success");
        } else {
          customAlert(res?.message || "Failed to add holiday");
        }
      }

      // 🔹 Fetch updated notifications
      await dispatch(fetchNotifications());

      // 🔹 Close modal
      document.getElementById("closeAdd")?.click();

      // 🔹 Refresh holiday list
      if (onHolidayAdded) onHolidayAdded();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving holiday:", error);
      customAlert("Server error while saving holiday");
    }
  };

  return (
    <div>
      <div className="modal custom-modal fade" id="add_holiday" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditing ? "Edit Holiday" : "Add Holiday"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeAdd"
                onClick={onClose}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* Holiday Name */}
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Holiday Name <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="e.g., Christmas or May Day"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                />
              </div>

              {/* Holiday Date */}
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Holiday Date <span className="text-danger">*</span>
                </label>
                <div className="cal-icon">
                 <DatePicker
  selected={selectedDate}
  onChange={handleDateChange}
  dateFormat="dd-MM-yyyy"
  className="form-control datetimepicker"
  placeholderText="e.g., 25 Dec 2025"
  showPopperArrow={false}
/>

                </div>
              </div>

              {/* Submit Button */}
              <div className="submit-section">
                <button
                  className="btn btn-primary submit-btn"
                  type="button"
                  onClick={handleSubmit}
                >
                  {isEditing ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
