import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { get_employee_data } from "../Redux/services/Employee";

const EmployeeListFilter = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    designation: null,
  });

  const [focused, setFocused] = useState({ id: false, name: false });

  const handleChange = (field) => (e) => {
    const value = field === "designation" ? e : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (value && !focused[field]) {
      setFocused((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field) => () => {
    if (!formData[field]) {
      setFocused((prev) => ({ ...prev, [field]: false }));
    }
  };

  // ✅ FIXED: Removed clearing of other fields
  const handleFocus = (field) => () => {
    setFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(get_employee_data(formData));
  };

  const clearField = (field) => {
    const updatedFormData = { ...formData, [field]: "" };
    setFormData(updatedFormData);
    setFocused((prev) => ({ ...prev, [field]: false }));
    dispatch(get_employee_data({}));
  };

  const renderInputWithClear = (field, label) => (
    <div className="col-sm-6 col-md-3 position-relative">
      <div className={`input-block form-focus ${focused[field] || formData[field] ? "focused" : ""}`}>
        <input
          type="text"
          className="form-control pe-5"
          value={formData[field]}
          onFocus={handleFocus(field)}
          onBlur={handleBlur(field)}
          onChange={handleChange(field)}
        />
        <label className="focus-label">{label}</label>
        {formData[field] && (
          <button
            type="button"
            className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0"
            onClick={() => clearField(field)}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "16px",
              color: "#aaa",
              cursor: "pointer",
              lineHeight: "1",
            }}
            aria-label={`Clear ${field}`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="row gy-3">
      {renderInputWithClear("id", "Employee ID")}
      {renderInputWithClear("name", "Employee Name")}

      <div className="col-sm-6 col-md-3 d-flex align-items-end h-100">
        <button
          type="submit"
          className="btn btn-success w-100"
          style={{ height: "48px" }}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default EmployeeListFilter;
