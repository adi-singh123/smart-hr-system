/** @format */
import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Empty,
  Dropdown,
  Menu,
  Button,
  Input,
  Modal,
  Row,
  Col,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInternshipApplications,
} from "../../../../../Redux/services/InternshipForm";
import DeleteModal from "../../../../../components/modelpopup/DeleteModal";
// import { MoreOutlined } from "@ant-design/icons";
import { HTTPURL } from "../../../../../Constent/Matcher";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
//Check
const { Search } = Input;

const InternCandidatesTable = () => {
  const dispatch = useDispatch();
  const { internshipApplications, loading } = useSelector(
    (state) => state.internship
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // 🔹 NEW: For View Modal
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchInternshipApplications());
  }, [dispatch]);

  const data = Array.isArray(internshipApplications)
    ? internshipApplications
    : [];

  // 🔍 Search
  const filteredApplications = data.filter((item) => {
    const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
    const category = item.internship_category?.toLowerCase() || "";
    const email = item.email_address?.toLowerCase() || "";

    const term = searchTerm.toLowerCase();

    return (
      fullName.includes(term) || category.includes(term) || email.includes(term)
    );
  });

  // 🔹 Delete Action
  const openDeleteModal = (record) => {
    setDeleteId(record.id);
    document.getElementById("openInternDeleteModal")?.click();
  };

  // 🔹 NEW: View Modal Open
  const openViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewOpen(true);
  };

  const columns = [
    { title: "SR. No.", render: (_, __, index) => index + 1 },
    { title: "First Name", dataIndex: "first_name" },
    { title: "Last Name", dataIndex: "last_name" },
    { title: "Contact Number", dataIndex: "contact_number" },
    { title: "Email", dataIndex: "email_address" },
    { title: "Category", dataIndex: "internship_category" },
    { title: "Duration", dataIndex: "internship_duration" },
    {
      title: "Resume",
      render: (record) =>
        record.resume_file ? (
          <a
            href={`${HTTPURL}uploads/files/${record.resume_file}`}
            target="_blank"
            rel="noreferrer"
          >
            View Resume
          </a>
        ) : (
          "No File"
        ),
    },
    {
      title: "Action",
      align: "center",
      width: 90,
      render: (record) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" onClick={() => openViewModal(record)}>
              <i className="fa fa-eye m-r-5" /> View
            </Menu.Item>

            <Menu.Item key="delete" onClick={() => openDeleteModal(record)}>
              <i className="fa fa-trash m-r-5" /> Delete
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <span
              style={{
                cursor: "pointer",
                fontSize: "22px",
                padding: "0 8px",
                display: "inline-block",
              }}
            >
              ⋮
            </span>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-3">
        <Search
          placeholder="Search by Name, Category, or Email"
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      <div className="row">
        <div className="col-md-12">
          {loading ? (
            <div className="text-center p-5">
              <Spin size="large" />
            </div>
          ) : filteredApplications.length > 0 ? (
            <Table
              scroll={{ x: "max-content" }}
              className="table-striped"
              columns={columns}
              dataSource={filteredApplications}
              rowKey={(record) => record.id}
              pagination={{ pageSize: 10 }}
            />
          ) : (
            <Empty
              description="No internship applications found"
              className="p-5"
            />
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      <button
        id="openInternDeleteModal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#delete"
        style={{ display: "none" }}
      />
      <DeleteModal Name="Delete Intern" Id={deleteId} />

      {/* VIEW MODAL (NEW) */}
      <Modal
        title="Intern Candidate Details"
        open={isViewOpen}
        onCancel={() => setIsViewOpen(false)}
        footer={<Button onClick={() => setIsViewOpen(false)}>Close</Button>}
        width={700}
        centered
      >
        {selectedRecord && (
          <>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <strong>First Name:</strong> {selectedRecord.first_name}
              </Col>
              <Col span={12}>
                <strong>Last Name:</strong> {selectedRecord.last_name}
              </Col>

              <Col span={12}>
                <strong>Contact:</strong> {selectedRecord.contact_number}
              </Col>

              <Col span={12}>
                <strong>Email:</strong> {selectedRecord.email_address}
              </Col>

              <Col span={12}>
                <strong>Category:</strong> {selectedRecord.internship_category}
              </Col>

              <Col span={12}>
                <strong>Duration:</strong> {selectedRecord.internship_duration}
              </Col>

              <Col span={12}>
                <strong>Resume:</strong>{" "}
                {selectedRecord.resume_file ? (
                  <a
                    href={`${HTTPURL}uploads/files/${selectedRecord.resume_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : (
                  "-"
                )}
              </Col>
            </Row>
          </>
        )}
      </Modal>
    </>
  );
};

export default InternCandidatesTable;

export const exportInternCandidatesExcel = (applications) => {
  const excelData = applications.map((item, index) => ({
    "Sr No": index + 1,
    "First Name": item.first_name,
    "Last Name": item.last_name,
    "Contact Number": item.contact_number,
    Email: item.email_address,
    Category: item.internship_category,
    Duration: item.internship_duration,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(file, "Internship_Candidates.xlsx");
};
