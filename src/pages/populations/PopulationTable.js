import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

import CreatePopulation from "./CreatePopulation";
import TableContainer from "components/Common/DataTableContainer";
import { deletePopulation, updatePopulation } from "store/actions";
import PopulationDataTable from "components/TableContainers/PopulationDataTable";
import { useTranslation } from "react-i18next";

const PopulationTable = ({ List, loading, fieldErrors, totalrows }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState();
  const [selectedSortData, setSelectedSortData] = useState({ value: "date", direction: "desc" });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("")

  const permissions = [];
  // const hasEditPermission = permissions.some(item => item?.permissionName === "Edit Population");
  // const hasDeletePermission = permissions.some(item => item?.permissionName === "Delete Population");

  const handleDelete = (populationId) => {
    dispatch(deletePopulation(populationId));
    setDeleteId('');
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
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString("en-GB")
    },
    {
      header: 'Omanis',
      accessorKey: 'omanis',
      showFilter: false
    },
    {
      header: 'Expatriates',
      accessorKey: 'expatriates',
      showFilter: false
    },
    ...([
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
          const handleEdit = () => {
            setEditData(row.original);
            setIsOpen(true);
          };

          return (
            <div className="d-flex gap-2">
              {(
                <Button color="primary" onClick={handleEdit}>
                  <FaRegEdit size={18} />
                </Button>
              )}
              {(
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
        }
      }
    ])
  ], []);

  const handleSubmit = (data, id, resetForm, handleClose) => {
    dispatch(updatePopulation(data, id, resetForm, handleClose));
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditData('');
  };

  return (
    <>
      <ConfirmationModal
        okText="Confirm"
        onCancel={() => {
          setDeleteId('');
          setOpenModal(false);
        }}
        onOk={() => setConfirmAction(true)}
        isVisible={openModal}
        title="Delete Population"
        content="Are you sure you want to delete this record?"
      />

      <CreatePopulation
        loading={loading}
        fieldErrors={fieldErrors}
        visible={isOpen}
        initialData={editData}
        onSubmit={handleSubmit}
        handleClose={handleClose}
      />

      <div className="container-fluid">
        <PopulationDataTable
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
          totalrows={totalrows}
          pageInx={0}
          initialPageSize={10}
          loading={loading}
          columns={columns}
          data={List || []}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder={t("Search")}
          pagination="pagination"
          docName="Population"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default PopulationTable;
