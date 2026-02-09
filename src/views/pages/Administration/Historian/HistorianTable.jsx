/** @format */

import { Table, Input } from "antd";
import React, { useEffect, useState } from "react";
import {
  Avatar_01,
  Avatar_02,
  Avatar_03,
  Avatar_04,
  Avatar_05,
  Avatar_06,
  Avatar_07,
  Avatar_08,
  Avatar_09,
  Avatar_10,
  Avatar_11,
  Avatar_12,
} from "../../../../Routes/ImagePath";
import { Link } from "react-router-dom";
import EditHistorian from "../../../../components/Administration/Historian/EditHistorianModal";
import DeleteModal from "../../../../components/modelpopup/deletePopup";
import ViewHistorian from "../../../../components/Administration/Historian/ViewHistorianModel";
import {
  edit_historian_data,
  get_historian_data,
} from "../../../../Redux/services/Historian";
import { useDispatch, useSelector } from "react-redux";

const HistorianTable = () => {
  const dispatch = useDispatch();
  const [selectedHistorianId, setSelectedHistorianId] = useState("");
  const historianList = useSelector((state) => state?.historian?.historianData);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // 🔹 search/filter states
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (!historianList?.length) {
      dispatch(get_historian_data());
    }
  }, [historianList, dispatch]);

  const isDataEmpty =
    !historianList ||
    historianList.length === 0 ||
    (historianList?.length === 1 &&
      historianList[0].id === null &&
      historianList[0].title === "" &&
      historianList[0].created_date === null &&
      historianList[0].is_active === null &&
      historianList[0].is_featured === null &&
      historianList[0].is_tranding === null &&
      historianList[0].subCategory?.id === null &&
      historianList[0].subCategory?.name === "");

  const data = isDataEmpty
    ? []
    : historianList.map((item) => ({
        id: item?.id,
        title: item?.title || "-",
        created_date: item?.created_date || "-",
        is_active: item?.is_active ? "yes" : "no",
        is_featured: item?.is_featured ? "yes" : "no",
        is_tranding: item?.is_tranding ? "yes" : "no",
        subCategory: item?.subCategory?.name || "-",
      }));

  // 🔹 filter logic (title + subCategory)
  useEffect(() => {
    const lower = searchText.toLowerCase().trim();
    if (!lower) {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter(
          (item) =>
            (item.title || "").toLowerCase().includes(lower) ||
            (item.subCategory || "").toLowerCase().includes(lower)
        )
      );
    }
  }, [data, searchText]);

  const handleEdit = (id) => {
    setSelectedHistorianId(id);
    setEditModalOpen(true);
  };
  const handleView = (id) => {
    setSelectedHistorianId(id);
    setViewModalOpen(true);
  };
  const handleDelete = (id) => {
    setSelectedHistorianId(id);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    if (selectedHistorianId) {
      dispatch(edit_historian_data(selectedHistorianId));

      if (window.bootstrap) {
        const modalElement = new window.bootstrap.Modal(
          document.getElementById("edit_user")
        );
        modalElement.show();
      } else {
        console.error("Bootstrap JS is not loaded");
      }
    }
  }, [selectedHistorianId, dispatch]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text, record) => (
        <div className="table-avatar">
          {text} <span>{record.role}</span>
        </div>
      ),
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: "Is active",
      dataIndex: "is_active",
      sorter: (a, b) => a.is_active.length - b.is_active.length,
    },
    {
      title: "Is featured",
      dataIndex: "is_featured",
      sorter: (a, b) => a.is_featured.length - b.is_featured.length,
    },
    {
      title: "Is tranding",
      dataIndex: "is_tranding",
      sorter: (a, b) => a.is_tranding.length - b.is_tranding.length,
    },
    {
      title: "Sub Category",
      dataIndex: "subCategory",
      sorter: (a, b) => a.subCategory.localeCompare(b.subCategory),
      render: (text) => text || "-",
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-success btn-sm"
            onClick={() => handleView(record.id)}
          >
            <i className="fa fa-eye"></i> View
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleEdit(record.id)}
          >
            <i className="fa fa-pencil"></i> Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(record.id)}
          >
            <i className="fa fa-trash"></i> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        {/* 🔹 Search bar */}
        <div className="mb-3">
          <Input
            placeholder="Search by Title or Sub Category"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "300px", maxWidth: "100%" }}
          />
        </div>

        <div className="table-responsive">
          <Table
            className="table-striped"
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record.id}
          />

          {isViewModalOpen && (
            <ViewHistorian
              id={selectedHistorianId}
              onClose={() => setViewModalOpen(false)}
            />
          )}

          {isEditModalOpen && selectedHistorianId && (
            <EditHistorian
              id={selectedHistorianId}
              onClose={() => setEditModalOpen(false)}
            />
          )}

          {isDeleteModalOpen && selectedHistorianId && (
            <DeleteModal
              id={selectedHistorianId}
              onClose={() => setDeleteModalOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorianTable;
