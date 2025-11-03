import React, { useState, useEffect } from "react";
import { Modal, Switch } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ClipLoader } from "react-spinners";
import { showError } from "helpers/notification_helper";

const FILE_SIZE = 20 * 1024 * 1024; // 20MB
const SUPPORTED_FORMATS = ["application/pdf"];
const SUPPORTED_IMAGE_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

// Convert file to Base64
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreateMethodology = ({
  visible,
  handleClose,
  initialData = "",
  onSubmit,
  fieldErrors,
  loading,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title_en: initialData?.title_en || "",
      title_ar: initialData?.title_ar || "",
      cover_image: "",
      pdf_file: "",
      pdf_file_ar: "",
      status: initialData?.status ?? true,
    },
    validationSchema: Yup.object({
      title_en: Yup.string().required("English title is required"),
      title_ar: Yup.string().required("Arabic title is required"),
      cover_image: initialData
        ? Yup.mixed()
            .nullable()
            .test(
              "fileSize",
              "File size too large (max 20MB)",
              (value) =>
                !value || typeof value === "string" || value.size <= FILE_SIZE
            )
            .test(
              "fileFormat",
              "Unsupported Format (JPG/PNG only)",
              (value) =>
                !value ||
                typeof value === "string" ||
                SUPPORTED_IMAGE_FORMATS.includes(value.type)
            )
        : Yup.mixed()
            .nullable()
            .required("Cover image is required"),

      pdf_file: initialData
        ? Yup.mixed()
            .nullable()
            .test(
              "fileFormat",
              "Unsupported Format (PDF only)",
              (value) =>
                !value ||
                typeof value === "string" ||
                SUPPORTED_FORMATS.includes(value.type)
            )
        : Yup.mixed()
            .nullable()
            .required("PDF file (EN) is required"),

      pdf_file_ar: initialData
        ? Yup.mixed()
            .nullable()
            .test(
              "fileFormat",
              "Unsupported Format (PDF only)",
              (value) =>
                !value ||
                typeof value === "string" ||
                SUPPORTED_FORMATS.includes(value.type)
            )
        : Yup.mixed()
            .nullable()
            .required("PDF file (AR) is required"),

      status: Yup.boolean().required("Status is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      let base64Cover = null;
      let base64Pdf = null;
      let base64PdfAr = null;

      if (values.cover_image)
        base64Cover = await fileToBase64(values.cover_image);
      if (values.pdf_file) base64Pdf = await fileToBase64(values.pdf_file);
      if (values.pdf_file_ar)
        base64PdfAr = await fileToBase64(values.pdf_file_ar);

      const payload = {
        title_en: values.title_en,
        title_ar: values.title_ar,
        cover_image: base64Cover,
        pdf_file: base64Pdf,
        pdf_file_ar: base64PdfAr,
        status: values.status,
      };

      if (initialData) {
        onSubmit(payload, initialData?.id, resetForm, onClose);
      } else {
        onSubmit(payload, resetForm, onClose);
      }
    },
  });

  useEffect(() => {
    console.log(fieldErrors);
    if (fieldErrors) formik.setErrors(fieldErrors);

  }, [fieldErrors]);

  useEffect(() => {
    if (Object.keys(formik.errors).length !== 0 && isSubmitted) {
      showError("Validation Error");
      setIsSubmitted(false);
    }
  }, [formik.errors, isSubmitted]);

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const handleFileChange = (e, field) => {
    const file = e.currentTarget.files[0];
    formik.setFieldValue(field, file || "");
  };

  return (
    <Modal
      title={initialData ? "Edit Methodology" : "Create Methodology"}
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={700}
      maskClosable={false}
      className="custom-modal-header p-0"
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="row g-3">
          {/* Title EN */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Title (EN) <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="title_en"
              className="form-control"
              value={formik.values.title_en}
              onChange={formik.handleChange}
              placeholder="Enter English title"
            />
            {formik.errors.title_en && (
              <div className="text-danger">{formik.errors.title_en}</div>
            )}
          </div>

          {/* Title AR */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Title (AR) <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="title_ar"
              className="form-control"
              value={formik.values.title_ar}
              onChange={formik.handleChange}
              placeholder="Enter Arabic title"
            />
            {formik.errors.title_ar && (
              <div className="text-danger">{formik.errors.title_ar}</div>
            )}
          </div>

          {/* Cover Image */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Cover Image <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              className="form-control"
              onChange={(e) => handleFileChange(e, "cover_image")}
            />
            {formik.errors.cover_image && (
              <div className="text-danger">{formik.errors.cover_image}</div>
            )}
            {initialData?.cover_image_url && (
              <a
                href={initialData.cover_image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="d-block mt-2 text-primary"
              >
                View Uploaded Image
              </a>
            )}
          </div>

          {/* PDF File (EN) */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              PDF File (EN) <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              accept="application/pdf"
              className="form-control"
              onChange={(e) => handleFileChange(e, "pdf_file")}
            />
            {formik.errors.pdf_file && (
              <div className="text-danger">{formik.errors.pdf_file}</div>
            )}
            {initialData?.pdf_file_url && (
              <a
                href={initialData.pdf_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="d-block mt-2 text-primary"
              >
                View English PDF
              </a>
            )}
          </div>

          {/* PDF File (AR) */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              PDF File (AR) <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              accept="application/pdf"
              className="form-control"
              onChange={(e) => handleFileChange(e, "pdf_file_ar")}
            />
            {formik.errors.pdf_file_ar && (
              <div className="text-danger">{formik.errors.pdf_file_ar}</div>
            )}
            {initialData?.pdf_file_url_ar && (
              <a
                href={initialData.pdf_file_url_ar}
                target="_blank"
                rel="noopener noreferrer"
                className="d-block mt-2 text-primary"
              >
                View Arabic PDF
              </a>
            )}
          </div>

          {/* Status */}
          <div className="col-md-6 d-flex align-items-center">
            <div>
              <label className="form-label fs-7 d-block">Status</label>
              <Switch
                checked={formik.values.status}
                onChange={(checked) => formik.setFieldValue("status", checked)}
                style={{
                    backgroundColor: formik.values.status ? "#00A895" : undefined,
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer mt-4">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Close
          </button>
          <button
            type="submit"
            onClick={() => setIsSubmitted(true)}
            className="btn btn-primary ms-3"
            style={{ minWidth: "100px" }}
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={18} color="white" />
            ) : initialData ? (
              "Update"
            ) : (
              "Add"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateMethodology;
