/** @format */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Dropdown, Menu, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Breadcrumbs from "../../../components/Breadcrumbs";
import SearchBox from "../../../components/SearchBox";
import ResignationModal from "../../../components/modelpopup/ResignationModal";
import ResignationPreviewModal from "../../../components/modelpopup/ResignationPreviewModal";
import DeleteModal from "../../../components/modelpopup/DeleteModal";

import {
  get_resignations,
  delete_resignation,
} from "../../../Redux/services/Resignation";

const Resignation = () => {
  const dispatch = useDispatch();
  const { resignations } = useSelector((state) => state.resignation);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingData, setEditingData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [selectedToDelete, setSelectedToDelete] = useState(null);

  // Fetch resignations from Redux
  const fetchResignations = () => {
    dispatch(get_resignations());
  };

  useEffect(() => {
    fetchResignations();
  }, []);

  // Auto-open preview modal
  useEffect(() => {
    if (previewData) {
      const modalEl = document.getElementById("view_resignation");
      if (modalEl) {
        // Purana instance dispose karo
        const existingModal = bootstrap.Modal.getInstance(modalEl);
        if (existingModal) existingModal.dispose();

        // Thoda delay dekar naya modal show karo
        setTimeout(() => {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();

          // Jab modal band ho, state reset kar do
          modalEl.addEventListener(
            "hidden.bs.modal",
            () => setPreviewData(null),
            { once: true }
          );
        }, 100);
      }
    }
  }, [previewData]);

  // Auto-open edit modal
  useEffect(() => {
    if (editingData) {
      const modalEl = document.getElementById("edit_resignation");
      if (modalEl) {
        const existingModal = bootstrap.Modal.getInstance(modalEl);
        if (existingModal) existingModal.dispose();

        setTimeout(() => {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();

          modalEl.addEventListener(
            "hidden.bs.modal",
            () => setEditingData(null),
            { once: true }
          );
        }, 100);
      }
    }
  }, [editingData]);

  // Auto-open delete modal
  useEffect(() => {
    if (selectedToDelete) {
      const modalEl = document.getElementById("delete");
      if (modalEl) {
        const existingModal = bootstrap.Modal.getInstance(modalEl);
        if (existingModal) existingModal.dispose();

        setTimeout(() => {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();

          modalEl.addEventListener(
            "hidden.bs.modal",
            () => setSelectedToDelete(null),
            { once: true }
          );
        }, 100);
      }
    }
  }, [selectedToDelete]);

  // Delete resignation
  const handleDelete = () => {
    if (!selectedToDelete) return;
    dispatch(delete_resignation(selectedToDelete.id)).then(() => {
      setSelectedToDelete(null);
      fetchResignations();
    });
  };

  // Filter resignations by search term
  const filteredResignations = resignations.filter(
    (r) =>
      (r.employee_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (r.department || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.reason || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Table columns
  const columns = [
    { title: "Sr. No", render: (text, record, index) => index + 1 },
    {
      title: "Resigning Employee",
      dataIndex: "employee_name",
      sorter: (a, b) =>
        (a.employee_name || "").localeCompare(b.employee_name || ""),
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: (a, b) => (a.department || "").localeCompare(b.department || ""),
    },
    // {
    //   title: "Reason",
    //   dataIndex: "reason",
    //   sorter: (a, b) => (a.reason || "").localeCompare(b.reason || ""),
    // },
    {
      title: "Notice Date",
      dataIndex: "notice_date",
      sorter: (a, b) =>
        (a.notice_date || "").localeCompare(b.notice_date || ""),
    },
    {
      title: "Resignation Date",
      dataIndex: "resignation_date",
      sorter: (a, b) =>
        (a.resignation_date || "").localeCompare(b.resignation_date || ""),
    },
    {
      title: "Action",
      align: "center",
      width: 100,
      render: (record) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" onClick={() => setPreviewData(record)}>
              <i className="fa fa-eye me-2" /> View
            </Menu.Item>
            <Menu.Item key="edit" onClick={() => setEditingData(record)}>
              <i className="fa fa-pencil me-2" /> Edit
            </Menu.Item>
            <Menu.Item key="delete" onClick={() => setSelectedToDelete(record)}>
              <i className="fa fa-trash me-2" /> Delete
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <Button
              type="link"
              style={{
                color: "#1890ff",
                fontSize: 25,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-three-dots-vertical"
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
            maintitle="Resignation"
            title="Dashboard"
            subtitle="Resignation"
            modal="#add_resignation"
            name="Add Resignation"
          />

          <SearchBox
            placeholder="Search employee, department, or reason..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Table
            columns={columns}
            dataSource={filteredResignations}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>

      {/* Modals */}
      <ResignationModal
        editingData={editingData}
        onClose={() => setEditingData(null)}
        fetchResignations={fetchResignations}
      />
      <ResignationPreviewModal
        data={previewData}
        onClose={() => setPreviewData(null)}
      />
      <DeleteModal
        Name="Delete Resignation"
        onConfirm={handleDelete}
        onCancel={() => setSelectedToDelete(null)}
      />
    </>
  );
};

export default Resignation;
