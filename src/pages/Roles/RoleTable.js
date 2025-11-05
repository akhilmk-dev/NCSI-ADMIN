import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmationModal from "components/Modals/ConfirmationModal";
import { deleteRole } from "store/actions"; // Redux action to delete role
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";
import TableContainer from "components/Common/DataTableContainer";
import RolesDataTable from "components/TableContainers/RolesDataTable";

const RolesTable = ({ list, loading,total }) => {
  console.log(list)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [selectedSortData, setSelectedSortData] = useState({
    value: "created_at",
    direction: "desc",
  });

  // Permissions from localStorage
//   const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
//   const hasEditPermission = permissions.some(p => p.permission_name === "Edit Role");
//   const hasDeletePermission = permissions.some(p => p.permission_name === "Delete Role");

  // Handle delete action
  const handleDelete = (roleId) => {
    dispatch(deleteRole(roleId));
    setDeleteId(null);
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
      header: t("Role Name"),
      accessorKey: "name",
      enableColumnFilter: false,
      enableSorting: true,
    },
          {
            header: t("Actions"),
            id: "actions",
            cell: ({ row }) => {
              const rowData = row.original;

              const handleEdit = () => {
                navigate(`/createRole?id=${rowData?.id}`);
              };

              return (
                <div className="d-flex gap-2">
                  {(
                    <Button color="primary" onClick={handleEdit} title={t("Edit")}>
                      <FaRegEdit color="white" size={18} />
                    </Button>
                  )}
                  {(
                    <Button
                      color="danger"
                      onClick={() => {
                        setDeleteId(rowData?.id);
                        setOpenModal(true);
                      }}
                      title={t("Delete")}
                    >
                      <MdDelete color="white" size={18} />
                    </Button>
                  )}
                </div>
              );
            },
          }
  ], [ t, navigate]);

  // Meta title
  document.title = "Roles | Your Admin Dashboard";

  return (
    <>
      <ConfirmationModal
        okText={t("Confirm")}
        onCancel={() => {
          setDeleteId(null);
          setOpenModal(false);
        }}
        onOk={() => {
          setConfirmAction(true);
        }}
        isVisible={openModal}
        title={t("Delete Role")}
        content={t("Are you sure you want to delete this role?")}
      />

      <div className="container-fluid">
         <RolesDataTable
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
          data={list || []}
          isGlobalFilter={true}
          isPagination={true}
          totalrows={total}
          SearchPlaceholder={t("Search statistics")}
          pagination="pagination"
          docName="Statistics"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default RolesTable;
