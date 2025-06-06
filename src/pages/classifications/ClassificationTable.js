import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateClassification from "./CreateClassification";
import TableContainer from "components/Common/DataTableContainer";
import { Button } from "reactstrap";
import { deleteClassification, updateClassification } from "store/actions";

import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import ClassificationDataTable from "components/TableContainers/ClassificationTable";

const ClassificationTable = ({ List, loading,fieldErrors,totalrows }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);

  const permissions = [];

  // const hasEditPermission = permissions.some(item => item?.permissionName === "Edit Classifications");
  // const hasDeletePermission = permissions.some(item => item?.permissionName === "Delete Classifications");

  const handleDelete = (classificationId) => {
    dispatch(deleteClassification(classificationId));
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
        header: 'Classification(En)',
        accessorKey: 'name',
      },
      {
        header: 'Created At',
        accessorKey: 'created_at',
        cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
      },
      ...([
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
                {(
                  <Button color="primary" onClick={handleEdit} className="mr-2">
                    <FaRegEdit size={18} />
                  </Button>
                )}
                {(
                  <Button
                    color="danger"
                    onClick={() => { setDeleteId(row?.original?.id); setOpenModal(true); }}
                    className="mr-2"
                  >
                    <MdDeleteOutline size={18} />
                  </Button>
                )}
              </div>
            );
          },
        },
      ] ),
    ],
    []
  );

  const handleSubmit = (data,id,resetForm,handleClose) => {
    dispatch(updateClassification(data,id,resetForm,handleClose));
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditData('');
  };

  // Meta title
  document.title = "NCSI";

  return (
    <>
      <ConfirmationModal
        okText={"Confirm"}
        onCancel={() => { setDeleteId(''); setOpenModal(false); }}
        onOk={() => { setConfirmAction(true); }}
        isVisible={openModal}
        title="Delete Classification"
        content='Are You Sure You Want to Delete the Classification?'
      />
      <CreateClassification  fieldErrors={fieldErrors} visible={isOpen} initialData={editData} onSubmit={handleSubmit} handleClose={handleClose} />
      <div className="container-fluid">
        <ClassificationDataTable
          loading={loading}
          columns={columns}
          data={List || []}
          isGlobalFilter={true}
          isPagination={true}
          totalrows={totalrows}
          SearchPlaceholder="Search..."
          pagination="pagination"
          docName="Classifications"
          paginationWrapper='dataTables_paginate paging_simple_numbers'
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default ClassificationTable;
