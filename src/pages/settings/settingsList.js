import axiosInstance from 'pages/Utility/axiosInstance'
import React, { useEffect, useState } from 'react'
import { Form, FormGroup, Label, Input, Button, Container, Row, Col } from "reactstrap";
import Breadcrumb from 'components/Common/Breadcrumb2';
import Cookies from 'js-cookie';
import { ClipLoader } from 'react-spinners';
import { showSuccess } from 'helpers/notification_helper';

const SettingsList = () => {
  const [settings, setSettings] = useState()
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchSettings = async () => {
    const response = await axiosInstance.get('', { params: { sp: "usp_GetSettings" } })
    setSettings(response?.data?.Data)
    setInputValue(response?.data?.Data?.[0]?.settingValue)
  }
  const userId = JSON.parse(Cookies?.get('authUser'))?.userId
  useEffect(() => {
    fetchSettings();
  }, [])

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('', {
        "sp": "usp_UpdateSetting",
        "settingID": settings?.[0]?.settingID,
        "settingName": settings?.[0]?.settingName,
        "settingValue":inputValue ? inputValue : settings?.[0]?.settingValue,
        "isEditable": 1,
        "lastUpdatedBy": userId
      })
      if (response) {
        setLoading(false);
        showSuccess("Successfully updated")
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  };


  return (
    <Container fluid className="page-content">
      <div className="d-flex justify-content-start align-items-center mx-3">
        <Breadcrumb title="Settings" breadcrumbItems={[{ title: "Dashboard", link: `/dashboard` }, { title: "Settings", link: '#' }]} />
      </div>
      <div className="d-flex justify-content-start align-items-center mx-3">
      <Row className="justify-content-start w-100">
        <Col md={12}>
          <Form className="p-4 shadow rounded bg-white">
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="updateInput">Sheduled Day Off</Label>
                  <Input
                    id="updateInput"
                    type="text"
                    placeholder="Enter something..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Button className="bg-primary text-white text-center"  style={{ minWidth: "90px" }} onClick={handleUpdate}>
              {loading ? <ClipLoader size={16} color='white' /> : "Update"}
            </Button>
          </Form>
        </Col>
      </Row>
      </div>
    </Container>
  );

}

export default SettingsList