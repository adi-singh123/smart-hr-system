import { Table } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssets, updateAsset, deleteAsset } from "../../../../Redux/services/Assets";
import { getAllUsers } from "../../../../Redux/services/User";

const AssetsTable = () => {
  const dispatch = useDispatch();
  const { assets } = useSelector((state) => state.Assets);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [staffOptions, setStaffOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch assets on mount
  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  // Fetch users for assignee dropdown
  const fetchUsers = useCallback(async () => {
    try {
      const response = await dispatch(getAllUsers()).unwrap();
      if (response?.status && response?.data?.users) {
        setStaffOptions(
          response.data.users.map((u) => ({
            value: u.id,
            label: `${u.first_name} ${u.last_name} (${u.employee_id || "N/A"})`,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Open edit modal
  const handleEditClick = (record) => {
    setEditedValues({
      ...record,
      assignee: record.assigneeUser?.id || null, // store string ID only
    });
    setEditModalOpen(true);
  };

  // Save edited asset with duplicate check
  const handleSave = async () => {
    const assetName = editedValues.name?.trim().toLowerCase();
    const assetId = editedValues.asset_id?.trim();

    // Check for duplicates (excluding current asset)
    const duplicate = assets.find(
      (a) =>
        a.id !== editedValues.id &&
        (a.name?.trim().toLowerCase() === assetName || a.asset_id === assetId)
    );

    if (duplicate) {
      alert("Duplicate Asset Name or Asset ID found. Please use unique values.");
      return;
    }

    try {
      const payload = {
        asset_id: editedValues.asset_id?.trim(),
        name: editedValues.name?.trim(),
        assigned_date: editedValues.assigned_date,
        assignee: editedValues.assignee || null, // string ID
      };

      await dispatch(updateAsset({ id: editedValues.id, formData: payload }));
      await dispatch(fetchAssets());
      setEditModalOpen(false);
    } catch (err) {
      console.error("Error updating asset:", err);
    }
  };

  // Open delete modal
  const handleDeleteClick = (id) => {
    setSelectedAssetId(id);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteAsset(selectedAssetId));
      await dispatch(fetchAssets());
      setDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting asset:", err);
    }
  };

  // Update editedValues
  const handleInputChange = (field, value) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }));
  };

  // Filter assets based on search
  const filteredAssets = assets.filter((a) => {
    const assigneeName = a?.assigneeUser
      ? `${a.assigneeUser.first_name} ${a.assigneeUser.last_name}`
      : "";
    const assignedDate = a.assigned_date
      ? moment(a.assigned_date).format("DD-MM-YYYY")
      : "";
    const term = searchTerm.toLowerCase();

    return (
      (a.name || "").toLowerCase().includes(term) ||
      (a.asset_id || "").toLowerCase().includes(term) ||
      assigneeName.toLowerCase().includes(term) ||
      assignedDate.includes(term)
    );
  });

  const columns = [
    { title: "Sr.no", key: "index", render: (_, __, index) => index + 1, width: "5%" },
    { title: "Name", dataIndex: "name", key: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Asset ID", dataIndex: "asset_id", key: "asset_id", sorter: (a, b) => a.asset_id.localeCompare(b.asset_id) },
    {
      title: "Assigned Date",
      dataIndex: "assigned_date",
      key: "assigned_date",
      sorter: (a, b) => new Date(a.assigned_date) - new Date(b.assigned_date),
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },
    {
      title: "Assignee",
      key: "assignee",
      sorter: (a, b) => (a?.assigneeUser?.first_name || "").localeCompare(b?.assigneeUser?.first_name || ""),
      render: (record) => {
        const assignee = record.assigneeUser;
        return assignee ? `${assignee.first_name} ${assignee.last_name}` : "Unassigned";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="d-flex gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => handleEditClick(record)}>
            <i className="fa fa-edit"></i> Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(record.id)}>
            <i className="fa fa-trash"></i> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name, Asset ID, Assignee, or Date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal custom-modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Asset</h5>
                  <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    lineHeight: "1",
                    color: "#000",
                  }}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Asset Name"
                  value={editedValues.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Asset ID"
                  value={editedValues.asset_id || ""}
                  onChange={(e) => handleInputChange("asset_id", e.target.value)}
                />
                <input
                  type="date"
                  className="form-control mb-3"
                  value={editedValues.assigned_date || ""}
                  onChange={(e) => handleInputChange("assigned_date", e.target.value)}
                />
                <Select
                  className="mb-3"
                  options={staffOptions}
                  isClearable
                  placeholder="Select Assignee"
                  value={staffOptions.find(opt => opt.value === editedValues.assignee) || null} // show selected label
                  onChange={(opt) => handleInputChange("assignee", opt?.value || null)} // save only string ID
                />
                <div className="text-end">
                  <button className="btn btn-success" onClick={handleSave}>Save</button>
                  <button className="btn btn-secondary ms-2" onClick={() => setEditModalOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="modal custom-modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Confirm Delete</h5>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    lineHeight: "1",
                    color: "#000",
                  }}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body text-center">
                <p>Are you sure you want to delete this asset?</p>
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <button className="btn btn-danger" onClick={handleDeleteConfirm}>Delete</button>
                  <button className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assets Table */}
      <div className="table-responsive table-newdatatable">
        <Table
          columns={columns}
          dataSource={filteredAssets}
          rowKey="id"
          className="table-striped"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No assets found. Try adjusting your search or filters." }}
        />
      </div>
    </>
  );
};

export default AssetsTable;
