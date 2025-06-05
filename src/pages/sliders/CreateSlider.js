import React, { useEffect, useRef } from 'react';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreateSlider = ({ visible, handleClose, initialData = '', onSubmit ,fieldErrors}) => {
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
      alt_text: initialData?.alt_text || '',
      slider_image: null,
      slider_image_ar: null
    },
    validationSchema: Yup.object({
      link: Yup.string().url('Enter a valid URL').required('Link is required'),
      alt_text: Yup.string().required('Alt text is required'),
      ...(initialData ? {} : {
        slider_image: Yup.mixed().required('Image is required'),
      }),
      ...(initialData ? {} : {
        slider_image_ar: Yup.mixed().required('The slider image ar field is required.'),
      })
    }),
    onSubmit: async (values,{resetForm}) => {
      let base64Image = null;
      let sliderImgAr=null

      if (values.slider_image) {
        base64Image = await toBase64(values.slider_image);
      }
      if(values?.slider_image_ar){
        sliderImgAr= await toBase64(values?.slider_image_ar)
      }

      const payload = {
        link: values.link,
        alt_text: values.alt_text,
        slider_image: base64Image,
        slider_image_ar:sliderImgAr
      };
      if(initialData){
        onSubmit(payload,initialData?.id,resetForm,handleClose)
      }else{
        onSubmit(payload,resetForm,handleClose);
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

  useEffect(()=>{
    if(fieldErrors){
      formik.setErrors(fieldErrors)
    }
  },[fieldErrors])

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
              <span style={{ color: 'red' }} role="alert">{formik.errors.link || formik.errors.link?.[0]}</span>
            </div>

            <div className="col-md-12">
              <label className="form-label fs-7">Alt Text</label><span className="text-danger">*</span>
              <input
                type="text"
                className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                placeholder="Enter alt text"
                name="alt_text"
                value={formik.values.alt_text}
                onChange={formik.handleChange}
              />
              <span style={{ color: 'red' }} role="alert">{formik.errors.alt_text || formik.errors.alt_text?.[0]}</span>
            </div>

            <div className="col-md-12">
              <label className="form-label fs-7">Slider Image</label>
              <span className="text-danger">{!initialData && '*'}</span>
              <input
                type="file"
                className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                name="slider_image"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  formik.setFieldValue('slider_image', e.currentTarget.files[0]);
                }}
              />
              <span style={{ color: 'red' }} role="alert">{formik.errors.slider_image || formik.errors.slider_image?.[0]}</span>
            </div>
            <div className="col-md-12">
              <label className="form-label fs-7">Slider Image(Ar)</label>
              <span className="text-danger">{!initialData && '*'}</span>
              <input
                type="file"
                className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                name="slider_image_ar"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  formik.setFieldValue('slider_image_ar', e.currentTarget.files[0]);
                }}
              />
              <span style={{ color: 'red' }} role="alert">{formik.errors.slider_image_ar || formik.errors.slider_image_ar?.[0]}</span>
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
