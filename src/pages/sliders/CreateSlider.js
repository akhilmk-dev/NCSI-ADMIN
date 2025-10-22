import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IMG_URL } from 'constants/config';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import { showError } from 'helpers/notification_helper';

const CreateSlider = ({ visible, handleClose, initialData = '', onSubmit, fieldErrors, loading }) => {
  const fileInputRef = useRef();
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
   const [isSubmitted,setIsSubmitted]= useState(false);
  
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
      alt_text: initialData?.alt_text || '',
      slider_image: null,
      slider_image_ar: null
    },
    validationSchema: Yup.object({
      link: Yup.string().required('Link is required'),
      alt_text: Yup.string().required('Alt text is required'),
      ...(initialData ? {} : {
        slider_image: Yup.mixed().required('Image is required'),
      }),
      ...(initialData ? {} : {
        slider_image_ar: Yup.mixed().required('The slider image ar field is required.'),
      })
    }),
    onSubmit: async (values, { resetForm }) => {
      let base64Image = null;
      let sliderImgAr = null

      if (values.slider_image) {
        base64Image = await toBase64(values.slider_image);
      }
      if (values?.slider_image_ar) {
        sliderImgAr = await toBase64(values?.slider_image_ar)
      }

      const payload = {
        link: values.link,
        alt_text: values.alt_text,
        slider_image: base64Image,
        slider_image_ar: sliderImgAr
      };
      if (initialData) {
        onSubmit(payload, initialData?.id, resetForm, handleClose)
      } else {
        onSubmit(payload, resetForm, handleClose);
      }

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
      formik.setFieldValue('alt_text', initialData?.alt_text || '');
    }
  }, [initialData]);

  useEffect(() => {
    if (fieldErrors) {
      setErrors(fieldErrors);
    }
  }, [fieldErrors])

  useEffect(() => {
    if (Object.keys(formik.errors).length !== 0 && isSubmitted) {
      console.log(formik.errors,"kooi")
      showError("Validation Error")
      setIsSubmitted(false)
    }
  }, [formik.errors, isSubmitted])

  return (
    <Modal
      title={initialData ? t('Edit Slider') : t('Create New Slider')}
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
              <label className="form-label fs-7">{t('Slider Link')}</label><span className="text-danger">*</span>
              <input
                type="url"
                className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                placeholder={t("Enter link")}
                name="link"
                value={formik.values.link}
                onChange={(e) => {
                  formik.handleChange(e);
                  // Clear backend error for 'name' on user input
                  if (errors.link) {
                    setErrors(prev => ({ ...prev, link: undefined }));
                  }
                }}
              />
              {formik.touched.link && <span style={{ color: 'red' }} role="alert">{formik.errors.link}</span>}
              {(!formik.errors.link && errors?.link) && <span style={{ color: 'red' }}>{errors?.link}</span>}
            </div>

            <div className="col-md-12">
              <label className="form-label fs-7">{('Alt Text')}</label><span className="text-danger">*</span>
              <input
                type="text"
                className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                placeholder={t("Enter alt text")}
                name="alt_text"
                value={formik.values.alt_text}
                onChange={(e) => {
                  formik.handleChange(e);
                  // Clear backend error for 'name' on user input
                  if (errors.alt_text) {
                    setErrors(prev => ({ ...prev, alt_text: undefined }));
                  }
                }}
              />
              {formik.touched.alt_text && <span style={{ color: 'red' }} role="alert">{formik.errors.alt_text}</span>}
              {(!formik.errors.alt_text && errors?.alt_text) && <span style={{ color: 'red' }}>{errors?.alt_text}</span>}
            </div>

            <div className="col-md-12">
              <label className="form-label fs-7">{t('Slider Image')}</label>
              <span className="text-danger">{!initialData && '*'}</span>
              <input
                type="file"
                className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                name="slider_image"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  formik.setFieldValue('slider_image', e.currentTarget.files[0]);
                  // Clear backend error for 'name' on user input
                  if (errors.slider_image) {
                    setErrors(prev => ({ ...prev, slider_image: undefined }));
                  }
                }}
              />
              {formik.touched.slider_image && <span style={{ color: 'red' }} role="alert">{formik.errors.slider_image}</span>}
              {(!formik.errors.slider_image && errors?.slider_image) && <span style={{ color: 'red' }}>{errors?.slider_image}</span>}
              {initialData?.slider_image_url && <a
                href={`${initialData?.slider_image_url}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00A895", textDecoration: "underline" }}
              >
                {t('View Uploaded image')}
              </a>}
            </div>
            <div className="col-md-12">
              <label className="form-label fs-7">{t('Slider Image(Ar)')}</label>
              <span className="text-danger">{!initialData && '*'}</span>
              <input
                type="file"
                className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                name="slider_image_ar"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  formik.setFieldValue('slider_image_ar', e.currentTarget.files[0]);
                  // Clear backend error for 'name' on user input
                  if (errors.slider_image_ar) {
                    setErrors(prev => ({ ...prev, slider_image_ar: undefined }));
                  }
                }}
              />
              {formik.touched.slider_image_ar && <span style={{ color: 'red' }} role="alert">{formik.errors.slider_image_ar}</span>}
              {(!formik.errors.slider_image_ar && errors?.slider_image_ar) && <span style={{ color: 'red' }}>{errors?.slider_image_ar}</span>}
              {initialData?.slider_image_ar && <a
                href={`${process.env.REACT_APP_IMG_URL}${initialData?.slider_image_ar}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00A895", textDecoration: "underline" }}
              >
                {t('View Uploaded image')}
              </a>}
            </div>
          </div>

          <div className="modal-footer mt-3">
            <button type="button" className="btn btn-md btn-light" onClick={onClose}>
              {t('Close')}
            </button>
            <button type="submit" onClick={()=>setIsSubmitted(true)} className="btn btn-primary ms-3" style={{ minWidth: "100px" }} disabled={loading}>
              {loading ? <ClipLoader color='white' size={18} /> : initialData ? t('Update') : t('Add')}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSlider;
