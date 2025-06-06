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
  const [pendingWorkOrders, setPendingWorkOrders] = useState();
  const [dashboard, setDashboard] = useState()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState()
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

  useEffect(() => {
    if (dashboard?.result2?.[0]?.MonthlyWiseTotalCount) {
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
            data: [],
          },
        ],
      })
    }
  }, [dashboard]);


  document.title = "Dashboard | NCSI";
  return (
    <React.Fragment>
        <div
          className="d-flex page-content align-items-center justify-content-center bg-light "
          style={{ height: '100vh' }}
        >
          <Container>
            <Row className="justify-content-center bg-light">
              <Col sm={12}>
                <Card className=" border-0 text-center">
                  <CardBody className="p-5 bg-light">
                    <div className="mb-4">
                      <div
                        className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                        style={{ width: '70px', height: '70px', fontSize: '30px' }}
                      >
                        🚧
                      </div>
                    </div>
                    <h2 className="mb-3">Dashboard Coming Soon</h2>
                    <p className="text-muted mb-4">
                      We’re working on building something amazing. Please check back later!
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
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
