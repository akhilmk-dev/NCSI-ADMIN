import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb2';
import { useTranslation } from 'react-i18next';
import PagesTable from './CmsTable';

const PagesList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const pagesList = useSelector((state) => state.CmsPage.cmsPages);
  const loading = useSelector((state) => state.CmsPage.loading);
  const error = useSelector((state) => state.CmsPage.error);


  document.title = 'Pages | NCSI';

  return (
    <>
      {/* Page Content */}
      <div className="page-content container-fluid">
        <div className="d-flex justify-content-between align-items-center mx-3">
          <Breadcrumb
            title="Pages"
            breadcrumbItems={[
              { title: 'Dashboard', link: '/dashboard' },
              { title: 'Pages', link: '#' },
            ]}
          />
        </div>

        {/* Pages Table */}
        <PagesTable
          totalrows={pagesList?.data?.total}
          loading={loading}
          list={pagesList?.data?.pages}
        />
      </div>
    </>
  );
};

export default PagesList;
