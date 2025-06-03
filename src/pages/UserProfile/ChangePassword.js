import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import Breadcrumb from "components/Common/Breadcrumb2";
import axiosInstance from "pages/Utility/axiosInstance";
import Cookies from "js-cookie";
import { showSuccess } from "helpers/notification_helper";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import changeImg from '../../assets/images/change-password.png'

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false);
  const userId = JSON.parse(Cookies.get('authUser'))?.userId;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required("Current password is required")
      .min(6, "Password must be at least 6 characters"),

    newPassword: Yup.string()
      .required("New password is required")
      .min(6, "Password must be at least 6 characters")
      .notOneOf(
        [Yup.ref("currentPassword"), null],
        "New password must be different from the current password"
      ),

    confirmNewPassword: Yup.string()
      .required("Please confirm your new password")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('', {
        "sp": "usp_ChangePassword",
        "userId": userId,
        "currentPassword": values?.currentPassword,
        "newPassword": values?.newPassword
      }
      )
      if (response?.data?.Message == "Success") {
        showSuccess("Password updated successfully")
        setLoading(false)
        resetForm();
      }
    } catch (error) {
      setLoading(false)
    }
  };

  return (
    <div className="page-content mt-3">
      <div className="d-flex justify-content-between align-items-center mx-2">
        <Breadcrumb
          title="Change Password"
          breadcrumbItems={[
            { title: "Dashboard", link: `/dashboard` },
            { title: "Change Password", link: "#" },
          ]}
        />
        <Button
          className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </Button>
      </div>
      <Row
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "300px" }}
      >
        <Col md={12}>
          <Card>
            <CardBody>
              <Row>
                <Col md={6}>
                  <h3 className="text-center mb-4">Change Password</h3>
                  <Formik
                    initialValues={{
                      currentPassword: "",
                      newPassword: "",
                      confirmNewPassword: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched, isSubmitting }) => (
                      <Form>
                        <FormGroup>
                          <Label for="currentPassword">Current Password</Label> <span className="text-danger">*</span>
                          <InputGroup>
                            <Field
                              name="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              id="currentPassword"
                              placeholder="Enter your current password"
                              as={Input}
                              invalid={touched.currentPassword && !!errors.currentPassword}
                            />
                            <InputGroupText
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className={
                                  showCurrentPassword ? "mdi mdi-eye" : "mdi mdi-eye-off"
                                }
                              ></i>
                            </InputGroupText>
                            <ErrorMessage
                              name="currentPassword"
                              component={FormFeedback}
                            />
                          </InputGroup>
                        </FormGroup>

                        <FormGroup>
                          <Label for="newPassword">New Password</Label> <span className="text-danger">*</span>
                          <InputGroup>
                            <Field
                              name="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              id="newPassword"
                              placeholder="Enter your new password"
                              as={Input}
                              invalid={touched.newPassword && !!errors.newPassword}
                            />
                            <InputGroupText
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className={
                                  showNewPassword ? "mdi mdi-eye" : "mdi mdi-eye-off"
                                }
                              ></i>
                            </InputGroupText>
                            <ErrorMessage
                              name="newPassword"
                              component={FormFeedback}
                            />
                          </InputGroup>
                        </FormGroup>

                        <FormGroup>
                          <Label for="confirmNewPassword">Confirm New Password</Label> <span className="text-danger">*</span>
                          <InputGroup>
                            <Field
                              name="confirmNewPassword"
                              type={showConfirmNewPassword ? "text" : "password"}
                              id="confirmNewPassword"
                              placeholder="Confirm your new password"
                              as={Input}
                              invalid={touched.confirmNewPassword && !!errors.confirmNewPassword}
                            />
                            <InputGroupText
                              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className={
                                  showConfirmNewPassword ? "mdi mdi-eye" : "mdi mdi-eye-off"
                                }
                              ></i>
                            </InputGroupText>
                            <ErrorMessage
                              name="confirmNewPassword"
                              component={FormFeedback}
                            />
                          </InputGroup>
                        </FormGroup>

                        <Button
                          type="submit"
                          color="primary"
                          block
                          disabled={isSubmitting}
                        >
                          {loading ? <ClipLoader size={16} color="white" /> : "Change Password"}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Col>
                <Col md={6} className="d-flex justify-content-center d-none d-md-flex">
                  <img src={changeImg} className="img-fluid" alt="Responsive" style={{ maxWidth: '100%', height: 'auto' }} />
                </Col>

              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChangePassword;
