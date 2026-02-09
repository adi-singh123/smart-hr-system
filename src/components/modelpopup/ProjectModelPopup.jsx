/** @format */

import React, { useEffect, useState } from "react";
import { createProject } from "../../Redux/services/Project";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { fetchProjects } from "../../Redux/services/Project";
import { get_employee_data } from "../../Redux/services/Employee";
import { fetchClients } from "../../Redux/services/Client";
import { useDispatch } from "react-redux";
import { fetchNotifications } from "../../Redux/services/Notifications";

const ProjectModelPopup = ({
  show,
  setShow,
  isEdit,
  setIsEdit,
  selectedProject,
  setSelectedProject,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: "",
      client: null,
      priority: null,
      rate: null,
      startDate: null,
      endDate: null,
      description: "",
      projectLeader: null,
      projectMembers: [],
      attachments: [],
      progress: 0, // ✅ Default 0
    },
  });

  const dispatch = useDispatch();
  const [staffOptions, setStaffOptions] = useState([]);
  const [clientOption, setClientOptions] = useState([]);

  const attachments = watch("attachments");

  const isView = !isEdit && selectedProject; // View mode flag

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(get_employee_data());
        if (data?.payload?.data?.users) {
          const staffOptionsData = data.payload.data.users.map((employee) => ({
            value: employee.id,
            label: `${employee.first_name} ${employee.last_name}`,
          }));
          setStaffOptions(staffOptionsData);
        }

        const clientRes = await dispatch(fetchClients());
        if (clientRes?.payload?.data) {
          const clientOptionsData = clientRes.payload.data.map((client) => ({
            value: client.id,
            label: `${client.first_name} ${client.last_name}`,
          }));
          setClientOptions(clientOptionsData);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if ((isEdit || isView) && selectedProject) {
      setValue("projectName", selectedProject.projectName);
      setValue(
        "client",
        clientOption.find((opt) => opt.value == selectedProject.client_id)
      );
      setValue("priority", {
        label: selectedProject.priority,
        value: selectedProject.priority,
      });
      setValue("startDate", new Date(selectedProject.startDate));
      setValue("endDate", new Date(selectedProject.endDate));
      setValue("description", selectedProject.description);
      setValue(
        "projectLeader",
        staffOptions.find(
          (opt) => opt.value === selectedProject.project_leader_id
        )
      );
      setValue(
        "projectMembers",
        staffOptions.filter((opt) =>
          selectedProject.projectMembers.includes(opt.value)
        )
      );
      // ✅ Set progress for edit/view
      setValue("progress", selectedProject.progress || 0);
    }
  }, [isEdit, isView, selectedProject, setValue, staffOptions, clientOption]);

  const formatDate = (date) => {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const onSubmit = async (data) => {
    if (isView) return;

    const formattedData = {
      projectName: data.projectName,
      client: data.client?.value || null,
      priority: data.priority?.label || null,
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
      description: data.description || "",
      projectLeader: data.projectLeader?.value || null,
      projectMembers: data.projectMembers?.map((member) => member.value) || [],
      attachments: data.attachments || null,
      progress: data.progress || 0, // ✅ Include progress
      id: isEdit && selectedProject ? selectedProject.id : undefined,
    };

    try {
      const result = await dispatch(createProject(formattedData));
      if (createProject.fulfilled.match(result)) {
        reset();
        setIsEdit(false);
        setSelectedProject(null);
        await dispatch(fetchProjects());
        await dispatch(fetchNotifications());
        document.getElementById("project-modal-close")?.click();
      } else {
        console.error("Project operation error:", result.payload);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": { backgroundColor: "#ff9b44" },
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const status = [
    { value: 1, label: "High" },
    { value: 2, label: "Medium" },
    { value: 3, label: "Low" },
  ];

  const handleClose = () => {
    reset();
    setIsEdit(false);
    setSelectedProject(null);
    setShow(false);
  };

  return (
    <div
      id="create_project"
      className={`modal custom-modal fade ${show ? "show d-block" : ""}`}
      role="dialog"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEdit
                ? "Edit Project"
                : isView
                ? "View Project"
                : "Create Project"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="project-modal-close"
              onClick={handleClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Project Name & Client */}
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Project Name</label>
                  <input
                    className="form-control"
                    placeholder="Enter Project Name"
                    {...register("projectName")}
                    disabled={isView}
                  />
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Client</label>
                  <Controller
                    name="client"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={clientOption}
                        styles={customStyles}
                        menuPortalTarget={document.body}
                        isDisabled={isView}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Dates & Priority */}
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Start Date</label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        className="form-control"
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Enter start date"
                        disabled={isView}
                      />
                    )}
                  />
                </div>

                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">End Date</label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        className="form-control"
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Enter end date"
                        disabled={isView}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Priority</label>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={status}
                        styles={customStyles}
                        menuPortalTarget={document.body}
                        isDisabled={isView}
                      />
                    )}
                  />
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="col-form-label">Project Leader</label>
                  <Controller
                    name="projectLeader"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={staffOptions}
                        styles={customStyles}
                        menuPortalTarget={document.body}
                        isDisabled={isView}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Project Members */}
              <div className="mb-3">
                <label className="col-form-label">Project Members</label>
                <Controller
                  name="projectMembers"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={staffOptions}
                      isMulti
                      styles={customStyles}
                      menuPortalTarget={document.body}
                      isDisabled={isView}
                    />
                  )}
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="col-form-label">Description</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Editor
                      apiKey="mksmp9zbbb6wj32a4ph9c32wwv4ka7pkbfg45ceqr9l3dghp"
                      value={value}
                      onEditorChange={onChange}
                      init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                          "advlist autolink lists link image charmap print preview anchor",
                          "searchreplace visualblocks code fullscreen",
                          "insertdatetime media table paste code help wordcount",
                        ],
                        toolbar:
                          "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                        readonly: isView,
                      }}
                    />
                  )}
                />
              </div>

              {/* Progress → Only editable in Edit */}
              <div className="mb-3">
                <label className="col-form-label">Progress (%)</label>
                <Controller
                  name="progress"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      className="form-control"
                      {...field}
                      disabled={!isEdit} // ✅ Create → readonly, Edit → editable
                    />
                  )}
                />
              </div>

              {/* File Upload → Only in Create/Edit */}
              {!isView && (
                <div className="mb-3">
                  <label className="col-form-label">Upload File</label>
                  <Controller
                    name="attachments"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          field.onChange(file);
                          setValue("attachments", file);
                        }}
                      />
                    )}
                  />
                </div>
              )}

              {/* Submit → Only in Create/Edit */}
              {!isView && (
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    {isEdit ? "Update" : "Submit"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModelPopup;
