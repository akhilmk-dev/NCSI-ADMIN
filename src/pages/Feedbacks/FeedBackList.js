import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import Breadcrumb from 'components/Common/Breadcrumb2';
import FeedbackTable from './FeedBackTable';
import { getFeedbacks } from 'store/actions';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const FeedbackList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
 const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const feedbackState = useSelector((state) => state.Feedback);
  const { feedbacks, loading, fieldErrors, error } = feedbackState;
  const permissions = JSON.parse(localStorage?.getItem('permissions')) || []
  const hasEditPermission = permissions.includes('feedback.update');
  const hasDeletePermission = permissions.includes('feedback.delete')
  const hasViewPermission = permissions.includes('feedback.view');
  const hasCreatePermission = permissions.includes('feedback.create')
  const hasListPermission = permissions.includes('feedback.list');
  const isAdmin = Cookies.get('isAdmin') == "yes"
  
  useEffect(() => {
    if (!hasEditPermission && !hasDeletePermission && !hasCreatePermission && !hasListPermission && !isAdmin) {
      navigate('/pages-403')
    }
  }, [])
  document.title = "Feedbacks | NCSI";
  return (
    <>
      <div className="page-content container-fluid">
        <div className="d-flex justify-content-between align-items-center mx-3">
          <Breadcrumb
            title="Feedback"
            breadcrumbItems={[
              { title: "Dashboard", link: "/dashboard" },
              { title: "Feedback", link: "#" },
            ]}
          />
        </div>

        <FeedbackTable
          totalrows={feedbacks?.data?.total}
          fieldErrors={fieldErrors}
          loading={loading}
          feedbackList={feedbacks?.data?.feedback}
        />
      </div>
    </>
  );
};

export default FeedbackList;
