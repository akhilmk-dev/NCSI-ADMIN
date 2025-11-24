import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import Breadcrumb from 'components/Common/Breadcrumb2'
import { addGuideClassification, getGuideClassifications } from 'store/actions'
import GuideClassificationTable from './GuideClassificationTable'
import CreateGuideClassification from './GuideClassificationCreate'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const GuideClassificationList = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const classifications = useSelector((state) => state.GuideClassification.classifications)
  const loading = useSelector((state) => state.GuideClassification.loading)
  const error = useSelector((state) => state.GuideClassification.error)
  const fieldErrors = useSelector((state) => state.GuideClassification.fieldErrors)
  const permissions = JSON.parse(localStorage?.getItem('permissions')) || []
  const hasEditPermission = permissions.includes('guideclassifications.update');
  const hasDeletePermission = permissions.includes('guideclassifications.delete')
  const hasViewPermission = permissions.includes('guideclassifications.view');
  const hasCreatePermission = permissions.includes('guideclassifications.create')
  const hasListPermission = permissions.includes('guideclassifications.list');
  const isAdmin = Cookies.get('isAdmin') == "yes"
  
  useEffect(() => {
    if (!hasEditPermission && !hasDeletePermission && !hasCreatePermission && !hasListPermission && !isAdmin) {
      navigate('/pages-403')
    }
  }, [])

  const handleSubmit = (data, resetForm, handleClose) => {
    dispatch(addGuideClassification(data, resetForm, handleClose))
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  document.title = "Guidea and Classifications | NCSI"

  return (
    <>
      <CreateGuideClassification
        loading={loading}
        fieldErrors={fieldErrors}
        visible={isOpen}
        onSubmit={handleSubmit}
        handleClose={handleClose}
      />

      <div className="page-content container-fluid">
        <div className="d-flex justify-content-between align-items-center" style={{ margin: "0 11px" }}>
          <Breadcrumb
            title="Guides and Classifications"
            breadcrumbItems={[
              { title: 'Dashboard', link: '/dashboard' },
              { title: 'Guides and Classifications', link: '#' },
            ]}
          />
          {(isAdmin || hasCreatePermission) &&<Button
            className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
            onClick={() => setIsOpen(true)}
          >
            <i className="ti-plus"></i> {t('Add New')}
          </Button>}
        </div>

        <GuideClassificationTable
          totalrows={classifications?.data?.total}
          fieldErrors={fieldErrors}
          loading={loading}
          List={classifications?.data?.classifications}
        />
      </div>
    </>
  )
}

export default GuideClassificationList
