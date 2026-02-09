/** @format */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Menu, Modal, message, Input } from "antd";

import {
  fetchProjects,
  deleteProject,
} from "../../../../Redux/services/Project";
import { getName } from "../../../../Redux/services/User";
import ProjectModelPopup from "../../../../components/modelpopup/ProjectModelPopup";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { fetchNotifications } from "../../../../Redux/services/Notifications";

const Project = () => {
  const dispatch = useDispatch();
  const [nameMap, setNameMap] = useState({});
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  const allProjects = useSelector((state) => state.project.allProjects);
  const isLoading = useSelector((state) => state.project.isLoading);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const loadName = async (userId) => {
    if (!nameMap.hasOwnProperty(userId)) {
      try {
        const res = await dispatch(getName(userId)).unwrap();
        setNameMap((prev) => ({ ...prev, [userId]: res }));
      } catch (error) {
        setNameMap((prev) => ({ ...prev, [userId]: "Unknown" }));
      }
    }
  };

  useEffect(() => {
    allProjects.forEach((project) => {
      if (project.project_leader_id) loadName(project.project_leader_id);

      let teamMembers = [];
      try {
        const parsed =
          typeof project.projectMembers === "string"
            ? JSON.parse(project.projectMembers)
            : project.projectMembers;
        teamMembers = Array.isArray(parsed) ? parsed.flat() : [];
      } catch (e) {
        console.error("Invalid projectMembers format:", project.projectMembers);
        teamMembers = [];
      }

      teamMembers.forEach((id) => loadName(id));
    });
  }, [allProjects]);

  // 🔹 Search/filter logic
  useEffect(() => {
    const lowerSearch = searchText.toLowerCase().trim();

    if (!lowerSearch) {
      setFilteredProjects(allProjects);
    } else {
      const filtered = allProjects.filter((project) => {
        const leaderName = nameMap[project.project_leader_id] || "";
        let teamNames = [];
        try {
          const parsed =
            typeof project.projectMembers === "string"
              ? JSON.parse(project.projectMembers)
              : project.projectMembers;
          teamNames = Array.isArray(parsed)
            ? parsed
                .flat()
                .map((id) => nameMap[id] || "")
                .filter((n) => n)
            : [];
        } catch (e) {
          teamNames = [];
        }

        return (
          (project.projectName || "").toLowerCase().includes(lowerSearch) ||
          leaderName.toLowerCase().includes(lowerSearch) ||
          teamNames.join(" ").toLowerCase().includes(lowerSearch)
        );
      });
      setFilteredProjects(filtered);
    }
  }, [searchText, allProjects, nameMap]);

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
          await dispatch(fetchNotifications());
        } catch (err) {
          message.error("Failed to delete project");
        }
      },
    });
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsEdit(true);
    setShowProjectModal(true);
  };

  const handleView = (project) => {
    setSelectedProject(project);
    setIsEdit(false);
    setShowProjectModal(true);
  };

  const getMenu = (record) => (
    <Menu>
      <Menu.Item key="view" onClick={() => handleView(record)}>
        <i className="fa fa-eye me-2" /> View
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => handleEdit(record)}>
        <i className="fa fa-pencil me-2" /> Edit
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(record.id)}>
        <i className="fa fa-trash me-2" /> Delete
      </Menu.Item>
    </Menu>
  );

  const formatDate = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Projects"
          title="Dashboard"
          subtitle="Projects"
          modal="#create_project"
          name="Create Project"
          Linkname="/projects"
          Linkname1="/project-list"
        />

        {/* 🔹 Search Bar */}
        <div className="row mb-3 align-items-center">
          <div className="col-12 col-md-6 mb-2 mb-md-0">
            <Input
              placeholder="Search by Project Name, Leader, or Members"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%", height: "45px" }}
            />
          </div>
        </div>

        <div className="row">
          {isLoading ? (
            <p>Loading projects...</p>
          ) : filteredProjects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            filteredProjects.map((project) => {
              const teamMembers = Array.isArray(project.projectMembers)
                ? project.projectMembers
                : JSON.parse(project.projectMembers || "[]");
              return (
                <div
                  className="col-lg-4 col-sm-6 col-md-4 col-xl-3 d-flex"
                  key={project.id}
                >
                  <div className="card w-100 shadow-sm">
                    <div className="card-body position-relative">
                      {/* 3-dot dropdown at top-right */}
                      <div className="position-absolute top-0 end-0 m-2">
                        <Dropdown
                          overlay={getMenu(project)}
                          trigger={["click"]}
                        >
                          <i
                            className="material-icons"
                            style={{ cursor: "pointer" }}
                          >
                            more_vert
                          </i>
                        </Dropdown>
                      </div>

                      <h4 className="project-title mt-2 mb-2">
                        <Link
                          to={`/project-view/${project.id}`}
                          className="text-dark font-4xl"
                        >
                          {project.projectName}
                        </Link>
                      </h4>

                      <p
                        className="text-dark mt-2 font-sm"
                        dangerouslySetInnerHTML={{
                          __html: project.description,
                        }}
                      />

                      <div className="pro-deadline mb-2">
                        <div className="text-dark fw-semibold">Deadline:</div>
                        <div className="text-muted">
                          {formatDate(project.endDate)}
                        </div>
                      </div>

                      <div className="project-members mb-2">
                        <div className="text-dark fw-semibold">
                          Project Leader:
                        </div>
                        <div className="text-muted small">
                          {nameMap[project.project_leader_id] || "Loading..."}
                        </div>
                      </div>

                      <div className="project-members mb-2">
                        <div className="text-dark fw-semibold">
                          Team Members:
                        </div>
                        <div className="text-muted small">
                          {teamMembers
                            .flat()
                            .map((memberId) => nameMap[memberId])
                            .filter((name) => !!name && name !== "Unknown")
                            .join(", ") || "Loading..."}
                        </div>
                      </div>

                      <div className="d-flex gap-4 align-items-center">
                        <span className="fw-semibold text-dark">Priority:</span>
                        <span
                          className={`badge rounded-pill px-4 py-2 ${
                            project.priority === "High"
                              ? "bg-danger"
                              : project.priority === "Medium"
                              ? "bg-warning text-dark"
                              : "bg-success"
                          }`}
                        >
                          {project.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Project Create/Edit/View Modal */}
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

export default Project;
