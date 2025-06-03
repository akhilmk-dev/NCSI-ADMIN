import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreateCategorie = ({ visible, handleClose, initialData = '', onSubmit }) => {

    const formik = useFormik({
        initialValues: {
            name: initialData?.categoryName || '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Category Name is required'),
        }),
        onSubmit: (values, { resetForm }) => {
            if (initialData?.categoryName) {
                onSubmit({ sp: "usp_UpdateCatalogueCategory", solutionId: 1, categoryName: values?.name, categoryId: initialData?.categoryId });
                onClose();
            } else {
                onSubmit({ sp: "usp_InsertCatalogueCategory", solutionId: 1, categoryName: values?.name });
                onClose();
            }
        },
    });

    const onClose = () => {
        formik.resetForm();
        handleClose();
    };

    useEffect(() => {
        if (initialData?.categoryName) {
            formik.setFieldValue('name', initialData?.categoryName);
        }
    }, [initialData]);

    return (
        <Modal
            title={initialData ? "Edit Category" : "Create New Category"}
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
                    <div>
                        <div>
                            <div className="row g-3">
                                <div className="col-md-12">
                                    <label className="form-label fs-7">Category Name</label><span className='text-danger'>*</span>
                                    <input
                                        type="text"
                                        className="form-control form-control-md form-control-solid fs-7 bg-body-secondary"
                                        placeholder="Enter category name"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                    />
                                    <span style={{ color: 'red' }} role="alert">{formik.errors.name}</span>
                                </div>
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

// CreateCategorie.propTypes = {
//     visible: PropTypes.bool.isRequired,
//     handleClose: PropTypes.func.isRequired,
//     initialData: PropTypes.object,
//     onSubmit: PropTypes.func.isRequired,
// };

export default CreateCategorie;
