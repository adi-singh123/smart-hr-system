/** @format */

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  deleteProject,
} from "../../../../../Redux/services/Project";
import { Dropdown, Menu, Modal, message } from "antd";
import ProjectModelPopup from "../../../../../components/modelpopup/ProjectModelPopup";

const RecentTable = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [recentProjects, setRecentProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const projectsData = useSelector((state) => state.project.allProjects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projectsData && projectsData.length > 0) {
      const sortedProjects = [...projectsData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentProjects(sortedProjects.slice(0, 4));
    }
  }, [projectsData]);

  // 🔹 Edit handler
  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsEdit(true);
    setShowProjectModal(true);
  };

  // 🔹 View handler
  const handleView = (project) => {
    setSelectedProject(project);
    setIsEdit(false);
    setShowProjectModal(true);
  };

  // 🔹 Delete handler
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this project?",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(deleteProject(id)).unwrap();
          message.success("Project deleted successfully!");
          dispatch(fetchProjects());
        } catch (err) {
          message.error("Failed to delete project");
        }
      },
    });
  };

  // 🔹 Dropdown menu for each project
  const getMenu = (project) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(project)}>
        <i className="fa fa-pencil me-2" /> Edit
      </Menu.Item>
      <Menu.Item key="view" onClick={() => handleView(project)}>
        <i className="fa fa-eye me-2" /> View
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(project.id)}>
        <i className="fa fa-trash me-2" /> Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="col-md-6 d-flex">
      <div className="card card-table flex-fill">
        <div className="card-header">
          <h3 className="card-title mb-0">Recent Projects</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table custom-table mb-0">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Progress</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project, index) => (
                  <tr key={project.id || index}>
                    <td>
                      <h2>
                        <Link to={`/project-view/${project.id}`}>
                          {project.projectName}
                        </Link>
                      </h2>
                      <small className="block text-ellipsis">
                        <span>{project.openTasks || 0}</span>{" "}
                        <span className="text-muted">open tasks, </span>
                        <span>{project.completedTasks || 0}</span>{" "}
                        <span className="text-muted">tasks completed</span>
                      </small>
                    </td>
                    <td>
                      <div className="progress progress-xs progress-striped">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          data-bs-toggle="tooltip"
                          title={`${project.progress || 0}%`}
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </td>
                    <td className="text-end">
                      <Dropdown overlay={getMenu(project)} trigger={["click"]}>
                        <i
                          className="material-icons"
                          style={{ cursor: "pointer" }}
                        >
                          more_vert
                        </i>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
                {recentProjects.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No recent projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {projectsData?.length > 4 && location.pathname !== "/projects" && (
          <div className="card-footer text-center">
            <Link to="/projects">View all projects</Link>
          </div>
        )}
      </div>

      {/* 🔹 Modal for View/Edit */}
      <ProjectModelPopup
        show={showProjectModal}
        setShow={setShowProjectModal}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
    </div>
  );
};

export default RecentTable;
