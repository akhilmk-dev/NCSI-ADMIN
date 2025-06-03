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

//   const events = useSelector((state) => state.Event.events)
//   const loading = useSelector((state) => state.Event.loading)
//   const error = useSelector((state) => state.Event.error)

const events = [
    {
      eventId: 1,
      title: "Tech Conference 2025",
      titleAr: "مؤتمر التكنولوجيا 2025",
      shortDescription: "An annual tech conference focusing on AI and robotics.",
      shortDescriptionAr: "مؤتمر تقني سنوي يركز على الذكاء الاصطناعي والروبوتات.",
      fromDate: "2025-09-15T09:00:00Z",
      toDate: "2025-09-17T17:00:00Z",
      location: "New York Convention Center",
      locationAr: "مركز مؤتمرات نيويورك",
      eventType: "Conference",
      eventTypeAr: "مؤتمر",
      eventSpeaker: "Dr. John Smith",
      eventSpeakerAr: "د. جون سميث",
      eventPdf: "https://example.com/tech-conference-2025.pdf",
    },
    {
      eventId: 2,
      title: "Marketing Summit",
      titleAr: "قمة التسويق",
      shortDescription: "A gathering of marketing professionals from around the globe.",
      shortDescriptionAr: "تجمع لمحترفي التسويق من جميع أنحاء العالم.",
      fromDate: "2025-10-05T10:00:00Z",
      toDate: "2025-10-06T16:00:00Z",
      location: "Dubai Expo Center",
      locationAr: "مركز دبي إكسبو",
      eventType: "Summit",
      eventTypeAr: "قمة",
      eventSpeaker: "Ms. Sarah Lee",
      eventSpeakerAr: "السيدة سارة لي",
      eventPdf: null,
    },
    {
      eventId: 3,
      title: "Health & Wellness Fair",
      titleAr: "معرض الصحة والعافية",
      shortDescription: "Explore new trends and innovations in health and wellness.",
      shortDescriptionAr: "استكشاف الاتجاهات والابتكارات الجديدة في الصحة والعافية.",
      fromDate: "2025-11-10T08:30:00Z",
      toDate: "2025-11-12T15:30:00Z",
      location: "Los Angeles Convention Center",
      locationAr: "مركز مؤتمرات لوس أنجلوس",
      eventType: "Fair",
      eventTypeAr: "معرض",
      eventSpeaker: "Dr. Ahmed Khalil",
      eventSpeakerAr: "د. أحمد خليل",
      eventPdf: "https://example.com/health-fair.pdf",
    },
  ];
  
  

//   useEffect(() => {
//     if (loading) return
//     dispatch(getEvents())
//   }, [dispatch, loading])

  const handleSubmit = (data) => {
    dispatch(addEvent(data))
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <CreateEvent visible={isOpen} onSubmit={handleSubmit} handleClose={handleClose} />
      <div className="page-content container-fluid">
        <div className="d-flex justify-content-between align-items-center mx-3">
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

        <EventTable loading={false} List={events} />
      </div>
    </>
  )
}

export default EventList
