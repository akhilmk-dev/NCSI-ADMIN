import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import { showError } from 'helpers/notification_helper';

const CreatePopulation = ({ visible, handleClose, initialData = '', onSubmit, fieldErrors, loading }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
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
        .max(new Date(), 'Future dates are not allowed')
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
      setErrors(fieldErrors);
    }
  }, [fieldErrors])

  useEffect(() => {
    if (Object.keys(formik.errors).length !== 0 && isSubmitted) {
      showError("Validation Error")
      setIsSubmitted(false)
    }
  }, [formik.errors, isSubmitted])

  return (
    <Modal
      title={initialData ? t('Edit Population Record') : t('Add Population Record')}
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
            <label className="form-label fs-7">{t('Omanis')} <span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              name="omanis"
              value={formik.values.omanis}
              onChange={(e) => {
                formik.handleChange(e);
                // Clear backend error for 'name' on user input
                if (errors.omanis) {
                  setErrors(prev => ({ ...prev, omanis: undefined }));
                }
              }}
              placeholder={t('Enter Omanis count')}
            />
            {formik.touched.omanis && <div className="text-danger">{formik.errors.omanis}</div>}
            {(!formik.errors.omanis && errors?.omanis) && <span style={{ color: 'red' }}>{errors?.omanis}</span>}

          </div>

          {/* Expatriates */}
          <div className="col-md-12">
            <label className="form-label fs-7">{t('Expatriates')} <span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              name="expatriates"
              value={formik.values.expatriates}
              onChange={(e) => {
                formik.handleChange(e);
                // Clear backend error for 'name' on user input
                if (errors.expatriates) {
                  setErrors(prev => ({ ...prev, expatriates: undefined }));
                }
              }}
              placeholder={t("Enter Expatriates count")}
            />
            {formik.touched.expatriates && <div className="text-danger">{formik.errors.expatriates}</div>}
            {(!formik.errors.expatriates && errors?.expatriates) && <span style={{ color: 'red' }}>{errors?.expatriates}</span>}
          </div>

          {/* Date */}
          <div className="col-md-12">
            <label className="form-label fs-7">{t('Date')} <span className="text-danger">*</span></label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formik.values.date}
              onChange={(e) => {
                formik.handleChange(e);
                // Clear backend error for 'name' on user input
                if (errors.date) {
                  setErrors(prev => ({ ...prev, date: undefined }));
                }
              }}
            />
            {formik.touched.date && <div className="text-danger">{formik.errors.date}</div>}
            {(!formik.errors.date && errors?.date) && <span style={{ color: 'red' }}>{errors?.date}</span>}
          </div>
        </div>

        <div className="modal-footer mt-4">
          <button type="button" className="btn btn-light" onClick={onClose}>
            {t('Close')}
          </button>
          <button type="submit" onClick={() => setIsSubmitted(true)} className="btn btn-primary ms-3" style={{ minWidth: "100px" }} disabled={loading}>
            {loading ? <ClipLoader size={18} color="white" /> : initialData ? t("Update") : t("Add")}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePopulation;
