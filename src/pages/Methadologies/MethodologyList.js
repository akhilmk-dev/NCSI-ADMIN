import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb2';
import CreateMethodology from './CreateMethodology'; // Modal form for Methodology
import MethodologyTable from './MethodologyTable'; // Table component for Methodology
import { addMethodology } from 'store/actions';
import { useTranslation } from 'react-i18next';

const MethodologyList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const methodologyList = useSelector((state) => state.Methodologies.methodologies);
  const loading = useSelector((state) => state.Methodologies.loading);
  const error = useSelector((state) => state.Methodologies.error);
  const fieldErrors = useSelector((state) => state.Methodologies.fieldErrors);



  // Handle Form Submission
  const handleSubmit = (data, resetForm, handleClose) => {
    dispatch(addMethodology(data, resetForm, handleClose));
  };

  // Handle Close Modal
  const handleClose = () => {
    setIsOpen(false);
  };

  document.title = 'Methodology | NCSI';

  return (
    <>
      {/* Create / Edit Modal */}
      <CreateMethodology
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
            title="Methodology"
            breadcrumbItems={[
              { title: 'Dashboard', link: '/dashboard' },
              { title: 'Methodology', link: '#' },
            ]}
          />
          <Button
            className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
            onClick={() => setIsOpen(true)}
          >
            <i className="ti-plus"></i> {t('Add New')}
          </Button>
        </div>

        {/* Methodology Table */}
        <MethodologyTable
          fieldErrors={fieldErrors}
          totalrows={methodologyList?.data?.total}
          loading={loading}
          list={methodologyList?.data?.methodolgies}
        />
      </div>
    </>
  );
};

export default MethodologyList;
