import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreateEvent = ({ visible, handleClose, initialData = '', onSubmit }) => {
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
      title: initialData?.title || '',
      titleAr: initialData?.titleAr || '',
      shortDescription: initialData?.shortDescription || '',
      shortDescriptionAr: initialData?.shortDescriptionAr || '',
      fromDate: initialData?.fromDate || '',
      toDate: initialData?.toDate || '',
      location: initialData?.location || '',
      locationAr: initialData?.locationAr || '',
      eventType: initialData?.eventType || '',
      eventTypeAr: initialData?.eventTypeAr || '',
      eventSpeaker: initialData?.eventSpeaker || '',
      eventSpeakerAr: initialData?.eventSpeakerAr || '',
      eventPdf: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      titleAr: Yup.string().required('Title in arabic is required'),
      shortDescription: Yup.string().required('Short description is required'),
      shortDescriptionAr: Yup.string().required('Short description in arabic is required'),
      fromDate: Yup.date()
        .required('From Date is required')
        .min(today, 'From Date cannot be in the past'),
      toDate: Yup.date()
        .required('To Date is required')
        .min(Yup.ref('fromDate'), 'To Date must be after From Date'),
      location: Yup.string().required('Location is required'),
      locationAr: Yup.string().required('Location in arabic is required'),
      eventType: Yup.string().required('Event Type is required'),
      eventTypeAr: Yup.string().required('Event Type arabic is required'),
      eventSpeaker: Yup.string().required('Event Speaker is required'),
      eventSpeakerAr: Yup.string().required('Event speaker arabic is required'),
      eventPdf: initialData ?Yup.mixed().nullable()
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
    onSubmit: async (values) => {
      let base64Pdf = null;

      if (values.eventPdf) {
        base64Pdf = await toBase64(values.eventPdf);
      }

      const payload = {
        eventId: initialData?.eventId || null,
        title: values.title,
        titleAr: values.titleAr,
        shortDescription: values.shortDescription,
        shortDescriptionAr: values.shortDescriptionAr,
        fromDate: values.fromDate,
        toDate: values.toDate,
        location: values.location,
        locationAr: values.locationAr,
        eventType: values.eventType,
        eventTypeAr: values.eventTypeAr,
        eventSpeaker: values.eventSpeaker,
        eventSpeakerAr: values.eventSpeakerAr,
        eventPdfBase64: base64Pdf,
      };

      onSubmit(payload);
      onClose();
    },
  });

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  useEffect(() => {
    if (visible && initialData) {
      formik.setValues({
        title: initialData.title || '',
        titleAr: initialData.titleAr || '',
        shortDescription: initialData.shortDescription || '',
        shortDescriptionAr: initialData.shortDescriptionAr || '',
        fromDate: initialData.fromDate || '',
        toDate: initialData.toDate || '',
        location: initialData.location || '',
        locationAr: initialData.locationAr || '',
        eventType: initialData.eventType || '',
        eventTypeAr: initialData.eventTypeAr || '',
        eventSpeaker: initialData.eventSpeaker || '',
        eventSpeakerAr: initialData.eventSpeakerAr || '',
        eventPdf: null,
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
            { name: 'title', label: 'Title' },
            { name: 'titleAr', label: 'Title(Ar)'},
            { name: 'shortDescription', label: 'Short Description', isTextarea: true },
            { name: 'shortDescriptionAr', label: 'Short Description(Ar)', isTextarea: true},
            { name: 'fromDate', label: 'From Date', type: 'datetime-local' },
            { name: 'toDate', label: 'To Date', type: 'datetime-local' },
            { name: 'location', label: 'Location' },
            { name: 'locationAr', label: 'Location(Ar)'},
            { name: 'eventType', label: 'Event Type' },
            { name: 'eventTypeAr', label: 'Event Type(Ar)'},
            { name: 'eventSpeaker', label: 'Event Speaker' },
            { name: 'eventSpeakerAr', label: 'Event Speaker(Ar)'}
          ].map(({ name, label, type = 'text', dir, isTextarea }) => (
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
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  dir={dir}
                  className="form-control"
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                />
              )}
              <div className="text-danger">{formik.errors[name]}</div>
            </div>
          ))}

          {/* PDF Upload */}
          <div className="col-md-12">
            <label className="form-label fs-7">Event PDF</label> {!initialData && <span className="text-danger">*</span>}
            <input
              type="file"
              name="eventPdf"
              className="form-control"
              accept="application/pdf"
              onChange={(e) => {
                formik.setFieldValue('eventPdf', e.currentTarget.files[0]);
              }}
            />
            <div className="text-danger">{formik.errors.eventPdf}</div>
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
