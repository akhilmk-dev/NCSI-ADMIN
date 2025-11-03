import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb2';
import CreateStatistics from './CreateStatistics'; // Your modal form for statistics
import StatisticsTable from './StatisticsTable'; // Your table component for statistics
import { addStatistics, getStatistics } from 'store/actions';
import { useTranslation } from 'react-i18next';

const StatisticsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const statisticsList = useSelector((state) => state.Statistics.statistics);
  const loading = useSelector((state) => state.Statistics.loading);
  const error = useSelector((state) => state.Statistics.error);
  const fieldErrors = useSelector((state) => state.Statistics.fieldErrors);


  // Handle Form Submission
  const handleSubmit = (data, resetForm, handleClose) => {
    dispatch(addStatistics(data, resetForm, handleClose));
  };

  // Handle Close Modal
  const handleClose = () => {
    setIsOpen(false);
  };

  document.title = 'Statistics | NCSI';

  return (
    <>
      {/* Create / Edit Modal */}
      <CreateStatistics
        loading={loading}
        fieldErrors={fieldErrors}
        visible={isOpen}
        onSubmit={handleSubmit}
        handleClose={handleClose}
      />

      {/* Page Content */}
      <div className="page-content container-fluid">
        <div className="d-flex justify-content-between align-items-center mx-3">
          <Breadcrumb
            title="Statistics"
            breadcrumbItems={[
              { title: 'Dashboard', link: '/dashboard' },
              { title: 'Statistics', link: '#' },
            ]}
          />
          <Button
            className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
            onClick={() => setIsOpen(true)}
          >
            <i className="ti-plus"></i> {t('Add New')}
          </Button>
        </div>

        {/* Statistics Table */}
        <StatisticsTable
          fieldErrors={fieldErrors}
          totalrows={statisticsList?.data?.total}
          loading={loading}
          list={statisticsList?.data?.statistics}
        />
      </div>
    </>
  );
};

export default StatisticsList;
