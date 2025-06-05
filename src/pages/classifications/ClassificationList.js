import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Row, Button, Input } from 'reactstrap';
import { addClassification, getClassifications } from 'store/actions';
import CreateClassification from './CreateClassification';
import Breadcrumb from 'components/Common/Breadcrumb2';
import ClassificationTable from './ClassificationTable';

const ClassificationList = () => {

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const permissions = JSON.parse(localStorage?.getItem('permissions'));

    const dispatch = useDispatch();
    const classifications = useSelector((state) => state.Classification.classifications);
    const loading = useSelector((state) => state.Classification.loading);
    const error = useSelector((state) => state.Classification.error);
    const fieldErrors = useSelector((state) => state.Classification.fieldErrors);

    const handleSubmit = (data,resetForm,handleClose) => {
        dispatch(addClassification(data,resetForm,handleClose));
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
        {console.log("kiue")}
            <CreateClassification fieldErrors={fieldErrors} visible={isOpen} onSubmit={handleSubmit} handleClose={handleClose} />
            <div className='page-content container-fluid'>
                <div className='d-flex justify-content-between align-items-center mx-3'>
                    <Breadcrumb 
                        title="Classifications" 
                        breadcrumbItems={[
                            { title: "Dashboard", link: `/dashboard` }, 
                            { title: "Classifications", link: '#' }
                        ]} 
                    />
                    { (
                        <Button 
                            className='bg-primary text-white d-flex justify-content-center gap-1 align-items-center' 
                            onClick={() => setIsOpen(true)}
                        >
                            <i className='ti-plus'></i> Add New
                        </Button>
                    )}
                </div>

                <ClassificationTable totalrows={classifications?.data?.total} fieldErrors={fieldErrors} loading={loading} List={classifications?.data?.classifications} />
            </div>
        </>
    );
};

export default ClassificationList;
