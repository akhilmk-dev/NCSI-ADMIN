import React, { useEffect, useState } from 'react';
import Select from "react-select";

import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import { GoogleMap, LoadScript, Autocomplete, Marker, LoadScriptNext } from '@react-google-maps/api';
import { showError } from 'helpers/notification_helper';


const containerStyle = {
  width: '100%',
  height: '250px'
};

const defaultCenter = {
  lat: 23.588,
  lng: 58.3829
};

const CreateEvent = ({ visible, handleClose, initialData = '', onSubmit, fieldErrors, loading }) => {
  const { t } = useTranslation();
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [embedUrl, setEmbedUrl] = useState('');
  const [autocompleteInputValue, setAutocompleteInputValue] = useState("");
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const FILE_SIZE = 20 * 1024 * 1024; // 20MB

  const SUPPORTED_FORMATS = ['application/pdf'];
  const SUPPORTED_IMAGE_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setSelectedPosition({ lat, lng });
        setMapCenter({ lat, lng });
        const embedString = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
        setEmbedUrl(embedString);
      }
    }
  };

  const eventTypeOptionsEN = [
    { value: "Public Event", label: "Public Event" },
    { value: "Private Event", label: "Private Event" },
    { value: "Other", label: "Other" },
  ];

  const eventTypeOptionsAR = [
    { value: "حدث عام", label: "حدث عام" },
    { value: "حدث خاص", label: "حدث خاص" },
    { value: "اخرى", label: "اخرى" },
  ];


  const formik = useFormik({
    initialValues: {
      title_en: initialData?.title_en || '',
      title_ar: initialData?.title_ar || '',
      short_description_en: initialData?.short_description_en || '',
      short_description_ar: initialData?.short_description_ar || '',
      from_date: initialData?.from_date || '',
      to_date: initialData?.to_date || '',
      location_en: initialData?.location_en || '',
      location_ar: initialData?.location_ar || '',
      event_type_en: initialData?.event_type_en || '',
      event_type_ar: initialData?.event_type_ar || '',
      event_speaker_en: initialData?.event_speaker_en || '',
      event_speaker_ar: initialData?.event_speaker_ar || '',
      event_pdf: null,
      event_pdf_ar: null,
      event_image: null,
      location_map: initialData?.location_map || "",
      event_status: initialData?.event_status || ""
    },
    validationSchema: Yup.object({
      title_en: Yup.string().required('Title is required'),
      title_ar: Yup.string().required('Title in arabic is required'),
      short_description_en: Yup.string().required('Short description is required'),
      short_description_ar: Yup.string().required('Short description in arabic is required'),
      from_date: Yup.date()
        .required('From Date is required'),
      // .min(today, 'From Date cannot be in the past'),
      to_date: Yup.date()
      .required("To Date is required")
      .min(
        Yup.ref("from_date"),
        "To Date must be after From Date"
      ),
      location_en: Yup.string(),
      location_ar: Yup.string(),
      event_type_en: Yup.string(),
      event_type_ar: Yup.string(),
      event_speaker_en: Yup.string(),
      event_speaker_ar: Yup.string(),
      event_pdf: initialData ? Yup.mixed().nullable()
        .test(
          'fileSize',
          'File size is too large, max 20MB',
          value => !value || (value && value.size <= FILE_SIZE)
        )
        .test(
          'fileFormat',
          'Unsupported Format, only PDF allowed',
          value => !value || (value && SUPPORTED_FORMATS.includes(value.type))
        ) : Yup.mixed().nullable()
          .test(
            'fileSize',
            'File size is too large, max 20MB',
            value => !value || (value && value.size <= FILE_SIZE)
          )
          .test(
            'fileFormat',
            'Unsupported Format, only PDF allowed',
            value => !value || (value && SUPPORTED_FORMATS.includes(value.type))
          ),

      event_pdf_ar: Yup.mixed().nullable()
        .test(
          'fileSize',
          'File size is too large, max 20MB',
          value => !value || (value && value.size <= FILE_SIZE)
        )
        .test(
          'fileFormat',
          'Unsupported Format, only PDF allowed',
          value => !value || (value && SUPPORTED_FORMATS.includes(value.type))
        ),
      event_image: initialData ? Yup.mixed()
        .nullable()
        .test("fileSize", "File size is too large, max 20MB", (value) => {
          if (!value || typeof value === "string") return true;
          return value.size <= FILE_SIZE;
        })
        .test("fileFormat", "Unsupported Format, only JPG/PNG allowed", (value) => {
          if (!value || typeof value === "string") return true;
          return SUPPORTED_IMAGE_FORMATS.includes(value.type);
        }) : Yup.mixed()
          .nullable()
          .test("fileSize", "File size is too large, max 20MB", (value) => {
            if (!value || typeof value === "string") return true;
            return value.size <= FILE_SIZE;
          })
          .test("fileFormat", "Unsupported Format, only JPG/PNG allowed", (value) => {
            if (!value || typeof value === "string") return true;
            return SUPPORTED_IMAGE_FORMATS.includes(value.type);
          }).required("Cover image is required"),
      location_map: Yup.string(),
      event_status: Yup.string()
    }),
    onSubmit: async (values, { resetForm }) => {

      let base64Pdf = null;
      let base64pdfAr = null;
      let base64CoverImg = null;

      if (values.event_pdf) {
        base64Pdf = await toBase64(values.event_pdf);
      }
      if (values.event_pdf_ar) {
        base64pdfAr = await toBase64(values.event_pdf_ar)
      }
      if (values?.event_image) {
        base64CoverImg = await toBase64(values.event_image);
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
        event_pdf_ar: base64pdfAr,
        event_image: base64CoverImg,
        location_map: values?.location_map,
        event_status: values?.event_status
      };

      if (initialData) {
        onSubmit(payload, initialData.id, resetForm, onClose);
      } else {
        onSubmit(payload, resetForm, onClose);
      }
    }

  });

  useEffect(() => {
    if (embedUrl) {
      formik.setFieldValue('location_map', embedUrl);
    }
  }, [embedUrl])

  const reverseGeocode = (lat, lng, setInputValue) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setInputValue(results[0].formatted_address); // Set input value
      } else {
        console.error('Reverse geocoding failed:', status);
      }
    });
  };

  useEffect(() => {
    if (Object.keys(formik.errors).length !== 0 && isSubmitted) {
      showError("Validation Error")
      setIsSubmitted(false)
    }
  }, [formik.errors, isSubmitted])

  useEffect(() => {
    if (initialData?.location_map) {
      // Example embedUrl: "https://www.google.com/maps?q=12.9716,77.5946&z=15&output=embed"
      setEmbedUrl(initialData?.location_map)
      const match = initialData?.location_map.match(/q=([-.\d]+),([-.\d]+)/);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        const location = { lat, lng };
        setMapCenter(location);
        setSelectedPosition(location);
        if (window.google) {
          reverseGeocode(location.lat, location.lng, setAutocompleteInputValue);
        }
      }
    }
  }, [initialData, mapsApiLoaded]);

  const onClose = () => {
    formik.resetForm();
    setSelectedPosition(null);
    setAutocompleteInputValue(null);
    setEmbedUrl("")
    handleClose();
  };

  useEffect(() => {
    if (fieldErrors) {
      formik.setErrors(fieldErrors)
    }
  }, [fieldErrors])

  useEffect(() => {
    if (visible && initialData) {
      formik.setValues({
        title_en: initialData?.title_en || '',
        title_ar: initialData?.title_ar || '',
        short_description_en: initialData?.short_description_en || '',
        short_description_ar: initialData?.short_description_ar || '',
        from_date: initialData?.from_date || '',
        to_date: initialData?.to_date || '',
        location_en: initialData?.location_en || '',
        location_ar: initialData?.location_ar || '',
        event_type_en: initialData?.event_type_en || '',
        event_type_ar: initialData?.event_type_ar || '',
        event_speaker_en: initialData?.event_speaker_en || '',
        event_speaker_ar: initialData?.event_speaker_ar || '',
        event_pdf: null,
        event_pdf_ar: null,
        event_image: null,
        location_map: initialData?.location_map || "",
        event_status: initialData?.event_status || ""
      });
    }
  }, [visible]);

  const notRequired =["event_speaker_en","event_speaker_ar","event_type_en","event_type_ar","location_en","location_ar"]

  return (
    <Modal
      title={initialData ? t("Edit Event") : t("Create New Event")}
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={700}
      className="custom-modal-header p-0 my-5"
      maskClosable={false}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="row g-3">
          {[
            { name: 'title_en', label: 'Title', placeholder: "Enter the title" },
            { name: 'title_ar', label: 'Title(Ar)', placeholder: "Enter title in arabic" },
            { name: 'short_description_en', label: 'Short Description', isTextarea: true, placeholder: "Enter short description" },
            { name: 'short_description_ar', label: 'Short Description(Ar)', isTextarea: true, placeholder: "Enter short description in arabic" },
            { name: 'from_date', label: 'From Date', type: 'datetime-local' },
            { name: 'to_date', label: 'To Date', type: 'datetime-local' },
            { name: 'location_en', label: 'Location', placeholder: "Enter the location" },
            { name: 'location_ar', label: 'Location(Ar)', placeholder: "Enter the location in arabic" },
            // { name: 'event_type_en', label: 'Event Type', placeholder: "Enter event type" },
            // { name: 'event_type_ar', label: 'Event Type(Ar)', placeholder: "Enter event type in arabic" },
            { name: 'event_speaker_en', label: 'Event Speaker', placeholder: "Enter speaker name" },
            { name: 'event_speaker_ar', label: 'Event Speaker(Ar)', placeholder: "Enter speaker name in arabic" }
          ].map(({ name, label, type = 'text', dir, isTextarea, placeholder }) => (
            <div className="col-md-6" key={name}>
              <label className="form-label fs-7">
                {t(label)} {(!notRequired?.includes(name)) && <span className="text-danger">*</span>}
              </label>
              {isTextarea ? (
                <textarea
                  name={name}
                  dir={dir}
                  className="form-control"
                  rows={3}
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                  placeholder={t(placeholder)}
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  dir={dir}
                  className="form-control"
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                  placeholder={t(placeholder)}
                />
              )}
              {formik.touched[name] && <div className="text-danger">{formik.errors[name] || formik.errors[name]?.[0]}</div>}
            </div>
          ))}

          {/* Event Type (English) */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              {t("Event Type")}
            </label>
            <Select
              name="event_type_en"
              options={eventTypeOptionsEN}
              isClearable
              value={eventTypeOptionsEN.find(
                (option) => option.value === formik.values.event_type_en
              )}
              onChange={(option) =>
                formik.setFieldValue("event_type_en", option ? option.value : "")
              }
              placeholder="Select event type"
            />
            {formik.touched.event_type_en && (
              <div className="text-danger">{formik.errors.event_type_en}</div>
            )}
          </div>

          {/* Event Type (Arabic) */}
          <div className="col-md-6">
            <label className="form-label fs-7">
              {t("Event Type (Ar)")}
            </label>
            <Select
              name="event_type_ar"
              options={eventTypeOptionsAR}
              isClearable
              isRtl
              classNamePrefix="react-select"
              value={eventTypeOptionsAR.find(
                (option) => option.value === formik.values.event_type_ar
              )}
              onChange={(option) =>
                formik.setFieldValue("event_type_ar", option ? option.value : "")
              }
              placeholder="اختر نوع الحدث"
            />
            {formik.touched.event_type_ar && (
              <div className="text-danger">{formik.errors.event_type_ar}</div>
            )}
          </div>

          {/* PDF Upload */}
          <div className="col-md-6">
            <label className="form-label fs-7">{t('Event PDF')}</label> 
            <input
              type="file"
              name="event_pdf"
              className="form-control"
              accept="application/pdf"
              onChange={(e) => {
                formik.setFieldValue('event_pdf', e.currentTarget.files[0]);
              }}
            />
            {formik.touched.event_pdf && <div className="text-danger">{formik.errors.event_pdf || formik.errors.event_pdf?.[0]}</div>}
            {initialData?.pdf_url && <a
              href={initialData?.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00A895", textDecoration: "underline" }}
            >
              {t('View Uploaded File')}
            </a>}
          </div>
          <div className="col-md-6">
            <label className="form-label fs-7">{t('Event PDF(Ar)')}</label>
            <input
              type="file"
              name="event_pdf_ar"
              className="form-control"
              accept="application/pdf"
              onChange={(e) => {
                formik.setFieldValue('event_pdf_ar', e.currentTarget.files[0]);
              }}
            />
            {formik.touched.event_pdf_ar && <div className="text-danger">{formik.errors.event_pdf_ar || formik.errors.event_pdf_ar?.[0]}</div>}
            {initialData?.pdf_url_ar && <a
              href={initialData?.pdf_url_ar}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00A895", textDecoration: "underline" }}
            >
              {t('View Uploaded File')}
            </a>}
          </div>
          <div className="col-md-6">
            <label className="form-label fs-7">{t('Event Image')}</label>{!initialData && <span className="text-danger">*</span>}
            <input
              type="file"
              name="event_image"
              className="form-control"
              accept="image/jpeg,image/png,image/jpg"
              onChange={(e) => {
                formik.setFieldValue('event_image', e.currentTarget.files[0]);
              }}
            />

            <small className="text-muted d-block mt-1">
              Recommended image size: <strong>1640 × 561 pixels</strong> for best display quality.
            </small>

            {formik.touched.event_image && <div className="text-danger">{formik.errors.event_image || formik.errors.event_image?.[0]}</div>}
            {initialData?.img_url && <a
              href={initialData?.img_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00A895", textDecoration: "underline" }}
            >
              {t('View Uploaded File')}
            </a>}
          </div>
          <div className='col-md-6'>
            <label className="form-label fs-7">
              Event Status
            </label>
            <input
              name="event_status"
              className="form-control"
              value={formik.values?.event_status}
              onChange={formik.handleChange}
              placeholder="Enter event status"
            />
            {formik.touched.event_status && <div className="text-danger">{formik.errors.event_status || formik.errors.event_status?.[0]}</div>}

          </div>
          <div className='col-md-12'>
            <label className='form-label fs-7'>Event Location</label>{<span className="text-danger">*</span>}
            <LoadScriptNext
              googleMapsApiKey={'AIzaSyAmmm_0QjgFftYMNEkASc1M8fkS30mZUlU'}
              libraries={['places']}
              onLoad={() => setMapsApiLoaded(true)}

            >
              <Autocomplete
                onLoad={setAutocomplete}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  type="text"
                  placeholder="Search a location"
                  style={{ width: '100%', height: '40px', border: " 1px solid lightgray", padding: '8px' }}
                  value={autocompleteInputValue}
                  onChange={(e) => setAutocompleteInputValue(e.target.value)}
                />
              </Autocomplete>

              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={14}
                onClick={(e) => {
                  const lat = e.latLng.lat();
                  const lng = e.latLng.lng();
                  const position = { lat, lng };

                  setSelectedPosition(position);
                  setMapCenter(position); // Optional: recenter map
                  setEmbedUrl(`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`);
                  reverseGeocode(lat, lng, setAutocompleteInputValue); // Update input field
                }}
              >
                {selectedPosition && <Marker position={selectedPosition}
                  draggable={true}
                  onDragEnd={(e) => {
                    const newLat = e.latLng.lat();
                    const newLng = e.latLng.lng();
                    const newPos = { lat: newLat, lng: newLng };

                    setSelectedPosition(newPos);
                    setMapCenter(newPos);

                    const embedString = `https://www.google.com/maps?q=${newLat},${newLng}&z=15&output=embed`;
                    setEmbedUrl(embedString);
                    // Reverse geocode to get address
                    reverseGeocode(newLat, newLng, setAutocompleteInputValue);
                  }}
                />}
              </GoogleMap>
              {formik.touched.location_map && <div className="text-danger">{formik.errors.location_map || formik.errors.location_map?.[0]}</div>}
            </LoadScriptNext>
          </div>
        </div>

        <div className="modal-footer mt-4">
          <button type="button" className="btn btn-light" onClick={onClose}>
            {t('Close')}
          </button>
          <button type="submit" onClick={() => setIsSubmitted(true)} className="btn btn-primary ms-3" style={{ minWidth: "100px" }} disabled={loading}>
            {loading ? <ClipLoader color='white' size={18} /> : initialData ? t('Update') : t('Add')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEvent;
