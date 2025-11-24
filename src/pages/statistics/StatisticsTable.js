import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import CreateStatistics from "./CreateStatistics";
import { deleteStatistics, updateStatistics } from "store/actions";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import StatisticsDataTable from "components/TableContainers/StatisticsDataTable";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { convertToDateOnly } from "helpers/dateFormat_helper";

const StatisticsTable = ({ list, loading, fieldErrors, totalrows }) => {
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
  const hasEditPermission = permissions.includes('statistics.update');
  const hasDeletePermission = permissions.includes('statistics.delete')
  const isAdmin = Cookies.get('isAdmin') == "yes"
  

  // DELETE HANDLER
  const handleDelete = (id) => {
    dispatch(deleteStatistics(id));
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
        header: "Indicator (EN)",
        accessorKey: "indicator_en",
        cell: ({ getValue }) => (
          <div style={{ whiteSpace: "normal", wordWrap: "break-word", width: "250px" }}>
            {getValue()}
          </div>
        ),
      },
      {
        header: "Indicator (AR)",
        accessorKey: "indicator_ar",
        cell: ({ getValue }) => (
          <div style={{ whiteSpace: "normal", wordWrap: "break-word", width: "250px" }}>
            {getValue()}
          </div>
        ),
      },
      {
        header: "Description (EN)",
        accessorKey: "description_en",
        cell: ({ getValue }) => (
          <div style={{ whiteSpace: "normal", wordWrap: "break-word", width: "300px" }}>
            {getValue()}
          </div>
        ),
      },
      {
        header: "Description (AR)",
        accessorKey: "description_ar",
        cell: ({ getValue }) => (
          <div style={{ whiteSpace: "normal", wordWrap: "break-word", width: "300px" }}>
            {getValue()}
          </div>
        ),
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        cell: ({ row }) =>
          row.original.created_at
            ? convertToDateOnly(row.original.created_at)
            : "-",
      },
      ...(isAdmin || hasEditPermission|| hasDeletePermission ?[{
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
          const handleEdit = () => {
            setEditData(row.original);
            setIsOpen(true);
          };

          return (
            <div className="d-flex gap-2">
              {(isAdmin || hasEditPermission) && <Button color="primary" onClick={handleEdit}>
                <FaRegEdit size={18} />
              </Button>}
              {(isAdmin || hasDeletePermission) &&<Button
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
    dispatch(updateStatistics(formData, id, resetForm, handleClose));
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
        title={t("Delete Statistic")}
        content={t("Are you sure you want to delete this statistic?")}
      />

      {/* Edit Modal */}
      <CreateStatistics
        loading={loading}
        fieldErrors={fieldErrors}
        visible={isOpen}
        initialData={editData}
        onSubmit={handleSubmit}
        handleClose={handleClose}
      />

      {/* DataTable */}
      <div className="container-fluid">
        <StatisticsDataTable
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
          SearchPlaceholder={t("Search statistics")}
          pagination="pagination"
          docName="Statistics"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default StatisticsTable;
