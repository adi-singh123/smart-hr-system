/** @format */

import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Input,
  Tooltip,
  Select,
  Button,
  Dropdown,
  Menu,
} from "antd";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import TrainingModal from "../../../../components/modelpopup/TrainingModal";
import TrainingViewModal from "../../../../components/modelpopup/TrainingViewModel";
import DeleteModal from "../../../../components/modelpopup/DeleteModal";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min";

// ✅ Redux services
import {
  getTrainings,
  deleteTraining,
  updateTraining,
} from "../../../../Redux/services/Training";

const { Option } = Select;

const Training = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editRecord, setEditRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [trainerFilter, setTrainerFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ✅ Fetch trainings
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTrainings();
      setData(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch trainings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document
      .querySelectorAll('[data-bs-toggle="dropdown"]')
      .forEach((toggle) => {
        bootstrap.Dropdown.getOrCreateInstance(toggle);
      });
  }, []);

  // ✅ Delete Handler
  const handleDelete = (id) => {
    setDeleteId(id);
    document.getElementById("openDeleteModal")?.click();
  };

  // ✅ Status Update
  const handleStatusChange = async (record) => {
    const updatedStatus = record.status === "Active" ? "Inactive" : "Active";
    try {
      await updateTraining(record.id, { ...record, status: updatedStatus });
      message.success("Status updated");
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Status update failed");
    }
  };

  const handleSearch = () => setSearchText(searchText.trim());

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // ✅ Filtering
  const filteredData = data
    .filter(
      (item) =>
        (item.traning_type_id?.toLowerCase() || "").includes(
          searchText.toLowerCase()
        ) ||
        (item.trainer_id?.toLowerCase() || "").includes(
          searchText.toLowerCase()
        )
    )
    .filter((item) =>
      trainerFilter ? item.trainer_id === trainerFilter : true
    )
    .filter((item) =>
      employeeFilter ? item.employees_id === employeeFilter : true
    )
    .filter((item) => (statusFilter ? item.status === statusFilter : true));

  // ✅ Table Columns
  const columns = [
    { title: "Sr.no", render: (text, record, index) => index + 1 },
    { title: "Training Type", dataIndex: "traning_type_id" },
    { title: "Trainer", dataIndex: "trainer_id" },
    { title: "Employee", dataIndex: "employees_id" },
    {
      title: "Training Period",
      render: (_, record) => `${record.start_date} - ${record.end_date}`,
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   render: (text) => (
    //     <Tooltip title={text}>
    //       {text?.length > 20 ? text.substring(0, 20) + "..." : text}
    //     </Tooltip>
    //   ),
    // },
    {
      title: "Cost",
      dataIndex: "training_cost",
      render: (text) => currencyFormatter.format(text),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <button
          className={`btn btn-sm btn-rounded ${
            text === "Active" ? "btn-success" : "btn-danger"
          }`}
          onClick={() => handleStatusChange(record)}
        >
          {text}
        </button>
      ),
    },
    {
      title: "Action",
      className: "text-center",
      render: (text, record) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="view"
              onClick={() => {
                setViewRecord(record);
                document.getElementById("openViewTrainingModal")?.click();
              }}
            >
              <i className="fa fa-eye me-2" /> View
            </Menu.Item>

            <Menu.Item
              key="edit"
              onClick={() => {
                setEditRecord(record);
                document.getElementById("openEditTrainingModal")?.click();
              }}
            >
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
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Training"
            title="Dashboard"
            subtitle="Training"
            modal="#add_training"
            name="Add New"
          />

          {/* Search and Filter */}
          <div className="row mb-3">
            <div className="col-md-3">
              <Input
                placeholder="Search by trainer/employee"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                suffix={
                  <i
                    className="fa fa-search"
                    style={{ cursor: "pointer" }}
                    onClick={handleSearch}
                  />
                }
              />
            </div>
            <div className="col-md-3">
              <Select
                placeholder="Filter by Trainer"
                allowClear
                style={{ width: "100%" }}
                onChange={(value) => setTrainerFilter(value)}
              >
                {[...new Set(data.map((d) => d.trainer_id))].map((id) => (
                  <Option key={id} value={id}>
                    {id}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="col-md-3">
              <Select
                placeholder="Filter by Employee"
                allowClear
                style={{ width: "100%" }}
                onChange={(value) => setEmployeeFilter(value)}
              >
                {[...new Set(data.map((d) => d.employees_id))].map((id) => (
                  <Option key={id} value={id}>
                    {id}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="col-md-3">
              <Select
                placeholder="Filter by Status"
                allowClear
                style={{ width: "100%" }}
                onChange={(value) => setStatusFilter(value)}
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <Table
                  scroll={{ x: true }}
                  className="table-striped"
                  columns={columns}
                  dataSource={filteredData}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: ["5", "10", "20"],
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`,
                    itemRender: (page, type, originalElement) => {
                      if (type === "prev") return <Button>Previous</Button>;
                      if (type === "next") return <Button>Next</Button>;
                      return originalElement;
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Add/Edit Modal */}
      <TrainingModal
        fetchData={fetchData}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
      />

      {/* ✅ View Modal */}
      <TrainingViewModal viewRecord={viewRecord} />

      {/* ✅ Delete Modal (Same as Holidays.jsx) */}
      <DeleteModal Name="Delete Training" Id={deleteId} fetchData={fetchData} />

      {/* Hidden Triggers */}
      <button
        id="openEditTrainingModal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#edit_training"
        style={{ display: "none" }}
      />
      <button
        id="openViewTrainingModal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#view_training"
        style={{ display: "none" }}
      />
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

export default Training;
