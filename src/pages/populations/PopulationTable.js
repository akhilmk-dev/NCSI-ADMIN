import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

import CreatePopulation from "./CreatePopulation";
import TableContainer from "components/Common/DataTableContainer";
import { deletePopulation, updatePopulation } from "store/actions";

const PopulationTable = ({ List, loading }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);

  const permissions = JSON.parse(localStorage?.getItem("permissions")) || [];
  const hasEditPermission = permissions.some(item => item?.permissionName === "Edit Population");
  const hasDeletePermission = permissions.some(item => item?.permissionName === "Delete Population");

  const handleDelete = (populationId) => {
    dispatch(deletePopulation(populationId));
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
      header: 'Date',
      accessorKey: 'date',
      enableColumnFilter: false,
      enableSorting: true,
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString()
    },
    {
      header: 'Omanis',
      accessorKey: 'omanis',
    },
    {
      header: 'Expatriates',
      accessorKey: 'expatriates',
    },
    ...([
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
          const handleEdit = () => {
            setEditData(row.original);
            setIsOpen(true);
          };

          return (
            <div className="d-flex gap-2">
              { (
                <Button color="primary" onClick={handleEdit}>
                  <FaRegEdit size={18} />
                </Button>
              )}
              {(
                <Button
                  color="danger"
                  onClick={() => {
                    setDeleteId(row.original.populationId);
                    setOpenModal(true);
                  }}
                >
                  <MdDeleteOutline size={18} />
                </Button>
              )}
            </div>
          );
        }
      }
    ])
  ], []);

  const handleSubmit = (data) => {
    dispatch(updatePopulation(data));
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditData('');
  };

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
        title="Delete Population"
        content="Are you sure you want to delete this record?"
      />

      <CreatePopulation
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
          docName="Population"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default PopulationTable;
