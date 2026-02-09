import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Add_ticket } from "../../Redux/services/Ticket";
import { useForm } from "react-hook-form";

const TicketModelPopup = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [file, setFile] = useState(null);
  const { employeeData } = useSelector((state) => state?.employee);
  const employees = employeeData?.users || [];

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (file) formData.append("attachment", file);

    await dispatch(Add_ticket(formData));
    reset();
    setFile(null);
    document.getElementById("add_ticket_close").click(); // closes modal
  };

  return (
    <div id="add_ticket" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Ticket</h5>
            <button id="add_ticket_close" className="close" data-bs-dismiss="modal">
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="modal-body">
              {/* Ticket Subject */}
              <div className="form-group">
                <label>Ticket Subject <span className="text-danger">*</span></label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="e.g., Internet Issue, Laptop Not Starting"
                  {...register("ticketSubject", {
                    required: "Ticket Subject is required",
                  })}
                />
                {errors.ticketSubject && (
                  <small className="text-danger">{errors.ticketSubject.message}</small>
                )}
              </div>

              {/* CC Field */}
              <div className="form-group">
                <label>CC <span className="text-danger">*</span></label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="e.g., user@example.com, admin@site.com"
                  {...register("cc", {
                    required: "CC is required",
                  })}
                />
                {errors.cc && (
                  <small className="text-danger">{errors.cc.message}</small>
                )}
              </div>

              {/* Assign Field */}
              <div className="form-group">
                <label>Assign To <span className="text-danger">*</span></label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="e.g., IT Team"
                  {...register("assign", {
                    required: "Assignment is required",
                  })}
                />
                {errors.assign && (
                  <small className="text-danger">{errors.assign.message}</small>
                )}
              </div>

              {/* Followers */}
              <div className="form-group">
                <label>Followers</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="e.g., manager@example.com"
                  {...register("followers")}
                />
              </div>

              {/* Priority */}
              <div className="form-group">
                <label>Priority</label>
                <select className="form-control" {...register("priority")}>
                  <option value="">-- Select Priority --</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Describe the issue in detail..."
                  {...register("description")}
                ></textarea>
              </div>

              {/* File Upload */}
              <div className="form-group">
                <label>Upload Files</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketModelPopup;
