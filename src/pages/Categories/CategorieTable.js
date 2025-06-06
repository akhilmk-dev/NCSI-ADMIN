import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateCategorie from "./CreateCategorie";
import TableContainer from "components/Common/DataTableContainer";
import { Button } from "reactstrap";
import { deleteCategory, updateCategory } from "store/actions";

import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const CategorieTable = ({ List, loading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);

  const permissions =  [];

  // const hasEditPermission = permissions.some(item => item?.permissionName === "Edit Categories");
  // const hasDeletePermission = permissions.some(item => item?.permissionName === "Delete Categories");

  const handleDelete = (categoryId) => {
    dispatch(deleteCategory(categoryId));
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
        header: 'Category',
        accessorKey: 'categoryName',
        enableColumnFilter: false,
        enableSorting: true,
      },
      // Ensure the Actions column has both id and header conditionally
      ...([
        {
          header: 'Actions', // String header for Actions column
          id: 'actions',    // Unique id for Actions column
          cell: ({ row }) => {
            const handleEdit = () => {
              const rowData = row.original;
              setEditData(rowData);
              setIsOpen(true);
            };

            return (
              <div className="d-flex gap-2">
                {hasEditPermission && (
                  <Button color="primary" onClick={handleEdit} className="mr-2">
                    <FaRegEdit size={18} />
                  </Button>
                )}
                {hasDeletePermission && (
                  <Button
                    color="danger"
                    onClick={() => { setDeleteId(row?.original?.categoryId); setOpenModal(true); }}
                    className="mr-2"
                  >
                    <MdDeleteOutline size={18} />
                  </Button>
                )}
              </div>
            );
          },
        },
      ]),  // Only render Actions column if user has Edit or Delete permissions
    ],
    [] // Re-run when permissions change
  );

  const handleSubmit = (data) => {
    dispatch(updateCategory(data));
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
        title="Delete Category"
        content='Are You Sure You Want to Delete the Category'
      />
      <CreateCategorie visible={isOpen} initialData={editData} onSubmit={handleSubmit} handleClose={handleClose} />
      <div className="container-fluid">
        <TableContainer
          loading={loading}
          columns={columns}
          data={List || []}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search..."
          pagination="pagination"
          docName="Categories"
          paginationWrapper='dataTables_paginate paging_simple_numbers'
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default CategorieTable;
