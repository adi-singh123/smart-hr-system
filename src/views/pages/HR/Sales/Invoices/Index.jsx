import React, { useState } from "react";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import InvoiceTable from "./invoiceTable";
import DeleteModal from "../../../../../components/modelpopup/DeleteModal";

const Invoices = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTwo, setSelectedDateTwo] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [filters, setFilters] = useState({});

  const handleSearch = () => {
    setFilters({
      from: selectedDate,
      to: selectedDateTwo,
      status: selectedOption?.value || "",
    });
  };

  const options = [
    { value: "Select Status", label: "Select Status" },
    { value: "Pending", label: "Pending" },
    { value: "Paid", label: "Paid" },
    { value: "Partially Paid", label: "Partially Paid" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": { backgroundColor: "#ff9b44" },
    }),
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Invoices"
            title="Dashboard"
            subtitle="Invoices"
            modal="#"
            name="Create Invoice"
            link="/create-invoice"
          />

          <div className="row filter-row">
            <div className="col-sm-6 col-md-3">
              <div className="input-block mb-3 form-focus focused">
                <div className="cal-icon">
                  <DatePicker
                    className="form-control floating datetimepicker"
                    selected={selectedDate}
                    onChange={setSelectedDate}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="From Date"
                  />
                </div>
                <label className="focus-label">From</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="input-block mb-3 form-focus focused">
                <div className="cal-icon">
                  <DatePicker
                    className="form-control floating datetimepicker"
                    selected={selectedDateTwo}
                    onChange={setSelectedDateTwo}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="To Date"
                  />
                </div>
                <label className="focus-label">To</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="input-block mb-3 form-focus select-focus">
                <Select
                  placeholder="Select Status"
                  onChange={setSelectedOption}
                  options={options}
                  styles={customStyles}
                />
                <label className="focus-label">Status</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <button className="btn btn-success w-100" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          {/* ⬇️ Pass filters as props */}
          <InvoiceTable filters={filters} />
        </div>
      </div>
      <DeleteModal Name="Delete Invoice" />
    </>
  );
};

export default Invoices;
