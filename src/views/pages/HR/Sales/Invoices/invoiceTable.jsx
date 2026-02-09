/** @format */

import React, { useEffect, useState } from "react";
import { Table, Dropdown, Menu, Button, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvoices,
  deleteInvoice,
} from "../../../../../Redux/services/Invoice";
import { fetchClientById } from "../../../../../Redux/services/Client";
import { useNavigate } from "react-router-dom";

const InvoiceTable = ({ filters = {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { invoices = [], loading } = useSelector(
    (state) => state.invoices || {}
  );
  const [invoiceData, setInvoiceData] = useState([]);

  // 🟢 Fetch invoices
  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  // 🟢 Map client_id → client name
  useEffect(() => {
    const fetchClients = async () => {
      const updated = await Promise.all(
        invoices.map(async (inv) => {
          if (inv.client_id) {
            const res = await dispatch(fetchClientById(inv.client_id));
            const client = res?.payload?.data;
            const clientName = client
              ? `${client.first_name || ""} ${client.last_name || ""}`.trim()
              : "Unknown Client";
            return { ...inv, clientName };
          }
          return { ...inv, clientName: "Unknown Client" };
        })
      );
      setInvoiceData(updated);
    };

    if (invoices.length > 0) fetchClients();
  }, [invoices, dispatch]);

  const handleDelete = async (id) => {
    await dispatch(deleteInvoice(id));
    dispatch(fetchInvoices());
  };

  const handleEdit = (record) => navigate(`/edit-invoice/${record.id}`);
  const handleView = (id) => navigate(`/invoice-view/${id}`);

  const getMenu = (record) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(record)}>
        <i className="fa fa-pencil m-r-5" /> Edit
      </Menu.Item>
      <Menu.Item key="view" onClick={() => handleView(record.id)}>
        <i className="fa fa-eye m-r-5" /> View
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(record.id)}>
        <i className="fa fa-trash m-r-5" /> Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Sr.no",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Client", // 🟢 changed from "Client id"
      dataIndex: "clientName", // 🟢 now showing client name
      render: (text) => text || "Unknown Client",
    },
    {
      title: "Created",
      dataIndex: "invoice_date",
    },
    {
      title: "Due",
      dataIndex: "due_date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text) => `$${parseFloat(text || 0).toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span
          className={`badge bg-inverse-${
            text === "Paid" ? "success" : "warning"
          }`}
        >
          {text || "Pending"}
        </span>
      ),
    },
    {
      title: "Action",
      render: (record) => (
        <Tooltip title="Actions">
          <Dropdown overlay={getMenu(record)} trigger={["click"]}>
            <Button
              type="text"
              style={{
                background: "#f0f0f0",
                borderRadius: "50%",
                padding: "6px 10px",
                fontSize: "18px",
                fontWeight: "bold",
                lineHeight: "1",
                color: "#333",
              }}
            >
              &#8942;
            </Button>
          </Dropdown>
        </Tooltip>
      ),
    },
  ];

  // 🔍 Apply filter logic
  const filteredInvoices = invoiceData.filter((inv) => {
    const statusMatch = filters.status
      ? inv.status?.toLowerCase() === filters.status.toLowerCase()
      : true;

    const invoiceDate = new Date(inv.invoice_date);
    const fromDate = filters.from ? new Date(filters.from) : null;
    const toDate = filters.to ? new Date(filters.to) : null;

    const fromMatch = fromDate ? invoiceDate >= fromDate : true;
    const toMatch = toDate ? invoiceDate <= toDate : true;

    return statusMatch && fromMatch && toMatch;
  });

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="table-responsive">
          <Table
            loading={loading}
            columns={columns}
            dataSource={filteredInvoices}
            rowKey={(record) => record?.id}
            pagination={false}
            className="table table-striped custom-table mb-0"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
