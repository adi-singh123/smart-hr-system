import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { updateTicket, get_tickets } from "../../Redux/services/Ticket";
import { get_employee_data } from "../../Redux/services/Employee";
import {
  FaPlus,
  FaFolderOpen,
  FaRedo,
  FaPause,
  FaCheck,
  FaSpinner,
  FaBan,
} from "react-icons/fa";

const EditTicketModal = ({ ticket, onClose }) => {
  const dispatch = useDispatch();

  const priorityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const statusOptions = [
    { value: "New", label: <><FaPlus className="text-primary me-1" /> New</> },
    { value: "Open", label: <><FaFolderOpen className="text-success me-1" /> Open</> },
    { value: "Reopened", label: <><FaRedo className="text-warning me-1" /> Reopened</> },
    { value: "On Hold", label: <><FaPause className="text-secondary me-1" /> On Hold</> },
    { value: "Closed", label: <><FaCheck className="text-success me-1" /> Closed</> },
    { value: "In Progress", label: <><FaSpinner className="text-info me-1" /> In Progress</> },
    { value: "Cancelled", label: <><FaBan className="text-danger me-1" /> Cancelled</> },
  ];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ticketSubject: ticket.ticket_subject || "",
      ticketId: ticket.ticket_id || "",
      cc: ticket.cc_email || "",
      assign: ticket.assign || "",
      followers: ticket.followers || "",
      fileUpload: ticket.file_upload || "",
      description: ticket.description || "",
    },
  });

  const [staffOptions, setStaffOptions] = useState([]);

  useEffect(() => {
    if (staffOptions.length > 0 && ticket.assign_staff) {
      const staff = staffOptions.find(
        (staffOption) => staffOption.value === ticket.assign_staff
      );
      setValue("assignStaff", staff || null);
    }
  }, [staffOptions, ticket.assign_staff, setValue]);

  useEffect(() => {
    const priority = priorityOptions.find((p) => p.value === ticket.priority);
    setValue("priority", priority || null);
  }, [ticket.priority, setValue]);

  useEffect(() => {
    const status = statusOptions.find((s) => s.value === ticket.status);
    setValue("status", status || null);
  }, [ticket.status, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(get_employee_data());
        if (data?.payload?.data?.users) {
          const staffOptionsData = data.payload.data.users.map((employee) => ({
            value: employee.id,
            label: `${employee.first_name} ${employee.last_name}`,
          }));
          setStaffOptions(staffOptionsData);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [dispatch]);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff9b44",
      },
    }),
  };

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ticketSubject: data.ticketSubject,
        ticketId: data.ticketId,
        assignStaff: data.assignStaff?.value || null,
        priority: data.priority?.value || null,
        cc: data.cc || "",
        assign: data.assign,
        followers: data.followers || "",
        fileUpload: data.fileUpload?.[0] || null,
        description: data.description,
        status: data.status?.value,
      };

      const response = await dispatch(
        updateTicket({ id: ticket.id, data: formattedData })
      );
      if (response?.payload?.status === true) {
        await dispatch(get_tickets());
        onClose();
      } else {
        console.error("Update failed:", response.payload);
      }
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  return (
    <div
      className="modal custom-modal fade show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Ticket</h5>
            <button
              type="button"
              className="btn-close text-black"
              onClick={onClose}
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-sm-6">
                  <label className="col-form-label">Ticket Subject</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="e.g. Login issue on portal"
                    {...register("ticketSubject", {
                      required: "Ticket Subject is required",
                    })}
                  />
                  {errors.ticketSubject && (
                    <span className="text-danger">
                      {errors.ticketSubject.message}
                    </span>
                  )}
                </div>
                <div className="col-sm-6">
                  <label className="col-form-label">Ticket ID</label>
                  <input
                    className="form-control"
                    type="text"
                    disabled
                    {...register("ticketId")}
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-sm-6">
                  <label className="col-form-label">Assign Staff</label>
                  <Controller
                    name="assignStaff"
                    control={control}
                    rules={{ required: "Assign Staff is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={staffOptions}
                        styles={customStyles}
                        placeholder="Select Staff"
                        isClearable
                      />
                    )}
                  />
                  {errors.assignStaff && (
                    <span className="text-danger">
                      {errors.assignStaff.message}
                    </span>
                  )}
                </div>
                <div className="col-sm-6">
                  <label className="col-form-label">Priority</label>
                  <Controller
                    name="priority"
                    control={control}
                    rules={{ required: "Priority is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={priorityOptions}
                        styles={customStyles}
                        placeholder="Select Priority"
                        isClearable
                      />
                    )}
                  />
                  {errors.priority && (
                    <span className="text-danger">{errors.priority.message}</span>
                  )}
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-sm-6">
                  <label className="col-form-label">CC Email</label>
                  <input
                    className="form-control"
                    type="email"
                    {...register("cc", { required: "CC email is required" })}
                  />
                  {errors.cc && <span className="text-danger">{errors.cc.message}</span>}
                </div>
                <div className="col-sm-6">
                  <label className="col-form-label">Assign</label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("assign", { required: "Assign is required" })}
                  />
                  {errors.assign && <span className="text-danger">{errors.assign.message}</span>}
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-sm-6">
                  <label className="col-form-label">Followers</label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("followers")}
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-sm-12">
                  <label className="col-form-label">Description</label>
                  <textarea
                    className="form-control"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  ></textarea>
                  {errors.description && (
                    <span className="text-danger">{errors.description.message}</span>
                  )}
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-sm-6">
                  <label className="col-form-label">Status</label>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Status is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={statusOptions}
                        styles={customStyles}
                        placeholder="Select Status"
                        isClearable
                      />
                    )}
                  />
                  {errors.status && (
                    <span className="text-danger">{errors.status.message}</span>
                  )}
                </div>
              </div>

              <div className="col-sm-12 mt-3">
                <label className="col-form-label">Upload Files</label>
                <input
                  className="form-control"
                  type="file"
                  {...register("fileUpload")}
                />
                {errors.fileUpload && (
                  <span className="text-danger">{errors.fileUpload.message}</span>
                )}
              </div>

              <div className="submit-section mt-4">
                <button className="btn btn-primary me-2" type="submit">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTicketModal;
