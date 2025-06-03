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
//   const sliders = useSelector((state) => state.Slider.sliders);
//   const loading = useSelector((state) => state.Slider.loading);
//   const error = useSelector((state) => state.Slider.error);

//   useEffect(() => {
//     if (loading) return;
//     dispatch(getSliders());
//   }, [dispatch]);

const sliders = [
    {
      sliderId: 1,
      sliderImage: "https://via.placeholder.com/600x200.png?text=Slider+1",
      link: "https://example.com/slider-1",
      altText: "Slider One Image"
    },
    {
      sliderId: 2,
      sliderImage: "https://via.placeholder.com/600x200.png?text=Slider+2",
      link: "https://example.com/slider-2",
      altText: "Slider Two Image"
    },
    {
      sliderId: 3,
      sliderImage: "https://via.placeholder.com/600x200.png?text=Slider+3",
      link: "https://example.com/slider-3",
      altText: "Slider Three Image"
    },
    {
      sliderId: 4,
      sliderImage: "https://via.placeholder.com/600x200.png?text=Slider+4",
      link: "https://example.com/slider-4",
      altText: "Slider Four Image"
    },
  ];
  

  const handleSubmit = (formData) => {
    dispatch(addSlider(formData));
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <CreateSlider visible={isOpen} onSubmit={handleSubmit} handleClose={handleClose} />

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

        <SliderTable loading={false} List={sliders} />
      </div>
    </>
  );
};

export default SliderList;
