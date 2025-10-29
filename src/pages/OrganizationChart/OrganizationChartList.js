import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import Breadcrumb from "components/Common/Breadcrumb2";
import CreateOrganizationChart from "./CreateOrganizationChart"; // Modal form
import OrganizationChartTable from "./OrganizationChartTable"; // Table component
import { addOrganizationChart, getOrganizationCharts } from "store/actions";
import { useTranslation } from "react-i18next";

const OrganizationChartList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const orgChartList = useSelector((state) => state.OrganizationChart.organizationCharts);
  const loading = useSelector((state) => state.OrganizationChart.loading);
  const error = useSelector((state) => state.OrganizationChart.error);
  const fieldErrors = useSelector((state) => state.OrganizationChart.fieldErrors);


  // Handle Form Submission
  const handleSubmit = (data, resetForm, handleClose) => {
    dispatch(addOrganizationChart(data, resetForm, handleClose));
  };

  // Handle Close Modal
  const handleClose = () => {
    setIsOpen(false);
  };

  document.title = "Organization Charts | NCSI";

  return (
    <>
      {/* Create / Edit Modal */}
      <CreateOrganizationChart
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
            title="Organization Charts"
            breadcrumbItems={[
              { title: "Dashboard", link: "/dashboard" },
              { title: "Organization Charts", link: "#" },
            ]}
          />
          <Button
            className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
            onClick={() => setIsOpen(true)}
          >
            <i className="ti-plus"></i> {t("Add New")}
          </Button>
        </div>

        {/* Organization Chart Table */}
        <OrganizationChartTable
          fieldErrors={fieldErrors}
          totalrows={orgChartList?.data?.total}
          loading={loading}
          list={orgChartList?.data?.orgchart}
        />
      </div>
    </>
  );
};

export default OrganizationChartList;
