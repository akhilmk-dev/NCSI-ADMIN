import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreateEvent = ({ visible, handleClose, initialData = '', onSubmit ,fieldErrors}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const SUPPORTED_FORMATS = ['application/pdf'];

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const formik = useFormik({
    initialValues: {
      title_en: initialData?.title_en || '',
      title_ar: initialData?.title_ar|| '',
      short_description_en: initialData?.short_description_en || '',
      short_description_ar: initialData?.short_description_ar || '',
      from_date: initialData?.from_date || '',
      to_date: initialData?.to_date || '',
      location_en: initialData?.location_en || '',
      location_ar: initialData?.location_ar || '',
      event_type_en: initialData?.event_type_en || '',
      event_type_ar: initialData?.event_type_ar || '',
      event_speaker_en: initialData?.event_speaker_en|| '',
      event_speaker_ar: initialData?.event_speaker_ar || '',
      event_pdf: null,
    },
    validationSchema: Yup.object({
      title_en: Yup.string().required('Title is required'),
      title_ar: Yup.string().required('Title in arabic is required'),
      short_description_en: Yup.string().required('Short description is required'),
      short_description_ar: Yup.string().required('Short description in arabic is required'),
      from_date: Yup.date()
        .required('From Date is required')
        .min(today, 'From Date cannot be in the past'),
      to_date: Yup.date()
        .required('To Date is required')
        .min(Yup.ref('from_date'), 'To Date must be after From Date'),
      location_en: Yup.string().required('Location is required'),
      location_ar: Yup.string().required('Location in arabic is required'),
      event_type_en: Yup.string().required('Event Type is required'),
      event_type_ar: Yup.string().required('Event Type arabic is required'),
      event_speaker_en: Yup.string().required('Event Speaker is required'),
      event_speaker_ar: Yup.string().required('Event speaker arabic is required'),
      event_pdf: initialData ? Yup.mixed().nullable()
      .test(
        'fileSize',
        'File size is too large, max 5MB',
        value => !value || (value && value.size <= FILE_SIZE)
      )
      .test(
        'fileFormat',
        'Unsupported Format, only PDF allowed',
        value => !value || (value && SUPPORTED_FORMATS.includes(value.type))
      ): Yup.mixed().nullable()
        .test(
          'fileSize',
          'File size is too large, max 5MB',
          value => !value || (value && value.size <= FILE_SIZE)
        )
        .test(
          'fileFormat',
          'Unsupported Format, only PDF allowed',
          value => !value || (value && SUPPORTED_FORMATS.includes(value.type))
        ).required("Event pdf is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      let base64Pdf = null;
    
      if (values.event_pdf) {
        base64Pdf = await toBase64(values.event_pdf);
      }
    
      const payload = {
        title_en: values.title_en,
        title_ar: values.title_ar,
        short_description_en: values.short_description_en,
        short_description_ar: values.short_description_ar,
        from_date: values.from_date,
        to_date: values.to_date,
        location_en: values.location_en,
        location_ar: values.location_ar,
        event_type_en: values.event_type_en,
        event_type_ar: values.event_type_ar,
        event_speaker_en: values.event_speaker_en,
        event_speaker_ar: values.event_speaker_ar,
        event_pdf: base64Pdf,
      };
    
      if (initialData) {
        onSubmit(payload, initialData.id, resetForm, handleClose);
      } else {
        onSubmit(payload, resetForm, handleClose);
      }
    }
    
  });
  
  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  useEffect(()=>{
    if(fieldErrors){
      formik.setErrors(fieldErrors)
    }
  },[fieldErrors])

  useEffect(() => {
    if (visible && initialData) {
      formik.setValues({
        title_en: initialData?.title_en || '',
        title_ar: initialData?.title_ar|| '',
        short_description_en: initialData?.short_description_en || '',
        short_description_ar: initialData?.short_description_ar || '',
        from_date: initialData?.from_date || '',
        to_date: initialData?.to_date || '',
        location_en: initialData?.location_en || '',
        location_ar: initialData?.location_ar || '',
        event_type_en: initialData?.event_type_en || '',
        event_type_ar: initialData?.event_type_ar || '',
        event_speaker_en: initialData?.event_speaker_en|| '',
        event_speaker_ar: initialData?.event_speaker_ar || '',
        event_pdf: null,
      });
    }
  }, [visible]);

  return (
    <Modal
      title={initialData ? "Edit Event" : "Create New Event"}
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={700}
      className="custom-modal-header p-0"
      maskClosable={false}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="row g-3">
          {[
            { name: 'title_en', label: 'Title',placeholder:"Enter the title" },
            { name: 'title_ar', label: 'Title(Ar)', placeholder:"Enter title in arabic"},
            { name: 'short_description_en', label: 'Short Description', isTextarea: true ,placeholder:"Enter short description"},
            { name: 'short_description_ar', label: 'Short Description(Ar)', isTextarea: true, placeholder:"Enter short description in arabic"},
            { name: 'from_date', label: 'From Date', type: 'datetime-local' },
            { name: 'to_date', label: 'To Date', type: 'datetime-local' },
            { name: 'location_en', label: 'Location',placeholder:"Enter the location" },
            { name: 'location_ar', label: 'Location(Ar)', placeholder:"Enter the location in arabic"},
            { name: 'event_type_en', label: 'Event Type',placeholder:"Enter event type" },
            { name: 'event_type_ar', label: 'Event Type(Ar)',placeholder:"Enter event type in arabic"},
            { name: 'event_speaker_en', label: 'Event Speaker',placeholder:"Enter speaker name" },
            { name: 'event_speaker_ar', label: 'Event Speaker(Ar)', placeholder:"Enter speaker name in arabic"}
          ].map(({ name, label, type = 'text', dir, isTextarea ,placeholder}) => (
            <div className="col-md-6" key={name}>
              <label className="form-label fs-7">
                {label} <span className="text-danger">*</span>
              </label>
              {isTextarea ? (
                <textarea
                  name={name}
                  dir={dir}
                  className="form-control"
                  rows={3}
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                  placeholder={placeholder}
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  dir={dir}
                  className="form-control"
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                  placeholder={placeholder}
                />
              )}
              <div className="text-danger">{formik.errors[name]||formik.errors[name]?.[0]}</div>
            </div>
          ))}

          {/* PDF Upload */}
          <div className="col-md-12">
            <label className="form-label fs-7">Event PDF</label> {!initialData && <span className="text-danger">*</span>}
            <input
              type="file"
              name="event_pdf"
              className="form-control"
              accept="application/pdf"
              onChange={(e) => {
                formik.setFieldValue('event_pdf', e.currentTarget.files[0]);
              }}
            />
            <div className="text-danger">{formik.errors.event_pdf || formik.errors.event_pdf?.[0]}</div>
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

export default CreateEvent;
