import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  editChildSubCategory,
  editSubCategory,
  getCategories,
  getChildSubCategories,
  getSubCategories,
} from "../../../Redux/services/Category";
import { customAlert } from "../../../utils/Alert";

const EditChildSubCategory = () => {
  const dispatch = useDispatch();
  const { SubCategoryList, editChildSubCategoryObject } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editChildSubCategoryObject) {

      setValue("name", editChildSubCategoryObject.name || "");
      setValue("is_active", editChildSubCategoryObject.is_active?.toString() || "true");
      setValue("sub_category_id", editChildSubCategoryObject.sub_category_id || "");
    }
  }, [editChildSubCategoryObject, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    formData.append("id", editChildSubCategoryObject.id);

    if (data.image?.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      const response = await dispatch(editChildSubCategory(formData));

      if (response?.payload?.status) {
        await dispatch(getChildSubCategories());

        const closeButton = document.querySelector("#edit_child_sub_category .btn-close");
        if (closeButton) closeButton.click();

        customAlert(response.payload.message, "success");
      } else {
        customAlert(response.payload.message, "failed");
        console.error("Failed to update category:", response.payload.message);
      }
    } catch (error) {
      console.error("Error during update category:", error);
    }
  };

  return (
    <div id="edit_child_sub_category" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Child Sub Category</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                {/* Category Name */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Name</label>
                    <input
                      className="form-control"
                      type="text"
                      {...register("name", { required: "Category name is required" })}
                      placeholder="Enter sub-category name"
                    />
                    {errors.name && <small className="text-danger">{errors.name.message}</small>}
                  </div>
                </div>

                {/* Is Active */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Is Active</label>
                    <select className="form-control" {...register("is_active", { required: "Is Active status is required" })}>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                    {errors.is_active && <small className="text-danger">{errors.is_active.message}</small>}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Image (No need to reupload if you don't want to change)</label>
                    <input className="form-control" type="file" {...register("image")} />
                    {errors.image && <small className="text-danger">{errors.image.message}</small>}
                  </div>
                </div>

                {/* Sub Category Selection */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Sub Category</label>
                    <select className="form-control" {...register("sub_category_id", { required: "Sub Category is required" })}>
                      <option value="">Select Sub Category</option>
                      {SubCategoryList.filter((item) => item.is_active).map(
                        (item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        )
                      )}
                    </select>
                    {errors.sub_category_id && <small className="text-danger">{errors.sub_category_id.message}</small>}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-success">
                Edit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditChildSubCategory;
