import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";

import { Row, Col, CardBody, Card, Container, Label, Form, FormFeedback, Input } from "reactstrap";

// Redux
import { connect, useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';
import withRouter from 'components/Common/withRouter';
import Cookies from 'js-cookie';

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { loginUser, apiError, login } from "../../store/actions";

// import images
import logoSm from "../../assets/images/logo-sm.png";
import { ClipLoader } from 'react-spinners';

// Importing eye icons for password visibility toggle
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state?.Login);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (Cookies.get('access_token')) {
      navigate('/dashboard')
    }
  }, [])

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(login({
        sp: "usp_InitiateUserAuth",
        logname: values?.email,
        passwd: values?.password
      }, navigate));
    }
  });

  document.title = "Login | NCSI";
  return (
    <React.Fragment>
      <div className="account-pages  pt-sm-5" style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={4}>
              <Card className="overflow-hidden">
                <div className="bg-primary">
                  <div className="text-primary text-center p-4">
                    <h5 className="text-white font-size-20">
                      Welcome !
                    </h5>
                    <p className="text-white-50">
                      Sign in to continue to NCSI
                    </p>
                    <Link to="/" className="logo logo-admin">
                      <img src={logoSm} height="34" alt="logo" width="70px"/>
                    </Link>
                  </div>
                </div>

                <CardBody className="p-4">
                  <div className="p-3">
                    <Form className="mt-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                      action="#">


                      <div className="mb-3">
                        <Label className="form-label" htmlFor="username">Username</Label> <span className='text-danger'>*</span>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter Username"
                          type="email"
                          id="username"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email ? true : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label" htmlFor="userpassword">Password</Label> <span className='text-danger'>*</span>
                        <div className="input-group">
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.password && validation.errors.password ? true : false
                            }
                          />
                          <div className="input-group-append">
                            <button
                              type="button"
                              className="input-group-text"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <AiFillEye size={20} />: <AiFillEyeInvisible size={20} /> }
                            </button>
                          </div>
                        </div>
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3 row">
                        <div className="col-12 text-center">
                          <button className="btn btn-primary w-md waves-effect waves-light" type="submit">
                            {loading ? <ClipLoader size={16} color='white' /> : "Log In"}
                          </button>
                        </div>
                      </div>

                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  const { error } = state.Login;
  return { error };
};

export default withRouter(
  connect(mapStateToProps, { login })(Login)
);

Login.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
};
