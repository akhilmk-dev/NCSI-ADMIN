import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreateClassification = ({ visible, handleClose, initialData = '', onSubmit,fieldErrors }) => {

    const formik = useFormik({
        initialValues: {
            name: initialData?.name || '',
            name_ar:initialData?.name_ar || ""
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Name is required'),
            name_ar:Yup.string()
            .required('Name in arabic is required')
        }),
        onSubmit: (values, { resetForm }) => {
            if (initialData?.name) {
                onSubmit({  
                    name: values?.name, 
                    name_ar:values?.name_ar
                },initialData?.id,resetForm,handleClose);
               
            } else {
                onSubmit({ 
                    name: values?.name ,
                    name_ar:values?.name_ar
                },resetForm,handleClose);
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
            formik.setFieldValue('name_ar',initialData?.name_ar)
        }
    }, [initialData]);

    useEffect(()=>{
        if(fieldErrors){
            formik.setErrors(fieldErrors)
        }
    },[fieldErrors])

    return (
        <Modal
            title={initialData ? "Edit Classification" : "Create New Classification"}
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
                                <label className="form-label fs-7">Classification Name</label><span className='text-danger'>*</span>
                                <input
                                    type="text"
                                    className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                                    placeholder="Enter classification name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.name && <span style={{ color: 'red' }} role="alert">{formik.errors.name || formik.errors.name?.[0]}</span>}
                            </div>
                        </div>
                        <div className="row g-3">
                            <div className="col-md-12">
                                <label className="form-label fs-7">Classification Name(Ar)</label><span className='text-danger'>*</span>
                                <input
                                    type="text"
                                    className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                                    placeholder="Enter classification name in arabic"
                                    name="name_ar"
                                    value={formik.values.name_ar}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.name_ar &&<span style={{ color: 'red' }} role="alert">{formik.errors.name_ar || formik.errors.name_ar?.[0]}</span>}
                            </div>
                        </div>
                        <div className="modal-footer mt-3">
                            <button type="button" className="btn btn-md btn-light" onClick={handleClose}>
                                Close
                            </button>
                            <button type="submit" className="btn btn-primary ms-3">
                                {initialData ? "Update" : "Add"}
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
