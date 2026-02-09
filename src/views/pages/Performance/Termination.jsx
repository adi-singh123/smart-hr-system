/** @format */
import React, { useEffect, useState } from "react";
import { Table, Dropdown, Menu, Button, Spin } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  get_terminations,
  edit_termination,
} from "../../../Redux/services/Termination";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

import Breadcrumbs from "../../../components/Breadcrumbs";
import SearchBox from "../../../components/SearchBox";
import TerminationModal from "../../../components/modelpopup/TerminationModal";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import TerminationPreviewModal from "../../../components/modelpopup/TerminationPreviewModal";

const Termination = () => {
  const dispatch = useDispatch();

  const {
    terminations = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.termination || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [editingData, setEditingData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    dispatch(get_terminations());
  }, [dispatch]);

  const cleanupModalState = () => {
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
  };

  // 🔹 Edit modal logic
  const openEditModal = async (record) => {
    const res = await dispatch(edit_termination(record.id));
    if (res?.payload?.data) {
      setEditingData(res.payload.data);
      setIsEditOpen(true);
    }
  };

  // 🔹 Preview modal logic
  const openPreviewModal = (record) => {
    setPreviewData(record);
    setIsPreviewOpen(true);

    setTimeout(() => {
      const modalEl = document.getElementById("termination_preview");
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl); // ✅ updated
        modal.show();
      }
    }, 0);
  };

  // 🔹 Delete modal logic
  const openDeleteModal = (record) => {
    setDeleteId(record.id);
    document.getElementById("openDeleteModal")?.click();
  };

  // 🔹 Search filter
  const filteredTerminations = (terminations || []).filter((t) =>
    [t.terminated_employee, t.department, t.reason]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "Sr. No", render: (text, record, index) => index + 1 },
    {
      title: "Employee",
      dataIndex: "terminated_employee",
      sorter: (a, b) =>
        (a.terminated_employee || "").localeCompare(
          b.terminated_employee || ""
        ),
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: (a, b) => (a.department || "").localeCompare(b.department || ""),
    },
    {
      title: "Termination Type",
      dataIndex: "termination_type",
      sorter: (a, b) =>
        (a.termination_type || "").localeCompare(b.termination_type || ""),
    },
    {
      title: "Termination Date",
      dataIndex: "termination_date",
      sorter: (a, b) =>
        (a.termination_date || "").localeCompare(b.termination_date || ""),
    },
    {
      title: "Notice Date",
      dataIndex: "notice_date",
      sorter: (a, b) =>
        (a.notice_date || "").localeCompare(b.notice_date || ""),
    },
    // ✅ Updated Reason column with truncate + click
    // {
    //   title: "Reason",
    //   dataIndex: "reason",
    //   sorter: (a, b) => (a.reason || "").localeCompare(b.reason || ""),
    //   render: (text) => {
    //     const displayText =
    //       text?.length > 50 ? text.substring(0, 50) + "..." : text;
    //     return (
    //       <span
    //         style={{
    //           cursor: text?.length > 50 ? "pointer" : "default",
    //           color: text?.length > 50 ? "#007bff" : "inherit",
    //         }}
    //         onClick={() => {
    //           if (text?.length > 50) {
    //             const modalEl = document.getElementById("fullReasonModal");
    //             if (modalEl) {
    //               modalEl.querySelector(".modal-body").innerText = text;
    //               const bsModal = new bootstrap.Modal(modalEl); // ✅ use imported bootstrap
    //               bsModal.show();
    //             }
    //           }
    //         }}
    //       >
    //         {displayText}
    //       </span>
    //     );
    //   },
    // },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span className={text === "Active" ? "text-success" : "text-danger"}>
          {text}
        </span>
      ),
    },
    {
      title: "Action",
      align: "center",
      width: 100,
      render: (record) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" onClick={() => openPreviewModal(record)}>
              <i className="fa fa-eye m-r-5" /> View
            </Menu.Item>
            <Menu.Item key="edit" onClick={() => openEditModal(record)}>
              <i className="fa fa-pencil m-r-5" /> Edit
            </Menu.Item>
            <Menu.Item key="delete" onClick={() => openDeleteModal(record)}>
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
            maintitle="Termination"
            title="Dashboard"
            subtitle="Termination"
            modal="#termination_model"
            name="Add Termination"
          />

          <SearchBox
            placeholder="Search employee, department, or reason..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredTerminations}
              rowKey="id"
              scroll={{ x: "max-content" }}
              pagination={{ pageSize: 10 }}
            />
          )}

          {error && (
            <div style={{ color: "red", marginTop: 12 }}>
              Error: {typeof error === "string" ? error : JSON.stringify(error)}
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Modals */}
      <TerminationModal
        editingData={editingData}
        isOpen={isEditOpen}
        setIsOpen={(open) => {
          setIsEditOpen(open);
          if (!open) setEditingData(null);
          cleanupModalState();
        }}
        fetchTerminations={() => dispatch(get_terminations())}
      />

      <TerminationPreviewModal
        data={previewData}
        isOpen={isPreviewOpen}
        setIsOpen={(open) => {
          setIsPreviewOpen(open);
          if (!open) setPreviewData(null);
          cleanupModalState();
        }}
      />

      {/* Full Reason Modal */}
      <div
        className="modal fade"
        id="fullReasonModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Full Reason</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div
              className="modal-body"
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowY: "auto",
                maxHeight: "400px",
              }}
            ></div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Delete trigger */}
      <button
        id="openDeleteModal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#delete"
        style={{ display: "none" }}
      />
      <DeleteModal Name="Delete Termination" Id={deleteId} />
    </>
  );
};

export default Termination;
