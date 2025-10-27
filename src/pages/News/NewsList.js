import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb2';
import CreateNews from './CreateNews'; // Your modal form for news
import NewsTable from './NewsTable'; // Your table component for news
import { addNews, getNews } from 'store/actions';
import { useTranslation } from 'react-i18next';

const NewsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const newsList = useSelector((state) => state.News.news);
  const loading = useSelector((state) => state.News.loading);
  const error = useSelector((state) => state.News.error);
  const fieldErrors = useSelector((state) => state.News.fieldErrors);

  // Handle Form Submission
  const handleSubmit = (data, resetForm, handleClose) => {
    dispatch(addNews(data, resetForm, handleClose));
  };

  // Handle Close Modal
  const handleClose = () => {
    setIsOpen(false);
  };

  document.title = 'News | NCSI';

  return (
    <>
      {/* Create / Edit Modal */}
      <CreateNews
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
            title="News"
            breadcrumbItems={[
              { title: 'Dashboard', link: '/dashboard' },
              { title: 'News', link: '#' },
            ]}
          />
          <Button
            className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
            onClick={() => setIsOpen(true)}
          >
            <i className="ti-plus"></i> {t('Add New')}
          </Button>
        </div>

        {/* News Table */}
        <NewsTable
          fieldErrors={fieldErrors}
          totalrows={newsList?.data?.total}
          loading={loading}
          list={newsList?.data?.news}
        />
      </div>
    </>
  );
};

export default NewsList;
