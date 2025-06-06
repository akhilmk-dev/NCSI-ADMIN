import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";

import CreateSlider from "./CreateSlider";
import TableContainer from "components/Common/DataTableContainer";
import { deleteSlider, updateSlider } from "store/actions";

import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IMG_URL } from "constants/config";
import SliderDataTable from "components/TableContainers/SliderDataTable";

const SliderTable = ({ List, loading,fieldErrors,totalrows }) => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);

  const permissions = [];
  // const hasEditPermission = permissions.some(item => item?.permissionName === "Edit Sliders");
  // const hasDeletePermission = permissions.some(item => item?.permissionName === "Delete Sliders");

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
      accessorKey: "slider_image_url",
      cell: ({ row }) => (
        <img src={row.original.slider_image_url} alt="slider" height="40" style={{ borderRadius: 5 }} />
      ),
    },
    {
      header: "Image(Ar)",
      accessorKey: "slider_image_ar",
      cell: ({ row }) => (
        <img src={`${IMG_URL}${row.original.slider_image_ar}`} alt="slider" height="40" style={{ borderRadius: 5 }} />
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
      accessorKey: "alt_text",
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
          },
        ]
      ),
  ], []);

  const handleSubmit = (formData,id,resetForm,handleClose) => {
    dispatch(updateSlider(formData,id,resetForm,handleClose));
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
        fieldErrors={fieldErrors}
        visible={isOpen}
        initialData={editData}
        onSubmit={handleSubmit}
        handleClose={handleClose}
      />

      <div className="container-fluid">
        <SliderDataTable
          pageInx={0}
          initialPageSize={10}
          totalrows={totalrows}
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
