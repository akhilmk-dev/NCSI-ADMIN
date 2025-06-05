import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";

import CreatePublication from "./CreatePublication";
// import TableContainer from "components/Common/DataTableContainer";
import { deletePublication, updatePublication } from "store/actions";

import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import PublicationDataTable from "components/TableContainers/PublicationDataTable";

const PublicationTable = ({ list, loading,classifications,fieldErrors }) => {
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(false);

    const permissions = JSON.parse(localStorage?.getItem('permissions')) || [];
    const hasEditPermission = permissions.some(item => item?.permissionName === "Edit Publications");
    const hasDeletePermission = permissions.some(item => item?.permissionName === "Delete Publications");

    const handleDelete = (id) => {
        dispatch(deletePublication(id));
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
            header: "Title (EN)",
            accessorKey: "title_en",
        },
        {
            header: "Title (AR)",
            accessorKey: "title_ar",
            cell: ({ row }) => (
                <div style={{ whiteSpace: 'normal', wordBreak: 'break-word',}}>
                    {row.original.title_ar}
                </div>
            ),
        },
        {
            header: "Cover Image",
            accessorKey: "cover_image_url",
            cell: ({ row }) => (
                row.original.cover_image_url ? (
                    <img
                        src={row.original.cover_image_url}
                        alt={row.original.title_en}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                    />
                ) : 'No Image'
            ),
        },
        {
            header: "PDF",
            accessorKey: "pdf_file_url",
            cell: ({ row }) => (
                row.original.pdf_file_url ? (
                    <a href={row.original.pdf_file_url} target="_blank" rel="noopener noreferrer">
                        View PDF
                    </a>
                ) : 'No PDF'
            ),
        },
        {
            header: "Show in Home",
            accessorKey: "show_in_home",
            cell: ({ row }) => (
                row.original.show_in_home ? 'Yes' : 'No'
            ),
        },
        {
            header: "Type",
            accessorKey: "type",
            cell: ({ row }) => (
                row.original.type 
            ),
        },
        {
            header: "Classification",
            accessorKey: "classification_id",
        },

        ...([{
            header: "Actions",
            id: "actions",
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
        }]),
    ], [hasEditPermission, hasDeletePermission]);

    const handleSubmit = (formData,id,resetForm,handleClose) => {
        dispatch(updatePublication(formData,id,resetForm,handleClose));
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
                    setDeleteId(null);
                    setOpenModal(false);
                }}
                onOk={() => setConfirmAction(true)}
                isVisible={openModal}
                title="Delete Publication"
                content="Are you sure you want to delete this publication?"
            />

            <CreatePublication
                fieldErrors={fieldErrors}
                classifications={classifications}
                visible={isOpen}
                initialData={editData}
                onSubmit={handleSubmit}
                handleClose={handleClose}
            />

            <div className="container-fluid">
                <PublicationDataTable
                    loading={loading}
                    columns={columns}
                    data={list || []}
                    isGlobalFilter={true}
                    isPagination={true}
                    SearchPlaceholder="Search publications..."
                    pagination="pagination"
                    docName="Publications"
                    paginationWrapper="dataTables_paginate paging_simple_numbers"
                    tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                />
            </div>
        </>
    );
};

export default PublicationTable;
