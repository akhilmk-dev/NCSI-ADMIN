import React, { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { deleteUserRequest, updateUser, updateUserRequest } from "store/actions";
import CreateUser from "./CreateUser";
import ConfirmationModal from "components/Modals/ConfirmationModal";
import TableContainer from '../../components/Common/DataTableContainer';
import { FaKey } from "react-icons/fa";
import PasswordResetModal from "./ResetPassword";
import axiosInstance from "pages/Utility/axiosInstance";
import { showSuccess } from "helpers/notification_helper";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const UserTable = ({ List, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [userId, setUserId] = useState();

  const permissions2 = JSON.parse(localStorage?.getItem('permissions'));

  // Handle deletion of user
  const handleDelete = (userId) => {
    dispatch(deleteUserRequest(userId));
    setDeleteId("");
    setOpenModal(false);
    setConfirmAction(false);
  };

  const handlePassword = (id) => {
    setUserId(id)
    setPasswordModalOpen(true);
  }

  const handlePasswordSubmit = async (pwd) => {
    const response = await axiosInstance.post('', {
      "sp": "usp_ResetUserPassword",
      "userId": userId,
      "newPassword": pwd

    })
    if (response) {
      showSuccess("Password Reset Successfully")
    }
  }

  // Effect hook to confirm and handle deletion
  useEffect(() => {
    if (deleteId && confirmAction) {
      handleDelete(deleteId);
    }
  }, [deleteId, confirmAction]);

  // Table columns definition
  const columns = useMemo(
    () => [
      {
        header: "User Name",
        accessorKey: "userName",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <span
          >
            {row.original.userName}
          </span>
        ),
      },
      {
        header: "Email",
        accessorKey: "emailId",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Phone Number",
        accessorKey: "phoneNo",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Role",
        accessorKey: "roleName",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Branch",
        accessorKey: "branchName",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Employee Id",
        accessorKey: "employeeId",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Status",
        accessorKey: "isActive",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <span>
            {row.original.isActive ? "Active" : "InActive"}
          </span>
        ),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
          const handleEdit = () => {
            const rowData = row.original;
            setEditData(rowData);
            setIsOpen(true);
          };

          const handleDelete = () => {
            const rowData = row.original;
            setDeleteId(rowData.userId);
            setOpenModal(true);
          };

          return (
            <div className="d-flex gap-2">
              {permissions2?.map(item => item?.permissionName)?.includes("Edit Users") && <Button color="primary" title="Edit user" onClick={handleEdit} className="mr-2">
                <FaRegEdit size={18} />
              </Button>}
              {permissions2?.map(item => item?.permissionName)?.includes("Delete Users") && <Button
                color="danger"
                onClick={handleDelete}
                className="mr-2"
                title="Delete"
              >
                <MdDeleteOutline size={18} />
              </Button>}
              {permissions2?.map(item => item?.permissionName)?.includes("Reset Password") && <Button
                color="primary"
                onClick={() => handlePassword(row.original.userId)}
                title="Reset Password"
              >
                <FaKey color="white" />
              </Button>}
            </div>
          );
        },
      },
    ],
    []
  );

  // Handle form submit (update user)
  const handleSubmit = (data,onClose) => {
    dispatch(updateUserRequest(data,onClose));
  };

  // Handle modal close
  const handleClose = () => {
    setIsOpen(false);
  };

  // Meta title
  document.title = "User Management | Admin Dashboard";

  return (
    <>
      {/* Confirmation Modal for Deleting User */}
      <ConfirmationModal
        okText={"Confirm"}
        onCancel={() => {
          setDeleteId("");
          setOpenModal(false);
        }}
        onOk={() => setConfirmAction(true)}
        isVisible={openModal}
        title="Delete User"
        content="Are you sure you want to delete this user?"
      />

      {/* Create/Edit User Modal */}
      <CreateUser
        visible={isOpen}
        initialData={editData} // Pass initial data for editing
        onSubmit={handleSubmit}
        handleClose={handleClose}
      />

      <PasswordResetModal onSubmit={handlePasswordSubmit} handleClose={() => setPasswordModalOpen(false)} visible={passwordModalOpen} />

      <div className="container-fluid">
        {/* Data Table Container to Display Users */}
        <TableContainer
          columns={columns}
          loading={loading}
          data={List || []}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search users..."
          pagination="pagination"
          docName="Users"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default UserTable;
