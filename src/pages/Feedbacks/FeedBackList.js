import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import Breadcrumb from 'components/Common/Breadcrumb2';
import FeedbackTable from './FeedBackTable';
import { getFeedbacks } from 'store/actions';

const FeedbackList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const feedbackState = useSelector((state) => state.Feedback);
  const { feedbacks, loading, fieldErrors, error } = feedbackState;
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
