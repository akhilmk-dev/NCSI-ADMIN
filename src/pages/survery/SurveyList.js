import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import Breadcrumb from 'components/Common/Breadcrumb2';
import SurveyTable from './SurveyTable';   // Table component for surveys
import { addSurvey, getSurveys } from 'store/actions'; // Redux actions for surveys
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const SurveyList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate()
  const surveys = useSelector((state) => state.Survey.surveys); // state.Survey must exist
  const loading = useSelector((state) => state.Survey.loading);
  const fieldErrors = useSelector((state) => state?.Survey?.fieldErrors);
  const permissions = JSON.parse(localStorage?.getItem('permissions')) || []
  const hasEditPermission = permissions.includes('surveyrequests.update');
  const hasDeletePermission = permissions.includes('surveyrequests.delete')
  const hasViewPermission = permissions.includes('surveyrequests.view');
  const hasCreatePermission = permissions.includes('surveyrequests.create')
  const hasListPermission = permissions.includes('surveyrequests.list');
  const isAdmin = Cookies.get('isAdmin') == "yes"
  
  useEffect(() => {
    if (!hasEditPermission && !hasDeletePermission && !hasCreatePermission && !hasListPermission && !isAdmin) {
      navigate('/pages-403')
    }
  }, [])
  document.title = "Surveys | NCSI";
  return (
    <>
      <div className="page-content container-fluid">
        <div className="d-flex justify-content-between align-items-center" style={{ margin: '0 11px' }}>
          <Breadcrumb
            title="Surveys"
            breadcrumbItems={[
              { title: 'Dashboard', link: '/dashboard' },
              { title: 'Surveys', link: '#' },
            ]}
          />
        </div>

        <SurveyTable
          totalrows={surveys?.data?.total}
          loading={loading}
          fieldErrors={fieldErrors}
          List={surveys?.data?.survey_requests}
        />
      </div>
    </>
  );
};

export default SurveyList;
