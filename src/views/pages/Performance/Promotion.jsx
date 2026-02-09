/** @format */

import React, { useEffect, useState } from "react";
import { Table, Dropdown, Menu, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumbs from "../../../components/Breadcrumbs";
import PromotionModal from "../../../components/modelpopup/PromotionModal";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import PreviewPromotionModal from "../../../components/modelpopup/PreviewPromotionModal";
import SearchBox from "../../../components/SearchBox";
import { HTTPURL } from "../../../Constent/Matcher";

// ✅ Redux services
import {
  fetchPromotions,
  deletePromotion,
} from "../../../Redux/services/Promotion";

const Promotion = () => {
  const dispatch = useDispatch();
  const { promotions } = useSelector((state) => state.promotion);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingData, setEditingData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [selectedToDelete, setSelectedToDelete] = useState(null);

  // ✅ Fetch promotions from Redux
  const loadPromotions = () => {
    dispatch(fetchPromotions());
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  // ✅ Auto-open modals when states change
  useEffect(() => {
    if (previewData) {
      const modalEl = document.getElementById("preview_promotion");
      if (modalEl) {
        // purana instance hatao
        const existingModal = bootstrap.Modal.getInstance(modalEl);
        if (existingModal) existingModal.dispose();

        // thoda delay dekar dubara show karo
        setTimeout(() => {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();

          // jab modal close ho, previewData null kar do
          modalEl.addEventListener(
            "hidden.bs.modal",
            () => {
              setPreviewData(null);
            },
            { once: true }
          );
        }, 100);
      }
    }
  }, [previewData]);

  // Auto-open edit modal when editingData changes
  useEffect(() => {
    if (editingData) {
      const modalEl = document.getElementById("add_promotion");
      if (modalEl) {
        const existingModal = bootstrap.Modal.getInstance(modalEl);
        if (existingModal) existingModal.dispose();

        setTimeout(() => {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();

          modalEl.addEventListener(
            "hidden.bs.modal",
            () => {
              setEditingData(null);
            },
            { once: true }
          );
        }, 100);
      }
    }
  }, [editingData]);

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
            () => {
              setSelectedToDelete(null);
            },
            { once: true }
          );
        }, 100);
      }
    }
  }, [selectedToDelete]);

  // ✅ Handle delete via Redux
  const handleDelete = async () => {
    if (!selectedToDelete) return;
    try {
      await dispatch(deletePromotion(selectedToDelete.id));
      loadPromotions();
      setSelectedToDelete(null);
    } catch (err) {
      console.error("Failed to delete promotion:", err);
    }
  };

  // ✅ Search filter
  const filteredPromotions = promotions.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.name || "").toLowerCase().includes(term) ||
      (p.department || "").toLowerCase().includes(term) ||
      (p.from_designation || "").toLowerCase().includes(term) ||
      (p.to_designation || "").toLowerCase().includes(term) ||
      (p.status || "").toLowerCase().includes(term)
    );
  });

  // ✅ Table columns (⚠️ match backend field names exactly)
  const columns = [
    { title: "Sr. No", render: (text, record, index) => index + 1 },
    { title: "Promoted Employee", dataIndex: "name" },
    { title: "Department", dataIndex: "department" },
    { title: "Promotion For", dataIndex: "from_designation" },
    { title: "Promoted To", dataIndex: "to_designation" },
    { title: "Promotion Date", dataIndex: "promotion_date" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const lower = status?.toLowerCase();
        const badgeClass =
          lower === "approved"
            ? "success"
            : lower === "pending"
            ? "warning"
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
            <Menu.Item key="view" onClick={() => setPreviewData(record)}>
              <i className="fa fa-eye m-r-5" /> Preview
            </Menu.Item>
            <Menu.Item key="edit" onClick={() => setEditingData(record)}>
              <i className="fa fa-pencil m-r-5" /> Edit
            </Menu.Item>
            <Menu.Item key="delete" onClick={() => setSelectedToDelete(record)}>
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
            maintitle="Promotion"
            title="Dashboard"
            subtitle="Promotion"
            modal="#add_promotion"
            name="Add New"
          />

          <SearchBox
            placeholder="Search promotion..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Table
            className="table-striped"
            columns={columns}
            dataSource={filteredPromotions}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>

      {/* ✅ Modals always in DOM */}
      <PromotionModal
        editingData={editingData}
        onClose={() => setEditingData(null)}
      />
      <PreviewPromotionModal data={previewData} />
      <DeleteModal
        Name="Delete Promotion"
        onConfirm={handleDelete}
        onCancel={() => setSelectedToDelete(null)}
      />
    </>
  );
};

export default Promotion;
