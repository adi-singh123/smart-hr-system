import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import {
  createInvoice,
  updateInvoice,
  fetchInvoiceById,
} from "../../../../../Redux/services/Invoice";
import { fetchClients } from "../../../../../Redux/services/Client";

const InvoiceAddEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clientState = useSelector((state) => state.client || {});
  const { clients = [] } = clientState;
  const { selectedInvoice } = useSelector((state) => state.invoices);

  const [form, setForm] = useState({
    client_id: "",
    project_id: "",
    email: "",
    invoice_date: new Date(),
    due_date: new Date(),
    tax: "0",
    discount: "0",
    client_address: "",
    billing_address: "",
    tax_id: "",
    status: "Unpaid",
    other_information: "",
    items: [{ item: "", description: "", unit_cost: "", qty: "", amount: 0 }],
  });

  useEffect(() => {
    dispatch(fetchClients());
    if (id) {
      dispatch(fetchInvoiceById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && selectedInvoice && selectedInvoice.id === id) {
      setForm({
        ...selectedInvoice,
        invoice_date: new Date(selectedInvoice.invoice_date),
        due_date: new Date(selectedInvoice.due_date),
        items: selectedInvoice.items || [],
      });
    }
  }, [selectedInvoice, id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...form.items];
    updated[index][field] = value;
    if (field === "unit_cost" || field === "qty") {
      updated[index].amount = (
        parseFloat(updated[index].unit_cost || 0) *
        parseFloat(updated[index].qty || 0)
      ).toFixed(2);
    }
    setForm((prev) => ({ ...prev, items: updated }));
  };

  const addRow = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { item: "", description: "", unit_cost: "", qty: "", amount: 0 },
      ],
    }));
  };

  const removeRow = (index) => {
    const updated = [...form.items];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, items: updated }));
  };

  const subtotal = form.items.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
  const taxAmount = (subtotal * parseFloat(form.tax || 0)) / 100;
  const discountAmount = (subtotal * parseFloat(form.discount || 0)) / 100;
  const total = subtotal + taxAmount - discountAmount;

  const handleSubmit = async () => {
    try {
      const invoicePayload = {
        client_id: form.client_id,
        project_id: form.project_id || "N/A",
        email: form.email,
        invoice_date: form.invoice_date,
        due_date: form.due_date,
        tax: form.tax || "0",
        discount: form.discount || "0",
        amount: total,
        client_address: form.client_address || "N/A",
        billing_address: form.billing_address || "N/A",
        tax_id: form.tax_id || null,
        other_information: form.other_information || "",
        status: form.status || "Unpaid",
        items: form.items.map((item) => ({
          item: item.item,
          description: item.description,
          unit_cost: item.unit_cost,
          qty: item.qty,
          amount: item.amount,
        })),
      };

      let response;
      if (id) {
        response = await dispatch(updateInvoice({ id, data: invoicePayload })).unwrap();
      } else {
        response = await dispatch(createInvoice(invoicePayload)).unwrap();
      }

      if (!response?.success) {
        throw new Error("Invoice operation failed");
      }

      navigate("/invoices");
    } catch (error) {
      console.error("Failed to save invoice:", error);
      alert("Failed to save invoice. Check console for details.");
    }
  };

  const clientOptions = clients.map((client) => ({
    value: client.id,
    label:
      client.company_name ||
      `${client.first_name} ${client.last_name}`.trim() ||
      client.username ||
      "Unnamed Client",
  }));

  const statusOptions = [
    { value: "Paid", label: "Paid" },
    { value: "Unpaid", label: "Unpaid" },
    { value: "Pending", label: "Pending" },
  ];

  if (id && (!selectedInvoice || selectedInvoice.id !== id)) {
    return <p>Loading invoice...</p>;
  }

  return (
    <div className="card" id="invoice_edit">
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            <label>Client</label>
            <Select
              options={clientOptions}
              value={clientOptions.find((c) => c.value === form.client_id)}
              onChange={(opt) => handleChange("client_id", opt.value)}
              placeholder="Select Client"
            />
          </div>
          <div className="col-md-4">
            <label>Email</label>
            <input
              className="form-control"
              placeholder="Enter Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label>Status</label>
            <Select
              options={statusOptions}
              value={statusOptions.find((s) => s.value === form.status)}
              onChange={(opt) => handleChange("status", opt.value)}
              placeholder="Select Status"
            />
          </div>
          <div className="col-md-4">
            <label>Invoice Date</label>
            <DatePicker
              className="form-control"
              selected={form.invoice_date}
              onChange={(date) => handleChange("invoice_date", date)}
            />
          </div>
          <div className="col-md-4">
            <label>Due Date</label>
            <DatePicker
              className="form-control"
              selected={form.due_date}
              onChange={(date) => handleChange("due_date", date)}
            />
          </div>
          <div className="col-md-4">
            <label>Project ID</label>
            <input
              className="form-control"
              placeholder="Enter Project Id"
              value={form.project_id}
              onChange={(e) => handleChange("project_id", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label>Client Address</label>
            <input
              className="form-control"
              placeholder="Enter Client Address"
              value={form.client_address}
              onChange={(e) => handleChange("client_address", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label>Billing Address</label>
            <input
              className="form-control"
              placeholder="Enter Billing Address"
              value={form.billing_address}
              onChange={(e) => handleChange("billing_address", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label>Tax ID</label>
            <input
              type="text"
              className="form-control"
              value={form.tax_id}
              onChange={(e) => handleChange("tax_id", e.target.value)}
              placeholder="Enter Tax ID"
            />
          </div>
        </div>

        <hr />

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Description</th>
                <th>Unit Cost</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      className="form-control"
                      value={row.item}
                      onChange={(e) =>
                        handleItemChange(index, "item", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="form-control"
                      value={row.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="form-control"
                      type="number"
                      value={row.unit_cost}
                      onChange={(e) =>
                        handleItemChange(index, "unit_cost", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="form-control"
                      type="number"
                      value={row.qty}
                      onChange={(e) =>
                        handleItemChange(index, "qty", e.target.value)
                      }
                    />
                  </td>
                  <td>${row.amount}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeRow(index)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-secondary" onClick={addRow}>
            + Add Item
          </button>
        </div>

        <hr />

        <div className="row">
          <div className="col-md-4 offset-md-8">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>
              Tax (%):
              <input
                type="number"
                className="form-control"
                value={form.tax}
                onChange={(e) => handleChange("tax", e.target.value)}
              />
            </p>
            <p>
              Discount (%):
              <input
                type="number"
                className="form-control"
                value={form.discount}
                onChange={(e) => handleChange("discount", e.target.value)}
              />
            </p>
            <h5>Grand Total: ${total.toFixed(2)}</h5>
          </div>
        </div>

        <div className="form-group">
          <label>Other Information</label>
          <textarea
            className="form-control"
            rows={3}
            value={form.other_information}
            onChange={(e) => handleChange("other_information", e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          {id ? "Update Invoice" : "Save & Send"}
        </button>
      </div>
    </div>
  );
};

export default InvoiceAddEdit;
