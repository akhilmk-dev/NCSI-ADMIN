import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb2';
import CreateStatistics from './CreateStatistics'; 
import StatisticsTable from './StatisticsTable'; 
import { addStatistics, getStatistics } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const StatisticsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const statisticsList = useSelector((state) => state.Statistics.statistics);
  const loading = useSelector((state) => state.Statistics.loading);
  const error = useSelector((state) => state.Statistics.error);
  const fieldErrors = useSelector((state) => state.Statistics.fieldErrors);
  const permissions = JSON.parse(localStorage?.getItem('permissions')) || []
  const hasEditPermission = permissions.includes('statistics.update');
  const hasDeletePermission = permissions.includes('statistics.delete')
  const hasViewPermission = permissions.includes('statistics.view');
  const hasCreatePermission = permissions.includes('statistics.create')
  const hasListPermission = permissions.includes('statistics.list');
  const isAdmin = Cookies.get('isAdmin') == "yes"
  
  useEffect(() => {
    if (!hasEditPermission && !hasDeletePermission && !hasCreatePermission && !hasListPermission && !isAdmin) {
      navigate('/pages-403')
    }
  }, [])


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
          {(isAdmin || hasCreatePermission) && <Button
            className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
            onClick={() => setIsOpen(true)}
          >
            <i className="ti-plus"></i> {t('Add New')}
          </Button>}
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
