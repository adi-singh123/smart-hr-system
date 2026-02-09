/** @format */

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { getSubCategories } from "../../../Redux/services/common";
import { useDispatch } from "react-redux";
import {
  get_historian_data,
  edit_historian_data,
} from "../../../Redux/services/Historian";

import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Add_historian } from "../../../Redux/services/Historian";
import { Editor } from "@tinymce/tinymce-react";
import { HTTPURL } from "../../../Constent/Matcher";

const EditHistorian = ({ id, onClose }) => {
  const dispatch = useDispatch();
  const subCategoryData = useSelector((state) => state?.common?.subCategories);
  const editHistorianList = useSelector(
    (state) => state?.historian?.EditHistorianList
  );
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // Heading options
    ["bold", "italic", "underline", "strike"], // Bold, Italic, Underline, Strikethrough
    [{ list: "ordered" }, { list: "bullet" }], // Ordered & Bullet List
    ["link", "blockquote", "image", "video"], // Links, Blockquote, Image, Video
    ["undo", "redo"], // Undo & Redo
  ];

  useEffect(() => {
    if (editHistorianList?.thumbnail) {
      const localBasePath = HTTPURL;
      const fullImagePath = editHistorianList?.thumbnail
        ? `${localBasePath}${editHistorianList?.thumbnail}`
        : ""; // Debugging step
      setThumbnailPreview(fullImagePath);
    }
  }, [editHistorianList?.thumbnail]);
  const handleThumbnailChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Create a preview URL
      setThumbnailPreview(previewUrl); // Set it as the preview
    }
  };

  // Initialize the editor and conclusion content properly
  const [editorContent, setEditorContent] = useState("");
  const [conclusionContent, setConclusionContent] = useState("");
  const [contentDescription, setContentDescription] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });
  // Sanitize the content and conclusion data
  const sanitizeContent = (data) => {
    // Remove double quotes and unwanted characters, extra spaces, etc.
    return data ? data.replace(/"/g, "").replace(/\s+/g, " ").trim() : "";
  };

  useEffect(() => {
    if (id) {
      dispatch(edit_historian_data(id));
    }
  }, [id]);

  useEffect(() => {
    // If editHistorianList has data, populate form values
    if (editHistorianList) {
      // Set form fields values
      setValue("sub_category_id", editHistorianList?.sub_category_id);
      setValue("blog_title", editHistorianList?.title);
      setValue("meta_description", editHistorianList?.meta_desc);
      setValue("keywords", editHistorianList?.keywords);

      setValue("publish_name", editHistorianList?.publish_name);
      // Handle active, featured, and trending flags
      setValue("is_active", editHistorianList?.is_active === true ? "1" : "0");
      setValue(
        "is_featured",
        editHistorianList?.is_featured === true ? "1" : "0"
      );
      setValue(
        "is_tranding",
        editHistorianList?.is_tranding === true ? "1" : "0"
      );

      // Set CKEditor content and conclusion without empty string fallback
      setEditorContent(editHistorianList?.content);
      setConclusionContent(editHistorianList?.conclusion);
      setContentDescription(editHistorianList?.first_paragraph);
      // Set thumbnail preview if available
    }
  }, [editHistorianList, setValue]); // Only run this effect when editHistorianList is updated

  useEffect(() => {
    // Dispatch action only if subCategories are not loaded yet
    if (!subCategoryData || !subCategoryData.length) {
      dispatch(getSubCategories());
    }
  }, [dispatch, subCategoryData]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (
        key !== "thumbnail" &&
        key !== "fields" &&
        key !== "content" &&
        key !== "conclusion"
      ) {
        formData.append(key, data[key]);
      }
    });

    if (data.thumbnail?.[0]) {
      formData.append("thumbnail", data.thumbnail[0]);
    }

    formData.append("content", editorContent);
    formData.append("conclusion", conclusionContent);
    formData.append("content-description", contentDescription);
    formData.append("publish_name", data.publish_name);
    const {
      fields,
      blog_title,
      meta_description,
      is_active,
      is_tranding,
      is_featured,
      ...rest
    } = data;
    const jsonData = {
      blog_title: blog_title,
      meta_description: meta_description,
      inner_data: fields.map((field) => ({
        title: field.title,
        paragraph: field.paragraph,
      })),
    };
    formData.append("json_data", JSON.stringify(jsonData));

    formData.append("is_active", is_active);
    formData.append("is_tranding", is_tranding);
    formData.append("is_featured", is_featured);
    formData.append("editid", editHistorianList.id);

    // Log the formData contents
    for (let [key, value] of formData.entries()) {
      // Log the FormData key-value pairs
    }

    try {
      const response = await dispatch(Add_historian(formData));

      // Log the response to inspect it
      if (response?.payload?.status == true) {
        await dispatch(get_historian_data());
        await dispatch(getSubCategories());
        const closeButton = document.querySelector(".modal .btn-close");
        if (closeButton) {
          closeButton.click(); // Simulate click on the close button to close the modal
        }
      }
    } catch (error) {
      console.error("Error during add historian:", error);
    }
  };

  return (
    <div
      className="modal custom-modal fade show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Historian</h5>
            <button
              type="button"
              className="btn-close btn-light"
              onClick={onClose}
            >
              <i className="fa fa-times"></i> {/* Visible cross icon */}
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                {/* Sub-Category */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Sub-Category</label>
                    <select
                      className="form-control"
                      disabled
                      {...register("sub_category_id", {
                        required: "Sub-Category is required",
                      })}
                    >
                      <option value="">Select SubCategory</option>
                      {subCategoryData &&
                        subCategoryData?.map((ele) => (
                          <option value={ele?.id} key={ele?.id}>
                            {ele?.name}
                          </option>
                        ))}
                    </select>
                    {errors.sub_category_id && (
                      <small className="text-danger">
                        {errors.sub_category_id.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* Blog Title */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Blog Title</label>
                    <input
                      className="form-control"
                      type="text"
                      {...register("blog_title", {
                        required: "Blog Title is required",
                      })}
                      placeholder="Blog Title"
                    />
                    {errors.blog_title && (
                      <small className="text-danger">
                        {errors.blog_title.message}
                      </small>
                    )}
                  </div>
                </div>
                {/* Publish Name Field */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Publish Name</label>
                    <input
                      className="form-control"
                      type="text"
                      {...register("publish_name", {
                        required: "Publish Name is required",
                      })}
                      placeholder="Enter Publish Name"
                    />
                    {errors.publish_name && (
                      <small className="text-danger">
                        {errors.publish_name.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* Meta Description */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Meta Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      {...register("meta_description", {
                        required: "Meta Description is required",
                      })}
                      placeholder="Meta Description"
                    ></textarea>
                    {errors.meta_description && (
                      <small className="text-danger">
                        {errors.meta_description.message}
                      </small>
                    )}
                  </div>
                </div>
                {/* Content Description Field */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">
                      Content Description
                    </label>
                    <Editor
                      apiKey="mksmp9zbbb6wj32a4ph9c32wwv4ka7pkbfg45ceqr9l3dghp"
                      value={contentDescription}
                      onEditorChange={(content) => {
                        setContentDescription(content);
                        setValue("content_description", content); // If using react-hook-form
                      }}
                      init={{
                        height: 400,
                        menubar: true,
                        plugins:
                          "advlist autolink lists link image charmap print preview anchor \
      searchreplace visualblocks code fullscreen insertdatetime media table \
      paste help wordcount",
                        toolbar:
                          "undo redo | formatselect | bold italic underline strikethrough | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | link unlink anchor image | \
      removeformat | code table | help",

                        branding: false,
                        content_style:
                          "body { font-family:Arial, sans-serif; font-size:14px }",

                        // Fix newline issues
                        forced_root_block: "", // Prevents TinyMCE from wrapping everything in <p>
                        remove_trailing_brs: true, // Avoids unnecessary <br> tags

                        // Link settings
                        link_assume_external_targets: true,
                        default_link_target: "_blank",
                        link_title: true,

                        // URL handling
                        relative_urls: false,
                        remove_script_host: false,
                        convert_urls: false,

                        // Performance optimization
                        cache_suffix: "?v=1.0", // Prevents caching issues
                        content_css:
                          "https://cdnjs.cloudflare.com/ajax/libs/tinyMCE/6.8.1/skins/content/default/content.min.css", // Ensures consistent styling
                      }}
                    />

                    {errors?.content_description && (
                      <small className="text-danger">
                        {errors?.content_description?.message}
                      </small>
                    )}
                  </div>
                </div>
                {/* CKEditor Content Field */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Content</label>
                    <Editor
                      apiKey="mksmp9zbbb6wj32a4ph9c32wwv4ka7pkbfg45ceqr9l3dghp"
                      value={editorContent}
                      onEditorChange={(content) => {
                        const cleanedContent = content
                          .replace(/\r\n/g, " ")
                          .trim();
                        setEditorContent(cleanedContent);
                        setValue("content", cleanedContent);
                      }}
                      init={{
                        height: 400,
                        menubar: true,
                        plugins:
                          "advlist autolink lists link image charmap print preview anchor \
      searchreplace visualblocks code fullscreen insertdatetime media table \
      paste help wordcount",
                        toolbar:
                          "undo redo | formatselect | bold italic underline strikethrough | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | link unlink anchor image | \
      removeformat | code table | help",
                        branding: false,
                        content_style:
                          "body { font-family: Arial, sans-serif; font-size:14px; line-height: 1.6; }",
                        forced_root_block: "p", // Ensures newlines are wrapped properly
                        remove_trailing_brs: true,
                        link_assume_external_targets: true,
                        default_link_target: "_blank",
                        link_title: true,
                        relative_urls: false,
                        remove_script_host: false,
                        convert_urls: false,
                      }}
                    />

                    {errors?.content && (
                      <small className="text-danger">
                        {errors?.content?.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* CKEditor Conclusion Field */}
                <div className="col-sm-12">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Conclusion</label>
                    <Editor
                      apiKey="mksmp9zbbb6wj32a4ph9c32wwv4ka7pkbfg45ceqr9l3dghp"
                      value={conclusionContent}
                      onEditorChange={(content) => {
                        const cleanedContent = content
                          .replace(/\r\n/g, " ")
                          .trim();
                        setConclusionContent(content);
                        setValue("conclusion", cleanedContent); // If using react-hook-form
                      }}
                      init={{
                        height: 400,
                        menubar: true,
                        plugins:
                          "advlist autolink lists link image charmap print preview anchor \
      searchreplace visualblocks code fullscreen insertdatetime media table \
      paste help wordcount",
                        toolbar:
                          "undo redo | formatselect | bold italic underline strikethrough | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | link unlink anchor image | \
      removeformat | code table | help",

                        branding: false,
                        content_style:
                          "body { font-family:Arial, sans-serif; font-size:14px }",

                        // ✅ Fix newline issues
                        forced_root_block: "p", // Prevents automatic <p> wrapping
                        remove_trailing_brs: true, // Avoids unnecessary <br> tags

                        // ✅ Link settings
                        link_assume_external_targets: true,
                        default_link_target: "_blank",
                        link_title: true,

                        // ✅ URL handling
                        relative_urls: false,
                        remove_script_host: false,
                        convert_urls: false,
                      }}
                    />

                    {errors?.conclusion && (
                      <small className="text-danger">
                        {errors?.conclusion?.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* Thumbnail */}
                {/* Thumbnail */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Thumbnail</label>

                    {/* Image Preview */}
                    {thumbnailPreview && (
                      <div className="mb-2">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail Preview"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                    )}

                    {/* File Input */}
                    <input
                      className="form-control"
                      type="file"
                      {...register("thumbnail")}
                      onChange={handleThumbnailChange}
                    />

                    {errors.thumbnail && (
                      <small className="text-danger">
                        {errors.thumbnail.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* Keywords */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Keywords</label>
                    <textarea
                      className="form-control"
                      type="text"
                      {...register("keywords", {
                        required: "Keywords are required",
                      })}
                    ></textarea>
                    {errors.keywords && (
                      <small className="text-danger">
                        {errors.keywords.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* Is Active */}
                <div className="col-sm-4">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Is Active</label>
                    <select
                      className="form-control"
                      {...register("is_active", {
                        required: "Is Active is required",
                      })}
                    >
                      <option value="">Select</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                    {errors.is_active && (
                      <small className="text-danger">
                        {errors.is_active.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* Is Featured */}
                <div className="col-sm-4">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Is Featured</label>
                    <select
                      className="form-control"
                      {...register("is_featured", {
                        required: "Is Featured is required",
                      })}
                    >
                      <option value="">Select</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                    {errors.is_featured && (
                      <small className="text-danger">
                        {errors.is_featured.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* Is Trending */}
                <div className="col-sm-4">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Is Trending</label>
                    <select
                      className="form-control"
                      {...register("is_tranding", {
                        required: "Is Trending is required",
                      })}
                    >
                      <option value="">Select</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                    {errors.is_tranding && (
                      <small className="text-danger">
                        {errors.is_tranding.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHistorian;
