/** @format */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFiles, deleteFile } from "../../../../../Redux/services/File";
import { FaFilePdf, FaFileImage } from "react-icons/fa";
import { LuFiles } from "react-icons/lu";
import { HTTPURL } from "../../../../../Constent/Matcher";
import DeleteModal from "../../../../../components/modelpopup/DeleteModal";

const RecentFiles = ({ searchQuery }) => {
  const dispatch = useDispatch();

  const loginUserId = useSelector((state) => state?.user?.logUserID);
  const LogInuserRole = localStorage.getItem("role");
  const { files, loading, error } = useSelector((state) => state.file);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const icons = new Map([
    ["pdf", <FaFilePdf size={28} />],
    ["jpg", <FaFileImage size={28} />],
    ["jpeg", <FaFileImage size={28} />],
    ["png", <FaFileImage size={28} />],
    ["webp", <FaFileImage size={28} />],
    ["others", <LuFiles size={28} />],
  ]);

  // Helper to format bytes
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = 1024;
    const mb = kb * 1024;
    const gb = mb * 1024;

    if (bytes >= gb) return (bytes / gb).toFixed(2) + " GB";
    if (bytes >= mb) return (bytes / mb).toFixed(2) + " MB";
    if (bytes >= kb) return (bytes / kb).toFixed(2) + " KB";
    return bytes + " B";
  };

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  if (loading) return <p>Loading recent files...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  // Filter files only if searchQuery length >= 3
  let userFilteredFiles = files;

  // If NOT admin → show only logged-in user's files
  if (LogInuserRole !== "Admin") {
    userFilteredFiles = files.filter((file) => file.user_id === loginUserId);
  }

  // Now apply search filter on already user-filtered files
  const filteredFiles =
    searchQuery && searchQuery.length >= 3
      ? userFilteredFiles.filter((file) =>
          file.filename.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : userFilteredFiles;

  const showDeleteConfirm = () => {
    return new Promise((resolve) => {
      const wrap = document.createElement("div");
      wrap.innerHTML = `
      <div style="
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
      ">
        <div style="
          width: 380px;
          background: #fff;
          border-radius: 10px;
          padding: 25px;
          text-align: center;
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
          font-family: system-ui;
        ">
          <h3 style="margin-bottom: 10px;">Delete File</h3>
          <p style="margin-bottom: 20px;">Are you sure you want to delete?</p>

          <div style="display:flex; gap:15px; justify-content:center;">
            <button id="confirmBtn" style="
              padding: 8px 20px;
              background: #dc3545;
              border: none;
              color: white;
              border-radius: 5px;
            ">Delete</button>

            <button id="cancelBtn" style="
              padding: 8px 20px;
              background: #6c757d;
              border: none;
              color: white;
              border-radius: 5px;
            ">Cancel</button>
          </div>
        </div>
      </div>
    `;

      document.body.appendChild(wrap);

      wrap.querySelector("#confirmBtn").onclick = () => {
        document.body.removeChild(wrap);
        resolve(true);
      };

      wrap.querySelector("#cancelBtn").onclick = () => {
        document.body.removeChild(wrap);
        resolve(false);
      };
    });
  };

  const handleDelete = async (id) => {
    const confirm = await showDeleteConfirm();

    if (!confirm) return;

    const result = await dispatch(deleteFile(id));

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(fetchFiles());
      setSelectedFile(null);
    } else {
      alert("Failed to delete file");
    }
  };

  return (
    <>
      <div className="row g-4">
        {filteredFiles.length === 0 ? (
          <p className="text-muted">No files found.</p>
        ) : (
          filteredFiles.map((file) => {
            const icon = icons.has(file.file_type)
              ? icons.get(file.file_type)
              : icons.get("others");

            const fullPath = file?.path
              ? `${HTTPURL}${
                  file.path.startsWith("/") ? file.path.slice(1) : file.path
                }`
              : null;

            return (
              <div
                className={`col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2 ${
                  selectedFile?.id === file.id
                    ? "border border-primary rounded"
                    : ""
                }`}
                key={file.id}
              >
                <a
                  rel="noopener noreferrer"
                  onClick={() => setSelectedFile(file)}
                  className="text-decoration-none text-dark"
                >
                  <div className="card card-file h-100 shadow-sm">
                    <div className="card-file-thumb">
                      {["jpg", "jpeg", "png", "webp"].includes(
                        file.extension
                      ) && fullPath ? (
                        <img
                          src={fullPath}
                          className="img-fluid"
                          alt="preview"
                        />
                      ) : (
                        <div className="text-muted">{icon}</div>
                      )}
                    </div>

                    <div className="card-body px-3 py-2">
                      <h6 className="text-truncate mb-1" title={file.filename}>
                        {file.filename}
                      </h6>
                      <small className="text-muted">
                        {formatFileSize(file.file_size)}
                      </small>
                    </div>
                    <div className="card-footer text-muted small text-end">
                      {file.updated_at}
                    </div>
                  </div>
                </a>
              </div>
            );
          })
        )}
      </div>

      {/* File Preview Section */}
      {selectedFile && (
        <div className="mt-4 p-3 border rounded bg-light">
          <h6 className="mb-2">📁 Recent File Details</h6>
          <p>
            <strong>Name:</strong> {selectedFile.filename}
          </p>
          <p>
            <strong>Assign To:</strong>{" "}
            {`${selectedFile.uploadedBy?.first_name || ""} ${
              selectedFile.uploadedBy?.last_name || ""
            }`}
          </p>
          <p>
            <strong>Size:</strong> {formatFileSize(selectedFile.file_size)}
          </p>
          <p>
            <strong>Modified:</strong> {selectedFile.updated_at}
          </p>
          <p>
            <strong>Type:</strong> {selectedFile.file_type}
          </p>
          {["jpg", "jpeg", "png", "webp"].includes(selectedFile.extension) &&
          selectedFile.path ? (
            <img
              src={`${HTTPURL}${
                selectedFile.path.startsWith("/")
                  ? selectedFile.path.slice(1)
                  : selectedFile.path
              }`}
              className="img-fluid rounded"
              style={{ maxHeight: "300px" }}
              alt="preview"
            />
          ) : selectedFile.path ? (
            <div className="d-flex gap-2">
              <a
                href={`${HTTPURL}${
                  selectedFile.path.startsWith("/")
                    ? selectedFile.path.slice(1)
                    : selectedFile.path
                }`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-primary"
              >
                Open in New Tab
              </a>

              {/* Delete Button → Modal opens */}
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  handleDelete(selectedFile.id);
                }}
              >
                Delete
              </button>
            </div>
          ) : (
            <p className="text-muted">No preview available</p>
          )}
        </div>
      )}
    </>
  );
};

export default RecentFiles;
