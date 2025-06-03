import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { getPopulation, addPopulation } from 'store/actions';
import CreatePopulation from './CreatePopulation';
import PopulationTable from './PopulationTable';
import Breadcrumb from 'components/Common/Breadcrumb2';

const PopulationList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const permissions = JSON.parse(localStorage?.getItem('permissions'));

  const dispatch = useDispatch();
//   const populationList = useSelector((state) => state.Population.populations);
//   const loading = useSelector((state) => state.Population.loading);
//   const error = useSelector((state) => state.Population.error);

//   useEffect(() => {
//     if (!loading) {
//       dispatch(getPopulation());
//     }
//   }, [dispatch]);

const populationList = [
    {
      populationId: 1,
      date: "2025-06-01",
      omanis: 1500,
      expatriates: 2500,
    },
    {
      populationId: 2,
      date: "2025-05-01",
      omanis: 1480,
      expatriates: 2600,
    },
    {
      populationId: 3,
      date: "2025-04-01",
      omanis: 1450,
      expatriates: 2550,
    },
    {
      populationId: 4,
      date: "2025-03-01",
      omanis: 1430,
      expatriates: 2400,
    },
    {
      populationId: 5,
      date: "2025-02-01",
      omanis: 1400,
      expatriates: 2300,
    }
  ];
  

  const handleSubmit = (data) => {
    dispatch(addPopulation(data));
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <CreatePopulation visible={isOpen} onSubmit={handleSubmit} handleClose={handleClose} />
      <div className="page-content container-fluid">
        <div className="d-flex justify-content-between align-items-center mx-3">
          <Breadcrumb
            title="Population"
            breadcrumbItems={[
              { title: 'Dashboard', link: '/dashboard' },
              { title: 'Population', link: '#' },
            ]}
          />
          {(
            <Button
              className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
              onClick={() => setIsOpen(true)}
            >
              <i className="ti-plus"></i> Add New
            </Button>
          )}
        </div>

        <PopulationTable loading={false} List={populationList} />
      </div>
    </>
  );
};

export default PopulationList;
