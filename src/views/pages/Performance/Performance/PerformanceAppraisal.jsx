/* eslint-disable no-undef */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tooltip, Dropdown, Button , Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumbs from "../../../../components/Breadcrumbs";
import SearchBox from "../../../../components/SearchBox";
import DeleteModal from "../../../../components/modelpopup/DeleteModal";
import PerformanceAppraisalModal from "../../../../components/modelpopup/PerformanceAppraisalModal";

import {
  fetchPerformanceAppraisals,
  deletePerformanceAppraisal,
} from "../../../../Redux/services/PerformanceAppraisal";

const PerformanceAppraisal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ FIX: read from `appraisals` not `list`
  const { appraisals = [], loading } = useSelector(
    (state) => state.performanceAppraisal || {}
  );

  // 🔄 Fetch appraisals when component loads
  useEffect(() => {
    dispatch(fetchPerformanceAppraisals());
  }, [dispatch]);

  // 🗑️ Delete
  const handleDelete = async (id) => {
    await dispatch(deletePerformanceAppraisal(id));
    dispatch(fetchPerformanceAppraisals()); // refresh list
  };

  // ✏️ Edit
  const handleEdit = (record) => {
    navigate(`/edit-performance/${record.id}`);
  };

  // 👁️ View
  const handleView = (id) => {
    navigate(`/performance-view/${id}`);
  };


  const getMenu = (record) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(record)}>
        <i className="fa fa-pencil m-r-5" /> Edit
      </Menu.Item>
      <Menu.Item key="view" onClick={() => handleView(record.id)}>
        <i className="fa fa-eye m-r-5" /> View
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(record.id)}>
        <i className="fa fa-trash m-r-5" /> Delete
      </Menu.Item>
    </Menu>
  );

  // Table Columns
  const columns = [
    {
      title: "Sr. no",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Employee",
      dataIndex: "employee_name",
    },
    {
      title: "Designation",
      dataIndex: "designation",
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "Appraisal Date",
      dataIndex: "appraisal_date",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span
          className={`badge bg-inverse-${
            text === "Active" ? "success" : "danger"
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Action",
      render: (record) => (
        <Tooltip title="Actions">
          <Dropdown overlay={getMenu(record)} trigger={["click"]}>
            <Button
              type="text"
              style={{
                background: "#f0f0f0",
                borderRadius: "50%",
                padding: "6px 10px",
                fontSize: "18px",
                fontWeight: "bold",
                lineHeight: "1",
                color: "#333",
              }}
            >
              &#8942;
            </Button>
          </Dropdown>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <Breadcrumbs
          maintitle="Performance Appraisal"
          title="Dashboard"
          subtitle="Performance"
          modal="#add_appraisal"
          name="Add New"
          ariaLabel="Add New Appraisal Entry"
        />
        {/* /Page Header */}

        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <SearchBox />
              <Table
                className="table-striped"
                style={{ overflowX: "auto" }}
                loading={loading}
                columns={columns}
                dataSource={appraisals}
                rowKey={(record) => record.id}
                pagination={false}
              />
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <PerformanceAppraisalModal />
      <DeleteModal Name="Delete Performance " />
    </div>
  );
};

export default PerformanceAppraisal;
