import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import { Radio } from 'antd'
import { getPublications } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select'
import { showError } from 'helpers/notification_helper';

const CreateIndicator = ({ visible, handleClose, initialData = "", onSubmit, fieldErrors, loading }) => {
    const [fileOption, setFileOption] = React.useState('upload'); // 'upload' or 'publication'
    const [selectedPublication, setSelectedPublication] = React.useState(null);
    const [publicationFiles, setPublicationFiles] = React.useState([]);
    const [isSubmitted,setIsSubmitted]=useState(false);
    const publications = useSelector(state => state?.Publication.publications);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    const releaseTypeOptions = [
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Quarterly', value: 'Quarterly' }
    ];
    const monthOptions = [
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 },
    ];

const formik = useFormik({
        initialValues: {
            indicator_value: initialData?.indicator_value || '',
            indicator_value_unit_en: initialData?.indicator_value_unit_en || '',
            indicator_value_unit_ar: initialData?.indicator_value_unit_ar || '',
            indicator_title_en: initialData?.indicator_title_en || '',
            indicator_title_ar: initialData?.indicator_title_ar || '',
            indicator_sub_title_en: initialData?.indicator_sub_title_en || '',
            indicator_sub_title_ar: initialData?.indicator_sub_title_ar || '',
            indicator_date: initialData?.indicator_date || '',
            indicator_next_release_date: initialData?.indicator_next_release_date || '',
            release_type: initialData?.release_type || '',
            month_of_quarter: initialData?.month_of_quarter || '',
            file: null,
            pub_file:initialData?.pub_file || ""
        },
        validationSchema: Yup.object({
            indicator_value: Yup.number().required('Indicator value is required'),
            indicator_value_unit_en: Yup.string().required('Unit (EN) is required'),
            indicator_value_unit_ar: Yup.string().required('Unit (AR) is required'),
            indicator_title_en: Yup.string().required('Title (EN) is required'),
            indicator_title_ar: Yup.string().required('Title (AR) is required'),
            indicator_sub_title_en: Yup.string().required('Subtitle (EN) is required'),
            indicator_sub_title_ar: Yup.string().required('Subtitle (AR) is required'),
            indicator_date: Yup.date().required('Indicator date is required'),
            indicator_next_release_date: Yup.number()
            .typeError('Next release date must be a number')   
            .integer('Must be an integer')                     // ensures no decimals
            .min(1, 'Must be at least 1')                      // minimum valid day
            .max(31, 'Cannot be more than 31')                 // maximum valid day
            .required('Next release date is required'),        // field is required
            release_type: Yup.string().required('Release type is required'),
            month_of_quarter: Yup.number(),
            file:Yup.mixed().nullable(),
        }),
        onSubmit: async (values, { resetForm }) => {
            let base64data = null
            if (values?.file) {
                base64data = await toBase64(values?.file)
            }
            const formData = {
                ...values,
                file: base64data,
            }

            if (initialData?.id) {
                onSubmit(formData, initialData.id, resetForm, onClose);
            } else {
                onSubmit(formData, resetForm, onClose);
            }
        },
    });

    useEffect(() => {
        if (initialData && visible) {
            console.log(initialData)
            // Update formik values correctly, making sure to handle pub_file
            formik.setValues({
                indicator_value: initialData?.indicator_value || '',
                indicator_value_unit_en: initialData?.indicator_value_unit_en || '',
                indicator_value_unit_ar: initialData?.indicator_value_unit_ar || '',
                indicator_title_en: initialData?.indicator_title_en || '',
                indicator_title_ar: initialData?.indicator_title_ar || '',
                indicator_sub_title_en: initialData?.indicator_sub_title_en || '',
                indicator_sub_title_ar: initialData?.indicator_sub_title_ar || '',
                indicator_date: initialData?.indicator_date
                    ? new Date(initialData?.indicator_date).toLocaleDateString('en-CA')
                    : '',
                pub_file: initialData?.pub_file || null,
                indicator_next_release_date: initialData?.indicator_next_release_date || '',
                release_type: initialData?.release_type || '',
                month_of_quarter: initialData?.month_of_quarter || '',
                file: null, // Reset file, it might be changed in the UI
               // Ensure pub_file is correctly passed here
            });
        }
    }, [visible, initialData]);

    const onClose = () => {
        formik.resetForm();
        setPublicationFiles([])
        setFileOption('upload')
        setSelectedPublication("")
        handleClose();
    };

    useEffect(() => {
        if (fieldErrors) {
            formik.setErrors(fieldErrors);
        }
    }, [fieldErrors]);

    useEffect(()=>{
        if (Object.keys(formik.errors).length !== 0 && isSubmitted){
            showError("Validation Error")
            setIsSubmitted(false)
        }
    },[formik.errors,isSubmitted])
     
    useEffect(()=>{
        dispatch(getPublications())
    },[])

    useEffect(()=>{
        if(selectedPublication){
            const files = publications?.data?.publications?.filter(item=>item?.id == selectedPublication?.value);
            setPublicationFiles([{name:files[0]?.pdf_file,fileUrl:files[0]?.pdf_file_url},{name:files[0]?.pdf_file_ar,fileUrl:files[0]?.pdf_file_url_ar}])
        }
    },[selectedPublication])

    return (
        <Modal
            title={initialData?.id ? t("Edit Indicator") : t("Create New Indicator")}
            visible={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            centered
            width={700}
            className="custom-modal-header p-0"
            maskClosable={false}
        >
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">{t('Indicator Value')}</label><span className="text-danger">*</span>
                        <input
                            type="number"
                            name="indicator_value"
                            className="form-control"
                            value={formik.values.indicator_value}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.indicator_value && <span className="text-danger">{formik.errors.indicator_value || formik.errors.indicator_value?.[0]}</span>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">{t('Value Unit (EN)')}</label><span className="text-danger">*</span>
                        <input
                            type="text"
                            name="indicator_value_unit_en"
                            className="form-control"
                            value={formik.values.indicator_value_unit_en}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.indicator_value_unit_en && <span className="text-danger">{formik.errors.indicator_value_unit_en || formik.errors.indicator_value_unit_en?.[0]}</span>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">{t('Value Unit (AR)')}</label><span className="text-danger">*</span>
                        <input
                            type="text"
                            name="indicator_value_unit_ar"
                            className="form-control"
                            value={formik.values.indicator_value_unit_ar}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.indicator_value_unit_ar && <span className="text-danger">{formik.errors.indicator_value_unit_ar || formik.errors.indicator_value_unit_ar?.[0]}</span>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">{t('Title (EN)')}</label><span className="text-danger">*</span>
                        <input
                            type="text"
                            name="indicator_title_en"
                            className="form-control"
                            value={formik.values.indicator_title_en}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.indicator_title_en && <span className="text-danger">{formik.errors.indicator_title_en || formik.errors.indicator_title_en?.[0]}</span>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">{t('Title (AR)')}</label><span className="text-danger">*</span>
                        <input
                            type="text"
                            name="indicator_title_ar"
                            className="form-control"
                            value={formik.values.indicator_title_ar}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.indicator_title_ar && <span className="text-danger">{formik.errors.indicator_title_ar || formik.errors.indicator_title_ar?.[0]}</span>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">{t('Subtitle (EN)')}</label><span className="text-danger">*</span>
                        <input
                            type="text"
                            name="indicator_sub_title_en"
                            className="form-control"
                            value={formik.values.indicator_sub_title_en}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.indicator_sub_title_en && <span className="text-danger">{formik.errors.indicator_sub_title_en || formik.errors.indicator_sub_title_en?.[0]}</span>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">{t('Subtitle (AR)')}</label><span className="text-danger">*</span>
                        <input
                            type="text"
                            name="indicator_sub_title_ar"
                            className="form-control"
                            value={formik.values.indicator_sub_title_ar}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.indicator_sub_title_ar && <span className="text-danger">{formik.errors.indicator_sub_title_ar || formik.errors.indicator_sub_title_ar?.[0]}</span>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">{t('Indicator Date')}</label><span className="text-danger">*</span>
                        <input
                            type="date"
                            name="indicator_date"
                            className="form-control"
                            value={formik.values.indicator_date}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.indicator_date && <span className="text-danger">{formik.errors.indicator_date || formik.errors.indicator_date?.[0]}</span>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">{t('Next Release Date')}</label><span className="text-danger">*</span>
                        <input
                            type="text"
                            name="indicator_next_release_date"
                            className="form-control"
                            value={formik.values.indicator_next_release_date}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.indicator_next_release_date && <span className="text-danger">{formik.errors.indicator_next_release_date || formik.errors.indicator_next_release_date?.[0]}</span>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">{t('Release Type')}</label><span className="text-danger">*</span>
                        <Select
                            name="release_type"
                            options={releaseTypeOptions}
                            value={releaseTypeOptions.find(option => option.value === formik.values.release_type) || null}
                            onChange={option => formik.setFieldValue('release_type', option.value)}
                            onBlur={() => formik.setFieldTouched('release_type', true)}
                            placeholder={t('Select Release Type')}
                        />
                        {formik.touched.release_type && <span className="text-danger">{formik.errors.release_type}</span>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">{t('Month of Quarter')}</label>
                        <Select
                            name="month_of_quarter"
                            options={monthOptions}
                            value={monthOptions.find(option => option.value == formik.values.month_of_quarter) || ""}
                            onChange={option => formik.setFieldValue('month_of_quarter', option?.value || "")}
                            onBlur={() => formik.setFieldTouched('month_of_quarter', true)}
                            placeholder={t('Select Month')}
                            isClearable={true}
                        />
                        {formik.touched.month_of_quarter && <span className="text-danger">{formik.errors.month_of_quarter}</span>}
                    </div>
                    <div className="col-md-12">
                        <label className="form-label">{t('File Source')}</label>
                        <Radio.Group
                            onChange={(e) => {
                                setFileOption(e.target.value);
                                formik.setFieldValue("file", null); // Reset file
                                formik.setFieldValue("publication_pdf", null); // Reset publication file
                            }}
                            value={fileOption}
                            className="mb-3 d-flex gap-3"
                        >
                            <Radio value="upload">{t("Upload File")}</Radio>
                            <Radio value="publication">{t("Choose from Publications")}</Radio>
                        </Radio.Group>

                        {fileOption === 'upload' && (
                            <>
                                <label className="form-label">{t('Upload PDF')}</label>
                                <input
                                    type="file"
                                    name="file"
                                    accept=".pdf"
                                    className="form-control"
                                    onChange={(event) => {
                                        formik.setFieldValue('file', event.currentTarget.files[0]);
                                    }}
                                />
                                {formik.touched.file && <span className="text-danger">{formik.errors.file || formik.errors.file?.[0]}</span>}
                            </>
                        )}

                        {fileOption === 'publication' && (
                            <>
                                <label className="form-label">{t("Select Publication")}</label>
                                <Select
                                    options={publications?.data?.publications?.map(item=>({label:item?.title_en,value:item?.id}))}
                                    onChange={(option) => {
                                        setSelectedPublication(option);
                                        formik.setFieldValue("file", null);
                                    }}
                                    value={selectedPublication}
                                />
                                
                                {publicationFiles?.length > 0 && (
                                    <div className="mt-3">
                                        <label className="form-label">{t("Select a PDF")}</label> <br/>
                                        <Radio.Group
                                            onChange={(e) => {
                                                const fileUrl = e.target.value;
                                                formik.setFieldValue("pub_file", fileUrl); 
                                                
                                            }}
                                        >
                                            {publicationFiles.map((file, index) => (
                                                <>
                                                {file?.name && <div key={index} style={{ display: 'flex', alignItems: 'center',position:"relative", gap: '8px' }}>
                                                <Radio value={file?.name} >
                                                    {file?.name}&nbsp;
                                                    <span 
                                                  onClick={() => {
                                                    const selectedFile = publicationFiles?.find(item => item?.name === file?.name);
                                                    if (selectedFile?.fileUrl) {
                                                      window.open(selectedFile.fileUrl, "_blank");
                                                    }
                                                  }} 
                                                  style={{ position:"absolute" ,color: "blue", cursor: "pointer", textDecoration: "underline" }}
                                                >
                                                   View
                                                </span>
                                                </Radio>
                                                
                                              </div>}
                                              </>
                                            ))}
                                        </Radio.Group>
                                    </div>
                                )}
                            </>
                        )}

                        {(initialData?.file_url || initialData?.pub_file) && (
                            <a
                                href={initialData?.pub_file ? initialData?.pubfile_url:initialData?.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#00A895", textDecoration: "underline", display: "block", marginTop: "10px" }}
                            >
                                {t('View Uploaded File')}
                            </a>
                        )}
                    </div>

                </div>

                <div className="modal-footer mt-4">
                    <button type="button" className="btn btn-light" onClick={onClose}>Close</button>
                    <button type="submit" onClick={()=>setIsSubmitted(true)} className="btn btn-primary ms-3" style={{ minWidth: "100px" }} disabled={loading}>
                        {loading ? <ClipLoader color="white" size={18} /> : initialData?.id ? t("Update") : t("Add")}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

CreateIndicator.propTypes = {
    visible: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    fieldErrors: PropTypes.object
};

export default CreateIndicator;
