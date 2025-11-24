import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { deleteGuideClassification, updateGuideClassification } from "store/actions";
import EventDataTable from "components/TableContainers/EventDataTable";
import GuideClassificationDataTable from "components/TableContainers/GuideClassificationDataTable";
import CreateGuideClassification from "./GuideClassificationCreate";
import Cookies from "js-cookie";

const GuideClassificationTable = ({ List, loading, fieldErrors, totalrows }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [selectedSortData, setSelectedSortData] = useState({ value: "created_at", direction: "desc" });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("");
  const { t } = useTranslation();
  const permissions = JSON.parse(localStorage?.getItem('permissions')) || []
  const hasEditPermission = permissions.includes('guideclassifications.update');
  const hasDeletePermission = permissions.includes('guideclassifications.delete')
  const isAdmin = Cookies.get('isAdmin') == "yes"
  

  const handleDelete = (id) => {
    dispatch(deleteGuideClassification(id));
    setDeleteId("");
    setPageIndex(0);
    setOpenModal(false);
    setConfirmAction(false);
  };

  useEffect(() => {
    if (deleteId && confirmAction) {
      handleDelete(deleteId);
    }
  }, [deleteId, confirmAction]);

  const columns = useMemo(() => [
    {
      header: t("Title (English)"),
      accessorKey: "title_en",
      cell: ({ getValue }) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', width: '220px' }}>
          {getValue()}
        </div>
      ),
    },
    {
      header: t("Title (Arabic)"),
      accessorKey: "title_ar",
      cell: ({ getValue }) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', width: '220px' }}>
          {getValue()}
        </div>
      ),
    },
    {
      header: t("Cover Image"),
      accessorKey: "cover_image",
      showFilter: false,
      cell: ({ row }) => (
        row.original.cover_image ? (
          <div className="text-center">
            <a href={row.original.cover_image_url} target="_blank" rel="noopener noreferrer">
              <img
                src={row.original.cover_image_url}
                alt="cover"
                width="50"
                height="50"
                style={{ borderRadius: "5px", objectFit: "cover" }}
              />
            </a>
          </div>
        ) : "N/A"
      ),
    },
    {
      header: t("PDF (English)"),
      accessorKey: "pdf_file_url",
      showFilter:false,
      cell: ({ row }) => (
        row.original.pdf_file_url ? (
          <div className="text-center">
            <a href={row.original.pdf_file_url} target="_blank" rel="noopener noreferrer">
              <FaFilePdf size={28} />
            </a>
          </div>
        ) : "N/A"
      ),
    },
    {
      header: t("PDF (Arabic)"),
      accessorKey: "pdf_file_url_ar",
      showFilter: false,
      cell: ({ row }) => (
        row.original.pdf_file_url_ar ? (
          <div className="text-center">
            <a href={row.original.pdf_file_url_ar} target="_blank" rel="noopener noreferrer">
              <FaFilePdf size={28} />
            </a>
          </div>
        ) : "N/A"
      ),
    },
    {
      header: t("Status"),
      accessorKey: "status",
      cell: ({ getValue }) => (
        <span
        >
          {getValue() ? t("Active") : t("Inactive")}
        </span>
      ),
    },
    ...(isAdmin || hasEditPermission || hasDeletePermission ? [{
      header: t("Actions"),
      id: "actions",
      cell: ({ row }) => {
        const handleEdit = () => {
          setEditData(row.original);
          setIsOpen(true);
        };

        return (
          <div className="d-flex gap-2 justify-content-center">
            { (isAdmin || hasEditPermission) &&(
              <Button color="primary" onClick={handleEdit}>
                <FaRegEdit size={18} />
              </Button>
            )}
            {(isAdmin || hasDeletePermission) && (
              <Button
                color="danger"
                onClick={() => {
                  setDeleteId(row.original.id);
                  setOpenModal(true);
                }}
              >
                <MdDeleteOutline size={18} />
              </Button>
            )}
          </div>
        );
      },
    }]:[]),
  ], [hasEditPermission, hasDeletePermission, t,isAdmin]);

  const handleSubmit = (formData, id, resetForm, handleClose) => {
    dispatch(updateGuideClassification(formData, id, resetForm, handleClose));
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditData(null);
  };

  return (
    <>
      {/* Delete Confirmation */}
      <ConfirmationModal
        okText={t("Confirm")}
        onCancel={() => {
          setDeleteId("");
          setOpenModal(false);
        }}
        onOk={() => setConfirmAction(true)}
        isVisible={openModal}
        title={t("Delete Classification")}
        content={t("Are you sure you want to delete this classification?")}
      />

      {/* Add/Edit Modal */}
      <CreateGuideClassification
        loading={loading}
        visible={isOpen}
        initialData={editData}
        onSubmit={handleSubmit}
        handleClose={handleClose}
        fieldErrors={fieldErrors}
      />

      {/* Table */}
      <div className="container-fluid">
        <GuideClassificationDataTable
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
          data={List || []}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder={t("Search")}
          pagination="pagination"
          docName="Guide Classifications"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default GuideClassificationTable;
