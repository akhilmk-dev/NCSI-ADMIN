import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreateIndicator = ({ visible, handleClose, initialData = {}, onSubmit, fieldErrors }) => {
    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
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
            file: null,
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
            indicator_next_release_date: Yup.date().required('Next release date is required'),
            file: initialData ? Yup.mixed().nullable() : Yup.mixed().required('File is required'),
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
                onSubmit(formData, initialData.id, resetForm, handleClose);
            } else {
                onSubmit(formData, resetForm, handleClose);
            }
        },
    });

    const onClose = () => {
        formik.resetForm();
        handleClose();
    };

    useEffect(() => {
        if (fieldErrors) {
            formik.setErrors(fieldErrors);
        }
    }, [fieldErrors]);


    useEffect(() => {
        if (initialData && visible) {
            formik.setValues({
                indicator_value: initialData?.indicator_value || '',
                indicator_value_unit_en: initialData?.indicator_value_unit_en || '',
                indicator_value_unit_ar: initialData?.indicator_value_unit_ar || '',
                indicator_title_en: initialData?.indicator_title_en || '',
                indicator_title_ar: initialData?.indicator_title_ar || '',
                indicator_sub_title_en: initialData?.indicator_sub_title_en || '',
                indicator_sub_title_ar: initialData?.indicator_sub_title_ar || '',
                indicator_date: initialData?.indicator_date ? new Date(initialData?.indicator_next_release_date).toISOString().split('T')[0] : '',
                indicator_next_release_date: initialData?.indicator_next_release_date ? new Date(initialData?.indicator_next_release_date).toISOString().split('T')[0] : '',
                file: null,
            })
        }
    }, [visible])

    return (
        <Modal
            title={initialData?.id ? "Edit Indicator" : "Create New Indicator"}
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
                        <label className="form-label">Indicator Value</label><span className="text-danger">*</span>
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
                        <label className="form-label">Value Unit (EN)</label><span className="text-danger">*</span>
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
                        <label className="form-label">Value Unit (AR)</label><span className="text-danger">*</span>
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
                        <label className="form-label">Title (EN)</label><span className="text-danger">*</span>
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
                        <label className="form-label">Title (AR)</label><span className="text-danger">*</span>
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
                        <label className="form-label">Subtitle (EN)</label><span className="text-danger">*</span>
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
                        <label className="form-label">Subtitle (AR)</label><span className="text-danger">*</span>
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
                        <label className="form-label">Indicator Date</label><span className="text-danger">*</span>
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
                        <label className="form-label">Next Release Date</label><span className="text-danger">*</span>
                        <input
                            type="date"
                            name="indicator_next_release_date"
                            className="form-control"
                            value={formik.values.indicator_next_release_date}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.indicator_next_release_date && <span className="text-danger">{formik.errors.indicator_next_release_date || formik.errors.indicator_next_release_date?.[0]}</span>}
                    </div>
                    <div className="col-md-12">
                        <label className="form-label">Upload File (PDF)</label>{!initialData && <span className="text-danger">*</span>}
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
                        {initialData?.file_url && <a
                            href={initialData?.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#00A895", textDecoration: "underline" }}
                        >
                            View Uploaded File
                        </a>}
                    </div>
                </div>

                <div className="modal-footer mt-4">
                    <button type="button" className="btn btn-light" onClick={onClose}>Close</button>
                    <button type="submit" className="btn btn-primary ms-3">
                        {initialData?.id ? "Update" : "Add"}
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
