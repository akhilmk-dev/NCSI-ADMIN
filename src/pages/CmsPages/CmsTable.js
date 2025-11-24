import PageDataTable from 'components/TableContainers/PagesDataTable';
import Cookies from 'js-cookie';
import React, { useMemo, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';

const PagesTable = ({ list, loading, totalrows }) => {
  const [selectedSortData, setSelectedSortData] = useState({
    value: "page_title",
    direction: "asc",
  });
  const navigate = useNavigate()
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState("");
  const permissions = JSON.parse(localStorage?.getItem('permissions')) || []
  const hasEditPermission = permissions.includes('pages.update');
  const hasDeletePermission = permissions.includes('pages.delete')
  const isAdmin = Cookies.get('isAdmin') == "yes"


  const columns = useMemo(
    () => [
      {
        header: 'Page Title',
        accessorKey: 'page_title',
      },
      {
        header: 'Page Key',
        accessorKey: 'page_key',
      },
      ...(isAdmin || hasEditPermission ? [{
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
          return (
            <div className="d-flex gap-2">
              {(isAdmin || hasEditPermission) && <Button color="primary" onClick={() => navigate(`/cms/${row.original.page_key}`)}>
                <FaRegEdit size={18} />
              </Button>}
            </div>
          );
        },
      }] : []),
    ],
    [hasEditPermission,isAdmin]
  );

  return (
    <div className="container-fluid">
      <PageDataTable
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
        totalrows={totalrows}
        SearchPlaceholder="Search pages"
        pagination="pagination"
        docName="Pages"
        paginationWrapper="dataTables_paginate paging_simple_numbers"
        tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
      />
    </div>
  );
};

export default PagesTable;
