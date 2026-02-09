/** @format */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarModal from "../../../../../components/modelpopup/CalendarModal";
import { get_all_events } from "../../../../../Redux/services/Calendar";
import { setSelectedEvent } from "../../../../../Redux/features/CalenderSlice";
import * as bootstrap from "bootstrap";

const Calendar = () => {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.Calendar);
  const [weekendsVisible] = useState(true);

  // New state to force re-render
  const [calendarKey, setCalendarKey] = useState(0);

  // Fetch events on mount and whenever data is updated
  useEffect(() => {
    dispatch(get_all_events());
  }, [dispatch]);

  // Watch for changes in the events array and update the key
  useEffect(() => {
    setCalendarKey(prevKey => prevKey + 1);
  }, [events]);

  const getTextColor = (categoryName) => {
    const darkColors = ["danger", "purple", "primary", "inverse", "brown", "teal", "success"];
    return darkColors.includes(categoryName.toLowerCase()) ? "white" : "black";
  };

  // Convert Redux events to FullCalendar format with conditional text color
  const calendarEvents = events?.map((ev) => ({
    id: ev.id,
    title: ev.event_name,
    start: new Date(ev.event_date),
    className: `bg-${ev.category_name.toLowerCase()}`,
    textColor: getTextColor(ev.category_name)
  }));

  const handleEventClick = (info) => {
    const eventId = info.event.id;
    const selected = events.find((ev) => ev.id === eventId);
    dispatch(setSelectedEvent(selected));
    const modal = new bootstrap.Modal(document.getElementById("add_event"));
    modal.show();
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Events</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="admin-dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Events</li>
              </ul>
            </div>
            <div className="col-auto float-end ms-auto">
              <Link
                to="#"
                className="btn add-btn"
                data-bs-toggle="modal"
                data-bs-target="#add_event"
                onClick={() => dispatch(setSelectedEvent(null))}
              >
                <i className="fa-solid fa-plus" /> Add Event
              </Link>
            </div>
          </div>
        </div>
        <div className="mb-3 d-flex gap-3 flex-wrap">
          <span className="d-flex align-items-center gap-2">
            <span className="bg-success rounded-circle d-inline-block" style={{ width: 12, height: 12 }}></span>
            <span>Meetings</span>
          </span>
          <span className="d-flex align-items-center gap-2">
            <span className="bg-info rounded-circle d-inline-block" style={{ width: 12, height: 12 }}></span>
            <span>Workshops</span>
          </span>
          <span className="d-flex align-items-center gap-2">
            <span className="bg-primary rounded-circle d-inline-block" style={{ width: 12, height: 12 }}></span>
            <span>Trainings</span>
          </span>
          <span className="d-flex align-items-center gap-2">
            <span className="bg-purple rounded-circle d-inline-block" style={{ width: 12, height: 12 }}></span>
            <span>Holidays</span>
          </span>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card mb-0">
              <div className="card-body">
                <FullCalendar
                  key={calendarKey}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  initialView="dayGridMonth"
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  weekends={weekendsVisible}
                  events={calendarEvents}
                  selectAllow={(selectInfo) => {
                    const now = new Date().setHours(0, 0, 0, 0);
                    return selectInfo.start >= now;
                  }}
                  eventDidMount={(info) => info.el.setAttribute("title", info.event.title)}
                  dayCellDidMount={(info) => {
                    const today = new Date();
                    const cellDate = new Date(info.date);
                    today.setHours(0, 0, 0, 0);
                    if (cellDate < today) {
                      info.el.style.opacity = "0.4";
                      info.el.style.pointerEvents = "none";
                      info.el.style.cursor = "not-allowed";
                      info.el.setAttribute("title", "Past date – not editable");
                    }
                  }}
                  eventClick={handleEventClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CalendarModal />
    </div>
  );
};

export default Calendar;