import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Link, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";

// Redux services
import {
  createPerformanceAppraisal,
  updatePerformanceAppraisal,
  fetchPerformanceAppraisalById,
} from "../../Redux/services/PerformanceAppraisal";
import {
  createPerformanceTechnical,
  updatePerformanceTechnical,
  fetchPerformanceTechnicalById,
} from "../../Redux/services/PerformanceTechnical";
import {
  createPerformanceOrganization,
  updatePerformanceOrganization,
  fetchPerformanceOrganizationById,
} from "../../Redux/services/PerformanceOrganization";

const PerformanceAppraisalModal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Redux states
  const { selectedAppraisal } = useSelector(
    (state) => state.performanceAppraisal || {}
  );
  const { technicalData } = useSelector(
    (state) => state.performanceTechnical || {}
  );
  const { organizationalData } = useSelector(
    (state) => state.performanceOrganizations || {}
  );

  const selectoptions = [
    { label: "None", value: "None" },
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
    { label: "Expert / Leader", value: "Expert / Leader" },
  ];
  const selectActive = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];
  const selectEmployee = [
    { label: "Select Employee", value: "" },
    { label: "ddf", value: "1" },
    { label: "ddffd", value: "2" },
    { label: "koffo", value: "3" },
    { label: "gcvh", value: "4" },
  ];
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

  const initialFormState = {
    employee_name: "",
    appraisal_date: null,
    status: "Active",
    technical: {},
    organizational: {},
  };

  const [form, setForm] = useState(initialFormState);

  const resetForm = () => {
    setForm(initialFormState);
  };

  // fetch when editing
  useEffect(() => {
    if (id) {
      dispatch(fetchPerformanceAppraisalById(id));
      dispatch(fetchPerformanceTechnicalById(id));
      dispatch(fetchPerformanceOrganizationById(id));
    } else {
      resetForm(); // clear when adding new
    }
  }, [id, dispatch]);
// When main appraisal is loaded
useEffect(() => {
  if (id && selectedAppraisal) {
    setForm((prev) => ({
      ...prev,
      employee_name: selectedAppraisal.employee_name || "",
      appraisal_date: selectedAppraisal.appraisal_date
        ? new Date(selectedAppraisal.appraisal_date)
        : null,
      status: selectedAppraisal.status || "Active",
    }));
  }
}, [selectedAppraisal, id]);

// When technical data is loaded
useEffect(() => {
  if (id && technicalData) {
    setForm((prev) => ({
      ...prev,
      technical: {
        customer_experience: technicalData.customer_experience_set,
        marketing: technicalData.marketing_set,
        management: technicalData.management_set,
        administration: technicalData.administration_set,
        presentation: technicalData.presentation_set,
        quality: technicalData.quality_set,
        efficiency: technicalData.efficiency_set,
      },
    }));
  }
}, [technicalData, id]);

// When organizational data is loaded
useEffect(() => {
  if (id && organizationalData) {
    setForm((prev) => ({
      ...prev,
      organizational: {
        integrity: organizationalData.integrity_set,
        professionalism: organizationalData.professionalism_set,
        teamwork: organizationalData.teamWork_set,       // ⚠ watch case
        critical: organizationalData.criticalThinking_set,
        conflict: organizationalData.conflictManagement_set,
        attendance: organizationalData.attendance_set,
        deadline: organizationalData.abilityToMeetDeadline_set,
      },
    }));
  }
}, [organizationalData, id]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const appraisalData = {
      employee_name: form.employee_name,
      appraisal_date: form.appraisal_date,
      status: form.status,
    };

    if (!appraisalData.employee_name || !appraisalData.appraisal_date) {
      alert("Employee and Date are required fields.");
      return;
    }

    try {
      let appraisalId = id;
      let res;

      if (id) {
        // Update main appraisal record
        res = await dispatch(
          updatePerformanceAppraisal({ id, data: appraisalData })
        ).unwrap();
      } else {
        // Create main appraisal record
        res = await dispatch(createPerformanceAppraisal(appraisalData)).unwrap();
        appraisalId = res?.data?.id;
      }

      if (appraisalId) {
        // Build technical payload
        const technicalPayload = {
          appraisal_id: appraisalId,
          customer_experience_set: form.technical.customer_experience || "None",
          customer_experience_expected: "Intermediate",
          marketing_set: form.technical.marketing || "None",
          marketing_expected: "Advanced",
          management_set: form.technical.management || "None",
          management_expected: "Advanced",
          administration_set: form.technical.administration || "None",
          administration_expected: "Advanced",
          presentation_set: form.technical.presentation || "None",
          presentation_expected: "Expert / Leader",
          quality_set: form.technical.quality || "None",
          quality_expected: "Expert / Leader",
          efficiency_set: form.technical.efficiency || "None",
          efficiency_expected: "Expert / Leader",
        };

        if (id) {
          await dispatch(
            updatePerformanceTechnical({ id: appraisalId, data: technicalPayload })
          );
        } else {
          await dispatch(createPerformanceTechnical(technicalPayload));
        }

        // Build organizational payload
        const orgPayload = {
          appraisal_id: appraisalId,
          integrity_set: form.organizational.integrity || "None",
          integrity_expected: "Beginner",
          professionalism_set: form.organizational.professionalism || "None",
          professionalism_expected: "Beginner",
          teamWork_set: form.organizational.teamwork || "None",
          teamWork_expected: "Intermediate",
          criticalThinking_set: form.organizational.critical || "None",
          criticalThinking_expected: "Advanced",
          conflictManagement_set: form.organizational.conflict || "None",
          conflictManagement_expected: "Intermediate",
          attendance_set: form.organizational.attendance || "None",
          attendance_expected: "Intermediate",
          abilityToMeetDeadline_set: form.organizational.deadline || "None",
          abilityToMeetDeadline_expected: "Advanced",
        };

        if (id) {
          await dispatch(
            updatePerformanceOrganization({ id: appraisalId, data: orgPayload })
          );
        } else {
          await dispatch(createPerformanceOrganization(orgPayload));
        }
      }

      alert("Saved successfully!");
      if (!id) {
        resetForm();
      }
    } catch (err) {
      console.error("Error saving appraisal", err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <>
      <div id="add_appraisal" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Give Performance Appraisal</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={resetForm} // reset on close
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Employee</label>
                      <Select
                        options={selectEmployee}
                        placeholder="Select Employee"
                        styles={customStyles}
                        value={
                          selectEmployee.find(
                            (opt) => opt.label === form.employee_name
                          ) || null
                        }
                        onChange={(opt) =>
                          setForm((prev) => ({
                            ...prev,
                            employee_name: opt.label,
                          }))
                        }
                      />
                    </div>
                    <div className="input-block mb-3">
                      <label>
                        Select Date <span className="text-danger">*</span>
                      </label>
                      <div className="cal-icon">
                        <DatePicker
                          selected={form.appraisal_date}
                          onChange={(date) =>
                            setForm((prev) => ({
                              ...prev,
                              appraisal_date: date,
                            }))
                          }
                          placeholderText="DD-MM-YYYY"
                          className="form-control floating datetimepicker"
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="tab-box">
                          <div className="row user-tabs">
                            <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                              <ul className="nav nav-tabs nav-tabs-solid">
                                <li className="nav-item">
                                  <Link
                                    to="#appr_technical"
                                    data-bs-toggle="tab"
                                    className="nav-link active"
                                  >
                                    Technical
                                  </Link>
                                </li>
                                <li className="nav-item">
                                  <Link
                                    to="#appr_organizational"
                                    data-bs-toggle="tab"
                                    className="nav-link"
                                  >
                                    Organizational
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="tab-content">
                          {/* Technical */}
                          <div
                            id="appr_technical"
                            className="pro-overview tab-pane fade show active"
                          >
                            <div className="row">
                              <div className="col-sm-12">
                                <div className="bg-white">
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th>Technical Competencies</th>
                                        <th>Expected Value</th>
                                        <th>Set Value</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[
                                        { key: "customer_experience", label: "Customer Experience", expected: "Intermediate" },
                                        { key: "marketing", label: "Marketing", expected: "Advanced" },
                                        { key: "management", label: "Management", expected: "Advanced" },
                                        { key: "administration", label: "Administration", expected: "Advanced" },
                                        { key: "presentation", label: "Presentation Skill", expected: "Expert / Leader" },
                                        { key: "quality", label: "Quality Of Work", expected: "Expert / Leader" },
                                        { key: "efficiency", label: "Efficiency", expected: "Expert / Leader" },
                                      ].map((row) => (
                                        <tr key={row.key}>
                                          <td>{row.label}</td>
                                          <td>{row.expected}</td>
                                          <td>
                                            <Select
                                              options={selectoptions}
                                              placeholder="None"
                                              styles={customStyles}
                                              value={
                                                form.technical[row.key]
                                                  ? selectoptions.find(
                                                      (o) =>
                                                        o.value ===
                                                        form.technical[row.key]
                                                    )
                                                  : null
                                              }
                                              onChange={(opt) =>
                                                setForm((prev) => ({
                                                  ...prev,
                                                  technical: {
                                                    ...prev.technical,
                                                    [row.key]: opt.value,
                                                  },
                                                }))
                                              }
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Organizational */}
                          <div
                            className="tab-pane fade"
                            id="appr_organizational"
                          >
                            <div className="row">
                              <div className="col-sm-12">
                                <div className="bg-white">
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th>Organizational Competencies</th>
                                        <th>Expected Value</th>
                                        <th>Set Value</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[
                                        { key: "integrity", label: "Integrity", expected: "Beginner" },
                                        { key: "professionalism", label: "Professionalism", expected: "Beginner" },
                                        { key: "teamwork", label: "Team Work", expected: "Intermediate" },
                                        { key: "critical", label: "Critical Thinking", expected: "Advanced" },
                                        { key: "conflict", label: "Conflict Management", expected: "Intermediate" },
                                        { key: "attendance", label: "Attendance", expected: "Intermediate" },
                                        { key: "deadline", label: "Ability To Meet Deadline", expected: "Advanced" },
                                      ].map((row) => (
                                        <tr key={row.key}>
                                          <td>{row.label}</td>
                                          <td>{row.expected}</td>
                                          <td>
                                            <Select
                                              options={selectoptions}
                                              placeholder="None"
                                              styles={customStyles}
                                              value={
                                                form.organizational[row.key]
                                                  ? selectoptions.find(
                                                      (o) =>
                                                        o.value ===
                                                        form.organizational[row.key]
                                                    )
                                                  : null
                                              }
                                              onChange={(opt) =>
                                                setForm((prev) => ({
                                                  ...prev,
                                                  organizational: {
                                                    ...prev.organizational,
                                                    [row.key]: opt.value,
                                                  },
                                                }))
                                              }
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-sm-12">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Status</label>
                      <Select
                        options={selectActive}
                        placeholder="Active"
                        styles={customStyles}
                        value={
                          selectActive.find((opt) => opt.value === form.status) ||
                          null
                        }
                        onChange={(opt) =>
                          setForm((prev) => ({ ...prev, status: opt.value }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="submit"
                  >
                    {id ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerformanceAppraisalModal;
