/** @format */

import React, { useEffect, useState } from "react";
import { Table, message, Input, Spin } from "antd";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import TrainingTypeModal from "../../../../components/modelpopup/TrainingTypeModal";
import TrainingTypePreviewModal from "../../../../components/modelpopup/TrainingTypePreviewModal";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  getTrainingTypes,
  deleteTrainingType,
  updateTrainingType,
} from "../../../../Redux/services/TrainingType";

const TrainingType = () => {
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [editRecord, setEditRecord] = useState(null);
  const [previewRecord, setPreviewRecord] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const toggleDropdown = (id) =>
    setOpenDropdown(openDropdown === id ? null : id);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTrainingTypes();
      setTrainingTypes(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load training types");
      message.error("Failed to load training types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const triggers = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    triggers.forEach((toggle) => {
      const instance = bootstrap.Dropdown.getOrCreateInstance(toggle);
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        instance.toggle();
      });
    });
  }, [trainingTypes]);

  const handleDelete = async () => {
    if (!deleteRecord) return;
    try {
      await deleteTrainingType(deleteRecord.id);
      message.success("Deleted successfully");
      fetchData();
      setDeleteRecord(null);
      const closeButton = document.querySelector(
        "#delete_type_modal .cancel-btn"
      );
      closeButton?.click();
    } catch {
      message.error("Failed to delete");
    }
  };

  const handleStatusChange = async (record) => {
    try {
      const updatedStatus = record.status === "Active" ? "Inactive" : "Active";
      await updateTrainingType(record.id, { ...record, status: updatedStatus });
      message.success("Status updated");
      fetchData();
    } catch {
      message.error("Failed to update status");
    }
  };

  const filteredData = trainingTypes.filter(
    (item) =>
      item.type?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Sr.no",
      dataIndex: "id",
      render: (text, record, index) => index + 1,
    },
    { title: "Training Type", dataIndex: "type" },
    // { title: "Description", dataIndex: "description" },
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
      className: "text-end",
      render: (text, record) => (
        <div className="dropdown dropdown-action text-end training-dropdown">
          <a
            href="#"
            className="action-icon dropdown-toggle"
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown(record.id);
            }}
          >
            <i className="material-icons">more_vert</i>
          </a>

          {openDropdown === record.id && (
            <div
              className="dropdown-menu dropdown-menu-right show"
              style={{ position: "absolute" }}
            >
              <a
                className="dropdown-item"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#edit_type"
                onClick={(e) => {
                  e.preventDefault();
                  setEditRecord(record);
                  setOpenDropdown(null);
                }}
              >
                <i className="fa fa-pencil m-r-5" /> Edit
              </a>
              <a
                className="dropdown-item"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#preview_training_type"
                onClick={(e) => {
                  e.preventDefault();
                  setPreviewRecord(record);
                  setOpenDropdown(null);
                }}
              >
                <i className="fa fa-eye m-r-5" /> Preview
              </a>
              <a
                className="dropdown-item"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#delete_type_modal"
                onClick={(e) => {
                  e.preventDefault();
                  setDeleteRecord(record);
                  setOpenDropdown(null);
                }}
              >
                <i className="fa fa-trash m-r-5" /> Delete
              </a>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Training Type"
            title="Dashboard"
            subtitle="Training Type"
            modal="#add_type"
            name="Add New"
          />
          <div className="row mb-3">
            <div className="col-md-4">
              <Input
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center mt-5">
              <Spin size="large" />
            </div>
          ) : (
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <Table
                    className="table-striped"
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                  />
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
      </div>

      {/* Edit & Preview Modals */}
      <TrainingTypeModal
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        fetchData={fetchData}
      />
      <TrainingTypePreviewModal type={previewRecord} />

      {/* Custom Delete Modal */}
      <div
        className="modal custom-modal fade"
        id="delete_type_modal"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header text-center">
                <h3>Delete Training Type</h3>
                <p>Are you sure you want to delete?</p>
              </div>
              <div className="modal-btn delete-action d-flex justify-content-center gap-3">
                <button
                  className="btn btn-danger continue-btn"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  className="btn btn-secondary cancel-btn"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainingType;
