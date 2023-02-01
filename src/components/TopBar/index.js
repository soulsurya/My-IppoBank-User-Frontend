import React from "react";
import moment from "moment";

import css from "./Topbar.module.css";

import logo from "./../../assets/logo.png";
import Button from "../Button";
import { ButtonAttributes } from "../Button/ButtonAttributes";
import {
  CookiesKey,
  DateFormats,
  WebsitePageLinks,
} from "../../services/constants";
import { deleteCookie } from "../../utils/Cookies";
import { useNavigate } from "react-router-dom";
const TopBar = ({ title = "User" }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    deleteCookie(CookiesKey.ippoPay);
    navigate(WebsitePageLinks.home);
  };

  return (
    <nav className={css.navbar}>
      <div className={`column is-2 ${css.logo}`}>
        <img src={logo} />
      </div>

      <div className={`column is-10 ${css.navData}`}>
        <h2 className={css.title}>Welcome. {title}</h2>
        <div className={css.infoContainer}>
          <h2>{moment().format(DateFormats.modern)}</h2>
          <div className={css.logoutButton}>
            <Button
              buttonText="Logout"
              handleClick={handleLogoutClick}
              size={ButtonAttributes.size.small}
              variant={ButtonAttributes.variant.outline}
              textColor={ButtonAttributes.color}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
