// LeaveSettingCustomPolicy.jsx
import React, { useState } from 'react';
import { Table, message } from 'antd';
import { Link } from 'react-router-dom';
import { Avatar_05 } from '../../../Routes/ImagePath';

const LeaveSettingCustomPolicy = () => {
  const [customPolicies, setCustomPolicies] = useState([
    {
      id: 1,
      img: Avatar_05,
      name: "5 years service",
      days: "5",
      assignee: "John Deo",
    }
  ]);
  const [newPolicy, setNewPolicy] = useState({ name: '', days: '', assignee: '' });

  const addCustomPolicy = () => {
    const { name, days, assignee } = newPolicy;
    if (!name || !days || !assignee) {
      message.warning("All fields are required.");
      return;
    }
    if (customPolicies.some(policy => policy.name.toLowerCase() === name.toLowerCase())) {
      message.error("Policy with this name already exists.");
      return;
    }
    const newEntry = {
      id: Date.now(),
      name,
      days,
      assignee,
      img: Avatar_05
    };
    setCustomPolicies([...customPolicies, newEntry]);
    setNewPolicy({ name: '', days: '', assignee: '' });
    message.success("Policy added successfully.");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Day",
      dataIndex: "days",
      sorter: (a, b) => parseInt(a.days) - parseInt(b.days),
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      render: (text, record) => (
        <span className="table-avatar">
          <div className="avatar">
            <img alt="" src={record.img} />
          </div>
          <Link to="/profile" className="avatar">{text}</Link>
        </span>
      ),
      sorter: (a, b) => a.assignee.localeCompare(b.assignee),
    },
    {
      title: "",
      render: () => (
        <div className="dropdown dropdown-action text-end">
          <Link
            to="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <i className="material-icons">more_vert</i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="#">
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="custom-policy">
      <div className="leave-header">
        <div className="title">Custom policy</div>
        <div className="leave-action">
          <input
            placeholder="Policy name"
            value={newPolicy.name}
            onChange={e => setNewPolicy({ ...newPolicy, name: e.target.value })}
            className="form-control me-2"
          />
          <input
            placeholder="Days"
            type="number"
            min={1}
            value={newPolicy.days}
            onChange={e => setNewPolicy({ ...newPolicy, days: e.target.value })}
            className="form-control me-2"
          />
          <input
            placeholder="Assignee"
            value={newPolicy.assignee}
            onChange={e => setNewPolicy({ ...newPolicy, assignee: e.target.value })}
            className="form-control me-2"
          />
          <button className="btn btn-sm btn-primary" onClick={addCustomPolicy}>
            <i className="fa fa-plus" /> Add
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={customPolicies}
          className="table-striped"
          rowKey={(record) => record.id}
          locale={{ emptyText: "No custom policies available." }}
        />
      </div>
    </div>
  );
};

export default LeaveSettingCustomPolicy;
