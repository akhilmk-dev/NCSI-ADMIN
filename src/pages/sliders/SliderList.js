import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import { addSlider, getSliders } from 'store/actions';
import CreateSlider from './CreateSlider';
import SliderTable from './SliderTable';
import Breadcrumb from 'components/Common/Breadcrumb2';

const SliderList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
//   const permissions = JSON.parse(localStorage?.getItem('permissions'));

  const dispatch = useDispatch();
  const sliders = useSelector((state) => state.Slider.sliders);
  const loading = useSelector((state) => state.Slider.loading);
  const error = useSelector((state) => state.Slider.error);
  const fieldErrors = useSelector((state) => state.Slider.fieldErrors);

  useEffect(() => {
    if (loading) return;
    dispatch(getSliders());
  }, [dispatch]);

  const handleSubmit = (formData,resetForm,handleClose) => {
    dispatch(addSlider(formData,resetForm,handleClose));
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <CreateSlider fieldErrors={fieldErrors} visible={isOpen} onSubmit={handleSubmit} handleClose={handleClose} />

      <div className='page-content container-fluid'>
        <div className='d-flex justify-content-between align-items-center mx-3'>
          <Breadcrumb
            title='Sliders'
            breadcrumbItems={[
              { title: 'Dashboard', link: '/dashboard' },
              { title: 'Sliders', link: '#' },
            ]}
          />
          {(
            <Button
              className='bg-primary text-white d-flex justify-content-center gap-1 align-items-center'
              onClick={() => setIsOpen(true)}
            >
              <i className='ti-plus'></i> Add New
            </Button>
          )}
        </div>

        <SliderTable fieldErrors={fieldErrors} loading={loading} List={sliders?.data?.sliders} />
      </div>
    </>
  );
};

export default SliderList;
