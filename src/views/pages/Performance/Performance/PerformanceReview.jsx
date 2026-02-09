import React, { useState } from "react";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import ProfessionalExcellence from "./ProfessionalExcellence";
import PersonalExcellence from "./PersonalExcellence";
import Achievements from "./Achievements";
import CommandRoleTwo from "./CommandRoleTwo";
import PersonalUpdates from "./PersonalUpdates";
import ProfessionalGoals from "./ProfessionalGoals";
import GeneralComments from "./GeneralComments";
import ROUseOnly from "./ROUseOnly";
import HRDUseOnly from "./HRDUseOnly";

function PerformanceReview() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (itemId) => {
    setItemToDelete(itemId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // Delete logic here
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="page-wrapper">
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs
            maintitle="Performance"
            title="Dashboard"
            subtitle="Performance Review"
          />

          {/* /Page Header */}
          <section className="review-section information">
            <div className="review-header text-center">
              <h3 className="review-title">Employee Basic Information</h3>
              <p className="text-muted">Please fill in all required fields marked with *</p>
            </div>
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <div className="table-responsive">
                  <table className="table table-bordered table-nowrap review-table mb-0">
                    <tbody>
                      <tr>
                        <td className="p-3">
                          <form>
                            <div className="input-block mb-3">
                              <label htmlFor="name" className="form-label">
                                Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                required
                                placeholder="Enter full name"
                              />
                            </div>
                            <div className="input-block mb-3">
                              <label htmlFor="depart3" className="form-label">
                                Department <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="depart3"
                                required
                                placeholder="Enter department"
                              />
                            </div>
                            <div className="input-block mb-3">
                              <label htmlFor="departa" className="form-label">
                                Designation <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="departa"
                                required
                                placeholder="Enter designation"
                              />
                            </div>
                            <div className="input-block mb-3">
                              <label htmlFor="qualif" className="form-label">
                                Qualification
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="qualif"
                                placeholder="Enter qualifications"
                              />
                            </div>
                          </form>
                        </td>
                        <td className="p-3">
                          <form>
                            <div className="input-block mb-3">
                              <label htmlFor="empId" className="form-label">
                                Emp ID
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="empId"
                                defaultValue="DGT-009"
                                readOnly
                              />
                            </div>
                            <div className="input-block mb-3">
                              <label htmlFor="doj" className="form-label">
                                Date of Joining <span className="text-danger">*</span>
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                id="doj"
                                required
                              />
                            </div>
                            <div className="input-block mb-3">
                              <label htmlFor="doc" className="form-label">
                                Date of Confirmation
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                id="doc"
                              />
                            </div>
                            <div className="input-block mb-3">
                              <label htmlFor="exp" className="form-label">
                                Previous years of Experience
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="exp"
                                min="0"
                                max="50"
                                placeholder="Years of experience"
                              />
                            </div>
                          </form>
                        </td>
                        <td className="p-3">
                          <form>
                            <div className="input-block mb-3">
                              <label htmlFor="roName" className="form-label">
                                RO's Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="roName"
                                required
                                placeholder="Reporting officer name"
                              />
                            </div>
                            <div className="input-block mb-3">
                              <label htmlFor="roDesignation" className="form-label">
                                RO Designation <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="roDesignation"
                                required
                                placeholder="Reporting officer designation"
                              />
                            </div>
                          </form>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Excellence Section */}
          <ProfessionalExcellence 
            onDelete={handleDelete}
          />

          {/* Personal Excellence Section */}
          <PersonalExcellence 
            onDelete={handleDelete}
          />

          {/* Achievements Section */}
          <Achievements 
            onDelete={handleDelete}
          />

          <CommandRoleTwo 
            onDelete={handleDelete}
          />

          <PersonalUpdates 
            onDelete={handleDelete}
          />

          <ProfessionalGoals 
            onDelete={handleDelete}
          />

          {/* General Comments Section */}
          <GeneralComments 
            onDelete={handleDelete}
          />

          {/* RO Use Only Section */}
          <ROUseOnly 
            onDelete={handleDelete}
          />

          {/* HRD Use Only Section */}
          <HRDUseOnly 
            onDelete={handleDelete}
          />

          {/* Submit Button */}
          <div className="row mt-4">
            <div className="col-md-12 text-end">
              <button className="btn btn-primary me-2">Save Draft</button>
              <button className="btn btn-success">Submit Review</button>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="modal fade show" style={{ display: 'block' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirm Delete</h5>
                  </div>
                  <div className="modal-body">
                    <p>Are you sure you want to delete this entry?</p>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger" 
                      onClick={confirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* /Page Content */}
      </div>
    </>
  );
}

export default PerformanceReview;