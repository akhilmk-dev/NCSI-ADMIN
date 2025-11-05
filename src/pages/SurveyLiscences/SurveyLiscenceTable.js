import { useState, useEffect, useMemo } from "react";
import { Button } from "reactstrap";
import { MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteSurveyLicense, updateSurveyLicense } from "store/actions"; 
import ConfirmationModal from "components/Modals/ConfirmationModal";
import { Modal } from "antd";
import axiosInstance from "pages/Utility/axiosInstance";
import { useTranslation } from "react-i18next";
import SurveyLicenseDataTable from "components/TableContainers/SurveyLicenseDataTable";
import CreateSurveyLicense from "./CreateSurveyLiscence";


const SurveyLicenseTable = ({ list = [], totalrows, loading, fieldErrors }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // === STATES ===
  const [editData, setEditData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [selectedLicense, setSelectedLicense] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewId, setViewId] = useState(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [selectedSortData, setSelectedSortData] = useState({
    value: "created_at",
    direction: "desc",
  });

  // === FETCH SINGLE LICENSE DETAILS FOR VIEW ===
  const fetchLicenseDetails = async () => {
    try {
      const response = await axiosInstance.get(`V1/liscences/view/${viewId}`);
      const licenseData = response.data?.data?.liscences;
      setSelectedLicense(licenseData);
      setShowViewModal(true);
      setViewId(null);
    } catch (error) {
      console.error("Error fetching license details:", error);
    }
  };

  useEffect(() => {
    if (viewId) fetchLicenseDetails();
  }, [viewId]);

  // === DELETE HANDLER ===
  const handleDelete = (id) => {
    dispatch(deleteSurveyLicense(id));
    setDeleteId(null);
    setOpenModal(false);
    setConfirmAction(false);
  };

  useEffect(() => {
    if (deleteId && confirmAction) handleDelete(deleteId);
  }, [deleteId, confirmAction]);

  // 🧾 Table columns
  const columns = useMemo(
    () => [
      { header: "License Number", accessorKey: "licensenumber",cell: ({ getValue }) => getValue() || "N/A", },
      { header: "Title", accessorKey: "title",cell: ({ getValue }) => getValue() || "N/A", },
      { header: "Agency", accessorKey: "agency",cell: ({ getValue }) => getValue() || "N/A", },
      { header: "Sponsor", accessorKey: "sponsor",cell: ({ getValue }) => getValue() || "N/A", },
      { header: "Approval Date", accessorKey: "approval_date",cell: ({ getValue }) => getValue() || "N/A", },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
          const handleView = () => setViewId(row.original.id);
          const handleEdit = () => {
            setEditData(row.original);
            setIsOpen(true);
          };

          return (
            <div className="d-flex gap-2">
             
              <Button
                color="info"
                title="View"
                style={{ backgroundColor: "#00A895" }}
                onClick={handleView}
              >
                <IoEyeOutline size={18} color="white" />
              </Button>

              {/*  Edit Button */}
              <Button color="primary" title="Edit" onClick={handleEdit}>
                <FaRegEdit size={18} />
              </Button>

              {/* Delete Button */}
              <Button
                color="danger"
                title="Delete"
                onClick={() => {
                  setDeleteId(row.original.id);
                  setOpenModal(true);
                }}
              >
                <MdDeleteOutline size={18} />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      {/* === Edit Modal === */}
      <CreateSurveyLicense
        loading={loading}
        fieldErrors={fieldErrors}
        visible={isOpen}
        initialData={editData}
        onSubmit={handleSubmit}
        handleClose={handleClose}
      />

      {/* === View Modal === */}
      <Modal
        title="License Details"
        visible={showViewModal}
        onCancel={() => {
          setShowViewModal(false);
          setSelectedLicense(null);
        }}
        footer={null}
        destroyOnClose
        centered
        width={800}
        className="custom-modal-header p-0"
      >
        {selectedLicense && (
          <div className="p-3">
            {[
              ["License Number", selectedLicense.licensenumber],
              ["Title", selectedLicense.title],
              ["Agency", selectedLicense.agency],
              ["Sponsor", selectedLicense.sponsor],
              ["Agency Representative", selectedLicense.agency_rep],
              ["License Type", selectedLicense.licencetype],
              ["Approval Date", selectedLicense.approval_date],
              [
                "Implementation Period",
                `${selectedLicense.implementation_period_from} → ${selectedLicense.implementation_period_to}`,
              ],
              ["Objective", selectedLicense.objective],
              ["Status", selectedLicense.status === 1 ? "Active" : "Inactive"],
              ["Created At", selectedLicense.created_at],
              ["Updated At", selectedLicense.updated_at],
            ].map(([label, value], idx) => (
              <div key={idx} className="row mb-2">
                <div className="col-4 fw-bold">{label}:</div>
                <div className="col-8">{value || "N/A"}</div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* === Delete Confirmation === */}
      <ConfirmationModal
        okText={"Confirm"}
        onCancel={() => {
          setDeleteId(null);
          setOpenModal(false);
        }}
        onOk={() => setConfirmAction(true)}
        isVisible={openModal}
        title="Delete License"
        content="Are you sure you want to delete this license?"
      />

      {/* === Data Table === */}
      <div className="container-fluid">
        <SurveyLicenseDataTable
          selectedSortData={selectedSortData}
          setSelectedSortData={setSelectedSortData}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchString={searchString}
          setSearchString={setSearchString}
          totalrows={totalrows}
          loading={loading}
          columns={columns}
          data={list || []}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder={t("Search")}
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default SurveyLicenseTable;
