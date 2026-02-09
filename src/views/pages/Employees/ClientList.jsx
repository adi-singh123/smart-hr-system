/** @format */

import React, { useEffect, useState } from "react";
import { Table, Input, Button, Dropdown, Menu, Tooltip } from "antd";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import { ClientModelPopup } from "../../../components/modelpopup/ClientModelPopup";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchClients,
  addOrUpdateClient,
} from "../../../Redux/services/Client";
import * as bootstrap from "bootstrap";

const ClientList = () => {
  const dispatch = useDispatch();
  const { clients = [] } = useSelector((state) => state?.client || {});

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // 🔹 Fetch clients
  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  // 🔹 Live search filter
  useEffect(() => {
    const lowerSearch = searchText.toLowerCase().trim();
    if (!lowerSearch) {
      setFilteredData(clients);
    } else {
      const filtered = clients.filter(
        (client) =>
          (client.company_name || "").toLowerCase().includes(lowerSearch) ||
          (client.first_name || "").toLowerCase().includes(lowerSearch) ||
          (client.client_id || "").toLowerCase().includes(lowerSearch)
      );
      setFilteredData(filtered);
    }
  }, [clients, searchText]);

  const handleSaveClient = async (formData) => {
    await dispatch(addOrUpdateClient(formData));
    dispatch(fetchClients());
    setSelectedClient(null); // reset after save
  };

  // 🔹 Dropdown menu for 3-dot actions
  const getMenu = (client) => (
    <Menu>
      <Menu.Item
        key="edit"
        onClick={() => {
          setSelectedClient(client);
          const modalEl = document.getElementById("add_client");
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }}
      >
        <i className="fa fa-pencil me-2" /> Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        onClick={() => {
          setSelectedClient(client);
          setDeleteId(client.id); // modal को delete id pass कर रहे हैं
          document.getElementById("openDeleteModal")?.click(); // modal trigger
        }}
      >
        <i className="fa fa-trash me-2" /> Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { title: "Company Name", dataIndex: "company_name" },
    { title: "Client ID", dataIndex: "client_id" },
    { title: "Contact Person", dataIndex: "first_name" },
    { title: "Email", dataIndex: "email", render: (text) => text || "-" },
    { title: "Mobile", dataIndex: "phone", render: (text) => text || "-" },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => <span>{text || "Inactive"}</span>,
    },
    {
      title: "Action",
      align: "center",
      width: 100,
      render: (record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Clients"
            title="Dashboard"
            subtitle="Clients"
            modal="#add_client"
            name="Add Client"
            Linkname="/clients"
            Linkname1="/clients-list"
            onAddClick={() => setSelectedClient(null)}
          />

          {/* 🔹 Search Bar */}
          <div className="row mb-3 align-items-center">
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <Input
                placeholder="Search by Name, ID, or Company"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: "100%", height: "45px" }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <Table
                  className="table-striped"
                  style={{ overflowX: "auto" }}
                  columns={columns}
                  dataSource={filteredData}
                  rowKey={(record) => record.id}
                  pagination={{ pageSize: 8 }}
                  locale={{ emptyText: "No Clients Found" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Client Add/Edit Modal */}
      <ClientModelPopup client={selectedClient} onSave={handleSaveClient} />

      {/* 🔹 Hidden trigger for DeleteModal */}
      <button
        id="openDeleteModal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#delete"
        style={{ display: "none" }}
      />

      {/* 🔹 Delete Modal */}
      <DeleteModal
        Name="Delete Client"
        Id={deleteId} // modal में pass
        // onConfirm को हटा सकते हैं, modal में ही delete logic है
      />
    </>
  );
};

export default ClientList;
