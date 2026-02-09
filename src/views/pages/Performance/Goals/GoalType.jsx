/** @format */

import React, { useEffect, useState } from "react";
import { Table } from "antd";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import SearchBox from "../../../../components/SearchBox";
import GoalTypeModal from "../../../../components/modelpopup/GoalTypeModal";
import DeleteModal from "../../../../components/modelpopup/DeleteModal";
import PreviewGoalTypeModal from "../../../../components/modelpopup/PreviewGoalTypeModal";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  getGoalTypes,
  deleteGoalType,
} from "../../../../Redux/services/GoalTypeService"; // ✅ service functions

const GoalType = () => {
  const [goalTypes, setGoalTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingData, setEditingData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [selectedToDelete, setSelectedToDelete] = useState(null);

  // ✅ Fetch goal types using service
  const fetchGoalTypes = async () => {
    try {
      const res = await getGoalTypes();
      setGoalTypes(res); // service returns data array directly
    } catch (error) {
      console.error("Error fetching goal types:", error);
    }
  };

  useEffect(() => {
    fetchGoalTypes();
  }, []);

  useEffect(() => {
    const dropdownElements = document.querySelectorAll(
      '[data-bs-toggle="dropdown"]'
    );
    dropdownElements.forEach((el) => {
      const instance = bootstrap.Dropdown.getOrCreateInstance(el);
      // **onclick manually toggle karo**
      el.onclick = (e) => {
        e.stopPropagation(); // event modal ke liye bubble na ho
        instance.toggle();
      };
    });

    return () => {
      dropdownElements.forEach((el) => {
        const instance = bootstrap.Dropdown.getInstance(el);
        if (instance) instance.dispose();
        el.onclick = null;
      });
    };
  }, [goalTypes]);

  // ✅ Delete using service
  const handleDelete = async () => {
    if (!selectedToDelete) return;
    try {
      await deleteGoalType(selectedToDelete.id);
      fetchGoalTypes();
      setSelectedToDelete(null);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  // ✅ Filter goal types safely
  const filteredGoalTypes = goalTypes.filter(
    (goal) =>
      (goal.goal_type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (goal.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "sr.no",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Type",
      dataIndex: "goal_type",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => {
        const normalized = (text || "").toLowerCase();
        return (
          <span
            className={normalized === "active" ? "text-success" : "text-danger"}
          >
            {normalized.charAt(0).toUpperCase() + normalized.slice(1)}
          </span>
        );
      },
    },
    {
      title: "Action",
      render: (record) => (
        <div className="dropdown dropdown-action text-end training-dropdown">
          <button
            className="action-icon btn btn-white btn-sm dropdown-toggle"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const instance = bootstrap.Dropdown.getOrCreateInstance(
                e.currentTarget
              );
              instance.toggle();
            }}
          >
            <i className="material-icons">more_vert</i>
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => {
                  setEditingData(record);
                  const modalEl = document.getElementById("goal_type_modal");
                  if (modalEl) new bootstrap.Modal(modalEl).show();
                }}
              >
                <i className="fa fa-pencil m-r-5" /> Edit
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => {
                  setPreviewData(record);
                  const modalEl = document.getElementById("preview_goal_type");
                  if (modalEl) new bootstrap.Modal(modalEl).show();
                }}
              >
                <i className="fa fa-eye m-r-5" /> Preview
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => {
                  setSelectedToDelete(record);
                  const modalEl = document.getElementById("delete");
                  if (modalEl) new bootstrap.Modal(modalEl).show();
                }}
              >
                <i className="fa fa-trash m-r-5" /> Delete
              </button>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Goal Type"
            title="Dashboard"
            subtitle="Goal Type"
            modal="#goal_type_modal"
            name="Add New"
          />

          <SearchBox
            placeholder="Search goal type..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Table columns={columns} dataSource={filteredGoalTypes} rowKey="id" />
        </div>
      </div>

      <GoalTypeModal
        editingData={editingData}
        onClose={() => setEditingData(null)}
        fetchGoalTypes={fetchGoalTypes}
      />

      <PreviewGoalTypeModal data={previewData} />

      <DeleteModal Name="Delete Goal Type" onConfirm={handleDelete} />
    </>
  );
};

export default GoalType;
