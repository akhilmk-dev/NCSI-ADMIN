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
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";


const EventTable = ({ List, loading, fieldErrors, totalrows }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState();
  const [selectedSortData, setSelectedSortData] = useState({ value: "created_at", direction: "desc" });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("")
  const { t } = useTranslation()
  const isAdmin = Cookies.get('isAdmin') == "yes"
  
  const permissions = JSON.parse(localStorage?.getItem('permissions')) || []
  const hasEditPermission = permissions.includes('events.update');
  const hasDeletePermission = permissions.includes('events.delete')

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
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
      cell: ({ row }) => new Date(row.original.from_date).toLocaleString("en-GB"),
    },
    {
      header: "To Date",
      accessorKey: "to_date",
      cell: ({ row }) => new Date(row.original.to_date).toLocaleString("en-GB"),
    },
    {
      header: "Location",
      accessorKey: "location_en",
      showFilter:false,
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
              <FaFilePdf size={28} />
            </a>
          </div>
        ) : 'N/A'
      ),
      showFilter: false
    },
    ...(isAdmin || hasEditPermission || hasDeletePermission ?[{
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const handleEdit = () => {
          setEditData(row.original);
          setIsOpen(true);
        };

        return (
          <div className="d-flex gap-2">
            {(isAdmin || hasEditPermission) && (
              <Button color="primary" onClick={handleEdit}>
                <FaRegEdit size={18} />
              </Button>
            )}
            {(isAdmin || hasDeletePermission )&&(
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
  ], [hasEditPermission, hasDeletePermission,isAdmin]);

  const handleSubmit = (formData, id, resetForm, handleClose) => {
    dispatch(updateEvent(formData, id, resetForm, handleClose));
    //setIsOpen(false);
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
        loading={loading}
        visible={isOpen}
        initialData={editData}
        onSubmit={handleSubmit}
        handleClose={handleClose}
        fieldErrors={fieldErrors}
      />

      <div className="container-fluid">
        <EventDataTable
          selectedFromDate ={selectedFromDate}
          setSelectedFromDate ={setSelectedFromDate}
          selectedSortData = {selectedSortData}
          setSelectedSortData = {setSelectedSortData}
          pageIndex ={pageIndex}
          setPageIndex = {setPageIndex}
          pageSize ={pageSize}
          setPageSize = {setPageSize}
          searchString = {searchString}
          setSearchString = {setSearchString}
          totalrows={totalrows}
          loading={loading}
          columns={columns}
          data={List || []}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder={t("Search")}
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
