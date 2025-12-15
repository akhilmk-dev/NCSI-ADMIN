import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { addRole, updateRole } from 'store/actions';
import { Checkbox } from 'antd';
import Breadcrumb from 'components/Common/Breadcrumb2';
import { Button } from 'reactstrap';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import axiosInstance from 'pages/Utility/axiosInstance';
import { showError } from 'helpers/notification_helper';
import Cookies from 'js-cookie';


const CreateRole = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()
  const [initialData, setInitialData] = useState()
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState([])
  const { search } = location;
  const roleId = new URLSearchParams(search).get('id');
  const isAdmin = Cookies.get('isAdmin') == "yes"

  const permissions2 = JSON.parse(localStorage?.getItem('permissions')) || []
  const hasEditPermission = permissions2.includes('roles.update');
  const hasCreatePermission = permissions2.includes('roles.create')

  useEffect(() => {
    if (!hasEditPermission  && !hasCreatePermission  && !isAdmin) {
      navigate('/pages-403')
    }
  }, [])

  const nameRef = useRef(null);
  const [groups, setGroups] = useState({});
  const fetchPermissions = async () => {
    try {
      const response = await axiosInstance.get(`V1/permissions`);
      setPermissions(response.data?.data?.permissions)
    } catch (error) {
      console.log(error)
    }
  }
  const fetchEditData = async () => {
    try {
      const response = await axiosInstance.get(`V1/roles/view/${roleId}`);
      const role = response?.data?.data?.role;
      setInitialData({
        name: role.name,
        permissions: role.permissions || [],
      });
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchPermissions()
  }, [])

  useEffect(() => {
    if (roleId) {
      fetchEditData()
    }
  }, [roleId])

  // Transform JSON permissions into grouped array for rendering
  useEffect(() => {
    if (permissions?.length > 0) {
      const grouped = permissions.reduce((acc, group) => {
        acc[group.title] = Object.entries(group.permissions).map(([id, name]) => ({
          _id: id,
          permission_name: name
        }));
        return acc;
      }, {});
      setGroups(grouped);
    }
  }, [permissions]);

  // Initialize Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: initialData?.name || '',
      permissions: initialData?.permissions || [],
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required(t("Role Name is required")),
    }),
    onSubmit: (values) => {

      if (!values.permissions || values.permissions.length === 0) {
        showError(t("Please select at least one permission"));
        return;
      }

      const payload = {
        name: values.name,
        permissions: values.permissions,
      };

      if (roleId) {
        dispatch(updateRole(roleId, payload, navigate));
      } else {
        dispatch(addRole(payload, navigate));
      }
    },
  });

  const handlePermissionChange = (checkedValues) => {
    formik.setFieldValue('permissions', checkedValues);
  };

  const handleSubmit = () => {
    if (!formik.values.name.trim()) {
      nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="container page-content mt-4">
      <div className="d-flex justify-content-between align-items-center ms-2 mb-3">
        <Breadcrumb
          title={roleId ? t('Edit Role') : t('Create New Role')}
          breadcrumbItems={[
            { title: 'Dashboard', link: '/dashboard' },
            { title: 'Roles', link: '/roles' }
          ]}
        />
        <Button className="text-white bg-primary" onClick={() => navigate('/roles')}>
          ← {t('Back')}
        </Button>
      </div>

      <form onSubmit={formik.handleSubmit} className="bg-white p-3" style={{ borderRadius: '8px' }}>
        {/* Role Name */}
        <div className="form-group">
          <label htmlFor="name">{t('Role Name')}</label> <span className="text-danger">*</span>
          <input
            ref={nameRef}
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder={t("Enter role name")}
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          {formik.touched.name && formik.errors.name && (
            <div style={{ color: 'red' }}>{formik.errors.name}</div>
          )}
        </div>

        {/* Permissions */}
        <div className="form-group mt-3">
          <div className="mb-3">
            <h5 className="text-black">{t('Permissions')}</h5>
          </div>
          <Checkbox.Group
            name="permissions"
            value={formik.values.permissions}
            onChange={handlePermissionChange}
            className="d-flex flex-column gap-2"
          >
            {Object.keys(groups).map((group) => (
              <div key={group} className="mb-3">
                <h6>{group}</h6>
                <div>
                  {groups[group].map((permission) => (
                    <Checkbox key={permission._id} value={permission._id}>
                      <span style={{ whiteSpace: 'nowrap', color: 'gray' }}>
                        {permission.permission_name}
                      </span>
                    </Checkbox>
                  ))}
                </div>
              </div>
            ))}
          </Checkbox.Group>
        </div>

        {/* Submit */}
        <div className="form-group mt-3">
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            {roleId ? t('Update') : t('Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

CreateRole.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateRole;
