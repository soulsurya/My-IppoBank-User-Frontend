import React, { useState } from "react";
import css from "./OtpPage.module.css";
import logo from "../../assets/logo.png";
import phoneImage from "../../assets/phoneImage.png";
import InputText from "../../components/InputText";
import Button from "../Button";
import { Outlet, Link, BrowserRouter as Router, useNavigate } from "react-router-dom";
import Snackbar from '../../components/Snackbar'
import { API, CookiesKey, Validation, verificationTypes, WebsitePageLinks } from "../../services/constants";
import { makePostAPICAll } from "../../services/api";
import { setCookie } from "../../utils/Cookies";

const OtpPage = (props) => {
  const { titleText = "SignIn to Continue", onVerifyOtpClick, verificationType = verificationTypes.SIGN_IN, setUserData, submitButtonText = 'Submit OTP' } = props
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [validationResult, setValidationResult] = useState({});
  const [isVerifyOtpMode, setIsVerifyOtpMode] = useState(false);
  const [shouldApplyValidation, setShouldApplyValidation] = useState(false);
  const [responseError, setResponseError] = useState('');


  const handleInputChange = (event) => {
    userDetails[event.target.name] = event.target.value;
    setUserDetails({ ...userDetails });
  };

  const handleIsValid = (isValid, property) => {
    validationResult[property.toString()] = isValid;
    setValidationResult(validationResult);
  };

  const handleSubmitOtp = () => {
    setShouldApplyValidation(true);
    if (shouldApplyValidation && isValidForm()) {
      if (verificationType === verificationTypes.SIGN_IN) {
        makePostAPICAll(API.verifySignIn, { phoneNumber: userDetails.phoneNumber, otp: userDetails.otp })
          .then((response) => {
            if (response.success) {
              if (response.data.token !== undefined) {
                setCookie(CookiesKey.ippoPay, response.data.token);
                navigate(WebsitePageLinks.dashboard);
              }
            } else if (response.success !== undefined && response.success === false) {
              setResponseError(response.data);
            }
          })
          .catch(console.error);

      } else if (verificationType === verificationTypes.VERIFY_CREATE_ACCOUNT) {
        makePostAPICAll(API.verifySignUp, userDetails).then((response) => {
          if (response.success) {
            if (response.data.token !== undefined) {
              setCookie(CookiesKey.ippoPay, response.data.token);
            }
            setUserData({ phoneNumber: userDetails.phoneNumber, userName: userDetails.userName })
            onVerifyOtpClick();
          } else setResponseError(response.data)
        }).catch((error) => {
          setResponseError(error);
        })
      } else {
        makePostAPICAll(API.verifyOtp, userDetails).then((response) => {
          if (response.success) {
            setUserData({ userDetails })
            onVerifyOtpClick();
          } else setResponseError(response.data)
        }).catch((error) => {
          setResponseError(error);
        })
      }
    }
  }

  const handleGenerateOtp = () => {
    setShouldApplyValidation(true);
    if (shouldApplyValidation && isValidForm()) {
      makePostAPICAll(API.signIn, { phoneNumber: userDetails.phoneNumber }).then((response) => {
        if (response.success) {
          setShouldApplyValidation(false);
          setIsVerifyOtpMode(true);
        }
      }).catch((error) => {
        setResponseError(error)
      })
    }
  };

  const isValidForm = () => {
    let errorMessage = "";
    for (let key in validationResult) {
      if (!validationResult[key]) {
        errorMessage = "Enter valid " + key;
        break;
      }
    }
    return !Boolean(errorMessage);
  };

  return (
    <div className={css.container}>
      <div className={`${css.imageContainer} is-hidden-mobile`}>
        <Link to="/" className={css.logo}>
          <img src={logo} />
        </Link>
        <div className={css.phoneImage}>
          <img src={phoneImage} />
        </div>
      </div>
      <div className={css.inputContainerBox}>
        <h2 className={css.title}>{titleText}</h2>
        {verificationType !== verificationTypes.SIGN_IN && <div className={css.inputContainer}>
          <div className={css.inputFieldContainer}>
            <label className={css.label} htmlFor="userName">
              Full Name
            </label>
            <div className={css.inputField}>
              <InputText
                value={userDetails.userName}
                keyName={"userName"}
                label="Full Name"
                onInputChange={handleInputChange}
                placeholder="Full Name"
                isRequired={verificationType !== verificationTypes.SIGN_IN && shouldApplyValidation}
                isValid={(isValid, property) =>
                  handleIsValid(isValid, property)
                }
                disabled={isVerifyOtpMode}
              />
            </div>
          </div>
        </div>}
        <div className={css.inputContainer}>
          <div className={css.inputFieldContainer}>
            <label className={css.label} htmlFor="userName">
              Phone Number
            </label>
            <div className={css.inputField}>
              <InputText
                value={userDetails.phoneNumber}
                keyName={"phoneNumber"}
                label="Phone Number"
                onInputChange={handleInputChange}
                placeholder="10 digit number"
                isRequired={shouldApplyValidation}
                isValid={(isValid, property) =>
                  handleIsValid(isValid, property)
                }
                pattern={shouldApplyValidation && Validation.mobileNumberReg}
                disabled={isVerifyOtpMode}
              />
            </div>
          </div>
        </div>
        {isVerifyOtpMode && (
          <div className={css.inputContainer}>
            <div className={css.inputFieldContainer}>
              <label className={css.label} htmlFor="userName">
                OTP
              </label>
              <div className={css.inputField}>
                <InputText
                  value={userDetails.otp}
                  keyName={"otp"}
                  label="OTP"
                  onInputChange={handleInputChange}
                  placeholder="Enter OTP"
                  isRequired={shouldApplyValidation && isVerifyOtpMode}
                  pattern={shouldApplyValidation && Validation.otpRegex}
                  isValid={(isValid, property) =>
                    handleIsValid(isValid, property)
                  }
                />
              </div>
            </div>
          </div>
        )}
        <Snackbar text={responseError} onHide={() => setResponseError('')} />
        <div className={css.buttonContainer}>
          {isVerifyOtpMode ? (
            <Button buttonText={submitButtonText} handleClick={handleSubmitOtp} />
          ) : (
            <Button buttonText="Generate OTP" handleClick={handleGenerateOtp} />
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
