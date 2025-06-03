import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";

import CreateEvent from "./CreateEvent";
import TableContainer from "components/Common/DataTableContainer";
import { deleteEvent, updateEvent } from "store/actions";

import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const EventTable = ({ List, loading }) => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);

  const permissions = JSON.parse(localStorage?.getItem('permissions')) || [];
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
      header: "Title (EN)",
      accessorKey: "title",
    },
    {
      header: "Title (AR)",
      accessorKey: "titleAr",
      cell: ({ row }) => (
        <div dir="rtl" style={{ whiteSpace: 'normal', wordBreak: 'break-word', textAlign: 'right' }}>
          {row.original.titleAr}
        </div>
      ),
    },
    {
      header: "Short Description (EN)",
      accessorKey: "shortDescription",
      cell: ({ row }) => (
        <div style={{ maxWidth: 300, whiteSpace: 'normal', wordBreak: 'break-word' }}>
          {row.original.shortDescription}
        </div>
      ),
    },
    {
      header: "Short Description (AR)",
      accessorKey: "shortDescriptionAr",
      cell: ({ row }) => (
        <div dir="rtl" style={{ maxWidth: 300, whiteSpace: 'normal', wordBreak: 'break-word', textAlign: 'right' }}>
          {row.original.shortDescriptionAr}
        </div>
      ),
    },
    {
      header: "From Date",
      accessorKey: "fromDate",
      cell: ({ row }) => new Date(row.original.fromDate).toLocaleString(),
    },
    {
      header: "To Date",
      accessorKey: "toDate",
      cell: ({ row }) => new Date(row.original.toDate).toLocaleString(),
    },
    {
      header: "Location (EN)",
      accessorKey: "location",
    },
    {
      header: "Location (AR)",
      accessorKey: "locationAr",
      cell: ({ row }) => (
        <div dir="rtl" style={{ textAlign: 'right' }}>
          {row.original.locationAr}
        </div>
      ),
    },
    {
      header: "Event Type (EN)",
      accessorKey: "eventType",
    },
    {
      header: "Event Type (AR)",
      accessorKey: "eventTypeAr",
      cell: ({ row }) => (
        <div dir="rtl" style={{ textAlign: 'right' }}>
          {row.original.eventTypeAr}
        </div>
      ),
    },
    {
      header: "Speaker (EN)",
      accessorKey: "eventSpeaker",
    },
    {
      header: "Speaker (AR)",
      accessorKey: "eventSpeakerAr",
      cell: ({ row }) => (
        <div dir="rtl" style={{ textAlign: 'right' }}>
          {row.original.eventSpeakerAr}
        </div>
      ),
    },
    {
      header: "Event PDF",
      accessorKey: "eventPdf",
      cell: ({ row }) => (
        row.original.eventPdf ? (
          <a href={row.original.eventPdf} target="_blank" rel="noopener noreferrer">
            View PDF
          </a>
        ) : 'No PDF'
      ),
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
            { (
              <Button
                color="danger"
                onClick={() => {
                  setDeleteId(row.original.eventId);
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

  const handleSubmit = (formData) => {
    dispatch(updateEvent(formData));
    setIsOpen(false);
    setEditData(null);
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
      />

      <div className="container-fluid">
        <TableContainer
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
