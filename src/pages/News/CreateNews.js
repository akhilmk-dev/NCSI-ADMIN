import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import Switch from "react-switch";
import { ClipLoader } from "react-spinners";
import ReactQuill from "react-quill";
import { showError } from "helpers/notification_helper";

const SUPPORTED_IMAGE_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const CreateNews = ({
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
      content_en: initialData?.content_en || "",
      content_ar: initialData?.content_ar || "",
      news_image: initialData?.news_image || ""
    },
    validationSchema: Yup.object({
      title_en: Yup.string().required("English title is required"),
      title_ar: Yup.string().required("Arabic title is required"),
      content_en: Yup.string().required("English content is required"),
      content_ar: Yup.string().required("Arabic content is required"),
      news_image: initialData
        ? Yup.mixed()
            .nullable()
            .test(
              "fileSize",
              "File size too large (max 5MB)",
              (value) => !value || typeof value === "string" || value.size <= FILE_SIZE
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
            .required("News image is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        title_en: values.title_en,
        title_ar: values.title_ar,
        content_en: values.content_en,
        content_ar: values.content_ar,
        news_image: values.img_url
      };

      if (initialData) {
        onSubmit(payload, initialData?.id, resetForm, handleClose);
      } else {
        onSubmit(payload, resetForm, handleClose);
      }
    },
  });

  // Sync external validation errors
  useEffect(() => {
    if (fieldErrors) {
      formik.setErrors(fieldErrors);
    }
  }, [fieldErrors]);

  useEffect(() => {
    if (Object.keys(formik.errors).length !== 0 && isSubmitted) {
      showError("Validation Error");
      setIsSubmitted(false);
    }
  }, [formik.errors, isSubmitted]);

  // Reset form on close
  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  // Image to base64
  const handleImageChange = async (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        formik.setFieldValue("news_image", base64);
      } catch (err) {
        console.error(err);
      }
    } else {
      formik.setFieldValue("news_image", null);
    }
  };

  return (
    <Modal
      title={initialData ? "Edit News" : "Create News"}
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={800}
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
              onBlur={formik.handleBlur}
              placeholder="Enter title in English"
            />
            {formik.touched.title_en && (
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
              onBlur={formik.handleBlur}
              placeholder="Enter title in Arabic"
            />
            {formik.touched.title_ar && (
              <div className="text-danger">{formik.errors.title_ar}</div>
            )}
          </div>

          {/* Content EN (Rich text) */}
          <div className="col-12">
            <label className="form-label fs-7">
              Content (EN) <span className="text-danger">*</span>
            </label>
            <ReactQuill
              theme="snow"
              value={formik.values.content_en}
              onChange={(val) => formik.setFieldValue("content_en", val)}
            />
            {formik.touched.content_en && (
              <div className="text-danger">{formik.errors.content_en}</div>
            )}
          </div>

          {/* Content AR */}
          <div className="col-12">
            <label className="form-label fs-7">
              Content (AR) <span className="text-danger">*</span>
            </label>
            <textarea
              name="content_ar"
              className="form-control"
              rows="4"
              placeholder="Enter Arabic content"
              value={formik.values.content_ar}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.content_ar && (
              <div className="text-danger">{formik.errors.content_ar}</div>
            )}
          </div>

          {/* News Image */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              News Image <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              name="news_image"
              accept="image/jpeg,image/png,image/jpg"
              className="form-control"
              onChange={handleImageChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.news_image && (
              <div className="text-danger">{formik.errors.news_image}</div>
            )}
            {initialData?.news_image_url && (
              <a
                href={initialData?.img_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00A895", textDecoration: "underline" }}
              >
                View Uploaded Image
              </a>
            )}
          </div>

        </div>

        {/* Footer Buttons */}
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

export default CreateNews;
