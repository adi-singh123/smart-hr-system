/** @format */

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import * as bootstrap from "bootstrap";
import {
  Add_event,
  edit_event,
  delete_event,
} from "../../Redux/services/Calendar";
import { setSelectedEvent } from "../../Redux/features/CalenderSlice";
import DeleteModal from "../../components/modelpopup/DeleteModal";
import { get_all_events } from "../../Redux/services/Calendar";

const CalendarModal = () => {
  const dispatch = useDispatch();
  const { selectedEvent, isLoading } = useSelector((state) => state.Calendar);

  const [eventName, setEventName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const categories = [
    { label: "Danger", value: "Danger" },
    { label: "Success", value: "Success" },
    { label: "Purple", value: "Purple" },
    { label: "Primary", value: "Primary" },
    { label: "Pink", value: "Pink" },
    { label: "Info", value: "Info" },
    { label: "Inverse", value: "Inverse" },
    { label: "Orange", value: "Orange" },
    { label: "Brown", value: "Brown" },
    { label: "Teal", value: "Teal" },
    { label: "Warning", value: "Warning" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": { backgroundColor: "#ff9b44" },
    }),
  };

  // Populate form when editing
  useEffect(() => {
    if (selectedEvent) {
      setEventName(selectedEvent.event_name);
      setSelectedDate(new Date(selectedEvent.event_date));
      setSelectedCategory({
        label: selectedEvent.category_name,
        value: selectedEvent.category_name,
      });
    } else {
      setEventName("");
      setSelectedDate(null);
      setSelectedCategory(null);
    }
  }, [selectedEvent]);

  const handleDateChange = (date) => setSelectedDate(date);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventName || !selectedDate || !selectedCategory) {
      alert("Please fill all required fields");
      return;
    }

    const formData = {
      id: selectedEvent?.id || null,
      event_name: eventName,
      event_date: `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`, // ✅ no timezone conversion
      category_name: selectedCategory.value,
    };



    try {
      if (selectedEvent) {
        await dispatch(edit_event(formData)).unwrap();
      } else {
        await dispatch(Add_event(formData)).unwrap();
      }
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      // ✅ This code will now always run, whether the dispatch succeeds or fails.
      const modalEl = document.getElementById("add_event");
      const modalInstance =
        bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }

      // ✅ Reset form & clear Redux selectedEvent
      setEventName("");
      setSelectedDate(null);
      setSelectedCategory(null);
      dispatch(setSelectedEvent(null));
      dispatch(get_all_events())
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(delete_event(id)).unwrap();
      setDeleteId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div id="add_event" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{
                border: "none",
                background: "transparent",
                fontSize: "1.5rem",
                fontWeight: "bold",
                lineHeight: "1",
                color: "#000",
              }}
            >
              &times;
            </button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="input-block mb-3">
                <label className="col-form-label">
                  Event Name <span className="text-danger">*</span>
                </label>
                <input
                  placeholder="Ex-holi"
                  className="form-control"
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>

              <div className="input-block mb-3">
                <label className="col-form-label">
                  Event Date <span className="text-danger">*</span>
                </label>
                <div className="cal-icon">
                  <DatePicker
                    className="form-control w-100"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd-MM-yyyy"
                  />
                </div>
              </div>

              <div className="input-block mb-3">
                <label className="col-form-label">Category</label>
                <Select
                  options={categories}
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value)}
                  placeholder="Select Category"
                  styles={customStyles}
                />
              </div>

              <div className="submit-section">
                <button
                  className="btn btn-primary submit-btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {selectedEvent ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Modal (optional) */}
      <DeleteModal
        Name="Delete Event"
        Id={deleteId}
        deleteHandler={handleDelete}
      />
    </div>
  );
};

export default CalendarModal;