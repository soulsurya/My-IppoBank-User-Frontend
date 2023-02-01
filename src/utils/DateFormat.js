import moment from "moment";

import { DateFormats } from "./../services/constants";

moment.updateLocale("en", {
  relativeTime: {
    s: "%dsec",
    ss: "%dsec",
    m: "%dmin",
    mm: "%dmins",
    h: "%dhr",
    hh: "%dhrs",
    d: "%dday",
    dd: "%ddays",
    w: "%dW",
    ww: "%dW",
    M: "%dM",
    MM: "%dM",
    y: "%dY",
    yy: "%dY",
  },
});

export const getDateInFormat = (date, format = DateFormats.inputDate) => {
  return moment(date).format(format);
};

export const getISOStringFromDateTime = (
  date,
  time,
  format = "YYYY-MM-DD HH:mm:ss"
) => {
  return moment(`${date} ${time}`, format).toISOString();
};

export const addTime = (date, time, type = "minutes") => {
  return moment(date).add(time, type).toISOString();
};

//this function says from date is less than to date then return true else false
export const isLessThanDate = (fromDate, toDate) => {
  const fromOnlyDate = getDateInFormat(fromDate); //remove time from date
  const toOnlyDate = getDateInFormat(toDate);
  return moment(fromOnlyDate).isBefore(toOnlyDate);
};

//this function says from date is greater than to date then return true else false
export const isGreaterThanDate = (fromDate, toDate) => {
  const fromOnlyDate = getDateInFormat(fromDate); //remove time from date
  const toOnlyDate = getDateInFormat(toDate);
  return moment(fromOnlyDate).isAfter(toOnlyDate);
};

export const getCurrentFinancialYear = () => {
  const financialYearStartMonth = 3;
  let today = new Date();
  let currentYear = today.getFullYear();
  if (today.getMonth() + 1 <= financialYearStartMonth) {
    currentYear -= 1;
  }
  return currentYear + "-" + (currentYear + 1).toString().substr(2, 2);
};

export const getDateDifference = (date) => {
  return moment(date).fromNow();
};