import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb2';
import { useTranslation } from 'react-i18next';
import PagesTable from './CmsTable';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PagesList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const pagesList = useSelector((state) => state.CmsPage.cmsPages);
  const loading = useSelector((state) => state.CmsPage.loading);
  const error = useSelector((state) => state.CmsPage.error);
  const permissions = JSON.parse(localStorage?.getItem('permissions')) || []
  const hasEditPermission = permissions.includes('pages.update');
  const hasDeletePermission = permissions.includes('pages.delete')
  const hasViewPermission = permissions.includes('pages.view');
  const hasCreatePermission = permissions.includes('pages.create')
  const hasListPermission = permissions.includes('pages.list');
  const isAdmin = Cookies.get('isAdmin') == "yes"
  
  useEffect(() => {
    if (!hasEditPermission && !hasDeletePermission && !hasCreatePermission && !hasListPermission && !isAdmin) {
      navigate('/pages-403')
    }
  }, [])


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
