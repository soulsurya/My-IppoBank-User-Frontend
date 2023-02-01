import { _BASE_URL } from "./env";
export const BASE_URL = _BASE_URL;

export const WebsitePageLinks = {
    home: "/",
    signIn: "/sign-in",
    dashboard: "/dashboard",
    createAccount: "/create-account",
    applyLoan: "/apply-loan",
    createFinalExamDynamic: (examId) => `/schedule-exam/createFinalExam/${examId}`
};

export const API = {
    signIn: BASE_URL + "/auth/generateOtp",
    verifyOtp: BASE_URL + "/auth/verifyOtp",
    verifySignIn: BASE_URL + "/auth/verifySignIn",
    verifySignUp: BASE_URL + "/auth/verifySignUp",
    createAccount: BASE_URL + "/user/createUser",
    createTransaction: BASE_URL + "/user/createTransaction",
    payEmi: BASE_URL + "/loan/payEmi",
    checkEligibility: BASE_URL + "/loan/checkEligibility",
    applyLoan: BASE_URL + "/loan/createLoan",
    getUser: BASE_URL + "/user",
    courseDetails: (slug) => BASE_URL + "/admin/courses/" + slug,
};

export const CookiesKey = {
    ippoPay: "IPPO_PAY_TOKEN",
};

export const StatusCode = {
    inValidToken: 401,
};

export const defaultMinDate = "1900-01-01"
export const DateFormats = {
    primary: "DD-MMM-YYYY",
    secondary: "DD/MM/YYYY",
    inputDate: "YYYY-MM-DD",
    modern: "DD MMM YYYY",
    short: "DD MMM"
};

export const TimeFormats = {
    primary: "HH:mm:ss",
    secondary: "h:mm A",
    inputTime: "HH:mm",
};

export const DateTimeFormats = {
    primary: "DD-MMM-YYYY HH:mm:ss",
    secondary: "DD-MM-YYYY HH:mm",
    tertiary: "DD/MM/YYYY HH:mm"
};

export const Validation = {
    mobileNumberReg: /^[6-9]\d{9}$/,
    otpRegex: /^[1-9][0-9]{5}$/,
    pinCodeReg: /^[1-9][0-9]{5}$/,
    numberOnlyReg: /^[0-9]*$/
};

export const verificationTypes = {
    SIGN_IN: "SIGN_IN",
    VERIFY_OTP: "VERIFY_OTP",
    VERIFY_CREATE_ACCOUNT: "VERIFY_CREATE_ACCOUNT"
}
export const RupeeSymbol = "₹";
