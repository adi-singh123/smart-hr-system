import React, { useState } from "react";
import { logo3 } from "../../../../Routes/ImagePath/index";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const InvoiceSettings = () => {
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(logo3);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const validateImageSize = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        resolve(img.width === 200 && img.height === 40);
      };
    });
  };

  const onSubmit = async (data) => {
    try {
      if (data.invoiceLogo?.[0]) {
        const isValidSize = await validateImageSize(data.invoiceLogo[0]);
        if (!isValidSize) {
          setError("invoiceLogo", {
            type: "manual",
            message: "Image must be exactly 200x40 pixels.",
          });
          return;
        }
      }

      // Simulate successful API call
      console.log("Saved data:", data);
      toast.success("Invoice settings saved successfully!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <Breadcrumbs maintitle="Invoice Settings" />
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Invoice Prefix */}
              <div className="input-block row align-items-center mb-3">
                <label className="col-lg-3 col-form-label">
                  Invoice Prefix
                </label>
                <div className="col-lg-9">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., INV, INVOICE, 2025-INV"
                    {...register("invoicePrefix", {
                      required: "Invoice Prefix is required",
                    })}
                    defaultValue="INV"
                  />
                  {errors.invoicePrefix && (
                    <span className="text-danger">
                      {errors.invoicePrefix.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Invoice Logo */}
              <div className="input-block row align-items-center mb-3">
                <label className="col-lg-3 col-form-label">Invoice Logo</label>
                <div className="col-lg-7">
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    {...register("invoiceLogo")}
                    onChange={(e) => {
                      handleFileChange(e);
                    }}
                  />
                  <span className="form-text text-muted">
                    Recommended image size is 200px x 40px
                  </span>
                  {errors.invoiceLogo && (
                    <span className="text-danger">
                      {errors.invoiceLogo.message}
                    </span>
                  )}
                  {fileName && (
                    <div className="mt-1 text-secondary small">
                      Selected file: {fileName}
                    </div>
                  )}
                </div>
                <div className="col-lg-2 mt-2 mt-lg-0">
                  <div className="img-thumbnail float-lg-end">
                    <img
                      src={preview}
                      alt="Invoice Logo Preview"
                      className="img-fluid"
                      width={140}
                      height={40}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="submit-section text-center mt-4">
                <button className="btn btn-primary submit-btn" type="submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSettings;
