import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchInvoiceById } from "../../../../../Redux/services/Invoice";
import { Applogo } from "../../../../../Routes/ImagePath";

const InvoiceView = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { selectedInvoice } = useSelector((state) => state.invoices);

  useEffect(() => {
    if (id) dispatch(fetchInvoiceById(id));
  }, [id, dispatch]);

  if (!selectedInvoice) return <div>Loading invoice...</div>;

  const invoice = selectedInvoice;
  const items = Array.isArray(invoice.items) ? invoice.items : [];

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );
  const taxRate = parseFloat(invoice.tax || 0);
  const discountRate = parseFloat(invoice.discount || 0);
  const tax = (subtotal * taxRate) / 100;
  const discount = (subtotal * discountRate) / 100;
  const total = subtotal + tax - discount;

  return (
    <div className="page-wrapper" id="preview_invoice">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Invoice</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">Dashboard</li>
                <li className="breadcrumb-item active">Invoice</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6">
                    <img src={Applogo} className="inv-logo" alt="Logo" />
                    <ul className="list-unstyled">
                      <li>Bilvaleaf Technologies</li>
                      <li>{invoice.billing_address || "-"}</li>
                      <li>{invoice.email || "-"}</li>
                      <li>GST No: {invoice.tax_id || "-"}</li>
                    </ul>
                  </div>
                  <div className="col-sm-6 text-end">
                    <h3 className="text-uppercase">
                      Invoice #{invoice.invoice_number || invoice.id || "N/A"}
                    </h3>
                    <ul className="list-unstyled">
                      <li>Date: <span>{invoice.invoice_date || "-"}</span></li>
                      <li>Due date: <span>{invoice.due_date || "-"}</span></li>
                    </ul>
                  </div>
                </div>

                <div className="table-responsive mt-4">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Item</th>
                        <th>Description</th>
                        <th>Unit Cost</th>
                        <th>Qty</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length > 0 ? (
                        items.map((item, index) => (
                          <tr key={item.id || index}>
                            <td>{index + 1}</td>
                            <td>{item.item || "-"}</td>
                            <td>{item.description || "-"}</td>
                            <td>${parseFloat(item.unit_cost || 0).toFixed(2)}</td>
                            <td>{item.qty || 0}</td>
                            <td>${parseFloat(item.amount || 0).toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">No items found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="row">
                  <div className="col-sm-6"></div>
                  <div className="col-sm-6">
                    <table className="table">
                      <tbody>
                        <tr>
                          <th>Subtotal:</th>
                          <td>${subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <th>Tax ({taxRate}%):</th>
                          <td>${tax.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <th>Discount ({discountRate}%):</th>
                          <td>-${discount.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <th>Total:</th>
                          <td><strong>${total.toFixed(2)}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {invoice.other_information && (
                  <div className="invoice-info mt-4">
                    <h5>Other Information</h5>
                    <p>{invoice.other_information}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default InvoiceView;
