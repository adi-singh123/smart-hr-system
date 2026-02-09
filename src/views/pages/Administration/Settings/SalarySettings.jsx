import React, { useState } from "react";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";

const SalarySettings = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      da: "",
      hra: "",
      pfEmployee: "",
      pfOrganization: "",
      esiEmployee: "",
      esiOrganization: "",
      tdsEnabled: false,
      tds: [{ from: "", to: "", percent: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tds",
  });

  const tdsEnabled = watch("tdsEnabled");

  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data);
      toast.success("Salary settings saved successfully!");
    } catch (err) {
      toast.error("Failed to save settings.");
    }
  };

  const handleAddTdsRow = () => {
    append({ from: "", to: "", percent: "" });
    toast.info("Added new TDS slab");
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <Breadcrumbs maintitle="Salary Settings" />
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* DA & HRA */}
              <div className="settings-widget">
                <div className="card-title with-switch d-flex justify-content-between align-items-center">
                  <h3>DA & HRA Settings</h3>
                </div>
                <div className="row">
                  {[
                    { name: "da", label: "DA (%)" },
                    { name: "hra", label: "HRA (%)" },
                  ].map((field) => (
                    <div className="col-sm-6" key={field.name}>
                      <div className="input-block mb-3">
                        <label>{field.label}</label>
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            placeholder="e.g., 12"
                            {...register(field.name, {
                              required: `${field.label} is required`,
                              min: { value: 0, message: "Must be ≥ 0" },
                              max: { value: 100, message: "Must be ≤ 100" },
                            })}
                            className={`form-control ${
                              errors[field.name] ? "is-invalid" : ""
                            }`}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                        <div className="text-danger">{errors[field.name]?.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Provident Fund */}
              <div className="settings-widget">
                <div className="card-title with-switch d-flex justify-content-between align-items-center">
                  <h3>Provident Fund Settings</h3>
                </div>
                <div className="row">
                  {[
                    { name: "pfEmployee", label: "Employee Share (%)" },
                    { name: "pfOrganization", label: "Organization Share (%)" },
                  ].map((field) => (
                    <div className="col-sm-6" key={field.name}>
                      <div className="input-block mb-3">
                        <label>{field.label}</label>
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            placeholder="e.g., 12"
                            {...register(field.name, {
                              required: `${field.label} required`,
                              min: { value: 0, message: "≥ 0" },
                              max: { value: 100, message: "≤ 100" },
                            })}
                            className={`form-control ${
                              errors[field.name] ? "is-invalid" : ""
                            }`}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                        <div className="text-danger">{errors[field.name]?.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ESI */}
              <div className="settings-widget">
                <div className="card-title with-switch d-flex justify-content-between align-items-center">
                  <h3>ESI Settings</h3>
                  <label className="form-check form-switch ms-auto">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      {...register("esiEnabled")}
                    />
                  </label>
                </div>
                {watch("esiEnabled") && (
                  <div className="row">
                    {[
                      { name: "esiEmployee", label: "Employee Share (%)" },
                      { name: "esiOrganization", label: "Organization Share (%)" },
                    ].map((field) => (
                      <div className="col-sm-6" key={field.name}>
                        <div className="input-block mb-3">
                          <label>{field.label}</label>
                          <div className="input-group">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              placeholder="e.g., 1"
                              {...register(field.name, {
                                required: `${field.label} required`,
                                min: { value: 0, message: "≥ 0" },
                                max: { value: 100, message: "≤ 100" },
                              })}
                              className={`form-control ${
                                errors[field.name] ? "is-invalid" : ""
                              }`}
                            />
                            <span className="input-group-text">%</span>
                          </div>
                          <div className="text-danger">{errors[field.name]?.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TDS */}
              <div className="settings-widget">
                <div className="card-title d-flex align-items-center">
                  <h3>TDS Settings</h3>
                  <label className="form-check form-switch ms-auto">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      {...register("tdsEnabled")}
                    />
                  </label>
                </div>
                {tdsEnabled && (
                  <>
                    {fields.map((item, index) => (
                      <div className="row row-sm align-items-center" key={item.id}>
                        <div className="col-sm-4">
                          <input
                            type="number"
                            placeholder="Salary From"
                            {...register(`tds.${index}.from`, {
                              required: "Required",
                              min: 0,
                            })}
                            className="form-control mb-2"
                          />
                          <div className="text-danger">
                            {errors.tds?.[index]?.from?.message}
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <input
                            type="number"
                            placeholder="Salary To"
                            {...register(`tds.${index}.to`, {
                              required: "Required",
                              min: 0,
                            })}
                            className="form-control mb-2"
                          />
                          <div className="text-danger">
                            {errors.tds?.[index]?.to?.message}
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <div className="input-group">
                            <input
                              type="number"
                              placeholder="%"
                              step="0.01"
                              min="0"
                              max="100"
                              {...register(`tds.${index}.percent`, {
                                required: "Required",
                                min: { value: 0, message: "≥ 0" },
                                max: { value: 100, message: "≤ 100" },
                              })}
                              className={`form-control ${
                                errors.tds?.[index]?.percent ? "is-invalid" : ""
                              }`}
                            />
                            <span className="input-group-text">%</span>
                          </div>
                          <div className="text-danger">
                            {errors.tds?.[index]?.percent?.message}
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <button
                            type="button"
                            className="btn btn-danger w-100"
                            onClick={() => remove(index)}
                            title="Remove this slab"
                          >
                            <i className="fa fa-trash" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="row">
                      <div className="col-sm-2 ms-auto">
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          onClick={handleAddTdsRow}
                          title="Add new TDS slab"
                        >
                          <i className="fa fa-plus" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Submit */}
              <div className="submit-section text-center mt-3">
                <button
                  className="btn btn-primary submit-btn"
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySettings;
