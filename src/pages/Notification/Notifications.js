import React, { useEffect, useMemo, useState } from "react";

// Import components
import TableContainer from '../../components/Common/DataTableContainer';
import { Button, Modal } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "store/actions";  // Assuming you have a deleteNotification action
import Cookies from "js-cookie";
import Breadcrumb from "components/Common/Breadcrumb2";
import axiosInstance from "pages/Utility/axiosInstance";
import { useNavigate } from "react-router-dom";



const Notifications = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState();
  const List = useSelector(state => state?.Notification?.notifications)
  const loading = useSelector(state=>state?.Notification?.loading);
  const navigate = useNavigate()

  const id = JSON.parse(Cookies.get('authUser'))?.userId
  const permissions = [];

  useEffect(() => {
    if(loading)return;
    dispatch(getNotifications(id))
  }, [id])

  const markAsRead = async(id)=>{
    try {
      const response = await axiosInstance.post('',{
        "sp": "usp_UpdateNotification",
        "notificationId": id
    })
    if(response){
      navigate('/notifications')
    }
    } catch (error) {
      
    }

  }

  const columns = useMemo(
    () => [
      {
        header: 'User Name',
        accessorKey: 'userName',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Message Content',
        accessorKey: 'messageContent',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
          const handleView = () => {
            markAsRead(row.original?.notificationId)
          };
          const hasPermission = false;


          return (
            <div className="d-flex gap-2">
              {!row?.original?.isRead && hasPermission &&  <Button color="primary" onClick={handleView} className="mr-2">
                Mark As Read
              </Button>}
            </div>
          );
        },
      }
    ],
    []
  );


  // Meta title
  document.title = "Notification Management | Admin Dashboard";

  return (
    <>
      <div className="page-content">

        <div className="d-flex justify-content-between align-items-center ms-3 ">
          <Breadcrumb title="Notifications" breadcrumbItems={[{ title: "Dashboard", link: `/dashboard` }, { title: "Notifications", link: '#' }]} />
          {<Button
            className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
            onClick={() => navigate('/dashboard')}
          >
            Back
          </Button>}
        </div>
        <div className="container-fluid">
          <TableContainer
            columns={columns}
            data={List?.Data || []}
            isGlobalFilter={true}
            isPagination={true}
            SearchPlaceholder="Search..."
            pagination="pagination"
            docName="Notifications"
            loading={loading}
            paginationWrapper="dataTables_paginate paging_simple_numbers"
            tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
          />
        </div>
      </div>
    </>
  );
};

export default Notifications;
