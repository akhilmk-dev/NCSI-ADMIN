import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import CreateMethodology from "./CreateMethodology";
import { deleteMethodology, updateMethodology } from "store/actions";
import { MdDeleteOutline } from "react-icons/md";
import { FaFilePdf, FaRegEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import MethodologyDataTable from "components/TableContainers/MethodologyDataTable";
import Cookies from "js-cookie";

const MethodologyTable = ({ list, loading, fieldErrors, totalrows }) => {
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
  const permissions = JSON.parse(localStorage?.getItem('permissions')) || []
  const hasEditPermission = permissions.includes('methodologies.update');
  const hasDeletePermission = permissions.includes('methodologies.delete')
  const isAdmin = Cookies.get('isAdmin') == "yes"
  

  // DELETE HANDLER
  const handleDelete = (id) => {
    dispatch(deleteMethodology(id));
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

  // COLUMNS
  const columns = useMemo(
    () => [
      {
        header: "Title (EN)",
        accessorKey: "title_en",
        cell: ({ getValue }) => (
          <div style={{ whiteSpace: "normal", wordWrap: "break-word", width: "250px" }}>
            {getValue()}
          </div>
        ),
      },
      {
        header: "Title (AR)",
        accessorKey: "title_ar",
        cell: ({ getValue }) => (
          <div style={{ whiteSpace: "normal", wordWrap: "break-word", width: "250px" }}>
            {getValue()}
          </div>
        ),
      },
      {
        header: "Cover Image",
        accessorKey: "cover_image_url",
        showFilter: false,
        cell: ({ row }) =>
          row.original.cover_image_url ? (
            <img
              src={row.original.cover_image_url}
              alt={row.original.title_en}
              style={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          ) : (
            "No Image"
          ),
      },
      {
        header: "PDF (EN)",
        accessorKey: "pdf_file_url",
        showFilter: false,
        cell: ({ row }) =>
          row.original.pdf_file_url ? (
            <a
              href={row.original.pdf_file_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00A895", textDecoration: "underline" }}
            >
              <FaFilePdf size={28} />
            </a>
          ) : (
            "No File"
          ),
      },
      {
        header: "PDF (AR)",
        accessorKey: "pdf_file_ar_url",
        showFilter: false,
        cell: ({ row }) =>
          row.original.pdf_file_url_ar ? (
            <a
              href={row.original.pdf_file_url_ar}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00A895", textDecoration: "underline" }}
            >
              <FaFilePdf size={28} />
            </a>
          ) : (
            "No File"
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
      ...(isAdmin || hasDeletePermission || hasEditPermission ? [{
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
          const handleEdit = () => {
            setEditData(row.original);
            setIsOpen(true);
          };

          return (
            <div className="d-flex gap-2">
              {(isAdmin || hasEditPermission )&& <Button color="primary" onClick={handleEdit}>
                <FaRegEdit size={18} />
              </Button>}
              {(isAdmin || hasDeletePermission) && <Button
                color="danger"
                onClick={() => {
                  setDeleteId(row.original.id);
                  setOpenModal(true);
                }}
              >
                <MdDeleteOutline size={18} />
              </Button>}
            </div>
          );
        },
      }]:[]),
    ],
    [hasEditPermission,hasDeletePermission,isAdmin]
  );

  const handleSubmit = (formData, id, resetForm, handleClose) => {
    dispatch(updateMethodology(formData, id, resetForm, handleClose));
  };

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
        title={t("Delete Methodology")}
        content={t("Are you sure you want to delete this methodology?")}
      />

      {/* Edit Modal */}
      <CreateMethodology
        loading={loading}
        fieldErrors={fieldErrors}
        visible={isOpen}
        initialData={editData}
        onSubmit={handleSubmit}
        handleClose={handleClose}
      />

      {/* DataTable */}
      <div className="container-fluid">
        <MethodologyDataTable
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
          SearchPlaceholder={t("Search methodology")}
          pagination="pagination"
          docName="Methodology"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default MethodologyTable;
