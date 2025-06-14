import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "components/Common/withRouter";

// users
import user1 from "../../../assets/images/avatar.png";
import Cookies from "js-cookie";

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const [username, setusername] = useState("Admin");
  const navigate = useNavigate()

  const userId = 2

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setusername(obj.displayName);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setusername(obj.username);
      }
    }
  }, [props.success]);

  const handleLogout = ()=>{
    const allCookies = Cookies.get();

      // Loop through each cookie and remove it
      for (const cookieName in allCookies) {
        Cookies.remove(cookieName); // Removes the cookie
      }
      navigate('/login')
  }

  

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item waves-effect"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href={`#`}>
            {" "}
            <i className="mdi mdi-account-circle font-size-17 align-middle me-1" />
            {props.t("Profile")}{" "}
          </DropdownItem>

          <DropdownItem tag="a" href="#">
          <i className="mdi mdi-lock-open-outline font-size-17 align-middle me-1 " />
            Change Password
          </DropdownItem>
          <div className="dropdown-divider" />
          <span to="#" className="dropdown-item text-danger cursor-pointer" style={{cursor:"pointer"}} onClick={handleLogout}>
          <i className="bx bx-power-off font-size-17 align-middle me-1 text-danger" />
            <span style={{cursor:"pointer"}}>Logout</span>
          </span>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
};

const mapStatetoProps = state => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
