import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";

import CreatePublication from "./CreatePublication";
import TableContainer from "components/Common/DataTableContainer";
import { deletePublication, updatePublication } from "store/actions";

import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const PublicationTable = ({ list, loading }) => {
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
            accessorKey: "title",
        },
        {
            header: "Title (AR)",
            accessorKey: "titleAr",
            cell: ({ row }) => (
                <div dir="rtl" style={{ whiteSpace: 'normal', wordBreak: 'break-word', textAlign: 'right' }}>
                    {row.original.titleAr}
                </div>
            ),
        },
        {
            header: "Cover Image",
            accessorKey: "coverImage",
            cell: ({ row }) => (
                row.original.coverImage ? (
                    <img
                        src={row.original.coverImage}
                        alt={row.original.title}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                    />
                ) : 'No Image'
            ),
        },
        {
            header: "PDF",
            accessorKey: "pdf",
            cell: ({ row }) => (
                row.original.pdf ? (
                    <a href={row.original.pdf} target="_blank" rel="noopener noreferrer">
                        View PDF
                    </a>
                ) : 'No PDF'
            ),
        },
        {
            header: "Show in Home",
            accessorKey: "showInHome",
            cell: ({ row }) => (
                row.original.showInHome ? 'Yes' : 'No'
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
            accessorKey: "classification",
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
                                    setDeleteId(row.original.publicationId);
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

    const handleSubmit = (formData) => {
        dispatch(updatePublication(formData));
        setIsOpen(false);
        setEditData(null);
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
                visible={isOpen}
                initialData={editData}
                onSubmit={handleSubmit}
                handleClose={handleClose}
            />

            <div className="container-fluid">
                <TableContainer
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
