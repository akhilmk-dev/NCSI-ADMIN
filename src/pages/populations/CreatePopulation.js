import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreatePopulation = ({ visible, handleClose, initialData = '', onSubmit }) => {

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
        .required('Date is required'),
    }),
    onSubmit: (values) => {
      const payload = {
        sp: initialData?.populationId ? 'usp_UpdatePopulation' : 'usp_InsertPopulation',
        ...values,
        populationId: initialData?.populationId || undefined,
      };
    console.log(payload)
      onSubmit(payload);
      onClose();
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
            />
            <div className="text-danger">{formik.errors.omanis}</div>
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
            />
            <div className="text-danger">{formik.errors.expatriates}</div>
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
            <div className="text-danger">{formik.errors.date}</div>
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
