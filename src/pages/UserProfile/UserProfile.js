import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import axiosInstance from "pages/Utility/axiosInstance";
import { useDispatch } from "react-redux";
import { updateUserRequest } from "store/actions";
import Breadcrumb from "components/Common/Breadcrumb2";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(``,{params:{sp:"usp_GetUserProfile",userId:id}});
        setUser(response.data?.Data?.[0]);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{8}$/, "Phone number must be 8 digits")
      .required("Phone number is required"),
  });

  const handleSubmit = async (values) => {
    try {
      
        dispatch(updateUserRequest({
            "sp": "usp_UpdateUser",
            "userId":id,
             
            "userName": values?.username,
            
            "emailId": values?.email,
            "phoneNo": values?.phoneNumber,
            "roleId": user?.roleId
        }))
      
    } catch (err) {
      setError("Failed to update user data.");
    }
  };

  if (loading) {
    return (
      <div className="page-content text-center mt-5" >
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="page-content ">
    <div className="d-flex justify-content-between align-items-center mx-2">
        <Breadcrumb title="User Profile" breadcrumbItems={[{ title: "Dashboard", link: `/dashboard` }, { title: "Profile", link: '#' }]} />
        <Button className='bg-primary text-white d-flex justify-content-center gap-1 align-items-center' onClick={() => navigate('/dashboard')}>
            Back
        </Button>
    </div>
      {successMessage && <Alert color="success">{successMessage}</Alert>}
      <Formik
        initialValues={{
          username: user?.userName,
          email: user?.emailId,
          phoneNumber: user?.phoneNo,
          role: user?.roleName,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} className="bg-white p-3 rounded-3">
            <FormGroup>
              <Label for="username">Username</Label> <span className="text-danger">*</span>
              <Field
                name="username"
                as={Input}
                id="username"
                placeholder="Enter username"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-danger"
              />
            </FormGroup>

            <FormGroup>
              <Label for="email">Email</Label> <span className="text-danger">*</span>
              <Field
                name="email"
                type="email"
                as={Input}
                id="email"
                placeholder="Enter email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />
            </FormGroup>

            <FormGroup>
              <Label for="phoneNumber">Phone Number</Label> <span className="text-danger">*</span>
              <Field
                name="phoneNumber"
                as={Input}
                id="phoneNumber"
                placeholder="Enter phone number"
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="text-danger"
              />
            </FormGroup>

            <FormGroup>
              <Label for="role">Role</Label>
              <Field
                name="role"
                className="bg-secondary"
                as={Input}
                id="role"
                disabled
                readOnly
              />
            </FormGroup>

            <Button color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <ClipLoader size="sm" /> : "Update"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserProfile;
