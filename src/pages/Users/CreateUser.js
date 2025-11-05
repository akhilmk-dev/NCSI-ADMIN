import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Switch,Select  } from 'antd';
const { Option } = Select;

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getRoles } from 'store/actions';


const CreateUser = ({ visible, handleClose, initialData = '', onSubmit }) => {
    const [showPassword, setShowPassword] = useState(false);
    const error = useSelector((state) => state.User.error)
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: initialData?.user_name || '',
            email: initialData?.user_email || '',
            phone_number: initialData?.user_phone || '',
            password: '',
            status: initialData?.user_status || 1,
             role_id: initialData?.role_id || ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            phone_number: Yup.string()
                .required('Phone number is required')
                .matches(/^\d{8}$/, 'Phone number must be exactly 8 digits'),
            password: initialData
                ? Yup.string()
                : Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
                role_id: Yup.string().required('Role is required'),
        }),
        onSubmit: (values, { resetForm }) => {
            const payload = {
                name: values.name,
                email: values.email,
                phone_number: values.phone_number,
                status: values.status,
                role_id:values.role_id
            };

            if (!initialData) {
                payload.password = values.password;
                onSubmit(payload, onClose);
            }else{
                onSubmit(initialData?.user_id, payload, onClose);
            }
        },
    });

    const onClose = () => {
        formik.resetForm();
        handleClose();
    };
    
    const handleStatusChange = (checked) => {
        formik.setFieldValue('status', checked ? 1 : 2);
    };

    const dispatch = useDispatch();
const roles = useSelector((state) => state.Role.roles?.data?.roles || []); 


useEffect(() => {
    
    if (visible) {
      
        dispatch(getRoles());
    }
}, [visible, dispatch]);


    return (
        <Modal
            title={initialData ? 'Edit User' : 'Create New User'}
            visible={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            centered
            width={500}
            className="custom-modal-header p-0"
            maskClosable={false}
        >
            <form onSubmit={formik.handleSubmit}>
                <div role="document">
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="modal-form">Name <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control fs-7"
                                placeholder="Enter name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <span style={{ color: 'red' }}>{formik.errors.name}</span>
                            )}
                            {error?.name?.[0] && <span style={{ color: 'red' }}>{error?.name?.[0]}</span>}
                        </div>

                        <div className="col-12">
                            <label className="modal-form">Email <span className="text-danger">*</span></label>
                            <input
                                type="email"
                                className="form-control fs-7"
                                placeholder="Enter email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <span style={{ color: 'red' }}>{formik.errors.email}</span>
                            )}
                            {error?.email?.[0] && <span style={{ color: 'red' }}>{error?.email?.[0]}</span>}
                        </div>

                        <div className="col-12">
                            <label className="modal-form">Phone Number <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control fs-7"
                                placeholder="Enter phone number"
                                name="phone_number"
                                value={formik.values.phone_number}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.phone_number && formik.errors.phone_number && (
                                <span style={{ color: 'red' }}>{formik.errors.phone_number}</span>
                            )}
                            {error?.phone_number?.[0] && <span style={{ color: 'red' }}>{error?.phone_number?.[0]}</span>}
                        </div>

                        {!initialData && (
                            <div className="col-12 position-relative">
                                <label className="modal-form">Password <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control fs-7"
                                        placeholder="Enter password"
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                    />
                                    <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                    </span>
                                    
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <span style={{ color: 'red' }}>{formik.errors.password}</span>
                                )}
                            </div>
                            
                        )}

                        <div className="col-12">

<label className="modal-form">
  Role <span className="text-danger">*</span>
</label>

<Select
  showSearch
  allowClear 
  placeholder="Select Role"
  value={formik.values.role_id || undefined}
  onChange={(value) => formik.setFieldValue('role_id', value)}
  onBlur={() => formik.setFieldTouched('role_id', true)}
  className="w-100"
  optionFilterProp="children"
  filterOption={(input, option) =>
    option.children.toLowerCase().includes(input.toLowerCase())
  }
>
  {roles?.map((role) => (
    <Option key={role.id} value={role.id}>
      {role.name}
    </Option>
  ))}
</Select>

{formik.touched.role_id && formik.errors.role_id && (
  <span style={{ color: 'red' }}>{formik.errors.role_id}</span>
)}

    {formik.touched.role_id && formik.errors.role_id && (
        <span style={{ color: 'red' }}>{formik.errors.role_id}</span>
    )}
</div>


                        

                        <div className="col-12 d-flex pt-1 flex-column">
                            <label className="modal-form mb-0">Status</label>
                            <Switch
                                checked={formik.values.status === 1}
                                onChange={handleStatusChange}
                                style={{ width: "50px", marginTop: "11px",
                                    backgroundColor: formik.values.status === 1 ? "#00A895" : "#d9d9d9"
                                  }}
                            />
                            <span className="text-muted" style={{ fontSize: '12px' }}>
                                {formik.values.status === 1 ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    <div className="modal-footer mt-3">
                        <button type="button" className="btn btn-light btn-md" onClick={onClose}>
                            Close
                        </button>
                        <button type="submit" className="btn btn-primary btn-md ms-3">
                            {initialData ? 'Update' : 'Add'}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

CreateUser.propTypes = {
    visible: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
};

export default CreateUser;
