import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";

import CreateSlider from "./CreateSlider";
import TableContainer from "components/Common/DataTableContainer";
import { deleteSlider, updateSlider } from "store/actions";

import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const SliderTable = ({ List, loading }) => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);

  const permissions = JSON.parse(localStorage?.getItem('permissions')) || [];
  const hasEditPermission = permissions.some(item => item?.permissionName === "Edit Sliders");
  const hasDeletePermission = permissions.some(item => item?.permissionName === "Delete Sliders");

  const handleDelete = (id) => {
    dispatch(deleteSlider(id));
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
      header: "Image",
      accessorKey: "sliderImage",
      cell: ({ row }) => (
        <img src={row.original.sliderImage} alt="slider" height="40" style={{ borderRadius: 5 }} />
      ),
    },
    {
      header: "Link",
      accessorKey: "link",
      cell: ({ row }) => (
        <a href={row.original.link} target="_blank" rel="noopener noreferrer">
          {row.original.link}
        </a>
      ),
    },
    {
      header: "Alt Text",
      accessorKey: "altText",
    },
    ...(
      [
          {
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
                        setDeleteId(row.original.sliderId);
                        setOpenModal(true);
                      }}
                    >
                      <MdDeleteOutline size={18} />
                    </Button>
                  )}
                </div>
              );
            },
          },
        ]
      ),
  ], [hasEditPermission, hasDeletePermission]);

  const handleSubmit = (formData) => {
    dispatch(updateSlider(formData));
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditData('');
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
        title="Delete Slider"
        content="Are you sure you want to delete this slider?"
      />

      <CreateSlider
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
          docName="Sliders"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </>
  );
};

export default SliderTable;
