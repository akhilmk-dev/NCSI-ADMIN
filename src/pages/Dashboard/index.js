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
import { CiCalendar } from "react-icons/ci";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { TbFileExport } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi2";
import { GoGraph } from "react-icons/go";
import { LuClipboardList } from "react-icons/lu";
import { LuMessageSquareWarning } from "react-icons/lu";
import { PiNetworkLight } from "react-icons/pi";


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
import CountCard from 'components/cards/CountCard';

const Dashboard = props => {
  const [menu, setMenu] = useState(false);
  const [dashboardDetails, setDashboardDetails] = useState();
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

  const fetchDashboardDetails = async () => {
    try {
      const response = await axiosInstance('V1/dashboard/summary');
      setDashboardDetails(response?.data?.data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDashboardDetails()
  }, [])

  function formatDateToCustom(dateString) {
    const date = new Date(dateString);
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = date
      .toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
  }
  

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

  const thStyle = {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid rgb(241 241 241)',
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid rgb(241 241 241)',
    whiteSpace: 'nowrap',
  };

  const tdTitle ={
    maxWidth: '100%',       
    overflow: 'hidden',     
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',    
    padding: '12px',
    borderBottom: '1px solid rgb(241 241 241)',
    whiteSpace: 'nowrap',
    color:"black",
    cursor:"default"
  }



  document.title = "Dashboard | NCSI";
  return (
    <React.Fragment>
      <div
        className="page-content mt-5 p-4"
        style={{ minHeight: '100vh',backgroundColor:"#f4f5f9" }}
      >
        <h3 className='my-2'>Dashboard</h3>
        <div className='row g-3'>
          <CountCard title="Total Events" count={dashboardDetails?.counts?.total_events} path="/events" icon={<CiCalendar size={23} color="rgb(223 223 223)"/>}/>
          <CountCard title="Active Sliders" count={dashboardDetails?.counts?.active_sliders} path="/Sliders" icon={<TbAdjustmentsHorizontal size={23} color="rgb(223 223 223)" />}/>
          <CountCard title="Publications" count={dashboardDetails?.counts?.publications} path="/publications" icon={<TbFileExport size={23} color="rgb(223 223 223)"/>}/>
          <CountCard title="Classifications" count={dashboardDetails?.counts?.classifications} path="/classifications" icon={<PiNetworkLight size={23} color="rgb(223 223 223)"/>} />
          <CountCard title="Total Population" count={dashboardDetails?.counts?.total_population} path="/populations" icon={<HiOutlineUsers size={23} color="rgb(223 223 223)"/>}/>
          <CountCard title="Key Indicators" count={dashboardDetails?.counts?.key_indicators} path="/indicators"icon={<GoGraph size={23} color="rgb(223 223 223)" />} />
          <CountCard title="Surveys" count={dashboardDetails?.counts?.surveys} path="/surveys" icon={<LuClipboardList  size={23} color="rgb(223 223 223)"/>} />
          <CountCard title="Feedbacks" count={dashboardDetails?.counts?.feedbacks} path="/feedbacks" icon={<LuMessageSquareWarning size={23} color="rgb(223 223 223)"/>} />
        </div>
        <div className='row mb-3'>
          <div className='mt-4 col-xl-6'>
            <div className='pb-4' style={{ backgroundColor: "#fff", borderRadius: "8px" }}>
              <div className="d-flex px-3 pt-2 justify-content-between align-items-center" style={{marginBottom:"-8px"}}>
                <h5 >Latest Publications</h5>
                <span style={{color:"rgb(89 136 247)",cursor:"pointer"}} onClick={()=>navigate('/publications')}>View All</span>
              </div>
              <hr style={{ height: '1px', padding:0,border: 'none', backgroundColor: '#ccc' }} />
              <div className='p-2'>
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      border: '1px solid rgb(241 241 241)',
                      borderCollapse: 'separate', 
                      borderSpacing: 0,           
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: 'rgb(241 241 241)' }}>
                        <th style={{ ...thStyle, borderTopLeftRadius: '8px' }}>Title</th>
                        <th style={thStyle}>Created Date</th>
                        {/* <th style={thStyle}>Type</th>
                        <th style={{ ...thStyle, borderTopRightRadius: '8px' }}>Classifications</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardDetails?.latest_publications?.map(item=>(<tr>
                        <td style={tdTitle} title={item?.title}>{item?.title}</td>
                        <td style={tdStyle}>{item?.created_at}</td>
                        {/* <td style={tdStyle}>{item?.type}</td>
                        <td style={tdTitle} title={item?.classification}>{item?.classification}</td> */}
                      </tr>))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
          <div className='mt-4 col-xl-6'>
          <div className='pb-4' style={{ backgroundColor: "#fff", borderRadius: "8px" }}>
              <div className="d-flex px-3 pt-2 justify-content-between align-items-center" style={{marginBottom:"-8px"}}>
                <h5 >Events</h5>
                <span style={{color:"rgb(89 136 247)",cursor:"pointer"}} onClick={()=>navigate('/events')}>View All</span>
              </div>
              <hr style={{ height: '1px', padding:0,border: 'none', backgroundColor: '#ccc' }} />
              <div className='px-3 py-2'>
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      border: '1px solid rgb(241 241 241)',
                      borderCollapse: 'separate', // 👈 important
                      borderSpacing: 0,           // 👈 no spacing
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: 'rgb(241 241 241)' }}>
                        <th style={{ ...thStyle, borderTopLeftRadius: '8px' }}>Title</th>
                        <th style={thStyle}>From Date</th>
                        {/* <th style={{ ...thStyle, borderTopRightRadius: '8px' }}>Location</th> */}
                      </tr>
                    </thead>
                    <tbody>
                    {dashboardDetails?.latest_events?.map(item=>(<tr>
                        <td style={tdTitle} title={item?.title}>{item?.title}</td>
                        <td style={tdStyle}>{formatDateToCustom(item?.from_date)}</td>
                        {/* <td style={tdTitle} title={item?.location}>{item?.location}</td> */}
                      </tr>))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
        </div>
        {/* <Container>
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
          </Container> */}
      </div>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any
};

// export default withTranslation()(Dashboard);
export default Dashboard;
