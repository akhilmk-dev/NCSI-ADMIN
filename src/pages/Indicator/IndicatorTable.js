import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

import CreateIndicator from "./CreateIndicator";
import { deleteIndicator, updateIndicator } from "store/actions";

import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import IndicatorDataTable from "components/TableContainers/IndicatorDataTable";
import { useTranslation } from "react-i18next";

const IndicatorTable = ({ List, loading, fieldErrors, totalrows }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [selectedSortData, setSelectedSortData] = useState({ value: "indicator_date", direction: "asc" });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("")

  const handleDelete = (id) => {
    dispatch(deleteIndicator(id));
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

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'indicator_title_en',
      },
      {
        header: 'Value',
        accessorKey: 'indicator_value',
        showFilter: false
      },
      {
        header: 'Unit',
        accessorKey: 'indicator_value_unit_en',
        showFilter: false
      },
      {
        header: 'Date',
        accessorKey: 'indicator_date',
        cell: ({ row }) => new Date(row.original.indicator_date).toLocaleString("en-GB"),
      },
      {
        header: 'Next Release',
        accessorKey: 'indicator_next_release_date',
        cell: ({ row }) => new Date(row.original.indicator_next_release_date).toLocaleString("en-GB"),
      },
      {
        header: "PDF",
        accessorKey: "file_url",
        cell: ({ row }) => (
          (row.original.file_url || row.original?.pub_file)? (
            <div className="text-center">
              <a href={row.original.file_url ? row.original.file_url : `https://api.ncsi.gov.om/uploads/pdfs/${row?.original?.pub_file}`} className="text-center" target="_blank" rel="noopener noreferrer">
                <FaFilePdf size={28} />
              </a>
            </div>
          ) : <div className="text-center">N/A</div>
        ),
        showFilter: false
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
          const handleEdit = () => {
            const rowData = row.original;
            setEditData(rowData);
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
                  setDeleteId(row?.original?.id);
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

  const handleSubmit = (formData, id, resetForm, closeModal) => {
    dispatch(updateIndicator(formData, id, resetForm, closeModal));
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
        title="Delete Indicator"
        content="Are you sure you want to delete this indicator?"
      />
      <CreateIndicator
        loading={loading}
        visible={isOpen}
        initialData={editData}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        handleClose={handleClose}
      />
      <div className="container-fluid">
        <IndicatorDataTable
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
          data={List || []}
          isGlobalFilter={true}
          isPagination={true}
          totalrows={totalrows}
          SearchPlaceholder={t("Search")}
          pagination="pagination"
          docName="Indicators"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default IndicatorTable;
