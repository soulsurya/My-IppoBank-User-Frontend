import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loans from "../../components/Loans";
import Sidebar from "../../components/SideBar";
import TopBar from "../../components/TopBar";
import UserHome from "../../components/UserHome";
import { getCookie } from "../../utils/Cookies";
import { API, CookiesKey, WebsitePageLinks } from "../../services/constants";
import AccountDetails from "../../components/AccountDetails";
import { CircularProgress } from "@material-ui/core";

import css from "./Dashboard.module.css";
import { makeGetAPICAll } from "../../services/api";

const Dashboard = (props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [loanDetails, setLoanDetails] = useState({});


  useEffect(() => {
    if (!getCookie(CookiesKey.ippoPay)) {
      navigate(WebsitePageLinks.signIn);
    } else {
      getUser()
    }
  }, []);

  const getUser = () => {
    setIsLoading(true);
    makeGetAPICAll(API.getUser).then((response) => {
      setIsLoading(false);
      if (response.success) {
        setUserDetails(response.data.userDetails);
        setLoanDetails(response.data.loanDetails);
        setAccounts(response.data.userDetails.accounts);
      }
    });
  };

  const menuOptions = {
    HOME: "HOME",
    ACCOUNT: "ACCOUNT",
    LOAN: "LOAN",
  };
  const [optionStatus, setOptionStatus] = useState(menuOptions.HOME);

  return (
    <div> {
      isLoading ? <CircularProgress /> : (
        <>
          <TopBar title={userDetails?.userName} />
          <section className="main-content columns is-fullheight">
            < Sidebar menuOptions={menuOptions} setOptionStatus={setOptionStatus} optionStatus={optionStatus} />
            <div className={`container column is-10 ${css.displaySection}`}>
              {optionStatus === menuOptions.HOME && <UserHome userDetails={userDetails} />}
              {optionStatus === menuOptions.ACCOUNT && <AccountDetails accounts={accounts} />}
              {optionStatus === menuOptions.LOAN && <Loans loanDetails={loanDetails} />}
            </div>
          </section>
        </>
      )
    }
    </div>
  );
};


export default Dashboard;
