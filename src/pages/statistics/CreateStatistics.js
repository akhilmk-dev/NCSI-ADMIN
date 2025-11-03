import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ClipLoader } from "react-spinners";
import { showError } from "helpers/notification_helper";

const CreateStatistics = ({
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
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: {
      indicator_en: initialData?.indicator_en || "",
      indicator_ar: initialData?.indicator_ar || "",
      description_en: initialData?.description_en || "",
      description_ar: initialData?.description_ar || "",
    },
    validationSchema: Yup.object({
      indicator_en: Yup.string().required("English indicator is required"),
      indicator_ar: Yup.string().required("Arabic indicator is required"),
      description_en: Yup.string()
        .trim()
        .required("English description is required"),
      description_ar: Yup.string()
        .trim()
        .required("Arabic description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        indicator_en: values.indicator_en,
        indicator_ar: values.indicator_ar,
        description_en: values.description_en,
        description_ar: values.description_ar,
      };

      if (initialData) {
        onSubmit(payload, initialData?.id, resetForm, handleClose);
      } else {
        onSubmit(payload, resetForm, handleClose);
      }
    },
  });

  // Handle backend validation errors
  useEffect(() => {
    if (fieldErrors) formik.setErrors(fieldErrors);
  }, [fieldErrors]);

  // Handle local validation alert
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

  return (
    <Modal
      title={initialData ? "Edit Statistic" : "Create Statistic"}
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
          {/* Indicator EN */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Indicator (EN) <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="indicator_en"
              className="form-control"
              value={formik.values.indicator_en}
              onChange={formik.handleChange}
              placeholder="Enter indicator in English"
            />
            {formik.errors.indicator_en && (
              <div className="text-danger">{formik.errors.indicator_en}</div>
            )}
          </div>

          {/* Indicator AR */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Indicator (AR) <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="indicator_ar"
              className="form-control"
              value={formik.values.indicator_ar}
              onChange={formik.handleChange}
              placeholder="Enter indicator in Arabic"
            />
            {formik.errors.indicator_ar && (
              <div className="text-danger">{formik.errors.indicator_ar}</div>
            )}
          </div>

          {/* Description EN */}
          <div className="col-12">
            <label className="form-label fs-7">
              Description (EN) <span className="text-danger">*</span>
            </label>
            <textarea
              name="description_en"
              className="form-control"
              rows={4}
              value={formik.values.description_en}
              onChange={formik.handleChange}
              placeholder="Enter description in English"
            />
            {formik.errors.description_en && (
              <div className="text-danger">{formik.errors.description_en}</div>
            )}
          </div>

          {/* Description AR */}
          <div className="col-12">
            <label className="form-label fs-7">
              Description (AR) <span className="text-danger">*</span>
            </label>
            <textarea
              name="description_ar"
              className="form-control"
              rows={4}
              value={formik.values.description_ar}
              onChange={formik.handleChange}
              placeholder="Enter description in Arabic"
            />
            {formik.errors.description_ar && (
              <div className="text-danger">{formik.errors.description_ar}</div>
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

export default CreateStatistics;
