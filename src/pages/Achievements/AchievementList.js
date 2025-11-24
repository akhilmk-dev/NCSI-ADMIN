import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import Breadcrumb from "components/Common/Breadcrumb2";
import CreateAchievement from "./CreateAchievement";
import AchievementTable from "./AchievementTable";
import { addAchievement, getAchievements } from "store/actions";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AchievementList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const achievementList = useSelector((state) => state.Achievement.achievements);
  const loading = useSelector((state) => state.Achievement.loading);
  const fieldErrors = useSelector((state) => state.Achievement.fieldErrors);
  const permissions = JSON.parse(localStorage?.getItem('permissions')) || []
  const hasEditPermission = permissions.includes('achievments.update');
  const hasDeletePermission = permissions.includes('achievments.delete')
  const hasViewPermission = permissions.includes('achievments.view');
  const hasCreatePermission = permissions.includes('achievments.create')
  const hasListPermission = permissions.includes('achievments.list');
    const isAdmin = Cookies.get('isAdmin') == "yes"
  
  useEffect(() => {
    if (!hasEditPermission && !hasDeletePermission && !hasCreatePermission && !hasListPermission && !isAdmin) {
      navigate('/pages-403')
    }
  }, [])

  // Handle Form Submission
  const handleSubmit = (data, resetForm, handleClose) => {
    dispatch(addAchievement(data, resetForm, handleClose));
  };

  // Handle Close Modal
  const handleClose = () => {
    setIsOpen(false);
  };

  // Page Title
  document.title = "Achievements | NCSI";

  return (
    <>
      {/* Create / Edit Modal */}
      <CreateAchievement
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
            title="Achievements"
            breadcrumbItems={[
              { title: "Dashboard", link: "/dashboard" },
              { title: "Achievements", link: "#" },
            ]}
          />
          {(isAdmin || hasCreatePermission) &&<Button
            className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
            onClick={() => setIsOpen(true)}
          >
            <i className="ti-plus"></i> {t("Add New")}
          </Button>}
        </div>

        {/* Achievement Table */}
        <AchievementTable
          fieldErrors={fieldErrors}
          totalrows={achievementList?.data?.total}
          loading={loading}
          list={achievementList?.data?.achievment}
        />
      </div>
    </>
  );
};

export default AchievementList;
