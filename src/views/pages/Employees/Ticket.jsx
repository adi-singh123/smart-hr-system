import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { get_tickets } from "../../../Redux/services/Ticket";
import DeleteTicket from "../../../components/modelpopup/DeleteTicket";
import EditTicketModal from "../../../components/modelpopup/EditTicketModal";
import TicketModelPopup from "../../../components/modelpopup/TicketModelPopup";
import Breadcrumbs from "../../../components/Breadcrumbs";
import TicketFilter from "../../../components/TicketFilter";
import { base_url } from "../../../base_urls";

const Ticket = () => {
  const [users, setUsers] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const dispatch = useDispatch();
  const data = useSelector((state) => state?.ticket?.allTickets || []);
  const employees = useSelector((state) => state.employee?.employeeData?.users || []);

  useEffect(() => {
    dispatch(get_tickets());
  }, [dispatch]);

  useEffect(() => {
    axios.get(base_url + "/api/ticket.json").then((res) => setUsers(res.data));
  }, []);

  const handleEdit = (id) => {
    setSelectedTicketId(id);
    setEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      setSelectedTicketId(id);
      setDeleteModalOpen(true);
    }
  };

  const getStaffFullName = (staffId) => {
    const staff = employees.find((emp) => emp.id === staffId);
    if (!staff) return "Unassigned";
    return `${staff.first_name || ""} ${staff.last_name || ""}`;
  };

  const newTickets = data.filter((t) => t.status === "New").length;
  const closedTickets = data.filter((t) => t.status === "Closed").length;
  const openTickets = data.filter((t) => t.status === "Open").length;
  const pendingTickets = data.filter((t) => t.status !== "Closed").length;
  const total = data.length;

  const statusColors = {
    New: "primary",
    Open: "info",
    Reopened: "info",
    "On Hold": "warning",
    Closed: "success",
    "In Progress": "secondary",
    Cancelled: "danger",
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Ticket Id",
      dataIndex: "ticket_id",
      render: (ticket_id, record) => (
        <Link
          onClick={() => localStorage.setItem("minheight", "true")}
          to="/ticket-details"
          state={{ ticketData: record }}
        >
          {ticket_id}
        </Link>
      ),
      sorter: (a, b) => {
        const extractNum = (id) => parseInt(id?.split("-").pop(), 10);
        return extractNum(a.ticket_id) - extractNum(b.ticket_id);
      },
    },
    {
      title: "Ticket Subject",
      dataIndex: "ticket_subject",
      render: (subject) => (
        <span style={{ color: subject?.length < 3 ? "red" : "inherit" }}>
          {subject || "N/A"}
        </span>
      ),
      sorter: (a, b) => a.ticket_subject.length - b.ticket_subject.length,
    },
    {
      title: "Assigned Staff",
      dataIndex: "assign_staff",
      render: (staffId) => {
        const name = getStaffFullName(staffId);
        return (
          <span style={{ color: name === "Unassigned" ? "red" : "inherit" }}>
            {name}
          </span>
        );
      },
      sorter: (a, b) =>
        getStaffFullName(a.assign_staff).localeCompare(getStaffFullName(b.assign_staff)),
    },
    {
      title: "Created Date",
      dataIndex: "created_date",
      render: (date) =>
        date && !isNaN(new Date(date))
          ? format(new Date(date), "dd-MMM-yyyy hh:mm a")
          : "N/A",
      sorter: (a, b) => new Date(a.created_date) - new Date(b.created_date),
    },
    {
      title: "Last Reply",
      dataIndex: "updated_date",
      render: (date) =>
        date && !isNaN(new Date(date))
          ? format(new Date(date), "dd-MMM-yyyy hh:mm a")
          : "N/A",
      sorter: (a, b) => new Date(a.updated_date) - new Date(b.updated_date),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      sorter: (a, b) => a.priority.length - b.priority.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className={`badge bg-${statusColors[status] || "dark"}`}>
          <i className="far fa-dot-circle me-1" /> {status}
        </span>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Action",
      render: (id) => (
        <div className="text-end">
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => handleEdit(id)}
          >
            <i className="fa fa-pencil" /> Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(id)}
          >
            <i className="fa fa-trash" /> Delete
          </button>
        </div>
      ),
      sorter: false,
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Tickets"
          title="Dashboard"
          subtitle="Tickets"
          modal="#add_ticket"
          name="Add Ticket"
        />

        <div className="row">
          {/* Ticket Statistics Cards */}
          {/* New, Closed, Open, Pending */}
        </div>

        <TicketFilter />

        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                rowKey={(record) => record.id}
                style={{ overflowX: "auto" }}
                columns={columns}
                dataSource={data.length > 0 ? data : []}
              />
            </div>
          </div>
        </div>
      </div>

      <TicketModelPopup />

      {isEditModalOpen && selectedTicketId && (
        <EditTicketModal
          ticket={selectedTicketId}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && selectedTicketId && (
        <DeleteTicket
          id={selectedTicketId}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Ticket;
