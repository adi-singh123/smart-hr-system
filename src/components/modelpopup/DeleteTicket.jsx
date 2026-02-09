import React from "react";
import { useDispatch } from "react-redux";
import { get_tickets } from "../../Redux/services/Ticket";
import { deleteTicket } from "../../Redux/services/Ticket";
const DeleteTicket = ({ id, onClose }) => {
  const dispatch = useDispatch();

  const submit = async (id) => {
    try {
      console.log("sumit", id);
      const response = await dispatch(deleteTicket(id.id));
      console.log("Delete Ticket Response: ", response);
      if (response?.payload?.status === true) {
        await dispatch(get_tickets()); //
        if (response?.payload?.status === true) {
          await dispatch(get_tickets()); // Refresh ticket list
          onClose(); // Close modal after deletion
        }
      }
    } catch (error) {
      console.error("Error during ticket delete:", error);
    }
  };

  return (
    <div
      className="modal custom-modal fade show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Ticket</h5>
            <button
              type="button"
              className="btn-close btn-light"
              onClick={onClose}
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
          <div className="modal-body text-center">
            <div className="form-header">
              <h3>Delete Confirmation</h3>
              <p className="mb-4">
                Are you sure you want to delete this ticket? This action cannot
                be undone.
              </p>
            </div>
            <div className="row d-flex justify-content-center mt-3">
              <div className="col-6 col-md-4">
                <button
                  className="btn btn-danger continue-btn w-100"
                  onClick={() => submit(id)}
                >
                  Delete
                </button>
              </div>
              <div className="col-6 col-md-4">
                <button
                  className="btn btn-secondary cancel-btn w-100"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTicket;
