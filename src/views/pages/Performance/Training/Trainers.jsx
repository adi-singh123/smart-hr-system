// // Trainers.jsx
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Table, message, Input, Popconfirm } from "antd";
// import {
//   Avatar_02,
//   Avatar_05,
//   Avatar_09,
//   Avatar_10,
//   Avatar_11,
// } from "../../../../Routes/ImagePath/index";
// import Breadcrumbs from "../../../../components/Breadcrumbs";
// import TrainersModal from "../../../../components/modelpopup/TrainersModal";
// import TrainerPreviewModal from "../../../../components/modelpopup/TrainerPreviewModal";

// const Trainers = () => {
//   const initialData = [
//     {
//       key: 1,
//       image: Avatar_02,
//       name: "John Doe",
//       description: "Expert in Node.js and backend systems",
//       email: "john.doe@company.com",
//       status: "Active",
//       mobile: "9876543001",
//       role: "Backend Trainer",
//     },
//     {
//       key: 2,
//       image: Avatar_05,
//       name: "Richard Miles",
//       description: "Git and version control systems trainer",
//       email: "richard.miles@company.com",
//       status: "Active",
//       mobile: "9876543002",
//       role: "DevOps Coach",
//     },
//     {
//       key: 3,
//       image: Avatar_11,
//       name: "John Smith",
//       description: "iOS development and Swift expert",
//       email: "john.smith@company.com",
//       status: "Active",
//       mobile: "9876543003",
//       role: "iOS Trainer",
//     },
//     {
//       key: 4,
//       image: Avatar_10,
//       name: "Mike Litorus",
//       description: "HTML, CSS, and frontend trainer",
//       email: "mike.litorus@company.com",
//       status: "Inactive",
//       mobile: "9876543004",
//       role: "Frontend Instructor",
//     },
//     {
//       key: 5,
//       image: Avatar_09,
//       name: "Wilmer Deluna",
//       description: "Full-stack developer and Laravel coach",
//       email: "wilmer.deluna@company.com",
//       status: "Inactive",
//       mobile: "9876543005",
//       role: "Full-stack Trainer",
//     },
//   ];

//   const [data, setData] = useState(initialData);
//   const [searchText, setSearchText] = useState("");

//   const handleStatusChange = (key) => {
//     setData((prev) =>
//       prev.map((item) =>
//         item.key === key
//           ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" }
//           : item
//       )
//     );
//     message.success("Status updated");
//   };

//   const handleDelete = (key) => {
//     const updated = data.filter((item) => item.key !== key);
//     const reindexed = updated.map((item, index) => ({ ...item, key: index + 1 }));
//     setData(reindexed);
//     message.success("Trainer deleted");
//   };

//   const handleSearch = (e) => {
//     setSearchText(e.target.value);
//   };

//   const filteredData = data.filter((item) =>
//     item.name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const columns = [
//     {
//       title: "#",
//       dataIndex: "key",
//       sorter: (a, b) => a.key - b.key,
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       render: (text, record) => (
//         <h2 className="table-avatar">
//           <Link to="/profile" className="avatar">
//             <img alt="" src={record.image} />
//           </Link>
//           <Link to="/profile">
//             {text} <span>{record.role}</span>
//           </Link>
//         </h2>
//       ),
//       sorter: (a, b) => a.name.localeCompare(b.name),
//     },
//     {
//       title: "Contact Number",
//       dataIndex: "mobile",
//       sorter: (a, b) => a.mobile.localeCompare(b.mobile),
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       sorter: (a, b) => a.email.localeCompare(b.email),
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       sorter: (a, b) => a.description.length - b.description.length,
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (text, record) => (
//         <button
//           className={`btn btn-sm btn-rounded ${
//             text === "Active" ? "btn-success" : "btn-danger"
//           }`}
//           onClick={() => handleStatusChange(record.key)}
//         >
//           {text}
//         </button>
//       ),
//       sorter: (a, b) => a.status.localeCompare(b.status),
//     },
//     {
//       title: "Action",
//       sorter: false,
//       className: "text-end",
//       render: (text, record) => (
//         <div className="dropdown dropdown-action text-end">
//           <Link
//             to="#"
//             className="action-icon dropdown-toggle"
//             data-bs-toggle="dropdown"
//             aria-expanded="false"
//           >
//             <i className="material-icons">more_vert</i>
//           </Link>
//           <div className="dropdown-menu dropdown-menu-right">
//             <Link
//               className="dropdown-item"
//               to="#"
//               data-bs-toggle="modal"
//               data-bs-target="#edit_type"
//             >
//               <i className="fa fa-pencil m-r-5" /> Edit
//             </Link>
//             <Link
//               className="dropdown-item"
//               to="#"
//               data-bs-toggle="modal"
//               data-bs-target="#preview_trainer"
//             >
//               <i className="fa fa-eye m-r-5" /> Preview
//             </Link>
//             <Popconfirm
//               title="Are you sure to delete this trainer?"
//               onConfirm={() => handleDelete(record.key)}
//               okText="Yes"
//               cancelText="No"
//             >
//               <span className="dropdown-item" style={{ cursor: "pointer" }}>
//                 <i className="fa fa-trash m-r-5" /> Delete
//               </span>
//             </Popconfirm>
//           </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="page-wrapper">
//         <div className="content container-fluid">
//           <Breadcrumbs
//             maintitle="Trainers"
//             title="Dashboard"
//             subtitle="Trainers"
//             modal="#add_trainer"
//             name="Add New"
//           />
//           <div className="row mb-3">
//             <div className="col-md-4">
//               <Input placeholder="Search by name..." value={searchText} onChange={handleSearch} />
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-md-12">
//               <div className="table-responsive">
//                 <Table
//                   className="table-striped"
//                   columns={columns}
//                   dataSource={filteredData}
//                   rowKey={(record) => record.key}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <TrainersModal />
//       <TrainerPreviewModal />
//     </>
//   );
// };

// export default Trainers;
