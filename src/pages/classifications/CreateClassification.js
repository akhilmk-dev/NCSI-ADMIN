import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import { showError } from 'helpers/notification_helper';

const CreateClassification = ({ visible, handleClose, initialData = '', onSubmit, fieldErrors, loading }) => {
    const { t } = useTranslation();
    const [errors, setErrors] = useState();
    const [isSubmitted,setIsSubmitted]= useState(false);
    const formik = useFormik({
        initialValues: {
            name: initialData?.name || '',
            name_ar: initialData?.name_ar || ""
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Name is required'),
            name_ar: Yup.string()
                .required('Name in arabic is required')
        }),
        onSubmit: (values, { resetForm }) => {
            if (initialData?.name) {
                onSubmit({
                    name: values?.name,
                    name_ar: values?.name_ar
                }, initialData?.id, resetForm, handleClose);

            } else {
                onSubmit({
                    name: values?.name,
                    name_ar: values?.name_ar
                }, resetForm, handleClose);
            }
        },
    });

    const onClose = () => {
        formik.resetForm();
        handleClose();
    };

    useEffect(() => {
        if (initialData?.name) {
            formik.setFieldValue('name', initialData?.name);
            formik.setFieldValue('name_ar', initialData?.name_ar)
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
            title={initialData ? t("Edit Classification") : t("Create New Classification")}
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
                <div role="document">
                    <div>
                        <div className="row g-3">
                            <div className="col-md-12">
                                <label className="form-label fs-7">{t('Classification Name')}</label><span className='text-danger'>*</span>
                                <input
                                    type="text"
                                    className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                                    placeholder={t("Enter classification name")}
                                    name="name"
                                    value={formik.values.name}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        // Clear backend error for 'name' on user input
                                        if (errors.name) {
                                            setErrors(prev => ({ ...prev, name: undefined }));
                                        }
                                    }}
                                />
                                {formik.touched.name && <span style={{ color: 'red' }} role="alert">{formik.errors.name}</span>}
                                {(!formik.errors.name && errors?.name) && <span style={{ color: 'red' }}>{errors?.name}</span>}
                            </div>
                        </div>
                        <div className="row g-3" style={{ marginTop: "1px" }}>
                            <div className="col-md-12">
                                <label className="form-label fs-7">{t('Classification Name(Ar)')}</label><span className='text-danger'>*</span>
                                <input
                                    type="text"
                                    className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                                    placeholder={t("Enter classification name in arabic")}
                                    name="name_ar"
                                    value={formik.values.name_ar}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        // Clear backend error for 'name' on user input
                                        if (errors.name_ar) {
                                            setErrors(prev => ({ ...prev, name_ar: undefined }));
                                        }
                                    }}
                                />
                                {formik.touched.name_ar && <span style={{ color: 'red' }} role="alert">{formik.errors.name_ar}</span>}
                                {(!formik.errors.name_ar && errors?.name_ar) && <span style={{ color: 'red' }}>{errors?.name_ar}</span>}
                            </div>
                        </div>
                        <div className="modal-footer mt-3">
                            <button type="button" className="btn btn-md btn-light" onClick={handleClose}>
                                {t('Close')}
                            </button>
                            <button type="submit"  className="btn btn-primary ms-3" style={{ minWidth: "100px" }} disabled={loading}>
                                {loading ? <ClipLoader color="white" size={18} /> : initialData ? t("Update") : t("Add")}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

// Uncomment and adjust PropTypes as needed
// CreateClassification.propTypes = {
//     visible: PropTypes.bool.isRequired,
//     handleClose: PropTypes.func.isRequired,
//     initialData: PropTypes.object,
//     onSubmit: PropTypes.func.isRequired,
// };

export default CreateClassification;
