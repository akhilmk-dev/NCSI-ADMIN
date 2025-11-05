import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import Breadcrumb from "components/Common/Breadcrumb2";
import { addSurveyLicense, getSurveyLicenses } from "store/actions"; // Adjust import path
import { useTranslation } from "react-i18next";
import CreateSurveyLicense from "./CreateSurveyLiscence";
import SurveyLicenseTable from "./SurveyLiscenceTable";

const SurveyLicenseList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const surveyLicenses = useSelector((state) => state.SurveyLicense.licenses);
  const loading = useSelector((state) => state.SurveyLicense.loading);
  const error = useSelector((state) => state.SurveyLicense.error);
  const fieldErrors = useSelector((state) => state.SurveyLicense.fieldErrors);

  
  useEffect(() => {
    dispatch(getSurveyLicenses());
  }, [dispatch]);

  
  const handleSubmit = (data, resetForm, handleClose) => {
    dispatch(addSurveyLicense(data, resetForm, handleClose));
  };

  // Handle Close Modal
  const handleClose = () => {
    setIsOpen(false);
  };

  document.title = "Survey Licenses | NCSI";

  return (
    <>
      {/* Create / Edit Modal */}
      <CreateSurveyLicense
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
            title="Survey Licenses"
            breadcrumbItems={[
              { title: "Dashboard", link: "/dashboard" },
              { title: "Survey Licenses", link: "#" },
            ]}
          />
          <Button
            className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
            onClick={() => setIsOpen(true)}
          >
            <i className="ti-plus"></i> {t("Add New")}
          </Button>
        </div>

        {/* Survey License Table */}
        <SurveyLicenseTable
          fieldErrors={fieldErrors}
          totalrows={surveyLicenses?.data?.total}
          loading={loading}
          list={surveyLicenses?.data?.liscences}
        />
      </div>
    </>
  );
};

export default SurveyLicenseList;
