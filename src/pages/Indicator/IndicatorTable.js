import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

import CreateIndicator from "./CreateIndicator";
import { deleteIndicator, updateIndicator } from "store/actions";

import { MdDeleteOutline } from "react-icons/md";
import {  FaRegEdit } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import IndicatorDataTable from "components/TableContainers/IndicatorDataTable";

const IndicatorTable = ({ List, loading, fieldErrors, totalrows }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);

  const handleDelete = (id) => {
    dispatch(deleteIndicator(id));
    setDeleteId('');
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
      },
      {
        header: 'Unit',
        accessorKey: 'indicator_value_unit_en',
        showFilter:false
      },
      {
        header: 'Date',
        accessorKey: 'indicator_date',
        cell: ({ row }) => new Date(row.original.indicator_date).toLocaleString(),
      },
      {
        header: 'Next Release',
        accessorKey: 'indicator_next_release_date',
        cell: ({ row }) => new Date(row.original.indicator_next_release_date).toLocaleString(),
      },
       {
            header: "PDF",
            accessorKey: "file_url",
            cell: ({ row }) => (
              row.original.file_url ? (
                <div className="text-center">
                  <a href={row.original.file_url} className="text-center" target="_blank" rel="noopener noreferrer">
                    <FaFilePdf size={23} />
                  </a>
                </div>
              ) : <div className="text-center">N/A</div>
            ),
            showFilter:false
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

  document.title = "NCSI Indicators";

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
        visible={isOpen}
        initialData={editData}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        handleClose={handleClose}
      />
      <div className="container-fluid">
        <IndicatorDataTable
          loading={loading}
          columns={columns}
          data={List || []}
          isGlobalFilter={true}
          isPagination={true}
          totalrows={totalrows}
          SearchPlaceholder="Search..."
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
