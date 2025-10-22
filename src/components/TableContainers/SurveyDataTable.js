import React, { Fragment, useState, useRef, useEffect } from "react";
import { Row, Table, Button, Col } from "reactstrap";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Importing the jspdf-autotable plugin
import { useReactToPrint } from "react-to-print"; // Importing the hook
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // Importing ClipLoader from react-spinners
import { FadeLoader } from "react-spinners";
import Select from "react-select";
import { getClassifications, getEvents, getSurveys } from "store/actions";
import { useDispatch } from "react-redux";
import { DebouncedInput } from "helpers/common_helper";
import Pagination from "components/Common/Pagination";


// Global Filter (Debounced Input)


const SurveyDataTable = ({
    columns,
    data,
    tableClass,
    isPagination,
    isGlobalFilter,
    SearchPlaceholder,
    paginationWrapper,
    pagination,
    buttonClass,
    buttonName,
    handleUserClick,
    pageInx = 0,
    initialPageSize = 10,
    totalrows,
    loading,
    docName = "doc",
    selectedFromDate,
    setSelectedFromDate,
    selectedSortData,
    setSelectedSortData,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    searchString,
    setSearchString
}) => {
    const [globalFilter, setGlobalFilter] = useState("");
    const tableRef = useRef(); // Create a reference for the table content
    const [filteredData, setFilteredData] = useState(data || []);
    const [selectedSubject, setSelectedSubject] = useState();
    const [selectedRequester, setSelectedRequester] = useState();
    const dispatch = useDispatch();

    // Update filteredData when search query changes
    useEffect(() => {
        if (!globalFilter) {
            setFilteredData(data);
        } else {
            const lowercasedQuery = globalFilter.toLowerCase();
            setFilteredData(
                data.filter((row) =>
                    Object.values(row).some(
                        (value) =>
                            value &&
                            value.toString().toLowerCase().includes(lowercasedQuery)
                    )
                )
            );
        }
    }, [globalFilter, data]);

    const table = useReactTable({
        columns,
        data,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const serialNumberColumn = {
        header: "#",
        id: "serial",
        cell: ({ row }) => (pageIndex * pageSize) + row.index + 1,
        enableSorting: false,
        enableColumnFilter: false,
    };

    // Finally, set the columns with serial number prepended
    table.setOptions((prev) => ({
        ...prev,
        columns: [serialNumberColumn, ...columns]
    }));


    const { getHeaderGroups, getRowModel, getCanPreviousPage, getCanNextPage, getPageOptions, getPageCount, nextPage, previousPage, getState } = table;

    // const currentPage = getState().pagination.pageIndex;
    // const startIndex = currentPage * 10 + 1;
    // const endIndex = Math.min((currentPage + 1) * 10, data.length);

    // const totalFilteredRows = table.getFilteredRowModel().rows.length;
    // const pageSize = table.getState().pagination.pageSize;
    // const currentPageIndex = table.getState().pagination.pageIndex;
    const windowSize = 3;
    const totalPages = Math.ceil(totalrows / pageSize);
    const startPage = Math.floor(pageIndex / windowSize) * windowSize;
    const endPage = Math.min(startPage + windowSize, totalPages);


    useEffect(() => {
        if (!loading && pageIndex !== 0) {
            dispatch(getSurveys({
                "pagesize": pageSize,
                "currentpage": pageIndex + 1,
                "sortorder": selectedSortData?.value && selectedSortData?.direction
                    ? {
                        field: selectedSortData.value,
                        direction: selectedSortData.direction,
                    }
                    : {},
                "searchstring": searchString,
                "filter": {}
            }))
        }
    }, [selectedSortData, pageIndex])

    useEffect(() => {
        localStorage.setItem('pageIndex', pageIndex);
        localStorage.setItem('searchString', searchString);
        localStorage.setItem('selectedSortData', JSON.stringify(selectedSortData));
        localStorage.setItem('selectedSubject',JSON.stringify(selectedSubject));
        // localStorage.setItem('selectedRequester',JSON.stringify(selectedRequester));
        if (!loading && pageIndex == 0) {
            dispatch(getSurveys({
                "pagesize": pageSize,
                "currentpage": pageIndex + 1,
                "sortorder": selectedSortData?.value && selectedSortData?.direction
                    ? {
                        field: selectedSortData.value,
                        direction: selectedSortData.direction,
                    }
                    : {},
                "searchstring": searchString,
                "filter": {
                    "subject":selectedSubject?.value,
                    // "requester":selectedRequester?.value
                }
            }))
        }
    }, [searchString, pageIndex, selectedSortData, selectedSubject]);

    useEffect(() => {
        setPageIndex(0)
    }, [searchString,selectedRequester,selectedSubject])

    const handlePageChange = (newPageIndex) => {
        setPageIndex(newPageIndex);
    };

    const subjects = [
        { label: "Social", value: "Social" },
        { label: "Economic", value: "Economic" },
        { label: "Educational", value: "Educational" },
        { label: "Healthy", value: "Healthy" },
        { label: "Socioeconomic", value: "Socioeconomic" },
        { label: "Other", value: "Other" }
    ]

    // const requesters = [
    //     { label: "Government Institute", value: "Government Institute" },
    //     { label: "Private Institute", value: "Private Institute" },
    //     { label: "Institute(Government/Private)", value: "Institute(Government/Private)" },
    //     { label: "Individual", value: "Individual" }
    // ]

    return (
        <Fragment>
            <div className="d-flex justify-content-between gap-2 mb-2">
                <div className="d-flex justify-content-between gap-2 align-items-center">
                    <div className="" style={{ minWidth: "200px" }}>
                        <label className=" fs-8">
                            Subject
                        </label>
                        <Select
                            options={subjects}
                            value={subjects?.find(
                                (option) => option.value === selectedSubject?.value
                            ) || null}
                            onChange={(selectedOption) =>
                                setSelectedSubject(selectedOption)
                            }
                            classNamePrefix="select"
                            isClearable={true}

                        />
                    </div>
                    {/* <div className="" style={{ minWidth: "200px" }}>
                        <label className=" fs-8">
                            Requester
                        </label>
                        <Select
                            options={requesters}
                            value={requesters?.find(
                                (option) => option.value === selectedRequester?.value
                            ) || null}
                            onChange={(selectedOption) =>
                                setSelectedRequester(selectedOption)
                            }
                            classNamePrefix="select"
                            isClearable={true}
                        />
                    </div> */}
                </div>
                <div className="d-flex justify-content-between align-items-end">
                    <DebouncedInput
                        value={searchString ?? ""}
                        onChange={(value) => setSearchString(String(value))}
                        className="form-control search-box me-2  d-inline-block"
                        placeholder={SearchPlaceholder}
                    />
                </div>
            </div>

            <div className="table-responsive" id="table-to-print" ref={tableRef}>
                <Table hover className={tableClass} bordered>
                    <thead>
                        {getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) =>
                                    !header.isPlaceholder ? (
                                        <th
                                            key={header.id}
                                            style={{ width: "150px", verticalAlign: "middle" }}
                                        >
                                            <div className="d-flex align-items-center justify-content-between">
                                                {/* Header title */}
                                                <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>

                                                {/* Sorting Icon */}
                                                {(header.column.columnDef.accessorKey && header.column.getCanFilter?.() && header.column.columnDef.showFilter !== false) && (
                                                    <span
                                                        className="ms-1"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const field = header.column.columnDef.accessorKey;
                                                            if (!field) return;

                                                            if (!selectedSortData || selectedSortData.value !== field) {
                                                                setSelectedSortData({ value: field, direction: "asc" }); // default to asc
                                                            } else if (selectedSortData.direction === "asc") {
                                                                setSelectedSortData({ value: field, direction: "desc" });
                                                            } else {
                                                                setSelectedSortData({ value: field, direction: "asc" }); // reset to no sort
                                                            }
                                                        }}
                                                    >
                                                        {/* Icon Logic */}
                                                        {selectedSortData?.value === header.column.columnDef.accessorKey ? (
                                                            selectedSortData.direction === "asc" ? (
                                                                <i className="mdi mdi-arrow-up" style={{ fontSize: "20px" }}></i>
                                                            ) : (
                                                                <i className="mdi mdi-arrow-down" style={{ fontSize: "20px" }}></i>
                                                            )
                                                        ) : (
                                                            <i className="mdi mdi-swap-vertical" style={{ fontSize: "20px" }}></i>
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Optional: Render filter input here conditionally if needed */}
                                            {header.column.getCanFilter?.() && header.column.columnDef.showFilter !== false && (
                                                <div>{flexRender(header.column.columnDef.Filter, header.getContext())}</div>
                                            )}
                                        </th>) : null
                                )}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center border-none">
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                        <FadeLoader color="#00a895" size={40} />
                                    </div>
                                </td>
                            </tr>
                        ) : (data?.length <= 0 || getRowModel()?.rows?.length === 0) ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center">
                                    No Data Found
                                </td>
                            </tr>
                        ) : (
                            getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="" style={{ verticalAlign: "middle" }}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                    ))}
                                </tr>
                            ))
                        )}

                    </tbody>
                </Table>
            </div>

            {(isPagination && totalrows > 0) && (
                <Pagination
                    currentPage={pageIndex + 1}
                    totalPages={totalPages}
                    totalItems={totalrows}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    showInfo={true}
                />
            )}

        </Fragment>
    );
};

export default SurveyDataTable;
