import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  CardTitle
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";

// Custom Scrollbar
import SimpleBar from "simplebar-react";

// import images
import servicesIcon1 from "../../assets/images/services-icon/01.png";
import servicesIcon2 from "../../assets/images/services-icon/02.png";
import servicesIcon3 from "../../assets/images/services-icon/03.png";
import servicesIcon4 from "../../assets/images/services-icon/04.png";


import Salesdonut from "../AllCharts/apex/salesdonut";


//i18n
import { withTranslation } from "react-i18next";
import axiosInstance from 'pages/Utility/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkOrders } from 'store/actions';
import { FadeLoader } from 'react-spinners';
import { formatDateTimeToAmPm } from 'helpers/dateFormat_helper';
import Cookies from 'js-cookie';
import BarChart from 'pages/AllCharts/chartjs/barchart';
import { set } from 'store';

const Dashboard = props => {
  const [menu, setMenu] = useState(false);
  const [dashboardDetails, setDashboardDetails] = useState();
  const [pendingWorkOrders,setPendingWorkOrders] = useState();
  const [dashboard,setDashboard] = useState()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data,setData]= useState()
  // const id = JSON.parse(Cookies.get('authUser'))?.userId
  const permissions = [];

  // Selectors to access Redux state
  const workOrders = [];


  const toggle = () => {
    setMenu(!menu);
  };

  // const fetchDashboardDetails = async () => {
  //   try {
  //     const response = await axiosInstance('', { params: { sp: "usp_GetAdminDashboard",userId:user?.userId, multiple: true } });
  //     setDashboard(response?.data?.Data)
  //     setDashboardDetails(response?.data?.Data?.result1?.[0])
  //   } catch (error) {

  //   }
  // }

  // const fetchLatestPendingWorkOrders = async()=>{
  //   try {
  //     const response = await axiosInstance('', { params: { sp: 'usp_GetWorkorderReport', workOrderStatus: "WorkOrder Pending", scheduledFromDate:  null, scheduledToDate:  null, TeamID: null, createdBy: null } })
  //     setPendingWorkOrders(response?.data?.Data);
  //   } catch (error) {
      
  //   }
  // }

  // useEffect(() => {
  //   fetchDashboardDetails()
  //   fetchLatestPendingWorkOrders();
  // }, [])

  useEffect(()=>{
    if(dashboard?.result2?.[0]?.MonthlyWiseTotalCount){
      setData({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Work Orders",
            backgroundColor: "#02a499",
            borderColor: "#02a499",
            borderWidth: 1,
            hoverBackgroundColor: "#02a499",
            hoverBorderColor: "#02a499",
            data:[],
          },
        ],
      })
    }
  },[dashboard]);


  document.title = "Dashboard | NCSI";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                {/* <h6 className="page-title">Hey, {user?.userName}</h6> */}
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active text-xl font-bold">Welcome Back</li>
                </ol>
              </Col>
            </Row>
          </div>
          <Row className=''>
            <Col xl={3} md={6}>
              <Card className="mini-stat text-white" style={{ height: "170px", backgroundColor: "#00a895" }}>
                <CardBody >
                  <div className="mb-4" style={{minHeight:"70px"}}>
                    <div className="float-start mini-stat-img me-2" >
                      <img src={servicesIcon1} width="30px" alt="" />
                    </div>
                    <h5 className="font-size-14 text-uppercase mt-0 text-white-50">
                      TOTAL
                    </h5>
                    <h4 className="fw-medium font-size-24">
                      {dashboardDetails?.totalWorkOrders}
                      
                    </h4>
                  </div>
                 {<div className="pt-2" style={{cursor:"pointer"}}>
                    <div className="float-end">
                      <Link to="#" className="text-white-50">
                        <i className="mdi mdi-arrow-right h5"></i>
                      </Link>
                    </div>
                    <p className="text-white-50  mb-3">View All</p>
                  </div>}
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card className="mini-stat  text-white" style={{ height: "170px", backgroundColor: "#00a895" }}>
                <CardBody>
                  <div className="mb-4" style={{minHeight:"70px"}}>
                    <div className="float-start mini-stat-img me-2" >
                      <img src={servicesIcon2} width="30px" alt="" />
                    </div>
                    <h5 className="font-size-14  text-uppercase mt-0 text-white-50">
                      PENDING 
                    </h5>
                    <h4 className="fw-medium font-size-24">
                      {dashboardDetails?.ongoingWorkOrders}
                      
                    </h4>
                  </div>
                  { <div className="pt-2" style={{cursor:"pointer"}} >
                    <div className="float-end">
                      <Link to="#" className="text-white-50">
                        <i className="mdi mdi-arrow-right h5"></i>
                      </Link>
                    </div>

                    <p className="text-white-50 mb-3">View All</p>
                  </div>}
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card className="mini-stat text-white" style={{ height: "170px", backgroundColor: "#00a895" }}>
                <CardBody>
                  <div className="mb-4" style={{minHeight:"70px"}}>
                    <div className="float-start mini-stat-img me-2" style={{ padding: "0 !important", margin: "0px !important", width: "45px" }}>
                      <img src={servicesIcon3} width="30px" alt="" />
                    </div>
                    <h5 className="font-size-14 text-uppercase mt-0 text-white-50">
                      TOTAL STAFF
                    </h5>
                    <h4 className="fw-medium font-size-24">
                      {dashboardDetails?.totalStaff}
                     
                    </h4>
                  </div>
                  { <div className="pt-2" style={{cursor:"pointer"}}>
                    <div className="float-end">
                      <Link to="#" className="text-white-50">
                        <i className="mdi mdi-arrow-right h5"></i>
                      </Link>
                    </div>

                    <p className="text-white-50 mb-3">View All</p>
                  </div>}
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card className="mini-stat text-white" style={{ height: "170px", backgroundColor: "#00a895" }}>
                <CardBody>
                  <div className="mb-4" style={{minHeight:"70px"}}>
                    <div className="float-start mini-stat-img me-2" style={{ padding: "0 !important", margin: "0px !important", width: "45px" }}>
                      <img src={servicesIcon4} width="30px" alt="" />
                    </div>
                    <h5 className="font-size-14 text-uppercase mt-0 text-white-50">
                      TOTAL TEAMS
                    </h5>
                    <h4 className="fw-medium font-size-24">
                      {dashboardDetails?.totalTeams}
                      
                    </h4>
                  </div>
                  {<div className="pt-2" style={{cursor:"pointer"}} >
                    <div className="float-end">
                      <Link to="#" className="text-white-50">
                        <i className="mdi mdi-arrow-right h5"></i>
                      </Link>
                    </div>
                    <p className="text-white-50 mb-3">View All</p>
                  </div>}
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={9}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Monthly Report</h4>
                  <div style={{ height: 280 }}>
                    {data && <BarChart data={data} />}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3}>
              <Card >
                <CardBody style={{height:"362px"}}>
                  <h4 className="card-title mb-2"> Statistics</h4>
                  <div className="cleafix">
                  </div>
                  <div id="ct-donut" className="ct-chart wid mt-5">
                    {dashboard?.result3?.[0] && <Salesdonut  series={JSON?.parse(dashboard?.result3?.[0]?.WorkorderStatusCount)?.map(item=>item?.count)} labels={JSON?.parse(dashboard?.result3?.[0]?.WorkorderStatusCount)?.map(item=>item?.stateName)}/>}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* <Row>
            <Col xl={12}>
              {<Card>
                <CardBody>
                  <div className='d-flex justify-content-between align-items-center mb-3'>
                    <h4 className="card-title ">Latest Report</h4>
                    <Link to='/workorders'>View All</Link>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover table-centered table-nowrap mb-0">
                      <thead>
                        <tr>
                          <th scope="col">Work Order Number</th>
                          <th scope="col">Team</th>
                          <th scope="col">Scheduled Start Date</th>
                          <th scope="col">Scheduled End Date</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      {workOrders?.length >0  && <tbody>
                        {workOrders?.Data?.slice(0,10)?.map(item => (<tr>
                          <th scope="row"><span style={{ cursor: "Pointer", color: "#02a499" }} title='show details' onClick={() => permissions?.map(item=>item?.permissionName)?.includes("List Work Orders") ? navigate(`/workOrderDetails/${item?.workOrderId}`):""}>{item?.workOrderNumber}</span></th>
                          <td>{item?.teamName}</td>
                          <td>
                            {formatDateTimeToAmPm(item?.scheduledStartDateTime)}
                          </td>
                          <td>{formatDateTimeToAmPm(item?.scheduledEndDateTime)}</td>
                          <td>
                            <span className="badge bg-success py-1" style={{width:"160px",fontSize:"12px"}}>
                              {item?.workOrderStatus}
                            </span>
                          </td>
                        </tr>))}
                      </tbody>}
                      {workOrders?.length <=0 && <tbody >
                        <tr>
                          <td colSpan={5} className='text-center'>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                              <FadeLoader color="#007bff" size={35} />
                            </div>
                          </td>
                        </tr>
                      </tbody>}
                      {
                        (!workOrders?.length <=0 && workOrders?.Data?.length <= 0) && <tbody>
                          <tr>
                            <td colSpan={5} className="text-center">No Data Found</td>
                          </tr>
                        </tbody>
                      }
                    </table>
                  </div>
                </CardBody>
              </Card>}

            </Col>
            
          </Row> */}
        </Container>
      </div>

    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any
};

// export default withTranslation()(Dashboard);
export default Dashboard;
