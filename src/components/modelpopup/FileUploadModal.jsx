import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchFiles, uploadFile, updateFile } from "../../Redux/services/File";
import { get_employee_data } from "../../Redux/services/Employee";
import { customAlert } from "../../utils/Alert";

const UploadFileModal = ({ editFile }) => {
  const dispatch = useDispatch();
  const { employeeData } = useSelector((state) => state.employee);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Fetch users dynamically
  useEffect(() => {
    dispatch(get_employee_data());
  }, [dispatch]);

  // Prefill form if editing
  useEffect(() => {
    if (editFile) {
      setValue("user", editFile.user_id);
      // Note: file input cannot be prefilled for security reasons
    }
  }, [editFile, setValue]);

  const onSubmit = async (data) => {
    if (!data.user) {
      customAlert("Please select a user", "failed");
      return;
    }

    const formData = new FormData();
    if (data.file && data.file[0]) formData.append("file", data.file[0]);
    formData.append("user_id", data.user);

    try {
      const response = editFile
        ? await dispatch(updateFile({ id: editFile.id, formData }))
        : await dispatch(uploadFile(formData));

      if (response?.payload?.status) {
        await dispatch(fetchFiles());

        const closeButton = document.querySelector("#upload_file .btn-close");
        if (closeButton) closeButton.click();
        reset();

        customAlert(response?.payload?.message, "success");
      } else {
        customAlert(response?.payload?.message, "failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div id="upload_file" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editFile ? "Edit File" : "Upload File"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                {/* User Dropdown */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Assign to User</label>
                    <select
                      className="form-control"
                      {...register("user", { required: "User is required" })}
                    >
                      <option value="">Select User</option>
                      {employeeData?.users?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.first_name} {user.last_name} ({user.employee_id})
                        </option>
                      ))}
                    </select>
                    {errors.user && <small className="text-danger">{errors.user.message}</small>}
                  </div>
                </div>

                {/* File Input */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">File (Max file size - 5mb)</label>
                    <input
                      className="form-control"
                      type="file"
                      {...register("file", { required: !editFile && "File is required" })}
                    />
                    {errors.file && <small className="text-danger">{errors.file.message}</small>}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-success">
                {editFile ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFileModal;
