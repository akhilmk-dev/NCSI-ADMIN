import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import { addIndicator, getIndicators } from 'store/actions';
import CreateIndicator from './CreateIndicator';

import Breadcrumb from 'components/Common/Breadcrumb2';
import IndicatorTable from './IndicatorTable';
import { useTranslation } from 'react-i18next';


const IndicatorList = () => {
  const {t} = useTranslation()
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const permissions = [];

  const indicators = useSelector((state) => state.Indicator.indicators);
  const loading = useSelector((state) => state.Indicator.loading);
  const error = useSelector((state) => state.Indicator.error);
  const fieldErrors = useSelector((state) => state.Indicator.fieldErrors);

  const handleSubmit = (formData, resetForm, handleClose) => {
    dispatch(addIndicator(formData, resetForm, handleClose));
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  document.title = "Indicators | NCSI";
  return (
    <>
      <CreateIndicator 
        loading={loading}
        visible={isOpen} 
        fieldErrors={fieldErrors} 
        onSubmit={handleSubmit} 
        handleClose={handleClose} 
      />

      <div className="page-content container-fluid">
        <div className="d-flex justify-content-between align-items-center mx-3">
          <Breadcrumb
            title="Indicators"
            breadcrumbItems={[
              { title: "Dashboard", link: `/dashboard` },
              { title: "Indicators", link: "#" },
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

        <IndicatorTable
          totalrows={indicators?.data?.total}
          fieldErrors={fieldErrors}
          loading={loading}
          List={indicators?.data?.key_indicators}
        />
      </div>
    </>
  );
};

export default IndicatorList;
