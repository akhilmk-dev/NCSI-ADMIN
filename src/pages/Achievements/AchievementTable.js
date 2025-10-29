import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Badge } from "reactstrap";
import CreateAchievement from "./CreateAchievement";
import { deleteAchievement, updateAchievement } from "store/actions";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import AchievementDataTable from "components/TableContainers/AchievementDataTable";
import { useTranslation } from "react-i18next";

const AchievementTable = ({ list, loading, fieldErrors, totalrows }) => {
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
    dispatch(deleteAchievement(id));
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
        header: t("Title (EN)"),
        accessorKey: "title_en",
        cell: ({ getValue }) => (
          <div style={{ whiteSpace: "normal", wordWrap: "break-word"}}>
            {getValue()}
          </div>
        ),
      },
      {
        header: t("Title (AR)"),
        accessorKey: "title_ar",
        cell: ({ getValue }) => (
          <div
            style={{
              whiteSpace: "normal",
              wordWrap: "break-word"
            }}
          >
            {getValue()}
          </div>
        ),
      },
      {
        header: t("Achievement Image"),
        accessorKey: "img_url",
        showFilter: false,
        cell: ({ row }) =>
          row.original.img_url ? (
            <img
              src={row.original.img_url}
              alt={row.original.title_en}
              style={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          ) : (
            t("No Image")
          ),
      },
      {
        header: t("Achievement Date"),
        accessorKey: "ach_date",
        cell: ({ row }) =>
          row.original.ach_date
            ? new Date(row.original.ach_date).toLocaleDateString("en-GB")
            : "-",
      },
      {
        header: t("Status"),
        accessorKey: "status",
        cell: ({ row }) =>
          row.original.status ? (
            <span >{t("Active")}</span>
          ) : (
            <span >{t("Inactive")}</span>
          ),
      },
      {
        header: t("Actions"),
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

  const handleSubmit = (formData, id, resetForm, handleClose) => {
    dispatch(updateAchievement(formData, id, resetForm, handleClose));
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
        title={t("Delete Achievement")}
        content={t("Are you sure you want to delete this achievement?")}
      />

      {/* Edit/Create Modal */}
      <CreateAchievement
        loading={loading}
        fieldErrors={fieldErrors}
        visible={isOpen}
        initialData={editData}
        onSubmit={handleSubmit}
        handleClose={handleClose}
      />

      {/* DataTable */}
      <div className="container-fluid">
        <AchievementDataTable
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
          SearchPlaceholder={t("Search achievements")}
          pagination="pagination"
          docName="Achievements"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default AchievementTable;
