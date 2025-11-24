import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import withRouter from "components/Common/withRouter";

import { Link, useLocation } from "react-router-dom"
import { withTranslation } from "react-i18next";
import { IoListOutline, IoHomeOutline } from "react-icons/io5";
import { PiNetworkLight } from "react-icons/pi";
import { TfiLayoutSliderAlt } from "react-icons/tfi";
import { FaLeanpub } from "react-icons/fa6";
import { TbChartBarPopular } from "react-icons/tb";
import { GrIndicator } from "react-icons/gr";
import { RiSurveyLine,RiShieldUserLine  } from "react-icons/ri";
import { MdOutlineFeedback,MdAssignment  } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { BiNews } from "react-icons/bi";
import { GiAchievement } from "react-icons/gi";
import { RiFolderChartLine } from "react-icons/ri";
import { RiPagesLine } from "react-icons/ri";
import { IoMdList } from "react-icons/io";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { VscListTree } from "react-icons/vsc";




const SidebarContent = ({ t }) => {
  const location = useLocation();
  const ref = useRef();
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const user = useSelector(state=>state?.Login.user)
  const path = location.pathname;
  const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
  const isAdmin = Cookies.get('isAdmin') == "yes"

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); 

        const parent3 = parent2.parentElement; 
        if (parent3) {
          parent3.classList.add("mm-active"); 
          parent3.childNodes[0].classList.add("mm-active"); 
          const parent4 = parent3.parentElement; 
          if (parent4) {
            parent4.classList.add("mm-show"); 
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.length && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); 
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; 
            if (parent4) {
              parent4.classList.remove("mm-show"); 
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); 
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  function tToggle2(){
    var body = document.body;
    if (window.screen.width <= 992) {
      body.classList.toggle("sidebar-enable");
    }
  }
  
  const activeMenu = useCallback(() => {
    const pathName = location.pathname;
    const fullPath = pathName;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (fullPath === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  // Get available paths from permissions
  const availablePaths = permissions
  // Handle menu item click
  const handleMenuItemClick = (itemPath) => {
    setSelectedMenuItem(itemPath);  // Set the active menu item
  };

  const getActiveItemStyle = (itemPath) => {
    return selectedMenuItem === itemPath ? { backgroundColor: "#f0f0f0" } : {};
  };

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            { (
              <li>
                <Link to="/dashboard" className="waves-effect" onClick={() =>{ handleMenuItemClick("/dashboard"); tToggle2();}}>
                  <IoHomeOutline size={20} className="me-2 mb-1" />
                  <span className="">{t("Dashboard")}</span>
                </Link>
              </li>
            )}
            {(isAdmin || availablePaths.includes("events.list") || availablePaths.includes("events.create") || availablePaths.includes("events.update") || availablePaths.includes("events.delete") || availablePaths.includes("events.view"))&& (
              <li>
                <Link to="/events" className="waves-effect" onClick={() =>{ handleMenuItemClick("/events"); tToggle2();}}>
                  <IoListOutline size={23} className="me-2" />
                  <span>{t("Events")}</span>
                </Link>
              </li>
            )}
            {((isAdmin || availablePaths.includes("users.list") || availablePaths.includes("users.create") || availablePaths.includes("users.update") || availablePaths.includes("users.delete") || availablePaths.includes("users.view")))&&<li>
                <Link to="/users" className="waves-effect" onClick={() =>{ handleMenuItemClick("/users"); tToggle2();}}>
                <CiUser size={22} className="me-2" />
                  <span>{t("Users")}</span>
                </Link>
              </li>}
            {(isAdmin || availablePaths.includes("sliders.list") || availablePaths.includes("sliders.create") || availablePaths.includes("sliders.update") || availablePaths.includes("sliders.delete") || availablePaths.includes("sliders.view")) && (
              <li>
                <Link to="/Sliders" className="waves-effect" onClick={() =>{handleMenuItemClick("/Sliders"); tToggle2();}}>
                  <TfiLayoutSliderAlt  size={23} className="me-2" />
                  <span>{t("Sliders")}</span>
                </Link>
              </li>
            )}
           
            {(isAdmin || availablePaths.includes("publications.list") || availablePaths.includes("publications.create") || availablePaths.includes("publications.update") || availablePaths.includes("publications.delete") || availablePaths.includes("publications.view"))&&<li>
                <Link to="/publications" className="waves-effect" onClick={() =>{handleMenuItemClick("/publications"); tToggle2();}}>
                  <FaLeanpub size={23} className="me-2" />
                  <span>{t("Publications")}</span>
                </Link>
              </li>}

              {(isAdmin || availablePaths.includes("classifications.list") || availablePaths.includes("classifications.create") || availablePaths.includes("classifications.update") || availablePaths.includes("classifications.delete") || availablePaths.includes("classifications.view"))&&<li>
                <Link to="/classifications" className="waves-effect" onClick={() =>{handleMenuItemClick("/classifications"); tToggle2();}}>
                  <PiNetworkLight size={23} className="me-2" />
                  <span>{t("Classifications")}</span>
                </Link>
              </li>}
           
              {(isAdmin || availablePaths.includes("populations.list") || availablePaths.includes("populations.create") || availablePaths.includes("populations.update") || availablePaths.includes("populations.delete") || availablePaths.includes("populations.view"))&&<li>
                <Link to="/populations" className="waves-effect" onClick={() =>{handleMenuItemClick("/populations"); tToggle2();}}>
                  <TbChartBarPopular size={23} className="me-2" />
                  <span>{t("Population")}</span>
                </Link>
              </li>}

              {(isAdmin || availablePaths.includes("keyindicators.list") || availablePaths.includes("keyindicators.create") || availablePaths.includes("keyindicators.update") || availablePaths.includes("keyindicators.delete") || availablePaths.includes("keyindicators.view"))&&<li>
                <Link to="/indicators" className="waves-effect" onClick={() =>{handleMenuItemClick("/indicators"); tToggle2();}}>
                  <GrIndicator  size={21} className="me-2" />
                  <span>{t("Indicators")}</span>
                </Link>
              </li>}
           
              {(isAdmin || availablePaths.includes("surveyrequests.list") || availablePaths.includes("surveyrequests.create") || availablePaths.includes("surveyrequests.update") || availablePaths.includes("surveyrequests.delete") || availablePaths.includes("surveyrequests.view"))&&<li>
                <Link to="/surveys" className="waves-effect" onClick={() =>{handleMenuItemClick("/surveys"); tToggle2();}}>
                  <RiSurveyLine  size={21} className="me-2" />
                  <span>{t("Surveys")}</span>
                </Link>
              </li>}

              {(isAdmin || availablePaths.includes("feedback.list") || availablePaths.includes("feedback.create") || availablePaths.includes("feedback.update") || availablePaths.includes("feedback.delete") || availablePaths.includes("feedback.view"))&&<li>
                <Link to="/feedbacks" className="waves-effect" onClick={() =>{handleMenuItemClick("/feedbacks"); tToggle2();}}>
                  <MdOutlineFeedback  size={21} className="me-2" />
                  <span>{t("Feedbacks")}</span>
                </Link>
              </li>}

              {(isAdmin || availablePaths.includes("achievments.list") || availablePaths.includes("achievments.create") || availablePaths.includes("achievments.update") || availablePaths.includes("achievments.delete") || availablePaths.includes("achievments.view")) &&<li>
                <Link to="/achievements" className="waves-effect" onClick={() =>{handleMenuItemClick("/achievements"); tToggle2();}}>
                  <GiAchievement  size={21} className="me-2" />
                  <span>{t("Achievements")}</span>
                </Link>
              </li>}

              {(isAdmin || availablePaths.includes("statistics.list") || availablePaths.includes("statistics.create") || availablePaths.includes("organizationcharts.update") || availablePaths.includes("organizationcharts.delete") || availablePaths.includes("organizationcharts.view")) && <li>
                <Link to="/organization-charts" className="waves-effect" onClick={() =>{handleMenuItemClick("/organization-charts"); tToggle2();}}>
                  <RiFolderChartLine  size={21} className="me-2" />
                  <span>{t("Organization charts")}</span>
                </Link>
              </li>}

              {(isAdmin || availablePaths.includes("statistics.list") || availablePaths.includes("statistics.create") || availablePaths.includes("statistics.update") || availablePaths.includes("statistics.delete") || availablePaths.includes("statistics.view")) && <li>
                <Link to="/statistics" className="waves-effect" onClick={() =>{handleMenuItemClick("/statistics"); tToggle2();}}>
                  <IoMdList  size={21} className="me-2" />
                  <span>{t("Statistics")}</span>
                </Link>
              </li>}

              {(isAdmin || availablePaths.includes("methodologies.list") || availablePaths.includes("methodologies.create") || availablePaths.includes("methodologies.update") || availablePaths.includes("methodologies.delete") || availablePaths.includes("methodologies.view")) &&<li>
                <Link to="/methodologies" className="waves-effect" onClick={() =>{handleMenuItemClick("/methodologies"); tToggle2();}}>
                  <LiaProjectDiagramSolid  size={21} className="me-2" />
                  <span>{t("Methodologies")}</span>
                </Link>
              </li>}

              {(isAdmin || availablePaths.includes("pages.list") || availablePaths.includes("pages.create") || availablePaths.includes("pages.update") || availablePaths.includes("pages.delete") || availablePaths.includes("pages.view")) &&<li>
                <Link to="/cms-pages" className="waves-effect" onClick={() =>{handleMenuItemClick("/cms-pages"); tToggle2();}}>
                  <RiPagesLine  size={21} className="me-2" />
                  <span>{t("CMS Pages")}</span>
                </Link>
              </li>}

              {(isAdmin || availablePaths.includes("guideclassifications.list") || availablePaths.includes("guideclassifications.create") || availablePaths.includes("guideclassifications.update") || availablePaths.includes("guideclassifications.delete") || availablePaths.includes("guideclassifications.view")) &&<li>
                <Link to="/guide-classifications" className="waves-effect" onClick={() =>{handleMenuItemClick("/guide-classifications"); tToggle2();}}>
                  <VscListTree  size={21} className="me-2" />
                  <span>{t("Guides & Classifications")}</span>
                </Link>
              </li>}

              {(isAdmin || availablePaths.includes("liscences.list") || availablePaths.includes("liscences.create") || availablePaths.includes("liscences.update") || availablePaths.includes("liscences.delete") || availablePaths.includes("liscences.view")) &&<li>
                <Link to="/survey-licenses" className="waves-effect" onClick={() =>{handleMenuItemClick("/survey-licenses"); tToggle2();}}>
                  <MdAssignment   size={21} className="me-2" />
                  <span>{t("Survey Licence")}</span>
                </Link>
              </li>}

              {(isAdmin || availablePaths.includes("news.list") || availablePaths.includes("news.create") || availablePaths.includes("news.update") || availablePaths.includes("news.delete") || availablePaths.includes("news.view")) &&<li>
                <Link to="/news" className="waves-effect" onClick={() =>{handleMenuItemClick("/news"); tToggle2();}}>
                  <BiNews  size={21} className="me-2" />
                  <span>{t("News")}</span>
                </Link>
              </li>}

             {(isAdmin || availablePaths.includes("roles.list") || availablePaths.includes("roles.create") || availablePaths.includes("roles.update") || availablePaths.includes("roles.delete") || availablePaths.includes("roles.view")) &&<li>
                <Link to="/roles" className="waves-effect" onClick={() =>{handleMenuItemClick("/roles"); tToggle2();}}>
                  <RiShieldUserLine   size={21} className="me-2" />
                  <span>{t("Roles")}</span>
                </Link>
              </li>}

            {/* {availablePaths.includes("/settings") && (
              <li>
                <Link to="/settings" className="waves-effect d-flex align-items-center" onClick={() =>{handleMenuItemClick("/users");tToggle2();}}>
                  <IoSettingsOutline size={22} className="me-2 mt-1" />
                  <span>{t("Settings")}</span>
                </Link>
              </li>
            )} */}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  permissions: PropTypes.array,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
