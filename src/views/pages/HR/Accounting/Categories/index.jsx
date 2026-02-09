import React, { useState } from "react";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import { Link } from "react-router-dom";
import { Table, Input, Empty } from "antd";
import CategoriesModal from "./CategoriesModal";

const Categories = () => {
  const [searchText, setSearchText] = useState("");

  const data = [
    { id: 1, category: "Hardware", subcategory: "Computer Components", createdDate: "2024-01-05" },
    { id: 2, category: "Hardware", subcategory: "Networking Equipment", createdDate: "2024-01-10" },
    { id: 3, category: "Hardware", subcategory: "Peripherals", createdDate: "2024-01-15" },
    { id: 4, category: "Material", subcategory: "Construction Materials", createdDate: "2024-01-20" },
    { id: 5, category: "Material", subcategory: "Office Supplies", createdDate: "2024-01-25" },
    { id: 6, category: "Material", subcategory: "Packaging Materials", createdDate: "2024-02-01" },
    { id: 7, category: "Vehicle", subcategory: "Company Cars", createdDate: "2024-02-05" },
    { id: 8, category: "Vehicle", subcategory: "Delivery Vans", createdDate: "2024-02-10" },
    { id: 9, category: "Vehicle", subcategory: "Service Vehicles", createdDate: "2024-02-15" },
    { id: 10, category: "Software", subcategory: "Productivity Tools", createdDate: "2024-02-20" },
    { id: 11, category: "Software", subcategory: "Design Applications", createdDate: "2024-02-25" },
    { id: 12, category: "Software", subcategory: "Development Tools", createdDate: "2024-03-01" },
    { id: 13, category: "Services", subcategory: "IT Support", createdDate: "2024-03-05" },
    { id: 14, category: "Services", subcategory: "Cleaning Services", createdDate: "2024-03-10" },
    { id: 15, category: "Services", subcategory: "Maintenance", createdDate: "2024-03-15" }
  ];

  // Filter data based on search text
  const filteredData = data.filter(item => 
    item.id.toString().includes(searchText.toLowerCase()) ||
    item.category.toLowerCase().includes(searchText.toLowerCase()) ||
    item.subcategory.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Category Name",
      dataIndex: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Sub-Category Name",
      dataIndex: "subcategory",
      sorter: (a, b) => a.subcategory.localeCompare(b.subcategory),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
      render: (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
    },
    {
      title: "Action",
      render: () => (
        <div className="dropdown dropdown-action">
          <Link
            to="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-icons">more_vert</i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_categories"
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link className="dropdown-item" to="/sub-category">
              <i className="fa fa-object-ungroup m-r-5" /> Sub-Category{" "}
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Categories"
            title="Dashboard"
            subtitle="Accounts"
            modal="#add_categories"
            name="Add Categories"
          />
          
          {/* Search Box */}
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="d-flex justify-content-end">
                <Input.Search
                  placeholder="Search by ID, Category or Subcategory"
                  allowClear
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                  enterButton
                />
              </div>
            </div>
          </div>

          <Table
            className="table-striped"
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record.id}
            locale={{
              emptyText: (
                <Empty
                  description={
                    searchText ? "No matching records found" : "No data available"
                  }
                />
              )
            }}
          />
        </div>
      </div>
      <CategoriesModal />
    </>
  );
};

export default Categories;