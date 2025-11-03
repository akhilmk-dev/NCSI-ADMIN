import React, { useState, useEffect } from "react";
import { Modal, Switch, InputNumber } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ClipLoader } from "react-spinners";
import { showError } from "helpers/notification_helper";


const SUPPORTED_IMAGE_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const CreateOrganizationChart = ({
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
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: {
      title_en: initialData?.title_en || "",
      title_ar: initialData?.title_ar || "",
      designation_en: initialData?.designation_en || "",
      designation_ar: initialData?.designation_ar || "",
      photo: "",
      sort_order: initialData?.sort_order || "",
      status: initialData?.status ?? true,
    },
    validationSchema: Yup.object({
      title_en: Yup.string().required("English title is required"),
      title_ar: Yup.string().required("Arabic title is required"),
      designation_en: Yup.string().required("English designation is required"),
      designation_ar: Yup.string().required("Arabic designation is required"),
      photo: initialData
        ? Yup.mixed()
          .nullable()
          .test(
            "fileSize",
            "File size too large (max 5MB)",
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
          .required("Organization image is required"),
      sort_order: Yup.number()
        .typeError("Sort order must be a number")
        .required("Sort order is required")
        .positive("Must be greater than 0")
        .integer("Must be an integer"),
      status: Yup.boolean().required(),
    }),
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        title_en: values.title_en,
        title_ar: values.title_ar,
        designation_en: values.designation_en,
        designation_ar: values.designation_ar,
        photo: values.photo,
        sort_order: values.sort_order,
        status: values.status,
      };

      if (initialData) {
        onSubmit(payload, initialData?.id, resetForm, handleClose);
      } else {
        onSubmit(payload, resetForm, handleClose);
      }
    },
  });

  // Handle external field errors
  useEffect(() => {
    if (fieldErrors) {
      formik.setErrors(fieldErrors);
    }
  }, [fieldErrors]);

  useEffect(() => {
    if (Object.keys(formik.errors).length !== 0 && isSubmitted) {
      console.log(formik.errors);
      showError("Validation Error");
      setIsSubmitted(false);
    }
  }, [formik.errors, isSubmitted]);

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const handleImageChange = async (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        formik.setFieldValue("photo", base64);
      } catch (err) {
        console.error(err);
      }
    } else {
      formik.setFieldValue("photo", null);
    }
  };

  return (
    <Modal
      title={initialData ? "Edit Organization Chart" : "Create Organization Chart"}
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
              onBlur={formik.handleBlur}
              placeholder="Enter English title"
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
              placeholder="Enter Arabic title"
            />
            {formik.touched.title_ar && (
              <div className="text-danger">{formik.errors.title_ar}</div>
            )}
          </div>

          {/* Designation EN */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Designation (EN) <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="designation_en"
              className="form-control"
              value={formik.values.designation_en}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter English designation"
            />
            {formik.touched.designation_en && (
              <div className="text-danger">{formik.errors.designation_en}</div>
            )}
          </div>

          {/* Designation AR */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Designation (AR) <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="designation_ar"
              className="form-control"
              value={formik.values.designation_ar}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Arabic designation"
            />
            {formik.touched.designation_ar && (
              <div className="text-danger">{formik.errors.designation_ar}</div>
            )}
          </div>

          {/* Photo Upload */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Photo <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              name="photo"
              accept="image/jpeg,image/png,image/jpg"
              className="form-control"
              onChange={handleImageChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.photo && (
              <div className="text-danger">{formik.errors.photo}</div>
            )}
            {initialData?.img_url && (
              <a
                href={initialData.img_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00A895", textDecoration: "underline" }}
              >
                View Uploaded Image
              </a>
            )}
          </div>

          {/* Sort Order */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Sort Order <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              name="sort_order"
              className="form-control w-100"
              value={formik.values.sort_order}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                // Only allow positive numbers
                if (!isNaN(value) && value > 0) {
                  formik.setFieldValue("sort_order", value);
                } else if (e.target.value === "") {
                  // Allow clearing the field
                  formik.setFieldValue("sort_order", "");
                }
              }}
            />
            {formik.touched.sort_order && formik.errors.sort_order && (
              <div className="text-danger">{formik.errors.sort_order}</div>
            )}

          </div>

          {/* Status */}
          <div className="col-md-6">
            <label className="form-label fs-7">Status</label>
            <div>
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

export default CreateOrganizationChart;
