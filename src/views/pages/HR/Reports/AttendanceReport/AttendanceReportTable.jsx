import { Table, Pagination } from "antd";
import React, { useState } from "react";
import { attendanceData } from "./AttendanceReportData";

const PAGE_SIZE = 10;

const AttendanceReportTable = ({ data }) => {
  const [current, setCurrent] = useState(1);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      align: 'center',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      align: 'center',
      width: 160,
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
    },
    {
      title: "Date",
      dataIndex: "date",
      align: 'center',
      width: 120,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Clock In",
      dataIndex: "clockIn",
      align: 'center',
      width: 100,
      render: (text) => text === 'Week Off' ? <span style={{ color: '#ff4d4f', fontWeight: 600 }}>Week Off</span> : text,
      sorter: (a, b) => a.clockIn.localeCompare(b.clockIn),
    },
    {
      title: "Clock Out",
      dataIndex: "clockOut",
      align: 'center',
      width: 100,
      render: (text) => text === 'Week Off' ? <span style={{ color: '#ff4d4f', fontWeight: 600 }}>Week Off</span> : text,
      sorter: (a, b) => a.clockOut.localeCompare(b.clockOut),
    },
    {
      title: "Work Status",
      dataIndex: "workStatus",
      align: 'center',
      width: 120,
      render: (text) => text === 'Week Off' ? <span style={{ color: '#ff4d4f', fontWeight: 600 }}>Week Off</span> : text,
      sorter: (a, b) => a.workStatus.localeCompare(b.workStatus),
    },
  ];

  // Add this style block for week-off-row if not already present
  if (typeof window !== 'undefined') {
    if (!document.getElementById('attendance-week-off-style')) {
      const style = document.createElement('style');
      style.id = 'attendance-week-off-style';
      style.innerHTML = `
        .week-off-row td {
          background: #fff1f0 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Pagination logic - updated to match PaySlipReportTable
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
            rowClassName={record => record.workStatus === 'Week Off' ? 'week-off-row' : ''}
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

AttendanceReportTable.defaultProps = {
  data: attendanceData,
};

export default AttendanceReportTable;