import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import CreatePopulation from './CreatePopulation';
import PopulationTable from './PopulationTable';
import Breadcrumb from 'components/Common/Breadcrumb2';
import { addPopulation, getPopulation } from 'store/actions';
import { useTranslation } from 'react-i18next';

const PopulationList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {t} = useTranslation()
  const navigate = useNavigate();
  const permissions = [];

  const dispatch = useDispatch();
  const populationList = useSelector((state) => state.Population.populationList);
  const loading = useSelector((state) => state.Population.loading);
  const error = useSelector((state) => state.Population.error);
  const fieldErrors = useSelector((state) => state.Population.fieldErrors);
  

  const handleSubmit = (data,resetForm,handleClose) => {
    dispatch(addPopulation(data,resetForm,handleClose));
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  document.title = "Populations | NCSI";
  return (
    <>
      <CreatePopulation loading = {loading} fieldErrors={fieldErrors} visible={isOpen} onSubmit={handleSubmit} handleClose={handleClose} />
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
              <i className="ti-plus"></i> {t('Add New')}
            </Button>
          )}
        </div>

        <PopulationTable fieldErrors={fieldErrors} totalrows={populationList?.data?.total} loading={loading} List={populationList?.data?.populations} />
      </div>
    </>
  );
};

export default PopulationList;
