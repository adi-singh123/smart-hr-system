import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { getSubCategories } from "../../../../Redux/services/common";
import { get_historian_data } from "../../../../Redux/services/Historian";
import { customAlert } from "../../../../utils/Alert";
const HistorianFilter = () => {
  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionTwo, setSelectedOptionTwo] = useState(null);
  const [title, setTitle] = useState("");
  const [historyTitlePlaceholder, setHistoryTitlePlaceholder] = useState("");

  const subCategoryData = useSelector((state) => state?.common?.subCategories);
  const [itemFocus, setItemFocus] = useState(false);

  useEffect(() => {
    // Dispatch action only if subCategories are not loaded yet
    if (!subCategoryData || !subCategoryData.length) {
      dispatch(getSubCategories());
    }
  }, [dispatch, subCategoryData]);

  const inputFocus = () => {setItemFocus(true); setHistoryTitlePlaceholder("Eg. Abraham Lincoln")}
  const inputBlur = () => {setItemFocus(false);setHistoryTitlePlaceholder("")};

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

  const options = subCategoryData
    ? subCategoryData.map((ele) => ({
        value: ele?.id,
        label: ele?.name,
      }))
    : [];

  options.unshift({ value: "", label: "Select SubCategory" });

  const optionsTwo = [
    { value: 1, label: "Yes" },
    { value: 2, label: "No" },
  ];
  const handleSubmit = async () => {
    const filterData = {
      title: title ? title : null,
      subCategory: selectedOption ? selectedOption.value : null,
      status: selectedOptionTwo ? selectedOptionTwo.value : null,
    };

    console.log("Submitted Data:", filterData);
    const response = await dispatch(get_historian_data(filterData));

    console.log("Response: ", response);
    setTitle("");
    setSelectedOption(null);
    setSelectedOptionTwo(null);
  };

  return (
    <div className="row filter-row space">
      <div className="col-sm-6 col-md-3">
        <div
          className={`input-block mb-3 form-focus ${
            itemFocus ? "focused" : ""
          }`}
        >
          <input
            type="text"
            className="form-control floating"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={inputFocus}
            onBlur={inputBlur}
            placeholder={historyTitlePlaceholder}
          />
          <label className="focus-label">Title</label>
        </div>
      </div>

      <div className="col-sm-6 col-md-3">
        <div className="input-block form-focus select-focus">
          <Select
            placeholder="Select Subcategory"
            value={selectedOption}
            onChange={setSelectedOption}
            options={options}
            className="select floating"
            styles={customStyles}
          />
          <label className="focus-label">Subcategory</label>
        </div>
      </div>

      <div className="col-sm-6 col-md-3">
        <div className="input-block form-focus select-focus">
          <Select
            placeholder="Select Status"
            value={selectedOptionTwo}
            onChange={setSelectedOptionTwo}
            options={optionsTwo}
            className="select floating"
            styles={customStyles}
          />
          <label className="focus-label">Status</label>
        </div>
      </div>

      <div className="col-sm-6 col-md-3">
        <button
          onClick={handleSubmit}
          className="btn btn-success btn-block w-100"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default HistorianFilter;
