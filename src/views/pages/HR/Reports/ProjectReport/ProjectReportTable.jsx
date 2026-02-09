/** @format */

import { Table, Pagination, Modal, Input } from "antd"; // ✅ Input import add kiya
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProjects } from "../../../../../Redux/services/Project";
import { getName } from "../../../../../Redux/services/User";
import { fetchClientById } from "../../../../../Redux/services/Client"; // ✅ new import
import { HTTPURL } from "../../../../../Constent/Matcher";
import { useSelector } from "react-redux";
import {
  Avatar_02,
  Avatar_05,
  Avatar_09,
  Avatar_10,
  Avatar_19,
  Avatar_29,
} from "../../../../../Routes/ImagePath";
const PAGE_SIZE = 10;

const getInitials = (name) => {
  if (!name) return "";
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0][0] ? words[0][0].toUpperCase() : "";
  }
  return (
    (words[0][0] ? words[0][0].toUpperCase() : "") +
    (words[words.length - 1][0] ? words[words.length - 1][0].toUpperCase() : "")
  );
};

// Helper to get team members for a record (show only names now)
const getTeamMembers = (record, teamNames) => {
  const ids = record?.projectMembers || [];
  const members = ids.map((id, idx) => ({
    id,
    name: teamNames[id] || `Member ${idx + 1}`,
  }));
  return members;
};

const ProjectReportTable = ({ data: propData }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [clientNames, setClientNames] = useState({});
  const [teamNames, setTeamNames] = useState({});
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ search state

  // For modal popup of team details
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTeam, setModalTeam] = useState([]);
  const [modalProject, setModalProject] = useState("");

  const showTeamModal = (team, projectTitle) => {
    setModalTeam(team);
    setModalProject(projectTitle);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setModalTeam([]);
    setModalProject("");
  };

  const LoggedInuserId = useSelector((state) => state.user.logUserID);
  const LoggedInUserRole = localStorage.getItem("role");

  // 🟢 Fetch all projects on mount
  useEffect(() => {
    const fetchData = async () => {
      const res = await dispatch(fetchProjects({}));
      const projects = res?.payload || [];

      if (Array.isArray(projects)) {
        // 🔹 Filter by role
        let filteredProjects = projects;

        if (LoggedInUserRole?.toLowerCase() !== "admin") {
          filteredProjects = projects.filter(
            (p) =>
              p.project_leader_id === LoggedInuserId ||
              (p.projectMembers || []).includes(LoggedInuserId)
          );
        }

        setData(filteredProjects);

        // Collect client + member IDs
        const clientIds = filteredProjects
          .map((p) => p.client_id)
          .filter(Boolean);
        const memberIds = filteredProjects.flatMap(
          (p) => p.projectMembers || []
        );
        const uniqueClientIds = [...new Set(clientIds)];
        const uniqueMemberIds = [...new Set(memberIds)];

        const clientMap = {};
        const teamMap = {};

        // ✅ Fetch client details
        await Promise.all(
          uniqueClientIds.map(async (id) => {
            const result = await dispatch(fetchClientById(id));
            const clientData = result?.payload?.data;

            if (clientData) {
              const fullName = `${clientData.first_name || ""} ${
                clientData.last_name || ""
              }`.trim();
              clientMap[id] = {
                name: fullName || clientData.company_name || "Unknown Client",
                pic: clientData.profile_pic
                  ? `${HTTPURL}${clientData.profile_pic}`
                  : null,
              };
            } else {
              clientMap[id] = {
                name: "Unknown Client",
                pic: Avatar_10,
              };
            }
          })
        );

        // ✅ Fetch all member names
        await Promise.all(
          uniqueMemberIds.map(async (id) => {
            const result = await dispatch(getName(id));
            if (result?.payload) {
              teamMap[id] = result.payload;
            } else {
              teamMap[id] = "Unknown Member";
            }
          })
        );

        setClientNames(clientMap);
        setTeamNames(teamMap);
      }
    };
    fetchData();
  }, [dispatch]);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Project Title",
      dataIndex: "projectName",
    },
    {
      title: "Client Name",
      dataIndex: "client_id",
      render: (clientId, record) => {
        const client = clientNames[clientId];
        const clientName = client?.name || "Loading...";
        const clientPic = client?.pic;

        const initials = getInitials(clientName);

        return (
          <div
            className="table-avatar"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {clientPic ? (
              <Link to="/profile" className="avatar" style={{ flexShrink: 0 }}>
                <img
                  alt={clientName}
                  src={clientPic}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Link>
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "#1677ff",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                {initials}
              </div>
            )}

            <Link
              to="/profile"
              style={{
                color: "inherit",
                textDecoration: "none",
                fontWeight: "normal",
              }}
            >
              {clientName}
            </Link>
          </div>
        );
      },
    },

    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Priority",
      dataIndex: "priority",
    },
    {
      title: "Team Members",
      dataIndex: "projectMembers",
      render: (text, record) => {
        const team = getTeamMembers(record, teamNames);
        const visible = team.slice(0, 4);
        const extra = team.length > 4 ? team.length - 4 : 0;

        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {visible.map((m, i) => (
              <span
                key={i}
                style={{
                  background: "#f0f0f0",
                  borderRadius: "8px",
                  padding: "2px 8px",
                  fontSize: "13px",
                }}
              >
                {m.name}
              </span>
            ))}
            {extra > 0 && (
              <span
                style={{
                  color: "#1890ff",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
                onClick={() => showTeamModal(team, record.projectName)}
              >
                +{extra} more
              </span>
            )}
          </div>
        );
      },
    },
  ];

  // ✅ Simple Filter logic for search Input
  const filteredData = data.filter((project) => {
    const projectName = project.projectName?.toLowerCase() || "";
    const clientName =
      clientNames[project.client_id]?.name?.toLowerCase() || "";
    const teamList = (project.projectMembers || []).map(
      (id) => teamNames[id]?.toLowerCase() || ""
    );
    const search = searchTerm.toLowerCase();

    return (
      projectName.includes(search) ||
      clientName.includes(search) ||
      teamList.some((t) => t.includes(search))
    );
  });

  const paginatedData = filteredData.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE
  );

  return (
    <div className="row">
      <div className="col-md-12">
        {/* ✅ Simple Search bar */}
        <div className="mb-3 d-flex justify-content-end">
          <Input
            placeholder="Search by Project, Client, or Team Member..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrent(1);
            }}
            style={{ width: 320 }}
          />
        </div>

        <div className="table-responsive">
          <Table
            className="table-striped"
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={paginatedData}
            rowKey={(record) => record.id}
            pagination={false}
          />
        </div>
        <div className="d-flex justify-content-end mt-3">
          <Pagination
            current={current}
            pageSize={PAGE_SIZE}
            total={filteredData.length}
            onChange={setCurrent}
            showSizeChanger={false}
          />
        </div>
      </div>

      {/* 🟢 Team Modal */}
      <Modal
        title={`Team Members${modalProject ? ` - ${modalProject}` : ""}`}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
      >
        {modalTeam.length === 0 ? (
          <div>No team members found.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {modalTeam.map((m, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {m.name}
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
};

export default ProjectReportTable;
