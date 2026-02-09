/** @format */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar_07 } from "../../../Routes/ImagePath";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import { ClientModelPopup } from "../../../components/modelpopup/ClientModelPopup";
import { HTTPURL } from "../../../Constent/Matcher";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchClients,
  addOrUpdateClient,
} from "../../../Redux/services/Client";
import { Input, Button, Dropdown, Menu, Tooltip } from "antd";
import * as bootstrap from "bootstrap";

const Clients = () => {
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

  // 🔹 Update filtered data whenever clients OR searchText change (live search)
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

  // 🔹 Save Client
  const handleSaveClient = async (formData) => {
    await dispatch(addOrUpdateClient(formData));
    dispatch(fetchClients());
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
          setDeleteId(client.id);
          document.getElementById("openDeleteModal")?.click();
        }}
      >
        <i className="fa fa-trash me-2" /> Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
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
                style={{ height: "45px", width: "100%" }}
              />
            </div>
          </div>

          {/* 🔹 Clients Grid */}
          <div className="row staff-grid-row">
            {filteredData.length === 0 ? (
              <div className="col-md-12 text-center fs-2">No clients found</div>
            ) : (
              filteredData.map((client) => (
                <div
                  key={client.id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3"
                >
                  <div className="profile-widget position-relative">
                    {/* 🔹 Top Right Actions */}
                    <div
                      className="dropdown profile-action"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                    >
                      <Tooltip title="Actions">
                        <Dropdown overlay={getMenu(client)} trigger={["click"]}>
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
                    </div>

                    {/* Client Avatar */}
                    <div className="profile-img">
                      <Link to="/client-profile" className="avatar">
                        <img
                          alt={client.first_name}
                          src={
                            client.profile_pic
                              ? `${HTTPURL}${client.profile_pic}`
                              : Avatar_07
                          }
                        />
                      </Link>
                    </div>

                    {/* Client Info */}
                    <h4 className="user-name m-t-10 mb-0 text-ellipsis">
                      <Link to="/client-profile">{client.company_name}</Link>
                    </h4>
                    <h5 className="user-name m-t-5 mb-0 text-ellipsis">
                      <Link to="/client-profile">{client.first_name}</Link>
                    </h5>

                    <div className="d-flex gap-1 mt-2">
                      <Link
                        to={`/client-profile/${client.id}`}
                        className="btn btn-white btn-sm flex-grow-1"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
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
        Id={deleteId}
        fetchData={() => dispatch(fetchClients())} // List refresh modal से
      />
    </div>
  );
};

export default Clients;
