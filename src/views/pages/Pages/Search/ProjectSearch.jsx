import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "react-customizable-progressbar";

const mockProjects = [
  {
    id: 1,
    title: "CRM Redesign",
    leader: "Ravi Sharma",
    description: "Redesign the customer relationship management platform for better UX.",
    deadline: "2025-09-01",
    progress: 75,
  },
  {
    id: 2,
    title: "Mobile App Launch",
    leader: "Aarti Desai",
    description: "Launching the new mobile application for client onboarding.",
    deadline: "2025-08-15",
    progress: 40,
  },
  {
    id: 3,
    title: "API Integration",
    leader: "Nikhil Verma",
    description: "Integrate third-party APIs for billing and authentication.",
    deadline: "2025-07-30",
    progress: 90,
  },
];

const ProjectSearch = ({ searchTerm }) => {
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProjects(mockProjects);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = mockProjects.filter(
        (project) =>
          project.title.toLowerCase().includes(lower) ||
          project.description.toLowerCase().includes(lower) ||
          project.leader.toLowerCase().includes(lower)
      );
      setFilteredProjects(filtered);
    }
  }, [searchTerm]);

  return (
    <div className="tab-pane show active">
      <div className="row">
        {filteredProjects.map((project) => (
          <div className="col-md-6 col-xl-4" key={project.id}>
            <div className="card">
              <div className="card-body">
                <h4 className="project-title">
                  <Link to={`/projects/${project.id}`}>{project.title}</Link>
                </h4>
                <p className="text-muted">{project.description}</p>
                <div className="project-details">
                  <p>
                    <strong>Project Leader:</strong> {project.leader || "Not Assigned"}
                  </p>
                  <p>
                    <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="project-progress text-center">
                  <ProgressBar
                    radius={50}
                    progress={project.progress}
                    strokeWidth={6}
                    strokeColor="#4caf50"
                    trackStrokeWidth={6}
                    trackStrokeColor="#e6e6e6"
                    pointerRadius={0}
                    initialAnimation
                  >
                    <div className="indicator">
                      <div>{project.progress}%</div>
                    </div>
                  </ProgressBar>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSearch;
