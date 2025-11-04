import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { deleteSurveyLicense, updateSurveyLicense } from "store/actions";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import SurveyLicenseDataTable from "components/TableContainers/SurveyLicenseDataTable";
import { useTranslation } from "react-i18next";
import CreateSurveyLicense from "./CreateSurveyLiscence";

const SurveyLicenseTable = ({ list, loading, fieldErrors, totalrows }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [selectedSortData, setSelectedSortData] = useState({
    value: "created_at",
    direction: "desc",
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);

  // DELETE HANDLER
  const handleDelete = (id) => {
    dispatch(deleteSurveyLicense(id));
    setDeleteId(null);
    setPageIndex(0);
    setOpenModal(false);
    setConfirmAction(false);
  };

  useEffect(() => {
    if (deleteId && confirmAction) {
      handleDelete(deleteId);
    }
  }, [deleteId, confirmAction]);

  // TABLE COLUMNS
  const columns = useMemo(
    () => [
      {
        header: "License Number",
        accessorKey: "licensenumber",
      },
      {
        header: "Title",
        accessorKey: "title",
        cell: ({ getValue }) => (
          <div
            style={{
              whiteSpace: "normal",
              wordWrap: "break-word",
              width: "200px",
            }}
          >
            {getValue()}
          </div>
        ),
      },
      {
        header: "Agency",
        accessorKey: "agency",
      },
      {
        header: "Sponsor",
        accessorKey: "sponsor",
      },
      {
        header: "Agency Representative",
        accessorKey: "agency_rep",
      },
      {
        header: "License Type",
        accessorKey: "licencetype",
      },
      {
        header: "Approval Date",
        accessorKey: "approval_date",
        cell: ({ getValue }) =>
          getValue() ? new Date(getValue()).toLocaleDateString("en-GB") : "-",
      },
      {
        header: "Implementation Period (From)",
        accessorKey: "implementation_period_from",
        cell: ({ getValue }) =>
          getValue() ? new Date(getValue()).toLocaleDateString("en-GB") : "-",
      },
      {
        header: "Implementation Period (To)",
        accessorKey: "implementation_period_to",
        cell: ({ getValue }) =>
          getValue() ? new Date(getValue()).toLocaleDateString("en-GB") : "-",
      },
      {
        header: "Objective",
        accessorKey: "objective",
        cell: ({ getValue }) => (
          <div
            style={{
              whiteSpace: "normal",
              wordWrap: "break-word",
              width: "250px",
            }}
          >
            {getValue()}
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => (
          <span
          >
            {getValue() ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        cell: ({ row }) =>
          row.original.created_at
            ? new Date(row.original.created_at).toLocaleString("en-GB")
            : "-",
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
          const handleEdit = () => {
            setEditData(row.original);
            setIsOpen(true);
          };

          return (
            <div className="d-flex gap-2">
              <Button color="primary" onClick={handleEdit}>
                <FaRegEdit size={18} />
              </Button>
              <Button
                color="danger"
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
    [t]
  );

  // UPDATE HANDLER
  const handleSubmit = (formData, id, resetForm, handleClose) => {
    dispatch(updateSurveyLicense(formData, id, resetForm, handleClose));
  };

  // CLOSE MODAL
  const handleClose = () => {
    setIsOpen(false);
    setEditData(null);
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        okText={t("Confirm")}
        onCancel={() => {
          setDeleteId(null);
          setOpenModal(false);
        }}
        onOk={() => setConfirmAction(true)}
        isVisible={openModal}
        title={t("Delete Survey License")}
        content={t("Are you sure you want to delete this survey license?")}
      />

      {/* Edit Modal */}
      <CreateSurveyLicense
        loading={loading}
        fieldErrors={fieldErrors}
        visible={isOpen}
        initialData={editData}
        onSubmit={handleSubmit}
        handleClose={handleClose}
      />

      {/* DataTable */}
      <div className="container-fluid">
        <SurveyLicenseDataTable
          selectedFromDate={selectedFromDate}
          setSelectedFromDate={setSelectedFromDate}
          selectedSortData={selectedSortData}
          setSelectedSortData={setSelectedSortData}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchString={searchString}
          setSearchString={setSearchString}
          loading={loading}
          columns={columns}
          data={list || []}
          isGlobalFilter={true}
          isPagination={true}
          totalrows={totalrows}
          SearchPlaceholder={t("Search survey licenses")}
          pagination="pagination"
          docName="Survey Licenses"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default SurveyLicenseTable;
