/** @format */

import React, { useEffect, useState } from "react";
import { Table, Input, Modal, Dropdown, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../../../../../Redux/services/Invoice";
import { fetchClientById } from "../../../../../Redux/services/Client";

const InvoiceReportTable = () => {
  const dispatch = useDispatch();

  const { invoices = [] } = useSelector((state) => state.invoices || {});
  const [invoiceData, setInvoiceData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  // Map client ID to client name dynamically
  useEffect(() => {
    const fetchClients = async () => {
      const updatedInvoices = await Promise.all(
        invoices.map(async (inv) => {
          if (inv.client_id) {
            const clientRes = await dispatch(fetchClientById(inv.client_id));
            const clientName =
              clientRes?.payload?.data?.first_name &&
              clientRes?.payload?.data?.last_name
                ? `${clientRes.payload.data.first_name} ${clientRes.payload.data.last_name}`
                : "Unknown Client";
            return { ...inv, clientName };
          }
          return { ...inv, clientName: "Unknown Client" };
        })
      );
      setInvoiceData(updatedInvoices);
    };

    if (invoices.length > 0) {
      fetchClients();
    }
  }, [invoices, dispatch]);

  // Filter invoices based on search
  const filteredData = invoiceData.filter((inv) => {
    const text = searchText.toLowerCase();
    return (
      inv.clientName?.toLowerCase().includes(text) ||
      String(inv.amount).includes(text) ||
      inv.invoice_date?.includes(text) ||
      inv.due_date?.includes(text)
    );
  });

  // Open View modal
  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setViewModal(true);
  };

  // Dropdown menu for action
  const getMenu = (record) => (
    <Menu>
      <Menu.Item key="view" onClick={() => handleView(record)}>
        <i className="fa fa-eye me-2" /> View
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Sr No.",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Client",
      dataIndex: "clientName",
      sorter: (a, b) => a.clientName.localeCompare(b.clientName),
    },
    {
      title: "Created Date",
      dataIndex: "invoice_date",
      sorter: (a, b) =>
        new Date(a.invoice_date).getTime() - new Date(b.invoice_date).getTime(),
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      sorter: (a, b) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text) => <span>$ {text}</span>,
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span
          className={
            text === "Paid"
              ? "badge bg-inverse-success"
              : text === "Unpaid"
              ? "badge bg-inverse-info"
              : text === "Pending"
              ? "badge bg-inverse-warning"
              : "badge bg-inverse-default"
          }
        >
          {text}
        </span>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown overlay={getMenu(record)} trigger={["click"]}>
          <i className="material-icons" style={{ cursor: "pointer" }}>
            more_vert
          </i>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="row">
      <div className="col-md-12 mb-3">
        <Input
          placeholder="Search by Client, Amount, or Date"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="col-md-12">
        <div className="table-responsive">
          <Table
            className="table-striped"
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record.id}
          />
        </div>
      </div>

      {/* View Modal */}
      <Modal
        visible={viewModal}
        title="Invoice Details"
        footer={null}
        onCancel={() => setViewModal(false)}
      >
        {selectedInvoice ? (
          <div>
            <p>
              <strong>Client:</strong> {selectedInvoice.clientName}
            </p>
            <p>
              <strong>Created Date:</strong> {selectedInvoice.invoice_date}
            </p>
            <p>
              <strong>Due Date:</strong> {selectedInvoice.due_date}
            </p>
            <p>
              <strong>Amount:</strong> $ {selectedInvoice.amount}
            </p>
            <p>
              <strong>Status:</strong> {selectedInvoice.status}
            </p>
          </div>
        ) : (
          <p>No invoice selected.</p>
        )}
      </Modal>
    </div>
  );
};

export default InvoiceReportTable;
