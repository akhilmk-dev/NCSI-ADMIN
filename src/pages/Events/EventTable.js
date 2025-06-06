import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";

import CreateEvent from "./CreateEvent";
import { deleteEvent, updateEvent } from "store/actions";

import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import EventDataTable from "components/TableContainers/EventDataTable";
import { FaFilePdf } from "react-icons/fa6";


const EventTable = ({ List, loading, fieldErrors, totalrows }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);


  const permissions = [];
  const hasEditPermission = permissions.some(item => item?.permissionName === "Edit Events");
  const hasDeletePermission = permissions.some(item => item?.permissionName === "Delete Events");

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    setDeleteId('');
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
      header: "Title",
      accessorKey: "title_en",
      cell: ({ getValue }) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', width: '220px' }}>
          {getValue()}
        </div>
      ),
    },
    {
      header: "From Date",
      accessorKey: "from_date",
      cell: ({ row }) => new Date(row.original.from_date).toLocaleString(),
    },
    {
      header: "To Date",
      accessorKey: "to_date",
      cell: ({ row }) => new Date(row.original.to_date).toLocaleString(),
    },
    {
      header: "Location",
      accessorKey: "location_en",
      cell: ({ getValue }) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', width: '220px' }}>
          {getValue()}
        </div>
      ),
    },
    {
      header: "PDF",
      accessorKey: "pdf_url",
      cell: ({ row }) => (
        row.original.event_pdf ? (
          <div className="text-center">
            <a href={row.original.pdf_url} className="text-center" target="_blank" rel="noopener noreferrer">
              <FaFilePdf size={23} />
            </a>
          </div>
        ) : 'N/A'
      ),
      showFilter:false
    },
    ...([{
      header: "Actions",
      id: "actions",
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
      },
    }]),
  ], [hasEditPermission, hasDeletePermission]);

  const handleSubmit = (formData, id, resetForm, handleClose) => {
    dispatch(updateEvent(formData, id, resetForm, handleClose));
    // setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditData(null);
  };

  return (
    <>
      <ConfirmationModal
        okText={"Confirm"}
        onCancel={() => {
          setDeleteId('');
          setOpenModal(false);
        }}
        onOk={() => setConfirmAction(true)}
        isVisible={openModal}
        title="Delete Event"
        content="Are you sure you want to delete this event?"
      />

      <CreateEvent
        visible={isOpen}
        initialData={editData}
        onSubmit={handleSubmit}
        handleClose={handleClose}
        fieldErrors={fieldErrors}
      />

      <div className="container-fluid">
        <EventDataTable
          totalrows={totalrows}
          loading={loading}
          columns={columns}
          data={List || []}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search..."
          pagination="pagination"
          docName="Events"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default EventTable;
