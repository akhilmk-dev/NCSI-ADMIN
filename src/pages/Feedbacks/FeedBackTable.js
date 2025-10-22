import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { deleteFeedback } from "store/actions"; // Define these actions
import { useTranslation } from "react-i18next";
import FeedbackDataTable from "components/TableContainers/FeedbackDataTable";

const FeedbackTable = ({ feedbackList, loading, fieldErrors, totalrows }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [selectedSortData, setSelectedSortData] = useState({ value: "created_at", direction: "desc" });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (deleteId && confirmAction) {
      dispatch(deleteFeedback(deleteId));
      setDeleteId(null);
      setOpenModal(false);
      setConfirmAction(false);
      setPageIndex(0);
    }
  }, [deleteId, confirmAction, dispatch]);


  const columns = useMemo(() => [
    {
      header: 'Comment',
      accessorKey: 'comment',
      cell: ({ row }) => (
        <div style={{ maxWidth: '200px' }} >
          <span
            title={row?.original?.comment} 
            style={{
              display: 'inline-block',       
              width: '100%',    
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {row?.original?.comment}
          </span>
        </div>
      )
    },
    {
      header: 'Rating',
      accessorKey: 'rating',
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleString("en-GB"),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            color="danger"
            onClick={() => { setDeleteId(row.original.id); setOpenModal(true); }}
          >
            <MdDeleteOutline size={18} />
          </Button>
        </div>
      ),
    },
  ], []);

  document.title = "Feedback List";

  return (
    <>
      <ConfirmationModal
        okText="Confirm"
        onCancel={() => { setDeleteId(null); setOpenModal(false); }}
        onOk={() => setConfirmAction(true)}
        isVisible={openModal}
        title="Delete Feedback"
        content="Are you sure you want to delete this feedback?"
      />

      <div className="container-fluid">
        <FeedbackDataTable
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
          data={feedbackList || []}
          isGlobalFilter={true}
          isPagination={true}
          totalrows={totalrows}
          SearchPlaceholder={t("Search")}
          pagination="pagination"
          docName="Feedback"
          paginationWrapper='dataTables_paginate paging_simple_numbers'
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default FeedbackTable;
