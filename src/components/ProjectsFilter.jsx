import React, { useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { fetchProjects } from "../Redux/services/Project";
import RecentTable from "../views/pages/MainPages/Dashboard/AdminDashboard/recentTable";

const ProjectsFilter = () => {
  const { register, handleSubmit, control, setFocus, setValue, watch, reset } =
    useForm({
      defaultValues: {
        projectName: "",
        deadline: "",
        priority: null, // make sure this matches your select default
      },
    });

  const inputProjectName = watch("projectName", "");
  const [focusedProjectName, setFocusedProjectName] = useState(false);
  
  const [projectNamePlaceholder, setProjectNamePlaceholder] = useState("");

  const priorities = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
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
  const dispatch = useDispatch();
  const submit = async (data) => {
    console.log("Form submitted with:", data);
    await dispatch(fetchProjects(data));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="row filter-row">
        {/* Project Name */}
        <div className="col-sm-6 col-md-3">
          <div
            className={
              focusedProjectName || inputProjectName
                ? "input-block form-focus focused"
                : "input-block form-focus"
            }
          >
            <input
              type="text"
              className="form-control floating"
              {...register("projectName")}
              onFocus={() => {
                setFocusedProjectName(true);
                setProjectNamePlaceholder("Eg. Project 1");
              }}
              onBlur={() => {
                if (!watch("projectName")) {
                  setFocusedProjectName(false);
                  setProjectNamePlaceholder("");
                }
              }}
              placeholder={projectNamePlaceholder}
            />
            <label
              className="focus-label"
              onClick={() => setFocus("projectName")}
            >
              Project Name
            </label>
          </div>
        </div>

        {/* Deadline */}
        <div className="col-sm-6 col-md-3">
          <div className="input-block form-focus focused">
            <input
              type="date"
              className="form-control floating"
              {...register("deadline")}
            />
            <label className="focus-label">Deadline</label>
          </div>
        </div>

        {/* Priority Select */}
        <div className="col-sm-6 col-md-3">
          <div className="input-block form-focus select-focus">
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={priorities}
                  placeholder="Select Priority"
                  styles={customStyles}
                  isClearable
                />
              )}
            />
            <label className="focus-label">Priority</label>
          </div>
        </div>

        {/* Search Button */}
        <div className="col-sm-6 col-md-3">
          <button type="submit" className="btn btn-success btn-block w-100">
            Search
          </button>
        </div>
      </div>
      <RecentTable/>
    </form>
  );
};

export default ProjectsFilter;
