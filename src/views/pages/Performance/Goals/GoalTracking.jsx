/** @format */

import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import SearchBox from "../../../../components/SearchBox";
import GoalTrackingModal from "../../../../components/modelpopup/GoalTrackingModal";
import DeleteModal from "../../../../components/modelpopup/DeleteModal";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min";
import PreviewGoalTrackingModal from "../../../../components/modelpopup/PreviewGoalTrackingModal";
import {
  getGoals as fetchGoalsService,
  deleteGoal as deleteGoalService,
  updateGoal as updateGoalService,
} from "../../../../Redux/services/GoalService";

const GoalTracking = () => {
  const [goals, setGoals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingData, setEditingData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  // ✅ Fetch goals using service
  const fetchGoals = async () => {
    try {
      const res = await fetchGoalsService();
      setGoals(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch goals:", err);
      message.error("Failed to load goal tracking data.");
    }
  };
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
  }, [goals]);

  useEffect(() => {
    fetchGoals();
  }, []);

  // ✅ Delete goal using service
  const handleDelete = async () => {
    try {
      if (!deleteData?.id) return;
      await deleteGoalService(deleteData.id);
      message.success("Goal deleted successfully");
      fetchGoals();
      setDeleteData(null);
    } catch (err) {
      console.error("Failed to delete goal:", err);
      message.error("Failed to delete goal");
    }
  };

  // ✅ Update goal status
  const updateStatus = async (id, newStatus) => {
    try {
      await updateGoalService(id, { status: newStatus });
      fetchGoals();
    } catch (err) {
      console.error("Failed to update status:", err);
      message.error("Failed to update status");
    }
  };

  const filteredGoals = goals.filter(
    (goal) =>
      goal.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.goal_type_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "Sr.no", render: (text, record, index) => index + 1 },
    { title: "Goal Type", dataIndex: "goal_type_id" },
    { title: "Subject", dataIndex: "subject" },
    {
      title: "Target Achievement",
      dataIndex: "target_achievement",
      render: (text) => text || "Not specified",
    },
    { title: "Start Date", dataIndex: "start_date" },
    { title: "End Date", dataIndex: "end_date" },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => text || "No description",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <div className="dropdown action-label training-dropdown">
          <button
            type="button"
            className="btn btn-white btn-sm btn-rounded dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <i
              className={`far fa-dot-circle ${
                text === "Inactive" ? "text-danger" : "text-success"
              }`}
            ></i>{" "}
            {text}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={() => updateStatus(record.id, "Active")}
              >
                <i className="far fa-dot-circle text-success"></i> Active
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => updateStatus(record.id, "Inactive")}
              >
                <i className="far fa-dot-circle text-danger"></i> Inactive
              </button>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Progress",
      dataIndex: "target_achievement",
      render: (text, record) =>
        record.status === "Inactive" ? (
          <span className="text-muted">Not Active</span>
        ) : (
          <>
            <p className="mb-1">Completed {text || 0}%</p>
            <div className="progress" style={{ height: "5px" }}>
              <div
                className={`progress-bar ${
                  parseInt(text) === 100 ? "bg-success" : "bg-primary"
                }`}
                style={{ width: `${text || 0}%`, height: "10px" }}
              ></div>
            </div>
          </>
        ),
    },
    {
      title: "Action",
      render: (record) => (
        <div className="dropdown dropdown-action text-end">
          <button
            className="action-icon btn btn-white btn-sm dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="material-icons">more_vert</i>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className="dropdown-item"
                onClick={() => {
                  setEditingData(record);
                  const modalEl = document.getElementById(
                    "goal_tracking_modal"
                  );
                  if (modalEl) {
                    const modalInstance = new bootstrap.Modal(modalEl);
                    modalInstance.show();
                  }
                }}
              >
                <i className="fa fa-pencil m-r-5"></i> Edit
              </button>
            </li>

            <li>
              <button
                className="dropdown-item"
                onClick={() => {
                  setPreviewData(record);
                  const modalEl = document.getElementById(
                    "preview_goal_tracking"
                  );
                  if (modalEl) {
                    const modalInstance = new bootstrap.Modal(modalEl);
                    modalInstance.show();
                  }
                }}
              >
                <i className="fa fa-eye m-r-5"></i> Preview
              </button>
            </li>

            <li>
              <button
                className="dropdown-item"
                onClick={() => {
                  setDeleteData(record);
                  const modalEl = document.getElementById("delete");
                  if (modalEl) {
                    const modalInstance = new bootstrap.Modal(modalEl);
                    modalInstance.show();
                  }
                }}
              >
                <i className="fa fa-trash m-r-5"></i> Delete
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
            maintitle="Goal Tracking"
            title="Dashboard"
            subtitle="Goal Tracking"
            modal="#goal_tracking_modal"
            name="Add New"
            onClick={() => setEditingData(null)}
          />

          <SearchBox
            placeholder="Search goals..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* ✅ Responsive Table Wrapper with Horizontal Scroll */}
          <div className="table-responsive">
            <Table
              scroll={{ x: true }}
              className="table-striped"
              columns={columns}
              dataSource={filteredGoals}
              rowKey="id"
            />
          </div>
        </div>
      </div>

      <GoalTrackingModal
        editingData={editingData}
        onClose={() => setEditingData(null)}
        fetchGoals={fetchGoals}
      />
      <PreviewGoalTrackingModal data={previewData} />

      <DeleteModal Name="Delete Goal Tracking" onConfirm={handleDelete} />
    </>
  );
};

export default GoalTracking;
