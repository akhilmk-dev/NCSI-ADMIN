import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import { showError } from 'helpers/notification_helper';
import ConfirmationModal from 'components/Modals/ConfirmationModal';

const CreatePopulation = ({
  visible,
  handleClose,
  initialData = null,
  onSubmit,
  fieldErrors,
  loading,
}) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Confirmation modal states
  const [openModal, setOpenModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  const formik = useFormik({
    initialValues: {
      omanis: initialData?.omanis || '',
      expatriates: initialData?.expatriates || '',
      date: initialData?.date || '',
    },
    enableReinitialize: true,
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
      const payload = { ...values };

      // Instead of relying on state immediately, handle conflict in onSubmit callback
      const handleSubmit = (data) => {
        if (initialData) {
          onSubmit(data, initialData?.id, resetForm, handleClose);
        } else {
          onSubmit(data, resetForm, handleClose);
        }
      };

      // Store payload for retry if 409 conflict occurs
      setPendingPayload(payload);

      handleSubmit(payload);
    },
  });

  // Handle backend validation errors
  useEffect(() => {
    if (fieldErrors) {
      setErrors(fieldErrors);

      // Detect 409 conflict and open confirmation modal
      if (fieldErrors.conflict && pendingPayload) {
        setOpenModal(true);
      }
    }
  }, [fieldErrors, pendingPayload]);

  // Local validation error popup
  useEffect(() => {
    if (Object.keys(formik.errors).length !== 0 && isSubmitted) {
      showError('Validation Error');
      setIsSubmitted(false);
    }
  }, [formik.errors, isSubmitted]);

  const onClose = () => {
    formik.resetForm();
    handleClose();
    setErrors({});
    setPendingPayload(null);
  };

  // Confirm action handler
  const handleConfirm = () => {
    if (!pendingPayload) return;
    const confirmedPayload = { ...pendingPayload, confirm: true };

    if (initialData) {
      onSubmit(confirmedPayload, initialData?.id, formik.resetForm, handleClose);
    } else {
      onSubmit(confirmedPayload, formik.resetForm, handleClose);
    }

    setPendingPayload(null);
    setOpenModal(false);
  };

  return (
    <>
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
              <label className="form-label fs-7">
                {t('Omanis')} <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                name="omanis"
                value={formik.values.omanis}
                onChange={(e) => {
                  formik.handleChange(e);
                  if (errors.omanis) {
                    setErrors((prev) => ({ ...prev, omanis: undefined }));
                  }
                }}
                placeholder={t('Enter Omanis count')}
              />
              {formik.touched.omanis && (
                <div className="text-danger">{formik.errors.omanis}</div>
              )}
              {!formik.errors.omanis && errors?.omanis && (
                <span style={{ color: 'red' }}>{errors?.omanis}</span>
              )}
            </div>

            {/* Expatriates */}
            <div className="col-md-12">
              <label className="form-label fs-7">
                {t('Expatriates')} <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                name="expatriates"
                value={formik.values.expatriates}
                onChange={(e) => {
                  formik.handleChange(e);
                  if (errors.expatriates) {
                    setErrors((prev) => ({ ...prev, expatriates: undefined }));
                  }
                }}
                placeholder={t('Enter Expatriates count')}
              />
              {formik.touched.expatriates && (
                <div className="text-danger">{formik.errors.expatriates}</div>
              )}
              {!formik.errors.expatriates && errors?.expatriates && (
                <span style={{ color: 'red' }}>{errors?.expatriates}</span>
              )}
            </div>

            {/* Date */}
            <div className="col-md-12">
              <label className="form-label fs-7">
                {t('Date')} <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={formik.values.date}
                onChange={(e) => {
                  formik.handleChange(e);
                  if (errors.date) {
                    setErrors((prev) => ({ ...prev, date: undefined }));
                  }
                }}
              />
              {formik.touched.date && (
                <div className="text-danger">{formik.errors.date}</div>
              )}
              {!formik.errors.date && errors?.date && (
                <span style={{ color: 'red' }}>{errors?.date}</span>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="modal-footer mt-4">
            <button type="button" className="btn btn-light" onClick={onClose}>
              {t('Close')}
            </button>
            <button
              type="submit"
              onClick={() => setIsSubmitted(true)}
              className="btn btn-primary ms-3"
              style={{ minWidth: '100px' }}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={18} color="white" />
              ) : initialData ? (
                t('Update')
              ) : (
                t('Add')
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal for 409 conflict */}
      <ConfirmationModal
        okText="Confirm"
        onCancel={() => {
          setOpenModal(false);
          setPendingPayload(null);
        }}
        onOk={handleConfirm}
        isVisible={openModal}
        title="Conflict Detected"
        content={`A record already exists for this date.Do you want to  overwrite it?`}

      />
    </>
  );
};

export default CreatePopulation;
