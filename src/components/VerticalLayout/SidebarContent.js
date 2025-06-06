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

const SidebarContent = ({ t }) => {
  const location = useLocation();
  const ref = useRef();
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const path = location.pathname;
  const permissions = [];

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
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag
        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
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
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
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
  // const availablePaths = permissions?.map(permission => permission.pageUrl);

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
            {/* {availablePaths.includes("/add-form") && ( */}
              <li>
                <Link to="/events" className="waves-effect" onClick={() =>{ handleMenuItemClick("/events"); tToggle2();}}>
                  <IoListOutline size={23} className="me-2" />
                  <span>{t("Events")}</span>
                </Link>
              </li>
            {/* )} */}
            {/* {availablePaths.includes("/departments") && ( */}
              <li>
                <Link to="/Sliders" className="waves-effect" onClick={() =>{handleMenuItemClick("/Sliders"); tToggle2();}}>
                  <TfiLayoutSliderAlt  size={23} className="me-2" />
                  <span>{t("Sliders")}</span>
                </Link>
              </li>
            {/* )} */}
           
            <li>
                <Link to="/publications" className="waves-effect" onClick={() =>{handleMenuItemClick("/publications"); tToggle2();}}>
                  <FaLeanpub size={23} className="me-2" />
                  <span>{t("Publications")}</span>
                </Link>
              </li>

              <li>
                <Link to="/classifications" className="waves-effect" onClick={() =>{handleMenuItemClick("/classifications"); tToggle2();}}>
                  <PiNetworkLight size={23} className="me-2" />
                  <span>{t("Classifications")}</span>
                </Link>
              </li>
           
              <li>
                <Link to="/populations" className="waves-effect" onClick={() =>{handleMenuItemClick("/populations"); tToggle2();}}>
                  <TbChartBarPopular size={23} className="me-2" />
                  <span>{t("Population")}</span>
                </Link>
              </li>

              <li>
                <Link to="/indicators" className="waves-effect" onClick={() =>{handleMenuItemClick("/indicators"); tToggle2();}}>
                  <GrIndicator  size={21} className="me-2" />
                  <span>{t("Indicators")}</span>
                </Link>
              </li>
           
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
