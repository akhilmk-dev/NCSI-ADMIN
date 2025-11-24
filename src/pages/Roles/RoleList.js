import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { getRoles } from 'store/actions';
import Breadcrumb from 'components/Common/Breadcrumb2';
import { useTranslation } from 'react-i18next';
import RoleTable from './RoleTable';
import Cookies from 'js-cookie';


const RoleList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const roles = useSelector((state) => state.Role.roles);
    const loading = useSelector((state) => state.Role.loading);
    const error = useSelector((state) => state.Role.error);
    const permissions = JSON.parse(localStorage?.getItem('permissions')) || []
    const hasEditPermission = permissions.includes('roles.update');
    const hasDeletePermission = permissions.includes('roles.delete')
    const hasViewPermission = permissions.includes('roles.view');
    const hasCreatePermission = permissions.includes('roles.create')
    const hasListPermission = permissions.includes('roles.list');
    const isAdmin = Cookies.get('isAdmin') == "yes"
    
    useEffect(() => {
        if (!hasEditPermission && !hasDeletePermission && !hasCreatePermission && !hasListPermission && !isAdmin) {
            navigate('/pages-403')
        }
    }, [])
    // Dispatch action to fetch roles when component mounts
    useEffect(() => {
        if (loading) return;
        dispatch(getRoles());
    }, [dispatch]);

    return (
        <>
            <div className="page-content container-fluid mt-4">
                <div className="d-flex justify-content-between align-items-center mx-3">
                    <Breadcrumb title="Roles" breadcrumbItems={[{ title: "Dashboard", link: `/dashboard` }, { title: "Roles", link: '#' }]} />
                    {(isAdmin || hasCreatePermission) && <Button
                        className="text-white bg-primary d-flex justify-content-center gap-1 align-items-center"
                        onClick={() => navigate('/createRole')}

                    >
                        <i className="ti-plus"></i> {t('Add New')}
                    </Button>}
                </div>

                {/* Display loading state, error message, or the list of roles */}
                <RoleTable loading={loading} list={roles?.data?.roles} total={roles?.data?.total} />
            </div>
        </>
    );
};

export default RoleList;
