import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import ExportLeads from '../../../components/modelpopup/Crm/ExportLeads';
import DeleteContact from '../../../components/modelpopup/Crm/DeleteContact';
import AddContact from '../../../components/modelpopup/Crm/AddContact';
import EditContact from '../../../components/modelpopup/Crm/EditContact';
import AddNotes from '../../../components/modelpopup/Crm/AddNotes';
import { get_historian_contact } from '../../../Redux/services/Historian';
import { formatDate } from '../../../utils/formatDate';

const ContactList = () => {
  const dispatch = useDispatch();
  const maximizeBtnRef = useRef(null);
  const contactsData = useSelector((state) => state?.historian?.contactsData);

  const [isFullScreen, setFullScreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('All');

  useEffect(() => {
    dispatch(get_historian_contact());
  }, [dispatch]);

  useEffect(() => {
    const handleClick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setFullScreen(true);
      } else {
        document.exitFullscreen?.();
        setFullScreen(false);
      }
    };

    const maximizeBtn = maximizeBtnRef.current;
    maximizeBtn?.addEventListener('click', handleClick);
    return () => maximizeBtn?.removeEventListener('click', handleClick);
  }, [isFullScreen]);

  const uniqueContacts = [];
  const seenEmails = new Set();

  contactsData?.forEach((contact) => {
    if (!seenEmails.has(contact?.email)) {
      seenEmails.add(contact?.email);
      uniqueContacts.push(contact);
    }
  });

  const filteredContacts = uniqueContacts.filter((contact) => {
    const matchesSearch =
      contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag =
      tagFilter === 'All' ||
      (contact?.website_type || 'Not Assigned') === tagFilter;
    return matchesSearch && matchesTag;
  });

  const data = filteredContacts.map((elem) => ({
    Id: elem?.id,
    Name: elem?.name,
    Email: elem?.email,
    Tags: elem?.website_type && elem?.website_type !== 'N/A' ? elem.website_type : 'Not Assigned',
    Status: formatDate(elem?.created_date),
  }));

  const allTags = Array.from(
    new Set(
      contactsData?.map((c) =>
        c.website_type && c.website_type !== 'N/A' ? c.website_type : 'Not Assigned'
      )
    )
  );

  const tagOptions = ['All', ...allTags];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'Name',
      render: (text, record) => (
        <h2 className="table-avatar d-flex">
          <Link to="/contact-details" className="profile-split d-flex flex-column">
            {text}
          </Link>
        </h2>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'Email',
    },
    {
      title: 'Tags',
      dataIndex: 'Tags',
      filters: tagOptions.map((tag) => ({ text: tag, value: tag })),
      onFilter: (value, record) => record.Tags === value,
    },
    {
      title: 'Created Date',
      dataIndex: 'Status',
    },
    {
      title: 'Action',
      render: () => (
        <div className="dropdown dropdown-action text-end">
          <Link
            to="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            title="More Actions"
          >
            <i className="material-icons">more_vert</i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#edit_contact" title="Edit Contact">
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_contact" title="Delete Contact">
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
            <Link className="dropdown-item" to="/contact-details" title="View Contact">
              <i className="fa-regular fa-eye" /> Preview
            </Link>
            <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#add_notes" title="Add Notes">
              <i className="la la-file-prescription" /> Notes
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col-md-4">
              <h3 className="page-title">Contact</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin-dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Contact</li>
              </ul>
            </div>
            <div className="col-md-8 float-end ms-auto">
              <div className="d-flex title-head">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  className="form-control me-2"
                  style={{ maxWidth: 250 }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="form-select me-2"
                  style={{ maxWidth: 200 }}
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                >
                  {tagOptions.map((tag, index) => (
                    <option key={index} value={tag}>{tag}</option>
                  ))}
                </select>
                <Link to="#" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#add_contact">
                  <i className="la la-plus-circle" /> Add Contact
                </Link>
                <Link to="#" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#export">
                  <i className="las la-file-export" /> Export
                </Link>
                <Link to="#" className="btn btn-link" ref={maximizeBtnRef} title="Toggle Fullscreen">
                  <i className="las la-expand-arrows-alt" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table table-striped custom-table datatable contact-table"
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.Id}
              />
            </div>
          </div>
        </div>
      </div>

      <ExportLeads />
      <AddContact />
      <EditContact />
      <DeleteContact />
      <AddNotes />
    </div>
  );
};

export default ContactList;
