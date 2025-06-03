import React, { useEffect, useRef } from 'react';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreateSlider = ({ visible, handleClose, initialData = '', onSubmit }) => {
  const fileInputRef = useRef();

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const formik = useFormik({
    initialValues: {
      link: initialData?.link || '',
      altText: initialData?.altText || '',
      sliderImage: null, // Will be file object
    },
    validationSchema: Yup.object({
      link: Yup.string().url('Enter a valid URL').required('Link is required'),
      altText: Yup.string().required('Alt text is required'),
      ...(initialData ? {} : {
        sliderImage: Yup.mixed().required('Image is required'),
      })
    }),
    onSubmit: async (values) => {
      let base64Image = null;

      if (values.sliderImage) {
        base64Image = await toBase64(values.sliderImage);
      }

      const payload = {
        link: values.link,
        altText: values.altText,
        sliderImage: base64Image,
        id: initialData?.id || null,
      };

      onSubmit(payload);
      onClose();
    },
  });

  const onClose = () => {
    formik.resetForm();
    handleClose();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    if (initialData) {
      formik.setFieldValue('link', initialData?.link || '');
      formik.setFieldValue('altText', initialData?.altText || '');
    }
  }, [initialData]);

  return (
    <Modal
      title={initialData ? 'Edit Slider' : 'Create New Slider'}
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
        <div className="" role="document">
          <div className="row g-3">
            <div className="col-md-12">
              <label className="form-label fs-7">Slider Link</label><span className="text-danger">*</span>
              <input
                type="url"
                className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                placeholder="Enter link"
                name="link"
                value={formik.values.link}
                onChange={formik.handleChange}
              />
              <span style={{ color: 'red' }} role="alert">{formik.errors.link}</span>
            </div>

            <div className="col-md-12">
              <label className="form-label fs-7">Alt Text</label><span className="text-danger">*</span>
              <input
                type="text"
                className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                placeholder="Enter alt text"
                name="altText"
                value={formik.values.altText}
                onChange={formik.handleChange}
              />
              <span style={{ color: 'red' }} role="alert">{formik.errors.altText}</span>
            </div>

            <div className="col-md-12">
              <label className="form-label fs-7">Slider Image</label>
              <span className="text-danger">{!initialData && '*'}</span>
              <input
                type="file"
                className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                name="sliderImage"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  formik.setFieldValue('sliderImage', e.currentTarget.files[0]);
                }}
              />
              <span style={{ color: 'red' }} role="alert">{formik.errors.sliderImage}</span>
            </div>
          </div>

          <div className="modal-footer mt-3">
            <button type="button" className="btn btn-md btn-light" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="btn btn-primary ms-3">
              {initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSlider;
