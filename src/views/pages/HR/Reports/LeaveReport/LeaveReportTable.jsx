/** @format */

import { Table, Input } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLeaves } from "../../../../../Redux/services/EmployeeLeaves";
import { getFullUserById } from "../../../../../Redux/services/User"; // add your thunk
import { HTTPURL } from "../../../../../Constent/Matcher";

// Helper to get initials from full name
const getInitials = (name) => {
  if (!name) return "";
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0][0] ? words[0][0].toUpperCase() : "";
  }
  return (
    (words[0][0] ? words[0][0].toUpperCase() : "") +
    (words[words.length - 1][0] ? words[words.length - 1][0].toUpperCase() : "")
  );
};

const LeaveReportTable = () => {
  const dispatch = useDispatch();
  const leavesData = useSelector((state) => state.employeeLeaves?.leaves || []);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const LoggedInEmployeeId = localStorage.getItem("LoggedInEmployeeId");
  console.log("loggedIinEmployeeId", LoggedInEmployeeId);
  const LoggedInUserRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchLeaves = async () => {
      const response = await dispatch(getLeaves());
      if (response?.payload?.status) {
        let leaves = response.payload.data || [];
        leaves = leaves.filter((leave) => leave.status === "approved");
        // Filter leaves based on role
        if (LoggedInUserRole?.toLowerCase() !== "admin") {
          leaves = leaves.filter(
            (leave) => leave.employee_id === LoggedInEmployeeId
          );
        }

        const mappedData = await Promise.all(
          leaves.map(async (leave) => {
            let fullUser = null;
            try {
              fullUser = await dispatch(
                getFullUserById({ employeeId: leave.employee_id })
              ).unwrap();
            } catch (err) {
              console.error(
                `Failed to fetch user for ${leave.employee_id}:`,
                err
              );
            }

            return {
              key: leave.id,
              id: leave.id,
              empId: leave.employee_id || "-",
              name: leave.employee_name,
              date: `${leave.from} to ${leave.to}`,
              department: fullUser?.department?.name || "-",
              leavetype: leave.leave_type,
              noofdays: leave.no_of_days,
              remainingleave: leave.remaining_leaves,
              totalleaves: leave.total_leaves,
              totalleavetaken: leave.total_leaves_taken,
              image: fullUser?.profile_pic
                ? `${HTTPURL}${fullUser.profile_pic}`
                : null, // null so initials show instead
            };
          })
        );

        setData(mappedData);
      }
    };

    fetchLeaves();
  }, [dispatch, LoggedInUserRole, LoggedInEmployeeId]);

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Emp ID",
      dataIndex: "empId",
      sorter: (a, b) => (a.empId || "").length - (b.empId || "").length,
      align: "center",
    },
    {
      title: "Employee",
      dataIndex: "name",
      render: (text, record) => (
        <div className="table-avatar d-flex align-items-center">
          <Link to="/profile" className="avatar me-2">
            {record.image ? (
              <img alt="" src={record.image} />
            ) : (
              <div
                className="avatar-initials"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {getInitials(record.name)}
              </div>
            )}
          </Link>
          <Link to="/profile">{text}</Link>
        </div>
      ),
      sorter: (a, b) => (a.name || "").length - (b.name || "").length,
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => (a.date || "").length - (b.date || "").length,
      align: "center",
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: (a, b) =>
        (a.department || "").length - (b.department || "").length,
      align: "center",
    },
    {
      title: "Leave Type",
      dataIndex: "leavetype",
      render: (text) => (
        <button
          className={`btn btn-outline-${
            text === "Emergency Leave"
              ? "danger"
              : text === "Parenting Leave"
              ? "primary"
              : "info"
          } btn-sm`}
        >
          {text}
        </button>
      ),
      sorter: (a, b) => (a.leavetype || "").length - (b.leavetype || "").length,
      align: "center",
    },
    {
      title: "No.of Days",
      dataIndex: "noofdays",
      render: (text) => <span className="btn btn-danger btn-sm">{text}</span>,
      sorter: (a, b) => a.noofdays - b.noofdays,
      align: "center",
    },
    {
      title: "Remaining Leave",
      dataIndex: "remainingleave",
      render: (text) => (
        <span className="btn btn-warning btn-sm">
          <b>{text}</b>
        </span>
      ),
      sorter: (a, b) => a.remainingleave - b.remainingleave,
      align: "center",
    },
    {
      title: "Total Leaves",
      dataIndex: "totalleaves",
      render: (text) => (
        <span className="btn btn-success btn-sm">
          <b>{text}</b>
        </span>
      ),
      sorter: (a, b) => (a.totalleaves || 0) - (b.totalleaves || 0),
      align: "center",
    },
    {
      title: "Total Leave Taken",
      dataIndex: "totalleavetaken",
      render: (text) => (
        <span className="btn btn-primary btn-sm">
          <b>{text}</b>
        </span>
      ),
      sorter: (a, b) => (a.totalleavetaken || 0) - (b.totalleavetaken || 0),
      align: "center",
    },
  ];

  return (
    <div className="row">
      <div className="col-md-12 mb-3">
        <Input
          placeholder="Search in all columns..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
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
    </div>
  );
};

export default LeaveReportTable;
