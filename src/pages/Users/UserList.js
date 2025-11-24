import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Button } from 'reactstrap';
import { addUserRequest, fetchUsersRequest } from 'store/actions';
import CreateUser from './CreateUser';
import Breadcrumb from 'components/Common/Breadcrumb2';
import UserTable from './UserTable';
import { Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const UserList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const users = useSelector((state) => state.User.users);
    const loading = useSelector((state) => state.User.loading);
    const error = useSelector((state) => state.User.error);
    const navigate = useNavigate()
    const permissions = JSON.parse(localStorage?.getItem('permissions')) || []
    const hasEditPermission = permissions.includes('users.update');
    const hasDeletePermission = permissions.includes('users.delete')
    const hasViewPermission = permissions.includes('users.view');
    const hasCreatePermission = permissions.includes('users.create')
    const hasListPermission = permissions.includes('users.list');
    const isAdmin = Cookies.get('isAdmin') == "yes"
    
    useEffect(() => {
        if (!hasEditPermission && !hasDeletePermission && !hasCreatePermission && !hasListPermission && !isAdmin) {
            navigate('/pages-403')
        }
    }, [])

    // Fetch users on mount
    useEffect(() => {
        if (!loading) {
            dispatch(fetchUsersRequest({
                "pagesize": 10,
                "currentpage": 1,
                "searchstring": "",
                "sortorder": {
                    "field": "created_at",
                    "direction": "desc"
                },
                "filter": {

                }
            }));
        }
    }, [dispatch]);

    const handleSubmit = (data, onClose) => {
        dispatch(addUserRequest(data, onClose));
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Modal for creating or editing users */}
            <CreateUser
                visible={isOpen}
                onSubmit={handleSubmit}
                handleClose={handleClose}
            />

            <div className="page-content container-fluid">
                {/* Page header */}
                <div className="d-flex justify-content-between align-items-center mx-3">
                    <Breadcrumb
                        title="Users"
                        breadcrumbItems={[
                            { title: 'Dashboard', link: '/dashboard' },
                            { title: 'Users', link: '#' }
                        ]}
                    />

                    {(isAdmin || permissions?.includes('users.create')) && <Button
                        className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
                        onClick={() => setIsOpen(true)}
                    >
                        <i className="ti-plus"></i> Add New
                    </Button>}
                </div>

                {/* User list table */}
                <UserTable users={users?.users || []} totalrows={users.total} loading={loading} error={error} />
            </div>
        </>
    );
};

export default UserList;
