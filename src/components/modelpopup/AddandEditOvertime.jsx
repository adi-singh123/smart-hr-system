import React, { useMemo, useState } from "react";
import Select from "react-select";

const AddandEditOvertime = ({ onSave }) => {
  // Keep same selects, but actually store values (previous code used only setters)
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [rtTypeAdd, setRtTypeAdd] = useState(null);
  const [otTypeAdd, setOtTypeAdd] = useState(null);
  const [nameEdit, setNameEdit] = useState("");
  const [rateEdit, setRateEdit] = useState("");
  const [rtTypeEdit, setRtTypeEdit] = useState(null);
  const [otTypeEdit, setOtTypeEdit] = useState(null);

  const optionsOne = useMemo(
    () => [
      { value: "", label: "-" },
      { value: "daily", label: "Daily Rate" },
      { value: "hourly", label: "Hourly Rate" },
    ],
    []
  );

  const optionsTwo = useMemo(
    () => [
      { value: "", label: "-" },
      { value: "normal_1_5x", label: "Normal day OT 1.5x" },
      { value: "weekend_2x", label: "Weekend OT 2x" },
      { value: "holiday_2_5x", label: "Holiday OT 2.5x" },
    ],
    []
  );

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

  const validateRate = (val) => /^\d+(\.\d{1,2})?$/.test(val);

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name is required.");
    if (!rtTypeAdd || !rtTypeAdd.value) return alert("Rate Type is required.");
    if (!otTypeAdd || !otTypeAdd.value) return alert("OT Type is required.");
    if (!rate || !validateRate(rate)) return alert("Enter a valid numeric Rate (e.g., 500 or 500.00).");

    const payload = {
      name,
      rate_type: rtTypeAdd?.value,
      ot_type: otTypeAdd?.value,
      rate: Number(rate),
      mode: "add",
    };

    onSave?.(payload);
    // reset
    setName("");
    setRtTypeAdd(null);
    setOtTypeAdd(null);
    setRate("");
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!nameEdit.trim()) return alert("Name is required.");
    if (!rtTypeEdit || !rtTypeEdit.value) return alert("Rate Type is required.");
    if (!otTypeEdit || !otTypeEdit.value) return alert("OT Type is required.");
    if (!rateEdit || !validateRate(rateEdit)) return alert("Enter a valid numeric Rate (e.g., 500 or 500.00).");

    const payload = {
      name: nameEdit,
      rate_type: rtTypeEdit?.value,
      ot_type: otTypeEdit?.value,
      rate: Number(rateEdit),
      mode: "edit",
    };

    onSave?.(payload);
  };

  return (
    <>
      {/* Add Overtime Modal */}
      <div id="add_overtime" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Overtime</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitAdd}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="e.g., John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Rate Type <span className="text-danger">*</span>
                  </label>
                  <Select
                    placeholder="Select Rate Type"
                    options={optionsOne}
                    onChange={setRtTypeAdd}
                    className="select"
                    styles={customStyles}
                    value={rtTypeAdd}
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    OT Type <span className="text-danger">*</span>
                  </label>
                  <Select
                    placeholder="Select OT Type"
                    options={optionsTwo}
                    onChange={setOtTypeAdd}
                    className="select"
                    styles={customStyles}
                    value={otTypeAdd}
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Rate <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g., 500 or 500.00"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                </div>

                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Overtime Modal */}

      {/* Edit Overtime Modal */}
      <div id="edit_overtime" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Overtime</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitEdit}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="e.g., John Doe"
                    value={nameEdit}
                    onChange={(e) => setNameEdit(e.target.value)}
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Rate Type <span className="text-danger">*</span>
                  </label>
                  <Select
                    placeholder="Select Rate Type"
                    options={optionsOne}
                    onChange={setRtTypeEdit}
                    className="select"
                    styles={customStyles}
                    value={rtTypeEdit}
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    OT Type <span className="text-danger">*</span>
                  </label>
                  <Select
                    placeholder="Select OT Type"
                    options={optionsTwo}
                    onChange={setOtTypeEdit}
                    className="select"
                    styles={customStyles}
                    value={otTypeEdit}
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Rate <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g., 500 or 500.00"
                    value={rateEdit}
                    onChange={(e) => setRateEdit(e.target.value)}
                  />
                </div>

                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Overtime Modal */}
    </>
  );
};

export default AddandEditOvertime;
