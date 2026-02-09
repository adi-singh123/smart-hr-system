import React from "react";
import Header from "../../../../layout/Header";
import Sidebar from "../../../../layout/Sidebar";
import InvoiceAddEdit from "./invoiceAddEdit";
const EditInvoice = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="col">
          <h3 className="page-title">Edit</h3>
          <ul className="breadcrumb">
            <li className="breadcrumb-item">Dashboard
            </li>
            <li className="breadcrumb-item active">Invoice Edit</li>
          </ul>
        </div>
          <InvoiceAddEdit />
        </div>
      </div>
    </div>
  );
};

export default EditInvoice;