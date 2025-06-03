

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Row, Button, Input } from 'reactstrap'
import {addCategory, getCategories} from 'store/actions';
import CreateCategorie from './CreateCategorie';
import CategorieTable from './CategorieTable';
import Breadcrumb from 'components/Common/Breadcrumb2';

const CategorieList = () => {

    const [isOpen,setIsOpen] = useState(false);
    const navigate = useNavigate();
    const permissions = JSON.parse(localStorage?.getItem('permissions'));

    const dispatch = useDispatch();
    const categories = useSelector((state) => state.Category.categories);
    const loading = useSelector((state) => state.Category.loading);
    const error = useSelector((state) => state.Category.error);

    useEffect(() => {
        if(loading)return;
        dispatch(getCategories());
    }, [dispatch]);



    const handleSubmit = (data)=>{
        dispatch(addCategory(data));
    }

    const handleClose = ()=>{
        setIsOpen(false)
    }

    return (
        <>
        <CreateCategorie visible={isOpen}  onSubmit={handleSubmit} handleClose={handleClose} />
        <div className='page-content container-fluid'>
            <div className='d-flex justify-content-between align-items-center mx-3'>
                <Breadcrumb title="Categories" breadcrumbItems={[{ title: "Dashboard", link: `/dashboard` }, { title: "Categories", link: '#' }]} />
                {permissions?.map(item=>item?.permissionName)?.includes("Add Categories") &&<Button className='bg-primary text-white d-flex justify-content-center gap-1 align-items-center' onClick={() => setIsOpen(true)}>
                    <i className='ti-plus'></i> Add New
                </Button>}
            </div>

            <CategorieTable loading={loading} List={categories?.Data}/>
        </div>
        </>
    )
}

export default CategorieList;
