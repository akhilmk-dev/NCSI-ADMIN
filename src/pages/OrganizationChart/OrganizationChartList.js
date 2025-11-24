import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import Breadcrumb from "components/Common/Breadcrumb2";
import CreateOrganizationChart from "./CreateOrganizationChart"; // Modal form
import OrganizationChartTable from "./OrganizationChartTable"; // Table component
import { addOrganizationChart, getOrganizationCharts } from "store/actions";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "pages/Utility/axiosInstance";

const OrganizationChartList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const orgChartList = useSelector((state) => state.OrganizationChart.organizationCharts);
  const loading = useSelector((state) => state.OrganizationChart.loading);
  const error = useSelector((state) => state.OrganizationChart.error);
  const fieldErrors = useSelector((state) => state.OrganizationChart.fieldErrors);
  const permissions = JSON.parse(localStorage?.getItem('permissions')) || []
  const hasEditPermission = permissions.includes('organizationcharts.update');
  const hasDeletePermission = permissions.includes('organizationcharts.delete')
  const hasViewPermission = permissions.includes('organizationcharts.view');
  const hasCreatePermission = permissions.includes('organizationcharts.create')
  const hasListPermission = permissions.includes('organizationcharts.list');
  const isAdmin = Cookies.get('isAdmin') == "yes"
  const [fullList, setFullList] = useState([]);

  
  useEffect(() => {
    if (!hasEditPermission && !hasDeletePermission && !hasCreatePermission && !hasListPermission && !isAdmin) {
      navigate('/pages-403')
    }
  }, [])

  useEffect(() => {
  const fetchFullList = async () => {
    try {
      const response = await axiosInstance.post("V1/organizationcharts/list", {
        pagesize: 10000,
        currentpage: 1,
        sortorder: {},
        searchstring: "",
        filter: {}
      });

       console.log("FULL LIST => ", response?.data?.data?.orgchart);

      setFullList(response?.data?.data?.orgchart || []);
    } catch (err) {
      console.error("Full list fetch failed", err);
    }
  };

  fetchFullList();
}, []);


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
        list={fullList}

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
         { (isAdmin || hasCreatePermission) &&<Button
            className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
            onClick={() => setIsOpen(true)}
          >
            <i className="ti-plus"></i> {t("Add New")}
          </Button>}
        </div>

        {/* Organization Chart Table */}
        <OrganizationChartTable
          fieldErrors={fieldErrors}
          totalrows={orgChartList?.data?.total}
          loading={loading}
          list={orgChartList?.data?.orgchart}
           fullList={fullList}

        />
      </div>
    </>
  );
};

export default OrganizationChartList;
