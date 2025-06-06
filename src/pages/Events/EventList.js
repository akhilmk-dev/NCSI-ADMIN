import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from 'reactstrap'
import { addEvent, getEvents } from 'store/actions' // Assume these exist
import CreateEvent from './CreateEvent' // Your modal form for event create/edit
import EventTable from './EventTable' // Your table component for events
import Breadcrumb from 'components/Common/Breadcrumb2'

const EventList = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

//   const permissions = JSON.parse(localStorage?.getItem('permissions')) || []

  const events = useSelector((state) => state.Event.events)
  const loading = useSelector((state) => state.Event.loading)
  const error = useSelector((state) => state.Event.error)
  const fieldErrors = useSelector((state)=>state?.Event?.fieldErrors);

  const handleSubmit = (data,resetForm,handleClose) => {
    dispatch(addEvent(data,resetForm,handleClose))
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <CreateEvent fieldErrors={fieldErrors} visible={isOpen} onSubmit={handleSubmit} handleClose={handleClose} />
      <div className="page-content container-fluid">
        <div className="d-flex justify-content-between align-items-center " style={{margin:"0 11px"}}>
          <Breadcrumb
            title="Events"
            breadcrumbItems={[
              { title: 'Dashboard', link: '/dashboard' },
              { title: 'Events', link: '#' },
            ]}
          />
          {(
            <Button
              className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
              onClick={() => setIsOpen(true)}
            >
              <i className="ti-plus"></i> Add New
            </Button>
          )}
        </div>
         
        <EventTable  totalrows={events?.data?.total} fieldErrors={fieldErrors} loading={loading} List={events?.data?.events} />
      </div>
    </>
  )
}

export default EventList
