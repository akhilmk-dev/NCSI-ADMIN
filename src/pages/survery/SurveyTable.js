import ConfirmationModal from "components/Modals/ConfirmationModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { deleteSurvey, updateSurvey } from "store/actions";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import EventDataTable from "components/TableContainers/EventDataTable";
import { useTranslation } from "react-i18next";
import SurveyDataTable from "components/TableContainers/SurveyDataTable";
import { Modal } from "antd";
import axiosInstance from "pages/Utility/axiosInstance";
import { IoEyeOutline } from "react-icons/io5";

const SurveyTable = ({ List, loading, fieldErrors, totalrows }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(false);
    const [selectedFromDate, setSelectedFromDate] = useState();
    const [selectedSortData, setSelectedSortData] = useState({ value: "created_at", direction: "desc" });
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchString, setSearchString] = useState("");
    const [editId, setEditId] = useState();
    const permissions = [];
    const hasDeletePermission = permissions.some(item => item?.permissionName === "Delete Surveys");

    const handleDelete = (id) => {
        dispatch(deleteSurvey(id));
        setPageIndex(0)
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
        { header: "Code", accessorKey: "code" },
        { header: "Subject", accessorKey: "subject", showFilter: false },
        { header: "Requester", accessorKey: "requester", showFilter: false },

        { header: "From", accessorKey: "duration_from", cell: ({ row }) => new Date(row.original.duration_from).toLocaleDateString("en-GB") },
        { header: "To", accessorKey: "duration_to", cell: ({ row }) => new Date(row.original.duration_to).toLocaleDateString("en-GB") },
        // Files
        {
            header: "Created At",
            accessorKey: "created_at",
            cell: ({ row }) => new Date(row.original.created_at).toLocaleString("en-GB")
        },
        {
            header: "Actions",
            id: "actions",
            cell: ({ row }) => {
                const handleView = () => {
                    setEditId(row.original.id)
                };

                return (
                    <div className="d-flex gap-2">
                        <Button color="info" title="View" style={{ backgroundColor: "#00A895" }} className="cursor-pointer" onClick={handleView}>
                            <IoEyeOutline size={18} color="white" />
                        </Button>
                        <Button
                            color="danger"
                            className="cursor-pointer"
                            title="Delete"
                            onClick={() => {
                                setDeleteId(row.original.id);
                                setOpenModal(true);
                            }}
                        >
                            <MdDeleteOutline size={18} />
                        </Button>
                    </div>
                );
            },
        },
    ], [hasDeletePermission]);

    const fetchShowData = async () => {
        try {
            const response = await axiosInstance.get(`V1/surveyrequests/view/${editId}`);
            console.log(response?.data?.data)
            setSelectedSurvey(response?.data?.data)
            setShowViewModal(true);
            setEditId("")
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (editId) {
            fetchShowData()
        }
    }, [editId])

    return (
        <>
            {<Modal
                title="Survey Details"
                visible={showViewModal}
                onCancel={() => {
                    setShowViewModal(false);
                    setSelectedSurvey(null);
                }}
                footer={null}
                destroyOnClose
                centered
                width={800}
                className="custom-modal-header p-0"
                maskClosable={false}
            >
                {selectedSurvey && (
                    <div className="p-3">
                        {[
                            ["Code", selectedSurvey.code],
                            ["Subject", selectedSurvey.subject],
                            ["Requester", selectedSurvey.requester],
                            ["Institute", selectedSurvey.institute],
                            ["Contact Person", selectedSurvey.contact_person],
                            ["Email", selectedSurvey.email],
                            ["Telephone", selectedSurvey.telephone],
                            ["Title", selectedSurvey.title],
                            ["Duration", `${selectedSurvey.duration_from} to ${selectedSurvey.duration_to}`],
                            ["Coverage", selectedSurvey.coverage],
                            ["Sample Size", selectedSurvey.sample_size],
                            ["Sample Frame", selectedSurvey.sample_frame],
                            ["Sample Representation", selectedSurvey.sample_representation],
                            ["Data Collection Methods", selectedSurvey.data_collection_method?.join(", ")],
                            ["Other Method", selectedSurvey.other_method],
                            ["Data Availability", selectedSurvey.data_availability],
                            ["Notification Preference", selectedSurvey.notification_preference],
                        ].map(([label, value], idx) => (
                            <div key={idx} className="row mb-2">
                                <div className="col-4 fw-bold">{label}:</div>
                                <div className="col-8">{value || "N/A"}</div>
                            </div>
                        ))}

                        <div className="row mb-2">
                            <div className="col-4 fw-bold">Target Population:</div>
                            <div className="col-8" dangerouslySetInnerHTML={{
                                __html: selectedSurvey.target_population
                            }} />
                        </div>

                        {[
                            ["Letter", selectedSurvey.file_letter_url],
                            ["Questionnaire", selectedSurvey.file_questionnaire_url],
                            ["Beneficiaries", selectedSurvey.file_beneficiaries_url],
                            ["Objective", selectedSurvey.file_objective_url],
                            ["Sponsors", selectedSurvey.file_sponsors_url],
                            ["Attachments", selectedSurvey.file_attachments_url],
                        ].map(([label, file], idx) => (
                            <div key={`file-${idx}`} className="row mb-2">
                                <div className="col-4 fw-bold">{label}:</div>
                                <div className="col-8">
                                    {file ? (
                                        <a
                                            href={file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "#00A895", textDecoration: "underline" }}
                                        >
                                            View {label}
                                        </a>
                                    ) : "N/A"}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>}

            <ConfirmationModal
                okText={"Confirm"}
                onCancel={() => {
                    setDeleteId(null);
                    setOpenModal(false);
                }}
                onOk={() => setConfirmAction(true)}
                isVisible={openModal}
                title="Delete Survey"
                content="Are you sure you want to delete this survey?"
            />
            <div className="container-fluid">
                <SurveyDataTable
                    selectedSortData={selectedSortData}
                    setSelectedSortData={setSelectedSortData}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    searchString={searchString}
                    setSearchString={setSearchString}
                    totalrows={totalrows}
                    loading={loading}
                    columns={columns}
                    data={List || []}
                    isGlobalFilter={true}
                    isPagination={true}
                    SearchPlaceholder={t("Search")}
                    pagination="pagination"
                    docName="Surveys"
                    paginationWrapper="dataTables_paginate paging_simple_numbers"
                    tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                />
            </div>
        </>
    );
};

export default SurveyTable;
