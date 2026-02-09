import { Table, Pagination, Button } from "antd";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { dailyReportData } from "./DailyReportData";

const PAGE_SIZE = 5;

const DailyReportTable = () => {
  const [current, setCurrent] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [filters, setFilters] = useState({});

  // Helper for Antd Table search
  const getColumnSearchProps = (dataIndex, placeholder) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <input
          ref={searchInput}
          placeholder={`Search ${placeholder}`}
          value={selectedKeys[0] || ''}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={confirm}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={confirm}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    onFilter: (value, record) =>
      record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  // Filtering logic for all columns
  const filteredData = dailyReportData.filter(row => {
    let match = true;
    if (filters.name && filters.name.length > 0) {
      match = match && row.name.toLowerCase().includes(filters.name[0].toLowerCase());
    }
    if (filters.number && filters.number.length > 0) {
      match = match && row.number.toLowerCase().includes(filters.number[0].toLowerCase());
    }
    if (filters.department && filters.department.length > 0) {
      match = match && row.department.toLowerCase().includes(filters.department[0].toLowerCase());
    }
    if (filters.status && filters.status.length > 0) {
      match = match && row.status.toLowerCase().includes(filters.status[0].toLowerCase());
    }
    return match;
  });

  // Export to CSV (filtered data only)
  // const handleExport = () => {
  //   const headers = [
  //     'Employee Name', 'Emp ID', 'Date', 'Department', 'Status'
  //   ];
  //   const rows = filteredData.map(row => [
  //     row.name,
  //     row.number,
  //     row.date,
  //     row.department,
  //     row.status
  //   ]);
  //   let csvContent = 'data:text/csv;charset=utf-8,'
  //     + headers.join(',') + '\n'
  //     + rows.map(e => e.join(",")).join("\n");
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", "daily_report.csv");
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="table-avatar">
          <Link to="/profile" className="avatar">
            <img alt="" src={record.image} />
          </Link>
          <Link to="/profile">{text}</Link>
        </div>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name', 'Employee Name'),
      filteredValue: filters.name || null,
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Emp ID",
      dataIndex: "number",
      sorter: (a, b) => a.number.localeCompare(b.number),
      ...getColumnSearchProps('number', 'Emp ID'),
      filteredValue: filters.number || null,
      onFilter: (value, record) => record.number.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: (a, b) => a.department.length - b.department.length,
      ...getColumnSearchProps('department', 'Department'),
      filteredValue: filters.department || null,
      onFilter: (value, record) => record.department.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div className="dropdown dropdown-action">
          <button
            className={`btn btn-outline-${
              text === "Absent"
                ? "danger"
                : text === "Week off"
                ? "warning"
                : "info"
            } btn-sm`}
            style={text === "Week off" ? { fontWeight: 700, color: '#fa8c16', borderColor: '#fa8c16', background: '#fffbe6' } : {}}
          >
            {text}
          </button>
        </div>
      ),
      ...getColumnSearchProps('status', 'Status'),
      filteredValue: filters.status || null,
      onFilter: (value, record) => record.status.toLowerCase().includes(value.toLowerCase()),
    },
  ];

  // Pagination logic
  const paginatedData = filteredData.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div></div>
          {/* <Button type="primary" onClick={handleExport}>
            Export CSV
          </Button> */}
        </div>
        <div className="table-responsive">
          <Table
            className="table-striped"
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={paginatedData}
            rowKey={(record) => record.id}
            pagination={false}
            onChange={(_, filtersArg) => setFilters(filtersArg)}
          />
        </div>
        <div className="d-flex justify-content-end mt-3">
          <Pagination
            current={current}
            pageSize={PAGE_SIZE}
            total={filteredData.length}
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

export default DailyReportTable;
