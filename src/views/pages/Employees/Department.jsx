/** @format */

import React, { useEffect, useState } from "react";
import { Table, Dropdown, Menu, Button, Tag } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min";

import PreviewDepartmentModel from "../../../components/modelpopup/PreviewDepartmentModel";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SearchBox from "../../../components/SearchBox";
import DepartmentModal from "../../../components/modelpopup/DepartmentModal";
import DeleteModal from "../../../components/modelpopup/DeleteModal"; // ✅ same as Holiday.jsx
import {
  get_department_data,
  deleteDepartment,
} from "../../../Redux/services/Department";
import { setDepartmentEditID } from "../../../Redux/features/Department";
import { useDispatch, useSelector } from "react-redux";

const Department = () => {
  const LogInuserRole = localStorage.getItem("role");
  const dispatch = useDispatch();
  const AllDepartments = useSelector(
    (state) => state?.department?.AllDepartments || {}
  );

  const [editingId, setEditingId] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [localData, setLocalData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchDepartments = (page = 1, size = 10) =>
    dispatch(get_department_data({ page, list_data: size }));

  // Load initial data
  useEffect(() => {
    fetchDepartments(currentPage, pageSize);
  }, [dispatch, currentPage, pageSize]);

  // Update localData whenever AllDepartments changes
  useEffect(() => {
    const deptsArray = Array.isArray(AllDepartments)
      ? AllDepartments
      : Array.isArray(AllDepartments?.departments)
      ? AllDepartments.departments
      : [];

    setLocalData(
      deptsArray.map((item, i) => ({
        key: item.id,
        serial: i + 1 + (currentPage - 1) * pageSize,
        department: item.name || "",
        is_active: item.is_active ? "true" : "false",
      }))
    );
  }, [AllDepartments, currentPage, pageSize]);

  // Auto-open edit modal
  useEffect(() => {
    if (editingId) {
      dispatch(setDepartmentEditID(editingId));
      const modalEl = document.getElementById("department_modal");
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    }
  }, [editingId, dispatch]);

  // Auto-open preview modal
  useEffect(() => {
    if (previewData) {
      const modalEl = document.getElementById("department_preview");
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    }
  }, [previewData]);

  const handleDelete = (id) => {
    setDeleteId(id);
    document.getElementById("openDeleteModal")?.click();
  };

  const filteredData = localData.filter(
    (d) =>
      (d.department || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.is_active || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Sr No.",
      dataIndex: "serial",
      sorter: (a, b) => a.serial - b.serial,
      width: "10%",
    },
    {
      title: "Department Name",
      dataIndex: "department",
      sorter: (a, b) => a.department.localeCompare(b.department),
      width: "40%",
    },
    {
      title: "Is Active",
      dataIndex: "is_active",
      render: (value) => (
        <Tag color={value === "true" ? "green" : "red"}>
          {value === "true" ? "Active" : "Inactive"}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "true" },
        { text: "Inactive", value: "false" },
      ],
      onFilter: (value, record) => record.is_active === value,
      width: "20%",
    },
    {
      title: "Action",
      align: "center",
      width: 100,
      render: (record) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" onClick={() => setPreviewData(record)}>
              <i className="fa fa-eye me-2" /> Preview
            </Menu.Item>

            {LogInuserRole === "Admin" && (
              <>
                <Menu.Item
                  key="edit"
                  onClick={() => {
                    setEditingId(null);
                    setTimeout(() => setEditingId(record?.key), 0);
                  }}
                >
                  <i className="fa fa-pencil me-2" /> Edit
                </Menu.Item>
                <Menu.Item
                  key="delete"
                  onClick={() => handleDelete(record?.key)}
                >
                  <i className="fa fa-trash me-2" /> Delete
                </Menu.Item>
              </>
            )}
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <Button type="link" style={{ color: "#1890ff", fontSize: 22 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-three-dots-vertical"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
              </svg>{" "}
              <MoreOutlined />
            </Button>
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
            maintitle="Department"
            title="Dashboard"
            subtitle="Department"
            modal="#department_modal"
            name="Add Department"
          />
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex align-items-center mb-2">
                <div className="flex-grow-1">
                  <SearchBox
                    placeholder="Search department or status..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  title="Search"
                >
                  <i className="fa fa-search" />
                </button>
              </div>

              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={localData}
                  rowKey={(record) => record.key}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total:
                      AllDepartments?.totalNoPages * pageSize ||
                      localData.length,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: (page, size) => {
                      setCurrentPage(page);
                      setPageSize(size);
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DepartmentModal
        onSuccess={() => {
          setEditingId(null);
          setPreviewData(null);
          fetchDepartments(currentPage, pageSize);
        }}
      />
      <PreviewDepartmentModel data={previewData} />

      <DeleteModal Name="Delete Department" Id={deleteId} />

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

export default Department;
