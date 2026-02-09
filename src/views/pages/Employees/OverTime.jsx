// OverTime.jsx
// (unchanged from your improved version)
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar_02, Avatar_09 } from "../../../Routes/ImagePath";
import { Table, Input, Select, DatePicker } from "antd";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SearchBox from "../../../components/SearchBox";
import AddOverTime from "../../../components/modelpopup/AddOverTime";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import moment from "moment";

const OverTime = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const statsData = [
    { title: "Overtime Employee", value: 12, month: "this month" },
    { title: "Overtime Hours", value: 118, month: "this month" },
    { title: "Pending Request", value: 23 },
    { title: "Rejected", value: 5 },
  ];

  const rawData = [
    // ... your data unchanged
  ];

  const filteredData = rawData.filter((item) => {
    const matchName = item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filteredStatus ? item.status === filteredStatus : true;
    const matchDate = selectedDate
      ? moment(item.otdate).isSame(selectedDate, "day")
      : true;
    return matchName && matchStatus && matchDate;
  });

  const columns = [
    // ... your columns unchanged
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Overtime"
            title="Dashboard"
            subtitle="Overtime"
            modal="#add_overtime"
            name="Add Overtime"
          />

          {/* ... rest of UI unchanged */}

        </div>
      </div>
      <AddOverTime />
      <DeleteModal Name="Delete Overtime" />
    </>
  );
};

export default OverTime;
