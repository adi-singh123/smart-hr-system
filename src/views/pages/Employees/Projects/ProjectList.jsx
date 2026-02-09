/** @format */

import React, { useEffect, useState } from "react";
import { Table, Dropdown, Menu, Modal, message, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import {
  fetchProjects,
  deleteProject,
} from "../../../../Redux/services/Project";
import { getName } from "../../../../Redux/services/User";

import ProjectModelPopup from "../../../../components/modelpopup/ProjectModelPopup";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { UserRole } from "../../../../utils/UserRole";

const ProjectList = () => {
  const dispatch = useDispatch();
  const [nameMap, setNameMap] = useState({});
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id;
  const allProjects = useSelector((state) => state.project.allProjects);
  const isLoading = useSelector((state) => state.project.isLoading);

  // 🔹 Fetch projects
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // 🔹 Filter projects based on role
  useEffect(() => {
    if (allProjects.length > 0) {
      const filtered = allProjects.filter((project) => {
        if (UserRole() === "Internship") {
          const isLeader = project.project_leader_id === currentUserId;
          let isMember = false;
          try {
            const members =
              typeof project.projectMembers === "string"
                ? JSON.parse(project.projectMembers || "[]")
                : project.projectMembers || [];
            isMember = members.flat().includes(currentUserId);
          } catch (e) {
            console.error(e);
          }
          return isLeader || isMember;
        }
        return true;
      });
      setFilteredProjects(filtered);
    }
  }, [allProjects, currentUserId]);

  // 🔹 Load user names
  const loadName = async (userId) => {
    if (!nameMap.hasOwnProperty(userId)) {
      try {
        const res = await dispatch(getName(userId)).unwrap();
        setNameMap((prev) => ({ ...prev, [userId]: res }));
      } catch (err) {
        setNameMap((prev) => ({ ...prev, [userId]: "Unknown" }));
      }
    }
  };

  useEffect(() => {
    filteredProjects.forEach((project) => {
      if (project.project_leader_id) loadName(project.project_leader_id);
      let teamMembers = [];
      try {
        const parsed =
          typeof project.projectMembers === "string"
            ? JSON.parse(project.projectMembers || "[]")
            : project.projectMembers || [];
        teamMembers = parsed.flat();
      } catch (e) {
        console.error(e);
      }
      teamMembers.forEach((id) => loadName(id));
    });
  }, [filteredProjects]);

  // 🔹 Live search filter
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
              ? JSON.parse(project.projectMembers || "[]")
              : project.projectMembers || [];
          teamNames = Array.isArray(parsed)
            ? parsed
                .flat()
                .map((id) => nameMap[id] || "")
                .filter(Boolean)
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

  // 🔹 Edit & View handlers
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

  // 🔹 Dropdown menu
  const getMenu = (record) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(record)}>
        <i className="fa fa-pencil me-2" /> Edit
      </Menu.Item>
      <Menu.Item key="view" onClick={() => handleView(record)}>
        <i className="fa fa-eye me-2" /> View
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(record.id)}>
        <i className="fa fa-trash me-2" /> Delete
      </Menu.Item>
    </Menu>
  );

  // 🔹 Table columns
  const columns = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />,
    },
    {
      title: "Deadline",
      dataIndex: "endDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Project Leader",
      dataIndex: "project_leader_id",
      render: (text) => nameMap[text] || "Loading...",
    },
    {
      title: "Project Members",
      dataIndex: "projectMembers",
      render: (text) => {
        let members = [];
        try {
          const parsed =
            typeof text === "string" ? JSON.parse(text || "[]") : text || [];
          members = parsed.flat();
        } catch (e) {
          console.error(e);
        }
        return (
          members
            .map((id) => nameMap[id])
            .filter((name) => !!name && name !== "Unknown")
            .join(", ") || "Loading..."
        );
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (text) => (
        <span
          className={`badge rounded-pill px-3 py-1 ${
            text === "High"
              ? "bg-danger"
              : text === "Medium"
              ? "bg-warning text-dark"
              : "bg-success"
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown overlay={getMenu(record)} trigger={["click"]}>
          <i className="material-icons" style={{ cursor: "pointer" }}>
            more_vert
          </i>
        </Dropdown>
      ),
    },
  ];

  const data = filteredProjects.map((p) => ({ ...p, key: p.id }));

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
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.id}
                pagination={{ pageSize: 10 }}
              />
            </div>
          </div>
        </div>
      </div>

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

export default ProjectList;
