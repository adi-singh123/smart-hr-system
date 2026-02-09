/** @format */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AllEmployeeAddPopup from "../../../components/modelpopup/AllEmployeeAddPopup";
import AllEmployeeEditPopup from "../../../components/modelpopup/AllEmployeeEditPopup";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Menu, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  get_employee_data,
  get_user_id,
} from "../../../Redux/services/Employee";
import { HTTPURL } from "../../../Constent/Matcher";
import { fetchAsset } from "../../../Redux/services/Profile";
import { UserRole } from "../../../utils/UserRole";
import CommonAvatar from "../../../../src/CommanAvater.jsx";
import AddEmployeeOfTheMonthPopup from "../../../components/modelpopup/AddEmployeeOfTheMonthPopup.jsx";

const AllEmployee = () => {
  const dispatch = useDispatch();
  const AllEmployeeData = useSelector((state) => state?.employee?.employeeData);
  const LogInuserRole = localStorage.getItem("role");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [id, setId] = useState(null);

  // 🔹 NEW: Modal open states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 🔹 Search and Pagination states
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(get_employee_data());
    dispatch(fetchAsset());
    dispatch(get_user_id())
      .unwrap()
      .then((data) => {
        setId(data.data.id);
      })
      .catch((err) => {
        console.error("get_user_id failed:", err);
      });
  }, [dispatch]);

  // 🔹 Filter employees by search
  const filteredEmployees = AllEmployeeData?.users
    ?.filter((employee) => UserRole() !== "Internship" || employee.id === id)
    ?.filter(
      (employee) => UserRole() === "Admin" || employee.role.name !== "Admin"
    )
    // 3️⃣ Search ke hisaab se filter
    ?.filter((employee) => {
      if (!search) return true;
      const fullName =
        `${employee?.first_name} ${employee?.last_name}`.toLowerCase();
      return (
        employee.id.toString().includes(search.toLowerCase()) ||
        fullName.includes(search.toLowerCase())
      );
    });

  // 🔹 Pagination logic
  const totalItems = filteredEmployees?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedEmployees = filteredEmployees?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle page change
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Breadcrumb */}
        {LogInuserRole?.toLowerCase() === "admin" && (
          <Breadcrumbs
            maintitle="Employee"
            title="Dashboard"
            subtitle="Employee"
            modal="#add_employee"
            name="Add Employee"
            Linkname="/employees"
            Linkname1="/employees-list"
          />
        )}
        {LogInuserRole == "Admin" && (
          <div className="d-flex flex-column align-items-end">
            {/* Add Employee button (existing orange one) */}
            <button
              type="button"
              className="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#add_employee_of_month"
            >
              + Add Employee of the Month
            </button>
          </div>
        )}

        {/* 🔹 Search Input */}
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Employee ID or Name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset to first page on search
              }}
            />
          </div>
        </div>

        {/* Grid View */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4 mt-3">
          {paginatedEmployees?.map((employee) => (
            <div className="col" key={employee.id}>
              <div className="card h-100 profile-widget shadow-sm">
                <div className="card-body text-center">
                  <div className="profile-img mb-2">
                    <Link to={`/profile/${employee?.id}`} className="avatar">
                      <CommonAvatar
                        imageUrl={
                          employee?.profile_pic
                            ? `${HTTPURL}${employee?.profile_pic}`
                            : ""
                        }
                        alt={`${employee?.first_name} ${employee?.last_name}`}
                        size={80}
                      />
                    </Link>
                  </div>

                  {/* Dropdown menu */}
                  <div className="position-absolute top-0 end-0 m-2">
                    <Dropdown
                      trigger={["click"]}
                      placement="bottomRight"
                      overlay={
                        <Menu>
                          <Menu.Item key="view">
                            <Link to={`/profile/${employee.id}`}>
                              <i className="fa fa-eye me-2" /> View
                            </Link>
                          </Menu.Item>

                          {/* Agar logged-in user Admin hai tabhi Edit aur Delete dikhao */}
                          {(LogInuserRole === "Admin" ||
                            employee.id === id) && (
                            <Menu.Item
                              key="edit"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setIsEditOpen(true);
                              }}
                            >
                              <i className="fa fa-pencil me-2" /> Edit
                            </Menu.Item>
                          )}
                          {LogInuserRole === "Admin" && (
                            <Menu.Item
                              key="delete"
                              onClick={() => {
                                setSelectedEmployeeId(employee.id);
                              }}
                            >
                              <span
                                data-bs-toggle="modal"
                                data-bs-target="#delete"
                                style={{ cursor: "pointer" }}
                              >
                                <i className="fa fa-trash me-2" /> Delete
                              </span>
                            </Menu.Item>
                          )}
                        </Menu>
                      }
                    >
                      <Button
                        type="link"
                        style={{ color: "#1890ff", fontSize: 22 }}
                      >
                        <i className="material-icons">more_vert</i>
                        <MoreOutlined />
                      </Button>
                    </Dropdown>
                  </div>

                  <h5 className="card-title mb-0 mt-2">
                    <Link to={`/profile/${employee.id}`}>
                      {`${employee?.first_name} ${employee?.last_name}`}
                    </Link>
                  </h5>
                  <p className="text-muted small mb-0">
                    {employee?.role?.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🔹 Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => goToPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Modals */}
      <AllEmployeeAddPopup />

      <AllEmployeeEditPopup
        employee={selectedEmployee}
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
      />

      <DeleteModal Name="Delete Employee" Id={selectedEmployeeId} />
      <AddEmployeeOfTheMonthPopup />
    </div>
  );
};

export default AllEmployee;
