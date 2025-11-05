import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { deleteUserRequest, updateUserRequest } from "store/actions";
import CreateUser from "./CreateUser";
import ConfirmationModal from "components/Modals/ConfirmationModal";
import TableContainer from '../../components/Common/DataTableContainer';
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import UserDataTable from "components/TableContainers/UserDataTable";


const UserTable = ({ users, loading,totalrows }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [selectedSortData, setSelectedSortData] = useState({ value: "created_at", direction: "desc" });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("");
  const user = useSelector(state=>state?.Login.user)

  // Handle deletion
  const handleDeleteConfirmed = (id) => {
    dispatch(deleteUserRequest(id));
    setOpenModal(false);
    setConfirmAction(false);
  };

  useEffect(() => {
    if (deleteId && confirmAction) {
      handleDeleteConfirmed(deleteId);
    }
  }, [confirmAction]);
  function formatISOToDDMMYYYY(isoDateStr) {
    const date = new Date(isoDateStr);
  
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
  
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getUTCFullYear();
  
    return `${day}/${month}/${year}`;
  }
  

  // Table columns
  const columns = useMemo(() => [
    {
      header: "Name",
      accessorKey: "user_name",
    },
    {
      header: "Email",
      accessorKey: "user_email",
    },
    {
      header: "Phone",
      accessorKey: "user_phone",
    },
    {
  header: "Role",
  accessorKey: "role_name",
  cell: ({ row }) => (
    <span>
      {row.original.role?.name || row.original.role_name || "—"}
    </span>
  ),
},

    {
      header: "Created At",
      accessorKey: "created_at",
      showFilter:true,
      cell:({row})=>(
        <span>{formatISOToDDMMYYYY(row.original.created_at)}</span>
      )
    },
    {
      header: "Status",
      accessorKey: "user_status",
      cell: ({ row }) => (
        <span>{row.original.user_status === 1 ? "Active" : "Inactive"}</span>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const handleEdit = () => {
          setEditData(row.original);
          setIsOpen(true);
        };

        const handleDelete = () => {
          setDeleteId(row.original.user_id);
          setOpenModal(true);
        };

        return (
          <div className="d-flex gap-2">
            <Button color="primary" title="Edit" onClick={handleEdit}>
              <FaRegEdit size={18} />
            </Button>
            <Button color="danger" title="Delete" onClick={handleDelete}>
              <MdDeleteOutline size={18} />
            </Button>
          </div>
        );
      },
    }
  ], []);

  const handleFormSubmit = (id,data, onClose) => {
    dispatch(updateUserRequest(id,data, onClose));
  };

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmationModal
        okText="Confirm"
        onCancel={() => setOpenModal(false)}
        onOk={() => setConfirmAction(true)}
        isVisible={openModal}
        title="Delete User"
        content="Are you sure you want to delete this user?"
      />

      {/* Edit/Create Modal */}
      <CreateUser
        visible={isOpen}
        initialData={editData}
        onSubmit={handleFormSubmit}
        handleClose={() => setIsOpen(false)}
      />

      {/* Data Table */}
      <div className="container-fluid">
        <UserDataTable
          columns={columns}
          loading={loading}
          data={users || []}
          isGlobalFilter
          isPagination
          selectedSortData={selectedSortData}
          setSelectedSortData={setSelectedSortData}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageSize={pageSize}
          setSearchString={setSearchString}
          searchString={searchString}
          SearchPlaceholder="Search users..."
          pagination="pagination"
          docName="Users"
          totalrows={totalrows}
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default UserTable;
