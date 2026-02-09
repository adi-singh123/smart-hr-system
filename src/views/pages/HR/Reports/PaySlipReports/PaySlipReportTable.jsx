import { Table, Pagination, Tooltip } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const PAGE_SIZE = 10;

const getInitials = (name) => {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const PaySlipReportTable = ({ data }) => {
  const [current, setCurrent] = useState(1);

  // Helper for Antd Table search
  const getColumnSearchProps = (dataIndex, placeholder) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <input
          placeholder={`Search ${placeholder}`}
          value={selectedKeys[0] || ''}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={confirm}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <button onClick={confirm} style={{ marginRight: 8 }}>Search</button>
        <button onClick={clearFilters}>Reset</button>
      </div>
    ),
    onFilter: (value, record) =>
      record[dataIndex] && record[dataIndex].toLowerCase().includes(value.toLowerCase()),
  });

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Employee Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="table-avatar" style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#ff9b44',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 16,
              marginRight: 8,
            }}
          >
            {getInitials(text)}
          </div>
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', 'Employee Name'),
    },
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      sorter: (a, b) => a.employeeId.localeCompare(b.employeeId),
      ...getColumnSearchProps('employeeId', 'Employee ID'),
    },
    {
      title: "Designation",
      dataIndex: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
      ...getColumnSearchProps('role', 'Designation'),
    },
    {
      title: "Paid Amount",
      dataIndex: "amount",
      sorter: (a, b) => parseFloat(a.amount.slice(1)) - parseFloat(b.amount.slice(1)),
    },
    {
      title: "Payment Month",
      dataIndex: "paymentmonth",
      sorter: (a, b) => a.paymentmonth.localeCompare(b.paymentmonth),
    },
    {
      title: "Payment Year",
      dataIndex: "paymentyear",
      sorter: (a, b) => a.paymentyear.localeCompare(b.paymentyear),
    },
    {
      title: "Actions",
      render: () => (
        <Tooltip title="Download Payslip">
          <span>
            <Link to="#" className="btn btn-sm btn-primary" tabIndex={0} onClick={e => e.preventDefault()}>
              PDF
            </Link>
          </span>
        </Tooltip>
      ),
    },
  ];

  // Calculate paginated data
  const paginatedData = data.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="table-responsive">
          <Table
            className="table-striped"
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={paginatedData}
            rowKey={(record) => record.id}
            pagination={false}
          />
        </div>
        <div className="d-flex justify-content-end mt-3">
          <Pagination
            current={current}
            pageSize={PAGE_SIZE}
            total={data.length}
            onChange={setCurrent}
            showSizeChanger={false}
            showTotal={(total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PaySlipReportTable;