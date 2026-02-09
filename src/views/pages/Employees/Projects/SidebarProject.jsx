import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../../../Redux/services/Project";
import { setSelectedProject } from "../../../../Redux/features/Project"; // Make sure to import the correct action

export const SidebarProject = () => {
  const dispatch = useDispatch();
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const {
    allProjects = [],
    isLoading,
    error,
    selectedProject, // Get selectedProject from the Redux store
  } = useSelector((state) => state.project); // Assuming the state has selectedProject

  useEffect(() => {
    // Fetch projects only if they haven't been fetched yet
    if (!allProjects.length) {
      dispatch(fetchProjects({}));
    }

    // Update the selected project ID from Redux store
    setSelectedProjectId(selectedProject || ""); // Get selected project from Redux store
  }, [dispatch, allProjects.length, selectedProject]); // Re-run effect when selectedProject changes

  const handleProjectClick = (projectId) => {
    // Update the selected project in the Redux store
    dispatch(setSelectedProject(projectId)); // Dispatch the action to set the selected project in Redux

    // Update the local state to reflect the selected project
    setSelectedProjectId(projectId);

    console.log("Selected Project ID:", projectId);
  };

  return (
    <div className="sidebar text-white" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div className="sidebar-menu">
          <ul className="text-white">
            <li>
              <Link
                onClick={() => localStorage.setItem("firstload", "true")}
                to="/admin-dashboard"
              >
                <i className="la la-home" /> <span>Back to Home</span>
              </Link>
            </li>
            {/* Title for Projects */}
            <li className="menu-title d-flex justify-content-between align-items-center text-white">
              <span>Projects</span>
            </li>

            {/* Display error or loading message */}
            {error ? (
              <li className="text-danger">Error loading projects</li>
            ) : isLoading ? (
              <li className="text-white">Loading projects...</li>
            ) : allProjects.length === 0 ? (
              <li className="text-white">No projects available</li>
            ) : (
              // Display each project in a list
              allProjects.map((project) => (
                <li
                  key={project.id}
                  className={selectedProjectId === project.id ? "active" : ""}
                  style={{
                    margin: "2px 0",
                    borderRadius: "4px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Link
                    className={`text-white d-block px-3 py-2 ${
                      selectedProjectId === project.id ? "active-project" : ""
                    }`}
                    to="#"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleProjectClick(project.id)} // Set the selected project
                    style={{
                      textDecoration: "none",
                      borderRadius: "4px",
                    }}
                  >
                    {project.projectName}
                    {selectedProjectId === project.id && (
                      <span className="float-end">
                        <i className="fas fa-check ms-2"></i>
                      </span>
                    )}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
