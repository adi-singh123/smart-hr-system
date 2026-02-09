/** @format */

import { Table, Input, Dropdown, Menu, message } from "antd";
import { AddHoliday } from "../../../components/modelpopup/AddHoliday";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { fetchNotifications } from "../../../Redux/services/Notifications";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import * as bootstrap from "bootstrap";

// ✅ Import services
import { get_holidays, delete_holiday } from "../../../Redux/services/Holiday";

const Holidays = () => {
  const LogInuserRole = localStorage.getItem("role");
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setdeleteId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { holidays, loading } = useSelector((state) => state.holiday);
  console.log("holiday", holidays);

  // 🔹 Fetch holidays from Redux
  const fetchHolidays = async () => {
    try {
      await dispatch(get_holidays()).unwrap();
    } catch (err) {
      console.error("Error fetching holidays:", err);
      message.error("Something went wrong while fetching holidays");
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [dispatch]);

  // 🔹 Delete handler

  // 🔹 Open delete modal with selected ID
  const handleDelete = (id) => {
    setdeleteId(id);
    // Open your custom Delete Modal

    document.getElementById("openDeleteModal")?.click();
  };

  // 🔹 Filter & sort
  const filteredHolidays = Array.isArray(holidays)
    ? holidays
        .filter((h) =>
          h.Title?.toLowerCase().includes(searchText.toLowerCase())
        )
        .sort((a, b) => new Date(a.HolidayDate) - new Date(b.HolidayDate))
    : [];

  // 🔹 Table data mapping
  const holidayElements = filteredHolidays.map((h) => ({
    key: h.id,
    id: h.id,
    Title: h.Title,
    HolidayDate: h.HolidayDate,
    Day: new Date(h.HolidayDate).toLocaleString("en-US", { weekday: "long" }),
  }));

  // 🔹 Edit handler
  const handleEdit = (holiday) => {
    setSelectedHoliday(holiday);
    setIsEditing(true);
    document.getElementById("openHolidayModal")?.click();
  };

  // 🔹 Table columns

  const columns = [
    {
      title: "Sr No.",
      width: 80,
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Title",
      dataIndex: "Title",
      width: 200,
      sorter: (a, b) => a.Title.localeCompare(b.Title),
      align: "center",
    },
    {
      title: "Holiday Date",
      dataIndex: "HolidayDate",
      width: 180,
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.HolidayDate) - new Date(b.HolidayDate),
      align: "center",
    },
    {
      title: "Day",
      dataIndex: "Day",
      width: 150,
      sorter: (a, b) => a.Day.localeCompare(b.Day),
      align: "center",
    },
    {
      title: "Action",
      width: 150,
      align: "center",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="edit" onClick={() => handleEdit(record)}>
              <i className="fa fa-pencil me-2" /> Edit
            </Menu.Item>
            <Menu.Item key="delete" onClick={() => handleDelete(record.id)}>
              <i className="fa fa-trash me-2" /> Delete
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <i className="material-icons" style={{ cursor: "pointer" }}>
              more_vert
            </i>
          </Dropdown>
        );
      },
      hidden: LogInuserRole !== "Admin", // 👈 yahan condition lagao
    },
  ].filter((col) => !col.hidden);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Holidays"
            title="Dashboard"
            subtitle="Holidays"
            modal="#add_holiday"
            name="Add Holiday"
          />

          {/* Search Bar */}
          <div className="row mb-3">
            <div className="col-md-4 col-sm-12">
              <label className="form-label fw-semibold">Search Holidays</label>
              <Input
                placeholder="Search Holiday by Title"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </div>
          </div>

          {/* Table */}
          <div className="row">
            <div className="col-12">
              <div style={{ overflowX: "auto" }}>
                <Table
                  columns={columns}
                  dataSource={holidayElements}
                  rowKey={(record) => record.id}
                  pagination={{ pageSize: 10 }}
                  loading={loading}
                  scroll={{ x: "max-content" }}
                  className="table-striped"
                  onChange={(paginationInfo) => {
                    setPagination({
                      current: paginationInfo.current,
                      pageSize: paginationInfo.pageSize,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Holiday Modal */}
      <AddHoliday
        onHolidayAdded={fetchHolidays}
        isEditing={isEditing}
        holidayData={selectedHoliday}
        onClose={() => {
          setSelectedHoliday(null);
          setIsEditing(false);
        }}
      />

      {/* ✅ Custom Delete Modal (Dynamic ID Pass) */}
      <DeleteModal Name="Delete Holiday" Id={deleteId} />

      {/* Hidden button for modal trigger */}
      <button
        id="openHolidayModal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#add_holiday"
        style={{ display: "none" }}
      />
      {/* Hidden trigger for DeleteModal */}
      <button
        id="openDeleteModal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#delete"
        style={{ display: "none" }}
      />
    </>
  );
};

export default Holidays;
