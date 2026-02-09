import React, { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchAssets } from "../../../../Redux/services/Assets";
import { getAllUsers } from "../../../../Redux/services/User";

const AssetsSearchFilter = ({ setAssetData }) => {
  const dispatch = useDispatch();
  const { Assets } = useSelector((state) => state.Assets);
  const {user } = useSelector((state) => state.user);

  const [assetName, setAssetName] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [assetType, setAssetType] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // Fetch assets and users on mount
  useEffect(() => {
    dispatch(fetchAssets());
    dispatch(getAllUsers());
  }, [dispatch]);

  // Dynamically generate assignee options from Redux users
  const assigneeOptions = useMemo(() => {
    return (user || []).map((u) => ({
      value: u.id,
      label: `${u.first_name} ${u.last_name} (${u.employee_id || "N/A"})`,
    })) || [];
  }, [user]);

  // Dynamically generate asset type options from assets
  const assetTypeOptions = useMemo(() => {
    const types = [...new Set((Assets || []).map((a) => a.asset_type).filter(Boolean))];
    return types.map((type) => ({ value: type, label: type }));
  }, [Assets]);

  const handleSearch = () => {
    let filtered = [...Assets];

    if (assetName) {
      filtered = filtered.filter((asset) =>
        asset.name.toLowerCase().includes(assetName.toLowerCase())
      );
    }

    if (selectedAssignee) {
      filtered = filtered.filter(
        (asset) => asset.employee_id === selectedAssignee.value
      );
    }

    if (assetType) {
      filtered = filtered.filter((asset) => asset.asset_type === assetType.value);
    }

    if (startDate && endDate) {
      filtered = filtered.filter((asset) => {
        const assigned = new Date(asset.assigned_date);
        return assigned >= startDate && assigned <= endDate;
      });
    }

    setAssetData(filtered);
  };

  return (
    <div className="row align-items-end gy-3 mb-4">
      <div className="col-md-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter asset name..."
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
        />
      </div>
      <div className="col-md-3">
        <Select
          options={assigneeOptions}
          isClearable
          placeholder="Select Assignee"
          value={selectedAssignee}
          onChange={setSelectedAssignee}
        />
      </div>
      <div className="col-md-2">
        <Select
          options={assetTypeOptions}
          isClearable
          placeholder="Select Type"
          value={assetType}
          onChange={setAssetType}
        />
      </div>
      <div className="col-md-3">
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDateRange(update)}
          isClearable
          placeholderText="Select date range"
          className="form-control"
        />
      </div>
      <div className="col-md-1 d-grid">
        <button className="btn btn-success" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default AssetsSearchFilter;
