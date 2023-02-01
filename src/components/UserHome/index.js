import moment from "moment";
import React from "react";
import { DateFormats } from "../../services/constants";
import css from "./UserHome.module.css";

const UserHome = ({ userDetails }) => {
  const getTotalBalance = () => {
    return userDetails?.accounts?.reduce(
      (prev, curr) => Number(prev) + Number(curr["currentBalance"] || 0),
      0
    );
  };
  return (
    <div className={css.container}>
      <h2 className={css.name}> {userDetails?.userName}'s Profile</h2>
      <div className={css.detailsContainer}>
        <div className={css.detailCard}>
          <p>Customer Id:</p>
          <p>{userDetails?.customerId}</p>
        </div>
        <div className={css.detailCard}>
          <p>Total Balance:</p>
          <p>{getTotalBalance()}</p>
        </div>
        <div className={css.detailCard}>
          <p>Address:</p>
          <p>{`${userDetails?.address?.pincode}, ${userDetails?.address?.state}`}</p>
        </div>
        <div className={css.detailCard}>
          <p>phone Number:</p>
          <p>{userDetails?.phoneNumber}</p>
        </div>
        <div className={css.detailCard}>
          <p>Date of Birth:</p>
          <p>{moment(userDetails?.dob).format(DateFormats?.modern)}</p>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
