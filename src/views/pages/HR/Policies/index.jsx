/** @format */

// src/pages/Policies/Policies.jsx
import React, { useEffect, useState } from "react";
import { Table, Dropdown, Menu, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";

import Breadcrumbs from "../../../../components/Breadcrumbs";
import AddandEditPolicy from "../../../../components/modelpopup/AddandEditPolicy";
import DeleteModal from "../../../../components/modelpopup/DeleteModal";
import PreviewPoliciesModal from "../../../../components/modelpopup/PreviewPoliciesModel";
import SearchBox from "../../../../components/SearchBox";
import { HTTPURL } from "../../../../Constent/Matcher";

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingData, setEditingData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [selectedToDelete, setSelectedToDelete] = useState(null);

  // ✅ Fetch policies from backend
  const fetchPolicies = async () => {
    try {
      const res = await axios.get(`${HTTPURL}policies`);
      setPolicies(res.data.data || []);
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // ✅ Handle delete
  const handleDelete = async () => {
    if (!selectedToDelete) return;
    try {
      await axios.delete(`${HTTPURL}policies/${selectedToDelete.id}`);
      fetchPolicies();
      setSelectedToDelete(null);
    } catch (err) {
      console.error("Failed to delete policy:", err);
    }
  };

  // ✅ Search filter
  const filteredPolicies = policies.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.policy_name || "").toLowerCase().includes(term) ||
      (p.department_name || "").toLowerCase().includes(term) ||
      (p.description || "").toLowerCase().includes(term) ||
      (p.status || "").toLowerCase().includes(term)
    );
  });

  // ✅ Table columns
  const columns = [
    { title: "Sr no.", render: (text, record, index) => index + 1 },
    { title: "Policy Name", dataIndex: "policy_name" },
    { title: "Department", dataIndex: "department_name" },
    { title: "Description", dataIndex: "description" },
    { title: "Created", dataIndex: "created_at" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const lower = status?.toLowerCase();
        const badgeClass =
          lower === "active"
            ? "success"
            : lower === "inactive"
            ? "danger"
            : "secondary";
        return (
          <span className={`badge rounded-pill bg-${badgeClass}`}>
            {status || "Unknown"}
          </span>
        );
      },
    },
    {
      title: "Action",
      align: "center",
      width: 100,
      render: (record) => {
        const menu = (
          <Menu>
            {/* ✅ Preview */}
            <Menu.Item
              key="view"
              onClick={() => {
                setPreviewData(record);
                document.getElementById("openPreviewModal")?.click();
              }}
            >
              <i className="fa fa-eye m-r-5" /> Preview
            </Menu.Item>

            {/* ✅ Download */}
            {record.file_path ? (
              <Menu.Item key="download">
                <a
                  href={`${HTTPURL.replace(
                    /\/$/,
                    ""
                  )}/${record.file_path.replace(/^\/+/, "")}`}
                  download
                >
                  <i className="fa fa-download m-r-5" /> Download
                </a>
              </Menu.Item>
            ) : (
              <Menu.Item key="nofile" disabled>
                <i className="fa fa-ban m-r-5" /> No File
              </Menu.Item>
            )}

            {/* ✅ Edit */}
            <Menu.Item
              key="edit"
              onClick={() => {
                setEditingData(record);
                document.getElementById("openPolicyModal")?.click();
              }}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Menu.Item>

            {/* ✅ Delete */}
            <Menu.Item
              key="delete"
              onClick={() => {
                setSelectedToDelete(record);
                document.getElementById("openDeleteModal")?.click();
              }}
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <Button type="link" style={{ color: "#1890ff", fontSize: 25 }}>
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
            maintitle="Policies"
            title="Dashboard"
            subtitle="Policies"
            modal="#add_policy"
            name="Add Policy"
          />

          <SearchBox
            placeholder="Search policy..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Table
            className="table-striped"
            columns={columns}
            dataSource={filteredPolicies}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>

      {/* ✅ Modals */}
      <AddandEditPolicy
        editingData={editingData}
        onClose={() => setEditingData(null)}
        fetchPolicies={fetchPolicies}
      />
      <PreviewPoliciesModal data={previewData} />

      {/* Hidden buttons for modals */}
      <button
        id="openPolicyModal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#add_policy"
        style={{ display: "none" }}
      />
      <button
        id="openPreviewModal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#preview_policy"
        style={{ display: "none" }}
      />
      <button
        id="openDeleteModal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#delete"
        style={{ display: "none" }}
      />

      <DeleteModal
        Name="Delete Policy"
        onConfirm={handleDelete}
        onCancel={() => setSelectedToDelete(null)}
      />
    </>
  );
};

export default Policies;
