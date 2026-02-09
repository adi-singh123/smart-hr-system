/** @format */

import React, { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { getSubCategories } from "../../../Redux/services/common";
import { useSelector, useDispatch } from "react-redux";
import {
  Add_historian,
  get_historian_data,
} from "../../../Redux/services/Historian";
import { Editor } from "@tinymce/tinymce-react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
const AddHistorian = () => {
  const dispatch = useDispatch();
  const editorRef = useRef(null);
  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // Heading options
    ["bold", "italic", "underline", "strike"], // Bold, Italic, Underline, Strikethrough
    [{ list: "ordered" }, { list: "bullet" }], // Ordered & Bullet List
    ["link", "blockquote", "image", "video"], // Links, Blockquote, Image, Video
    ["undo", "redo"], // Undo & Redo
  ];
  const subCategoryData = useSelector((state) => state?.common?.subCategories);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: "",
      conclusion: "",
      content_description: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });
  useEffect(() => {
    register("content", { required: "Content is required" });
    register("conclusion", { required: "Conclusion is required" });
    register("content_description", {
      required: "Content Description is required",
    });

    // Ensure values are set properly after registering
    setValue("content", getValues("content"));
    setValue("conclusion", getValues("conclusion"));
    setValue("content_description", getValues("content_description"));
  }, [register, setValue, getValues]);

  const [editorContent, setEditorContent] = useState("");
  const [contentDescription, setContentDescription] = useState("");
  const [conclusionContent, setConclusionContent] = useState("");
  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (
        key !== "thumbnail" &&
        key !== "fields" && // Ignore fields when adding to FormData
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
    formData.append("content_description", contentDescription);
    formData.append("publish_name", data.publish_name);

    const jsonData = {
      blog_title: data.blog_title,
      meta_description: data.meta_description,
      inner_data: (data.fields || []).map((field) => ({
        title: field.title,
        paragraph: field.paragraph,
      })),
    };
    formData.append("json_data", JSON.stringify(jsonData));

    formData.append("is_active", data.is_active);
    formData.append("is_tranding", data.is_tranding);
    formData.append("is_featured", data.is_featured);
    try {
      const response = await dispatch(Add_historian(formData));

      if (response?.payload?.status === true) {
        await dispatch(get_historian_data());

        const closeButton = document.querySelector("#add_user .btn-close");
        if (closeButton) {
          closeButton.click();
        }

        reset({
          sub_category_id: "",
          blog_title: "",
          meta_description: "",
          keywords: "",
          is_active: "",
          is_tranding: "",
          thumbnail: "",
          is_featured: "",
          publish_name: "",
          fields: [], // Clear dynamic fields
        });
        setEditorContent("");
        setConclusionContent("");
        setContentDescription("");
      }
    } catch (error) {
      console.error("Error during add historian:", error);
    }
  };
  const [editorReady, setEditorReady] = useState(false);
  useEffect(() => {
    // Dispatch action only if subCategories are not loaded yet
    if (!subCategoryData || !subCategoryData.length) {
      dispatch(getSubCategories());
    }
  }, [dispatch, subCategoryData]);
  useEffect(() => {
    const modalElement = document.getElementById("add_user");

    const handleModalShown = () => {
      if (editorRef.current && !editorReady) {
        setEditorReady(true); // Mark editor as ready once modal is shown
      }
    };

    modalElement?.addEventListener("shown.bs.modal", handleModalShown);

    return () => {
      modalElement?.removeEventListener("shown.bs.modal", handleModalShown);
    };
  }, [editorReady]);
  return (
    <div
      id="add_user"
      className="modal custom-modal fade"
      role="dialog"
      aria-labelledby="addUserModalLabel"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Historian</h5>
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                {/* Sub-Category */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Sub-Category</label>
                    <select
                      className="form-control"
                      {...register("sub_category_id", {
                        required: "Sub-Category is required",
                      })}
                    >
                      <option value="">Select SubCategory</option>
                      {subCategoryData &&
                        subCategoryData?.map((ele) => (
                          <option value={ele?.id}>{ele?.name}</option>
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
                      placeholder="Eg. History of Akbar"
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
                      placeholder="Eg. John Doe"
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
                      placeholder="Eg. Akbar was a history's greatest emperor ..."
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
                        placeholder: "Write your content description here ...",
                        content_style: `
                          .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                            color: #6c757d;
                            font-style: italic;
                          }
                        `,
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
                        placeholder: "Write your content  here ...",
                        content_style: `
                          .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                            color: #6c757d;
                            font-style: italic;
                          }
                        `,
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
                        placeholder: "Write your conclusion here...",
                        content_style: `
                          .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                            color: #6c757d;
                            font-style: italic;
                          }
                        `,
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
                      placeholder="History"
                    ></textarea>
                    {errors.keywords && (
                      <small className="text-danger">
                        {errors.keywords.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="col-sm-6">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Thumbnail</label>
                    <input
                      className="form-control"
                      type="file"
                      {...register("thumbnail", {
                        required: "Thumbnail is required",
                      })}
                    />
                    {errors.thumbnail && (
                      <small className="text-danger">
                        {errors.thumbnail.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-sm-4">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Is Active</label>
                    <select
                      className="form-control"
                      {...register("is_active", {
                        required: "Is active is required",
                        onChange: (e) => setValue("is_active", e.target.value), // Ensures value is updated
                      })}
                    >
                      <option value="">Select</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                    {errors?.is_active && (
                      <small className="text-danger">
                        {errors?.is_active?.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-sm-4">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Is Trending</label>
                    <select
                      className="form-control"
                      {...register("is_tranding", {
                        required: "Is Trending is required",
                        onChange: (e) =>
                          setValue("is_tranding", e.target.value),
                      })}
                    >
                      <option value="">Select</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                    {errors?.is_tranding && (
                      <small className="text-danger">
                        {errors?.is_tranding?.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-sm-4">
                  <div className="input-block mb-3">
                    <label className="col-form-label">Is Featured</label>
                    <select
                      className="form-control"
                      {...register("is_featured", {
                        required: "Is featured is required",
                        onChange: (e) =>
                          setValue("is_featured", e.target.value),
                      })}
                    >
                      <option value="">Select</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                    {errors?.is_featured && (
                      <small className="text-danger">
                        {errors?.is_featured?.message}
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

export default AddHistorian;
