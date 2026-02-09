/** @format */

import React, { useState } from "react";
import RecentFiles from "./recentFiles";
import UploadFileModal from "../../../../../components/modelpopup/FileUploadModal";

const FileManager = () => {
  const LogInuserRole = localStorage.getItem("role");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="file-wrap d-flex">
                <div className="file-cont-wrap flex-grow-1">
                  <div className="file-cont-inner">
                    <div className="file-cont-header d-flex justify-content-between align-items-center border-bottom p-3">
                      <h5 className="mb-0">File Manager</h5>
                      <div className="d-flex align-items-center gap-2">
                        {/* File search */}
                        <form className="file-search">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control rounded-pill"
                              placeholder="Search Files..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </form>
                        {LogInuserRole == "Admin" && (
                          <button
                            className="btn btn-primary btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#upload_file"
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="file-content p-3">
                      <h6 className="mb-3">Recent Files</h6>
                      {/* Pass search query to filter inside RecentFiles */}
                      <RecentFiles searchQuery={searchQuery} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UploadFileModal />
    </>
  );
};

export default FileManager;
