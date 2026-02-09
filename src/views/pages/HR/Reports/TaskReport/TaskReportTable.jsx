/** @format */

import { Table, Pagination, Input } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../../../../Redux/services/Task"; // adjust path
import { getName } from "../../../../../Redux/services/User";

const PAGE_SIZE = 10;

const TaskReportTable = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.task); // adjust slice name
  const [current, setCurrent] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [assigneeNames, setAssigneeNames] = useState({});
  const [filteredTasks, setFilteredTasks] = useState([]);

  const LoggedInuserId = useSelector((state) => state.user.logUserID);
  const LoggedInUserRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      const res = await dispatch(fetchTasks());
      console.log("res", res);
      const allTasks = res?.payload || [];
      console.log("allTask", allTasks);
      let filtered = allTasks;
      if (LoggedInUserRole?.toLowerCase() !== "admin") {
        filtered = allTasks.filter((task) =>
          task.assignees?.includes(LoggedInuserId)
        );
      }
      console.log("filteredTask", filtered);
      setFilteredTasks(filtered);
    };
    fetchData();
  }, [dispatch, LoggedInUserRole, LoggedInuserId]);

  useEffect(() => {
    const fetchAssignees = async () => {
      const namesObj = {};
      for (const task of filteredTasks) {
        if (task.assignees?.length > 0) {
          const names = await Promise.all(
            task.assignees.map(async (id) => {
              try {
                const name = await dispatch(getName(id)).unwrap();
                return name;
              } catch {
                return "";
              }
            })
          );
          namesObj[task.id] = names.filter(Boolean).join(", ");
        } else {
          namesObj[task.id] = "";
        }
      }
      setAssigneeNames(namesObj);
    };
    fetchAssignees();
  }, [filteredTasks, dispatch]);

  const filteredData = filteredTasks.filter((task) => {
    const assignTo = assigneeNames[task.id] || "";
    return (
      task.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (task.createdAt || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (task.dueDate || "").toLowerCase().includes(searchText.toLowerCase()) ||
      assignTo.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const parseDate = (dateStr) => (dateStr ? new Date(dateStr).getTime() : NaN);

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => (current - 1) * PAGE_SIZE + index + 1,
      sorter: (a, b, idxA, idxB) => idxA - idxB,
    },
    {
      title: "Task Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Created By",
      dataIndex: "createdAt",
      render: (text) => (text ? new Date(text).toLocaleDateString() : ""),
      sorter: (a, b) => parseDate(a.createdAt) - parseDate(b.createdAt),
    },
    {
      title: "End Date",
      dataIndex: "dueDate",
      render: (text) => (text ? new Date(text).toLocaleDateString() : ""),
      sorter: (a, b) => parseDate(a.dueDate) - parseDate(b.dueDate),
    },
    {
      title: "Assign To",
      dataIndex: "id",
      render: (id) => assigneeNames[id] || "",
      sorter: (a, b) => {
        const nameA = assigneeNames[a.id] || "";
        const nameB = assigneeNames[b.id] || "";
        return nameA.localeCompare(nameB);
      },
    },
  ];

  const paginatedData = filteredData.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE
  );

  const itemRender = (currentPage, type, originalElement) => {
    if (type === "prev") {
      return (
        <button
          className="ant-pagination-item-link"
          disabled={currentPage === 1}
          style={{
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
            border: "none",
            background: "none",
          }}
        >
          Previous
        </button>
      );
    }
    if (type === "next") {
      const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
      return (
        <button
          className="ant-pagination-item-link"
          disabled={currentPage === totalPages}
          style={{
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
            border: "none",
            background: "none",
          }}
        >
          Next
        </button>
      );
    }
    return originalElement;
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="mb-3">
          <Input
            placeholder="Search Task Name,Assign To"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

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
            total={filteredData.length}
            onChange={setCurrent}
            showSizeChanger={false}
            itemRender={itemRender}
            showTotal={(total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`
            }
            style={{
              display: filteredData.length > PAGE_SIZE ? "block" : "none",
            }}
          />
          {filteredData.length <= PAGE_SIZE && (
            <div
              className="text-muted small ms-2"
              style={{ alignSelf: "center" }}
            >
              Only 1 page of results
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskReportTable;
