import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Row, Button, Input } from 'reactstrap';
import UserTable from './UserTable'; // You can implement a similar table component for users
import { addUserRequest, fetchUsersRequest, getUsers } from 'store/actions'; // Actions to add/get users
import CreateUser from './CreateUser'; // Component to create or edit users
import Breadcrumb from 'components/Common/Breadcrumb2';


const UserList = () => {
    const [isOpen, setIsOpen] = useState(false); 
    const dispatch = useDispatch();
    const users = useSelector((state) => state.User.users);
    const loading = useSelector((state) => state.User.loading);
    const error = useSelector((state) => state.User.error);

    const permissions2 = []
    
    // Fetch users when component mounts
    useEffect(() => {
        if(loading)return;
        dispatch(fetchUsersRequest());
    }, [dispatch]);

    const handleSubmit = (data,onClose) => {
        dispatch(addUserRequest(data,onClose));
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Modal for creating/editing users */}
            <CreateUser visible={isOpen} onSubmit={handleSubmit} handleClose={handleClose} />
            <div className="page-content container-fluid">
                {/* Header section with title and button to add new user */}
                <div className="d-flex justify-content-between align-items-center mx-3">
                    <Breadcrumb
                        title="Users"
                        breadcrumbItems={[{ title: 'Dashboard', link: '/dashboard' }, { title: 'Users', link: '#' }]}
                    />
                    {permissions2?.map(item=>item?.permissionName)?.includes("Add Users") && <Button className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center" onClick={() => setIsOpen(true)}>
                        <i className="ti-plus"></i> Add New
                    </Button>}
                </div>

                {/* Table to display list of users */}
                <UserTable List={users?.Data} loading={loading} error={error} />
            </div>
        </>
    );
};

export default UserList;
