import React, { useState } from "react";
import ProjectSearch from "./ProjectSearch";
import ClientSearch from "./ClientSearch";
import UserSearch from "./UserSearch";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("projects");

  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <div className="content container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card search">            
            <div className="card-body">
              <div className="input-group mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="input-group-text">
                  <i className="fa fa-search"></i>
                </span>
              </div>

              <ul className="nav nav-tabs nav-tabs-solid">
                <li className="nav-item">
                  <span
                    className={`nav-link ${activeTab === "projects" ? "active" : ""}`}
                    onClick={() => handleTabChange("projects")}
                  >
                    Projects
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className={`nav-link ${activeTab === "clients" ? "active" : ""}`}
                    onClick={() => handleTabChange("clients")}
                  >
                    Clients
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className={`nav-link ${activeTab === "users" ? "active" : ""}`}
                    onClick={() => handleTabChange("users")}
                  >
                    Users
                  </span>
                </li>
              </ul>

              <div className="tab-content">
                {activeTab === "projects" && <ProjectSearch searchTerm={searchTerm} />}
                {activeTab === "clients" && <ClientSearch searchTerm={searchTerm} />}
                {activeTab === "users" && <UserSearch searchTerm={searchTerm} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
