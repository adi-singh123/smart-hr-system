import { Table } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const PaymentReportTable = () => {
  const data = [
    {
      id: 1,
      transactionid: "834521",
      date: "2nd Dec 2023",
      clientname: "Dreams",
      paymentmethod: "Online",
      invoice: "#INV-0001",
      amount: "$1,250.00",
    },
    {
      id: 2,
      transactionid: "834522",
      date: "3rd Dec 2023",
      clientname: "Global Technologies",
      paymentmethod: "Bank Transfer",
      invoice: "#INV-0002",
      amount: "$2,100.50",
    },
    {
      id: 3,
      transactionid: "834523",
      date: "4th Dec 2023",
      clientname: "Delta Infotech",
      paymentmethod: "Cash",
      invoice: "#INV-0003",
      amount: "$980.75",
    },
    {
      id: 4,
      transactionid: "834524",
      date: "5th Dec 2023",
      clientname: "Techvision Solutions",
      paymentmethod: "Online",
      invoice: "#INV-0004",
      amount: "$3,450.00",
    },
    {
      id: 5,
      transactionid: "834525",
      date: "6th Dec 2023",
      clientname: "SoftLabs Pvt Ltd",
      paymentmethod: "Cheque",
      invoice: "#INV-0005",
      amount: "$1,875.20",
    },
    {
      id: 6,
      transactionid: "834526",
      date: "7th Dec 2023",
      clientname: "Creative Code Inc.",
      paymentmethod: "Online",
      invoice: "#INV-0006",
      amount: "$2,320.00",
    },
    {
      id: 7,
      transactionid: "834527",
      date: "8th Dec 2023",
      clientname: "NextGen Works",
      paymentmethod: "Bank Transfer",
      invoice: "#INV-0007",
      amount: "$1,150.00",
    },
    {
      id: 8,
      transactionid: "834528",
      date: "9th Dec 2023",
      clientname: "Binary Tree Solutions",
      paymentmethod: "Cash",
      invoice: "#INV-0008",
      amount: "$2,750.00",
    },
  ];

  
  const parseCustomDate = (dateStr) => {
  
    const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
    return new Date(cleaned);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionid",
      render: (text) => <Link to="#">{text}</Link>,
      sorter: (a, b) => a.transactionid.localeCompare(b.transactionid),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => {
        const dateA = parseCustomDate(a.date);
        const dateB = parseCustomDate(b.date);
        return dateA - dateB;
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Client Name",
      dataIndex: "clientname",
      sorter: (a, b) => a.clientname.localeCompare(b.clientname),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Payment Method",
      dataIndex: "paymentmethod",
      sorter: (a, b) => a.paymentmethod.localeCompare(b.paymentmethod),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      render: (text) => <Link to="#">{text}</Link>,
      sorter: (a, b) => a.invoice.localeCompare(b.invoice),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a, b) => {
        const amountA = parseFloat(a.amount.replace(/[$,]/g, ""));
        const amountB = parseFloat(b.amount.replace(/[$,]/g, ""));
        return amountA - amountB;
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Action",
      render: () => (
        <div className="dropdown dropdown-action text-end">
          <Link
            to="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-icons">more_vert</i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="/edit-invoice">
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link className="dropdown-item" to="/invoice-view">
              <i className="fa fa-eye m-r-5" /> View
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="fa fa-file-pdf m-r-5" /> Download
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="table-responsive">
          <Table
            className="table-striped"
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.id}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentReportTable;
