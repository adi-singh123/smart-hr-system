/** @format */
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_employee_data } from "../../Redux/services/Employee";
import {
  addEmployeeOfMonth,
  updateEmployeeOfMonth,
  fetchEmployeeOfMonths, // ✅ correct service
} from "../../Redux/services/EmployeeOfMonth";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";

const AddEmployeeOfMonth = () => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    id: null,
    employee_id: "",
    description: "",
    month: "",
    file: null,
  });

  const [existingFile, setExistingFile] = useState(""); // ✅ new line
  const [employees, setEmployees] = useState([]);
  const { loading } = useSelector((state) => state.employeeOfMonth || {});

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // ✅ Fetch employees list
  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await dispatch(get_employee_data());
      const users = res?.payload?.data?.users || [];
      setEmployees(users);
    };
    fetchEmployees();
  }, [dispatch]);

  // ✅ Fetch existing Employee of the Month (prefill)
  const fetchExistingData = async () => {
    try {
      const res = await dispatch(fetchEmployeeOfMonths());
      const data = res?.payload?.data?.[0]; // assuming only one active record
      if (data) {
        setFormData({
          id: data.id,
          employee_id: data.employee_id || "",
          description: data.description || "",
          month: data.month || "",
          file: null,
        });
        setExistingFile(data.file || ""); // ✅ set old file name
      }
    } catch (err) {
      console.error("Error fetching EOM:", err);
    }
  };

  useEffect(() => {
    fetchExistingData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_id || !formData.month) {
      customAlert("Please select employee and month.", "warning");
      return;
    }

    const form = new FormData();
    form.append("employee_id", formData.employee_id);
    form.append("month", formData.month);
    form.append("description", formData.description);
    if (formData.file) form.append("file", formData.file);

    let res;
    if (formData.id) {
      // ✅ Update
      res = await dispatch(
        updateEmployeeOfMonth({ id: formData.id, formData: form })
      );
    } else {
      // ✅ Add new
      res = await dispatch(addEmployeeOfMonth(form));
    }

    if (res?.payload?.success) {
      customAlert(
        formData.id ? "Updated successfully!" : "Added successfully!",
        "success"
      );
      await fetchExistingData(); // refresh once
      modalRef.current?.click(); // close modal
    } else {
      customAlert(res?.payload?.message || "Something went wrong!", "error");
    }
  };

  return (
    <div
      id="add_employee_of_month"
      className="modal custom-modal fade"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {formData.id
                ? "Edit Employee of the Month"
                : "Add Employee of the Month"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref={modalRef}
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Employee Dropdown */}
                <div className="col-md-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">
                      Employee <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control form-select"
                      name="employee_id"
                      value={formData.employee_id}
                      onChange={handleChange}
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                          {emp.first_name} {emp.last_name} (
                          {emp.role?.name || "N/A"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Month Dropdown */}
                <div className="col-md-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">
                      Month <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control form-select"
                      name="month"
                      value={formData.month}
                      onChange={handleChange}
                    >
                      <option value="">Select Month</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="col-md-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Write something about the employee..."
                    ></textarea>
                  </div>
                </div>

                {/* File Upload */}
                <div className="col-md-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Upload File</label>
                    <input
                      type="file"
                      className="form-control mb-2"
                      onChange={handleFileChange}
                    />

                    {/* 👇 Show existing file link if present */}
                    {formData?.id && !formData?.file && existingFile && (
                      <a
                        href={`${HTTPURL.replace(
                          /\/$/,
                          ""
                        )}/${existingFile.replace(/^\/+/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="submit-section text-end">
                <button
                  className="btn btn-success submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Submitting..."
                    : formData.id
                    ? "Update"
                    : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeOfMonth;
