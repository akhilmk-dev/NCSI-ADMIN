import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreateClassification = ({ visible, handleClose, initialData = '', onSubmit }) => {

    const formik = useFormik({
        initialValues: {
            classificationName: initialData?.classificationName || '',
        },
        validationSchema: Yup.object({
            classificationName: Yup.string()
                .required('Classification Name is required'),
        }),
        onSubmit: (values, { resetForm }) => {
            if (initialData?.classificationName) {
                onSubmit({ 
                    sp: "usp_UpdateClassification", 
                    solutionId: 1, 
                    classificationName: values?.classificationName, 
                    classificationId: initialData?.classificationId 
                });
                onClose();
            } else {
                onSubmit({ 
                    sp: "usp_InsertClassification", 
                    solutionId: 1, 
                    classificationName: values?.classificationName 
                });
                onClose();
            }
        },
    });

    const onClose = () => {
        formik.resetForm();
        handleClose();
    };

    useEffect(() => {
        if (initialData?.classificationName) {
            formik.setFieldValue('classificationName', initialData?.classificationName);
        }
    }, [initialData]);

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
                                    name="classificationName"
                                    value={formik.values.classificationName}
                                    onChange={formik.handleChange}
                                />
                                <span style={{ color: 'red' }} role="alert">{formik.errors.classificationName}</span>
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
