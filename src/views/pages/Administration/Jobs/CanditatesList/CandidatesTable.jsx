/** @format */
import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Empty,
  Dropdown,
  Menu,
  Button,
  Modal,
  Row,
  Col,
  Input,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { MoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { fetchJobApplications } from "../../../../../Redux/services/JobForm";
import { HTTPURL } from "../../../../../Constent/Matcher";
import DeleteModal from "../../../../../components/modelpopup/DeleteModal";

const { Search } = Input;

const CandidatesTable = () => {
  const dispatch = useDispatch();
  const { jobApplications, loading } = useSelector((state) => state.job);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchJobApplications());
  }, [dispatch]);

  const openDeleteModal = (record) => {
    setDeleteId(record.id);
    document.getElementById("openDeleteModal")?.click();
  };

  const openViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewOpen(true);
  };

  // 🔹 Filtered data logic (SAFE VERSION)
  const jobData = Array.isArray(jobApplications) ? jobApplications : [];

  const filteredApplications = jobData.filter((item) => {
    const fullName = [item.first_name, item.middle_name, item.last_name]
      .join(" ")
      .toLowerCase();

    const gender = item.gender?.toLowerCase() || "";
    const appliedFor = item.applied_for?.toLowerCase() || "";
    const email = item.email?.toLowerCase() || "";

    const term = searchTerm.toLowerCase();

    return (
      fullName.includes(term) ||
      gender.includes(term) ||
      appliedFor.includes(term) ||
      email.includes(term)
    );
  });

  const columns = [
    { title: "SR. No.", key: "sr_no", render: (_, __, index) => index + 1 },
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <div className="table-avatar">
          <Link to="#">
            {record.first_name}{" "}
            {record.middle_name ? record.middle_name + " " : ""}
            {record.last_name}
          </Link>
        </div>
      ),
      sorter: (a, b) =>
        `${a.first_name} ${a.last_name}`.localeCompare(
          `${b.first_name} ${b.last_name}`
        ),
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      sorter: (a, b) => a.phone_number.localeCompare(b.phone_number),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: (a, b) => a.gender.localeCompare(b.gender),
    },
    {
      title: "Applied For",
      dataIndex: "applied_for",
      sorter: (a, b) => a.applied_for.localeCompare(b.applied_for),
    },
    {
      title: "Action",
      align: "center",
      width: 100,
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
            <Button type="link" style={{ color: "#1890ff", fontSize: 25 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-three-dots-vertical"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
              </svg>{" "}
              <MoreOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-3">
        <Search
          placeholder="Search by Name, Gender, Applied For, or Email"
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
          ) : jobApplications && jobApplications.length > 0 ? (
            <div className="table-responsive">
              <Table
                className="table-striped"
                style={{ overflowX: "auto" }}
                columns={columns}
                dataSource={filteredApplications}
                rowKey={(record) => record.id}
                pagination={{ pageSize: 10 }}
              />
            </div>
          ) : (
            <Empty description="No job applications found" className="p-5" />
          )}
        </div>
      </div>

      {/* 🔹 Hidden Delete trigger */}
      <button
        id="openDeleteModal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#delete"
        style={{ display: "none" }}
      />
      <DeleteModal Name="Delete Candidates" Id={deleteId} />

      {/* 🔹 View Modal */}
      <Modal
        title="Candidate Details"
        open={isViewOpen}
        onCancel={() => setIsViewOpen(false)}
        footer={<Button onClick={() => setIsViewOpen(false)}>Close</Button>}
        width={800}
      >
        {selectedRecord ? (
          <>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <strong>Name:</strong> {selectedRecord.first_name}{" "}
                {selectedRecord.middle_name} {selectedRecord.last_name}
              </Col>
              <Col span={12}>
                <strong>Phone:</strong> {selectedRecord.phone_number}
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <strong>Email:</strong> {selectedRecord.email}
              </Col>
              <Col span={12}>
                <strong>Gender:</strong> {selectedRecord.gender}
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <strong>Applied For:</strong> {selectedRecord.applied_for}
              </Col>
              <Col span={12}>
                <strong>Social Media:</strong>{" "}
                {selectedRecord.social_media_url ? (
                  <a
                    href={selectedRecord.social_media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedRecord.social_media_url}
                  </a>
                ) : (
                  "-"
                )}
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
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

              <Col span={12}>
                <strong>Father's Name:</strong> {selectedRecord.father_name}
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <strong>Mother's Name:</strong> {selectedRecord.mother_name}
              </Col>
              <Col span={12}>
                <strong>Nationality:</strong> {selectedRecord.nationality}
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <strong>Religion:</strong> {selectedRecord.religion}
              </Col>
              <Col span={12}>
                <strong>Marital Status:</strong> {selectedRecord.marital_status}
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <strong>DOB:</strong> {selectedRecord.dob}
              </Col>
              <Col span={12}>
                <strong>Permanent Address:</strong>{" "}
                {selectedRecord.permanent_address}
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <strong>Current Address:</strong>{" "}
                {selectedRecord.current_address}
              </Col>
              <Col span={12}>
                <strong>Emergency Contact:</strong>{" "}
                {selectedRecord.emergency_contact}
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <strong>Highest Education:</strong>{" "}
                {selectedRecord.highest_education}
              </Col>
              <Col span={12}>
                <strong>Photo:</strong>{" "}
                {selectedRecord.photo_file ? (
                  <a
                    href={`${HTTPURL}uploads/files/${selectedRecord.photo_file}`}
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
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <strong>Aadhar:</strong>{" "}
                {selectedRecord.aadhar_file ? (
                  <a
                    href={`${HTTPURL}uploads/files/${selectedRecord.aadhar_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : (
                  "-"
                )}
              </Col>
              <Col span={12}>
                <strong>Education Documents:</strong>{" "}
                {selectedRecord.education_files
                  ? (Array.isArray(selectedRecord.education_files)
                      ? selectedRecord.education_files
                      : JSON.parse(selectedRecord.education_files)
                    ).map((file, index) => (
                      <div key={index}>
                        <a
                          href={`${HTTPURL}uploads/files/${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.split("/").pop()}
                        </a>
                      </div>
                    ))
                  : "-"}
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <strong>Experience Letters:</strong>{" "}
                {selectedRecord.experience_files
                  ? (Array.isArray(selectedRecord.experience_files)
                      ? selectedRecord.experience_files
                      : JSON.parse(selectedRecord.experience_files)
                    ).map((file, index) => (
                      <div key={index}>
                        <a
                          href={`${HTTPURL}uploads/files/${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.split("/").pop()}
                        </a>
                      </div>
                    ))
                  : "-"}
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <strong>Passport:</strong>{" "}
                {selectedRecord.passport_file ? (
                  <a
                    href={`${HTTPURL}uploads/files/${selectedRecord.passport_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : (
                  "-"
                )}
              </Col>
              <Col span={12}>
                <strong>PAN Card:</strong>{" "}
                {selectedRecord.pan_card_file ? (
                  <a
                    href={`${HTTPURL}uploads/files/${selectedRecord.pan_card_file}`}
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
            <Row gutter={[16, 8]}>
              <Col span={24}>
                <strong>Additional Comments:</strong>{" "}
                {selectedRecord.additional_comments
                  ? selectedRecord.additional_comments
                  : "-"}
              </Col>
            </Row>

            <Row gutter={[16, 8]}>
              <Col span={12}>
                <strong>Has Bank Details:</strong>{" "}
                {selectedRecord.has_bank_details ? "Yes" : "No"}
              </Col>
              {selectedRecord.has_bank_details && (
                <>
                  <Col span={12}>
                    <strong>Bank Full Name:</strong>{" "}
                    {selectedRecord.bank_full_name}
                  </Col>
                  <Col span={12}>
                    <strong>Bank Name:</strong> {selectedRecord.bank_name}
                  </Col>
                  <Col span={12}>
                    <strong>Branch Name:</strong> {selectedRecord.branch_name}
                  </Col>
                  <Col span={12}>
                    <strong>Account Number:</strong>{" "}
                    {selectedRecord.account_number}
                  </Col>
                  <Col span={12}>
                    <strong>Account Type:</strong> {selectedRecord.account_type}
                  </Col>
                  <Col span={12}>
                    <strong>IFSC Code:</strong> {selectedRecord.ifsc_code}
                  </Col>
                  <Col span={12}>
                    <strong>Account Holder Name:</strong>{" "}
                    {selectedRecord.account_holder_name}
                  </Col>
                </>
              )}
            </Row>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default CandidatesTable;
