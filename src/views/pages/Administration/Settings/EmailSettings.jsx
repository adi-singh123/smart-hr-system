import React from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

const EmailSettings = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Replace with actual API call here
      console.log("Form Data:", data);
      toast.success("Email settings updated successfully!");
    } catch (err) {
      toast.error("Failed to update settings. Please try again.");
    }
  };

  const selectOptions = [
    { label: "None", value: "none" },
    { label: "SSL", value: "ssl" },
    { label: "TLS", value: "tls" },
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

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Mail Option */}
              <div className="input-block mb-3">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="mailoption"
                    defaultChecked
                  />
                  <label className="form-check-label">PHP Mail</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="mailoption"
                  />
                  <label className="form-check-label">SMTP</label>
                </div>
              </div>

              <h4 className="page-title">PHP Email Settings</h4>
              <div className="row">
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Email From Address</label>
                    <input
                      className="form-control"
                      type="email"
                      placeholder="example@domain.com"
                      {...register("fromEmail", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email format",
                        },
                      })}
                    />
                    <span className="text-danger">{errors?.fromEmail?.message}</span>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Email From Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="John Doe"
                      {...register("fromName", {
                        required: "Sender name is required",
                      })}
                    />
                    <span className="text-danger">{errors?.fromName?.message}</span>
                  </div>
                </div>
              </div>

              <h4 className="page-title mt-4">SMTP Email Settings</h4>
              <div className="row">
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">SMTP HOST</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="smtp.gmail.com"
                      {...register("smtpHost", {
                        required: "SMTP Host is required",
                      })}
                    />
                    <span className="text-danger">{errors?.smtpHost?.message}</span>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">SMTP USER</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="your-email@gmail.com"
                      {...register("smtpUser", {
                        required: "SMTP User is required",
                      })}
                    />
                    <span className="text-danger">{errors?.smtpUser?.message}</span>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">SMTP PASSWORD</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Your SMTP password"
                      {...register("smtpPassword", {
                        required: "SMTP Password is required",
                      })}
                    />
                    <span className="text-danger">{errors?.smtpPassword?.message}</span>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">SMTP PORT</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="587"
                      {...register("smtpPort", {
                        required: "SMTP Port is required",
                      })}
                    />
                    <span className="text-danger">{errors?.smtpPort?.message}</span>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">SMTP Security</label>
                    <Controller
                      name="smtpSecurity"
                      control={control}
                      rules={{ required: "Security type is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={selectOptions}
                          placeholder="Select security"
                          styles={customStyles}
                        />
                      )}
                    />
                    <span className="text-danger">{errors?.smtpSecurity?.message}</span>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">
                      SMTP Authentication Domain
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="domain.com"
                      {...register("smtpDomain", {
                        required: "SMTP Auth Domain is required",
                      })}
                    />
                    <span className="text-danger">{errors?.smtpDomain?.message}</span>
                  </div>
                </div>
              </div>

              <div className="submit-section">
                <button
                  className="btn btn-primary submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save & Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
