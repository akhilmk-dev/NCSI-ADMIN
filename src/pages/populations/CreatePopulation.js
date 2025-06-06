import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreatePopulation = ({ visible, handleClose, initialData = '', onSubmit, fieldErrors }) => {

  const formik = useFormik({
    initialValues: {
      omanis: initialData?.omanis || '',
      expatriates: initialData?.expatriates || '',
      date: initialData?.date || '',
    },
    validationSchema: Yup.object({
      omanis: Yup.number()
        .typeError('Omanis must be a number')
        .required('Omanis count is required')
        .min(0, 'Must be 0 or more'),
      expatriates: Yup.number()
        .typeError('Expatriates must be a number')
        .required('Expatriates count is required')
        .min(0, 'Must be 0 or more'),
      date: Yup.date()
        .min(new Date(), 'Date cannot be in the past')
        .required('Date is required'),

    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        ...values,
      };
      if (initialData) {
        onSubmit(payload, initialData?.id, resetForm, handleClose);
      } else {
        onSubmit(payload, resetForm, handleClose);
      }
    },
  });

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  useEffect(() => {
    if (initialData) {
      formik.setValues({
        omanis: initialData.omanis || '',
        expatriates: initialData.expatriates || '',
        date: initialData.date || '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (fieldErrors) {
      formik.setErrors(fieldErrors)
    }
  }, [fieldErrors])

  return (
    <Modal
      title={initialData ? 'Edit Population Record' : 'Add Population Record'}
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={600}
      className="custom-modal-header p-0"
      maskClosable={false}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="row g-3">
          {/* Omanis */}
          <div className="col-md-12">
            <label className="form-label fs-7">Omanis <span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              name="omanis"
              value={formik.values.omanis}
              onChange={formik.handleChange}
              placeholder='Enter Omanis count'
            />
            {formik.touched.omanis && <div className="text-danger">{formik.errors.omanis || formik.errors.omanis?.[0]}</div>}
          </div>

          {/* Expatriates */}
          <div className="col-md-12">
            <label className="form-label fs-7">Expatriates <span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              name="expatriates"
              value={formik.values.expatriates}
              onChange={formik.handleChange}
              placeholder="Enter Expatriates count"
            />
            {formik.touched.expatriates && <div className="text-danger">{formik.errors.expatriates || formik.errors.expatriates?.[0]}</div>}
          </div>

          {/* Date */}
          <div className="col-md-12">
            <label className="form-label fs-7">Date <span className="text-danger">*</span></label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
            />
            {formik.touched.date && <div className="text-danger">{formik.errors.date || formik.errors.date?.[0]}</div>}
          </div>
        </div>

        <div className="modal-footer mt-4">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Close
          </button>
          <button type="submit" className="btn btn-primary ms-3">
            {initialData ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePopulation;
