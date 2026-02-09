/** @format */

import React, { useEffect, useState, useRef } from "react";
import { Table, Tag, Dropdown, Menu } from "antd";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SearchBox from "../../../components/SearchBox";
import { AddDesingnationModelPopup } from "../../../components/modelpopup/AddDesingnationModelPopup";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../../Redux/services/Notifications";
import {
  get_designation_data,
  delete_designation,
} from "../../../Redux/services/Designation";
import { customAlert } from "../../../utils/Alert";
import DeleteModal from "../../../components/modelpopup/DeleteModal"; // ✅ Added this import
import * as bootstrap from "bootstrap"; // ✅ Needed for modal trigger

const Designation = () => {
  const dispatch = useDispatch();
  const LogInuserRole = localStorage.getItem("role");
  const AllDesignation = useSelector(
    (state) => state?.designation?.AllDesignation
  );

  const [searchText, setSearchText] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // ✅ Added
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(get_designation_data());
  }, [dispatch]);

  // Close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = (designation) => {
    setSelectedDesignation(designation);
    setIsEditing(true);
    setIsViewing(false);
    document.getElementById("openDesignationModal")?.click();
    setActiveDropdown(null);
  };

  const handleView = (designation) => {
    setSelectedDesignation(designation);
    setIsEditing(false);
    setIsViewing(true);
    document.getElementById("openDesignationModal")?.click();
    setActiveDropdown(null);
  };

  // ✅ Custom Delete Handler using Bootstrap Modal
  const handleDelete = (designationId) => {
    setDeleteId(designationId);
    document.getElementById("openDeleteModal")?.click();
  };

  // ✅ Data mapping
  const data = AllDesignation?.designation?.map((item, index) => ({
    key: item?.id,
    serial: index + 1,
    designation: item?.name,
    department: item?.department?.name,
    department_id: item?.department?.id,
    is_active: item?.is_active === true ? "true" : "false",
  }));

  const filteredData = data?.filter(
    (item) =>
      item?.designation?.toLowerCase().includes(searchText.toLowerCase()) ||
      item?.department?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Sr No.", dataIndex: "serial", width: "5%", align: "center" },
    {
      title: "Department",
      dataIndex: "department",
      sorter: (a, b) => a.department.localeCompare(b.department),
      width: "30%",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sorter: (a, b) => a.designation.localeCompare(b.designation),
      width: "30%",
    },
    {
      title: "Is Active",
      dataIndex: "is_active",
      render: (value) => (
        <Tag
          color={value === "true" ? "green" : "volcano"}
          style={{
            fontWeight: "bold",
            borderRadius: "10px",
            padding: "4px 10px",
          }}
        >
          {value === "true" ? "Active" : "Inactive"}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "true" },
        { text: "Inactive", value: "false" },
      ],
      onFilter: (value, record) => record.is_active === value,
      width: "15%",
      align: "center",
    },
    {
      title: "Action",
      className: "text-end",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" onClick={() => handleView(record)}>
              <i className="fa fa-eye me-2" /> View
            </Menu.Item>

            {LogInuserRole === "Admin" && (
              <>
                <Menu.Item key="edit" onClick={() => handleEdit(record)}>
                  <i className="fa fa-pencil me-2" /> Edit
                </Menu.Item>
                <Menu.Item
                  key="delete"
                  onClick={() => handleDelete(record.key)}
                >
                  <i className="fa fa-trash me-2" /> Delete
                </Menu.Item>
              </>
            )}
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]} ref={dropdownRef}>
            <i className="material-icons" style={{ cursor: "pointer" }}>
              more_vert
            </i>
          </Dropdown>
        );
      },
      width: "20%",
      align: "center",
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Designations"
            title="Dashboard"
            subtitle="Designations"
            modal="#add_designation"
            name="Add Designation"
          />
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex align-items-center mb-2">
                <div className="flex-grow-1">
                  <SearchBox
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={filteredData?.length > 0 ? filteredData : []}
                  className="table-striped"
                  rowKey={(record) => record.key}
                  pagination={{ pageSize: 10 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Add/Edit/View Modal */}
        <AddDesingnationModelPopup
          isEditing={isEditing}
          isViewing={isViewing}
          designationData={selectedDesignation}
          onClose={() => {
            setSelectedDesignation(null);
            setIsEditing(false);
            setIsViewing(false);
            dispatch(get_designation_data());
          }}
        />

        {/* ✅ Custom Delete Modal */}
        <DeleteModal Name="Delete Designation" Id={deleteId} />

        {/* Hidden trigger buttons */}
        <button
          id="openDesignationModal"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#add_designation"
          style={{ display: "none" }}
        />
        <button
          id="openDeleteModal"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#delete"
          style={{ display: "none" }}
        />
      </div>
    </>
  );
};

export default Designation;
