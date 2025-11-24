import React, { useState, useEffect } from "react";
import { Modal, DatePicker, Switch } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ClipLoader } from "react-spinners";
import { showError } from "helpers/notification_helper";
import dayjs from "dayjs";
import Select from "react-select"

const CreateSurveyLicense = ({
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
      licensenumber: initialData?.licensenumber || "",
      title: initialData?.title || "",
      agency: initialData?.agency || "",
      sponsor: initialData?.sponsor || "",
      agency_rep: initialData?.agency_rep || "",
      licencetype: initialData?.licencetype || "",
      approval_date: initialData?.approval_date || "",
      implementation_period_from: initialData?.implementation_period_from || "",
      implementation_period_to: initialData?.implementation_period_to || "",
      objective: initialData?.objective || "",
      status: initialData?.status ?? true,
      survey_status: initialData?.survey_status
    },
    validationSchema: Yup.object({
      licensenumber: Yup.string().required("License number is required"),
      title: Yup.string().required("Title is required"),
      agency: Yup.string().required("Agency is required"),
      sponsor: Yup.string().required("Sponsor is required"),
      agency_rep: Yup.string().required("Agency representative is required"),
      licencetype: Yup.string().required("License type is required"),
      approval_date: Yup.date().required("Approval date is required"),
      implementation_period_from: Yup.date().required(
        "Implementation start date is required"
      ),
      implementation_period_to: Yup.date().required(
        "Implementation end date is required"
      ),
      objective: Yup.string().required("Objective is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        licensenumber: values.licensenumber,
        title: values.title,
        agency: values.agency,
        sponsor: values.sponsor,
        agency_rep: values.agency_rep,
        licencetype: values.licencetype,
        approval_date: values.approval_date,
        implementation_period_from: values.implementation_period_from,
        implementation_period_to: values.implementation_period_to,
        objective: values.objective,
        status: values.status
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
      title={initialData ? "Edit Survey Licence" : "Create Survey Licence"}
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
          {/* License Number */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Licence Number <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="licensenumber"
              className="form-control"
              value={formik.values.licensenumber}
              onChange={formik.handleChange}
              placeholder="Enter license number"
            />
            {formik.errors.licensenumber && (
              <div className="text-danger">{formik.errors.licensenumber}</div>
            )}
          </div>

          {/* Title */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Survey Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder="Enter title"
            />
            {formik.errors.title && (
              <div className="text-danger">{formik.errors.title}</div>
            )}
          </div>

          {/* Agency */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Agency <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="agency"
              className="form-control"
              value={formik.values.agency}
              onChange={formik.handleChange}
              placeholder="Enter agency name"
            />
            {formik.errors.agency && (
              <div className="text-danger">{formik.errors.agency}</div>
            )}
          </div>

          {/* Sponsor */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Sponsor <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="sponsor"
              className="form-control"
              value={formik.values.sponsor}
              onChange={formik.handleChange}
              placeholder="Enter sponsor"
            />
            {formik.errors.sponsor && (
              <div className="text-danger">{formik.errors.sponsor}</div>
            )}
          </div>

          {/* Agency Representative */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Agency Representative <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="agency_rep"
              className="form-control"
              value={formik.values.agency_rep}
              onChange={formik.handleChange}
              placeholder="Enter representative name"
            />
            {formik.errors.agency_rep && (
              <div className="text-danger">{formik.errors.agency_rep}</div>
            )}
          </div>

          {/* License Type */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Licence Type <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="licencetype"
              className="form-control"
              value={formik.values.licencetype}
              onChange={formik.handleChange}
              placeholder="Enter license type"
            />
            {formik.errors.licencetype && (
              <div className="text-danger">{formik.errors.licencetype}</div>
            )}
          </div>

          {/* Approval Date */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Approval Date <span className="text-danger">*</span>
            </label>
            <DatePicker
              className="form-control w-100"
              value={
                formik.values.approval_date
                  ? dayjs(formik.values.approval_date)
                  : null
              }
              onChange={(date, dateString) =>
                formik.setFieldValue("approval_date", dateString)
              }
            />
            {formik.errors.approval_date && (
              <div className="text-danger">{formik.errors.approval_date}</div>
            )}
          </div>

          {/* Implementation Period From */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Licence Period (From) {" "}
              <span className="text-danger">*</span>
            </label>
            <DatePicker
              className="form-control w-100"
              value={
                formik.values.implementation_period_from
                  ? dayjs(formik.values.implementation_period_from)
                  : null
              }
              onChange={(date, dateString) =>
                formik.setFieldValue("implementation_period_from", dateString)
              }
            />
            {formik.errors.implementation_period_from && (
              <div className="text-danger">
                {formik.errors.implementation_period_from}
              </div>
            )}
          </div>

          {/* Implementation Period To */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              Licence Period (To) {" "}
              <span className="text-danger">*</span>
            </label>
            <DatePicker
              className="form-control w-100"
              value={
                formik.values.implementation_period_to
                  ? dayjs(formik.values.implementation_period_to)
                  : null
              }
              onChange={(date, dateString) =>
                formik.setFieldValue("implementation_period_to", dateString)
              }
            />
            {formik.errors.implementation_period_to && (
              <div className="text-danger">
                {formik.errors.implementation_period_to}
              </div>
            )}
          </div>

          {/* Objective */}
          <div className="col-12">
            <label className="form-label fs-7">
              Objective <span className="text-danger">*</span>
            </label>
            <textarea
              name="objective"
              className="form-control"
              rows={3}
              value={formik.values.objective}
              onChange={formik.handleChange}
              placeholder="Enter objective"
            />
            {formik.errors.objective && (
              <div className="text-danger">{formik.errors.objective}</div>
            )}
          </div>

          {/* Status */}
          <div className="col-md-6 d-flex align-items-center">
            <label className="form-label fs-7 me-2 mb-0">License Status</label>
            <Switch
              checked={formik.values.status}
              onChange={(checked) => formik.setFieldValue("status", checked)}
              style={{
                backgroundColor: formik.values.status ? "#00A895" : undefined,
              }}
            />
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

export default CreateSurveyLicense;
