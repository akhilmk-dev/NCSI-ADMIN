import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Switch } from 'antd'; // Import Switch from Ant Design
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select'; // Importing react-select
import { fetchUsersRequest, getBranches, getRoles } from 'store/actions';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const CreateUser = ({ visible, handleClose, initialData = '', onSubmit }) => {
    const dispatch = useDispatch();
    const roles = useSelector(state => state?.Role?.roles);
    const loading = useSelector(state => state?.loading);
    const Branches = useSelector(state => state?.Branch?.branches)
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            userName: initialData?.userName || '',
            passwordHash: '',
            emailId: initialData?.emailId || '',
            phoneNo: initialData?.phoneNo || '',
            roleId: initialData?.roleId || '',
            isActive: initialData?.isActive ? 1 : 0,
            branch: initialData?.branchId || '',
            employeeId: initialData?.employeeId || ''
        },
        validationSchema: Yup.object({
            userName: Yup.string().required('Full Name is required'),
            passwordHash: initialData
                ? Yup.string()
                : Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
            emailId: Yup.string()
                .email('Invalid email address')
                .matches(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    'Invalid email address format'
                )
                .required('Email is required'),

            phoneNo: Yup.string().required('Phone number is required').matches(/^\d{8}$/, 'Phone number must be exactly 8 digits'),
            roleId: Yup.number().required('Role is required'),
            branch: Yup.string().required('Branch is required'),
            employeeId: Yup.string().required("Employee Id is required")
        }),
        onSubmit: (values, { resetForm }) => {
            if (initialData?.userName) {
                onSubmit({
                    sp: 'usp_UpdateUser',
                    userName: values?.userName,
                    emailId: values?.emailId,
                    phoneNo: values?.phoneNo,
                    roleId: values?.roleId,
                    userId: initialData?.userId,
                    isActive: values?.isActive == 1 ? true : false,
                    branchId: values?.branch,
                    employeeId: values?.employeeId
                },onClose);
               
            } else {
                onSubmit({
                    sp: 'usp_InsertUser',
                    userName: values?.userName,
                    emailId: values?.emailId,
                    phoneNo: values?.phoneNo,
                    roleId: values?.roleId,
                    passwordHash: values?.passwordHash,
                    isActive: values?.isActive == 1 ? true : false,
                    branchId: values?.branch,
                    employeeId: values?.employeeId
                },onClose);
            }
        },
    });

    const onClose = () => {
        formik.resetForm();
        handleClose();
    };

    const fetchRoles = () => {
        dispatch(getRoles());
    };

    useEffect(() => {
        if (visible) {
            if (loading) return;
            dispatch(getBranches())
            fetchRoles();
        }
    }, [visible]);

    // Transform roles data into the format that React Select requires
    const roleOptions = roles?.Data?.map(role => ({
        value: role.roleId,
        label: role.roleName,
    }));

    const branchOptions = Branches?.Data?.map(branch => ({
        value: branch?.branchId,
        label: branch?.branchName
    }))

    // Handling the change for React Select
    const handleRoleChange = (selectedOption) => {
        formik.setFieldValue('roleId', selectedOption?.value || '');
    };

    // Handling status toggle switch
    const handleStatusChange = (checked) => {
        formik.setFieldValue('isActive', checked ? 1 : 0);
    };

    const handleBranchChange = (selectedOption) => {
        formik.setFieldValue('branch', selectedOption?.value);
    }

    return (
        <Modal
            title={initialData ? 'Edit User' : 'Create New User'}
            visible={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            centered
            width={500} // Reduced width of modal
            className="custom-modal-header p-0"
            maskClosable={false}
        >
            <form onSubmit={formik.handleSubmit}>
                <div role="document">
                    <div className="row g-3">
                        {/* User Name & Password on the same row above medium screens */}
                        <div className="col-md-6 col-12">
                            <label className=" modal-form">Full Name</label> <span className='text-danger'>*</span>
                            <input
                                type="text"
                                className="form-control fs-7 form-control-md"
                                style={{ height: '38px' }} // Match height of react-select
                                placeholder="Enter your fullname"
                                name="userName"
                                value={formik.values.userName}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.userName && formik.errors.userName && (
                                <span style={{ color: 'red' }} role="alert">{formik.errors.userName}</span>
                            )}
                        </div>

                        <div className="col-md-6 col-12">
                            <label className="modal-form">Employee Id</label> <span className='text-danger'>*</span>
                            <input
                                type="text"
                                className="form-control fs-7 form-control-md"
                                style={{ height: '38px' }}
                                placeholder="Enter employee ID"
                                name="employeeId"
                                value={formik.values.employeeId}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.employeeId && formik.errors.employeeId && (
                                <span style={{ color: 'red' }} role="alert">{formik.errors.employeeId}</span>
                            )}
                        </div>

                        {/* Conditionally render the password field */}
                        {!initialData && (
                            <div className="col-md-6 col-12 position-relative">
                                <label className=" modal-form">Password</label> <span className="text-danger">*</span>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"} // Toggle between text and password
                                        className="form-control fs-7 form-control-md"
                                        style={{ height: "38px" }} // Match height of react-select
                                        placeholder="Enter password"
                                        name="passwordHash"
                                        value={formik.values.passwordHash}
                                        onChange={formik.handleChange}
                                    />
                                    {/* Eye icon for toggling password visibility */}
                                    <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                    </span>
                                </div>
                                {formik.touched.passwordHash && formik.errors.passwordHash && (
                                    <span style={{ color: "red" }} role="alert">
                                        {formik.errors.passwordHash}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Email ID & Phone Number on the same row above medium screens */}
                        <div className="col-md-6 col-12">
                            <label className=" modal-form">Email ID</label> <span className='text-danger'>*</span>
                            <input
                                type="email"
                                className="form-control fs-7 form-control-md"
                                style={{ height: '38px' }} // Match height of react-select
                                placeholder="Enter email ID"
                                name="emailId"
                                value={formik.values.emailId}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.emailId && formik.errors.emailId && (
                                <span style={{ color: 'red' }} role="alert">{formik.errors.emailId}</span>
                            )}
                        </div>

                        <div className="col-md-6 col-12">
                            <label className=" modal-form ">Phone Number</label> <span className='text-danger'>*</span>
                            <input
                                type="text"
                                className="form-control fs-7 form-control-md"
                                style={{ height: '38px' }} // Match height of react-select
                                placeholder="Enter phone number"
                                name="phoneNo"
                                value={formik.values.phoneNo}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.phoneNo && formik.errors.phoneNo && (
                                <span style={{ color: 'red' }} role="alert">{formik.errors.phoneNo}</span>
                            )}
                        </div>

                        {/* Role and Status on the same row above medium screens */}
                        <div className="col-md-6 col-12">
                            <label className=" modal-form ">Role</label> <span className='text-danger'>*</span>
                            <Select
                                name="roleId"
                                value={roleOptions?.find(option => option.value === formik.values.roleId)}
                                onChange={handleRoleChange}
                                options={roleOptions}
                                placeholder="Select role"
                            />
                            {formik.touched.roleId && formik.errors.roleId && (
                                <span style={{ color: 'red' }} role="alert">{formik.errors.roleId}</span>
                            )}
                        </div>

                        <div className="col-md-6 col-12">
                            <label className=" modal-form ">Branch</label> <span className='text-danger'>*</span>
                            <Select
                                name="branch"
                                value={branchOptions?.find(option => option.value === formik.values.branch)}
                                onChange={handleBranchChange}
                                options={branchOptions}
                                placeholder="Select branch..."
                            />
                            {formik.touched.branch && formik.errors.branch && (
                                <span style={{ color: 'red' }} role="alert">{formik.errors.branch}</span>
                            )}
                        </div>

                        <div className="col-md-6 col-12 d-flex pt-1 flex-column">
                            <label className=" modal-form mb-0">Is Active</label>
                            <Switch
                                checked={formik.values.isActive === 1}
                                onChange={handleStatusChange}
                                style={{ width: "50px", marginTop: "11px" }}
                                className=''
                                width={40}
                                height={20}
                                handleDiameter={18}
                            />
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
