import React, { useEffect, useState } from "react";
import OtpPage from "../../components/OtpPage";
import css from "./CreateAccount.module.css";
import { Outlet, Link, BrowserRouter as Router, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import phoneImage from "../../assets/phoneImage.png";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
import DropDown from "../../components/DropDown";
import { getValue } from "../../utils/Validator";
import DatePicker from "../../components/DatePicker";
import { API, CookiesKey, DateFormats, Validation, verificationTypes, WebsitePageLinks } from "../../services/constants";
import moment from "moment";
import { makePostAPICAll } from "../../services/api";
import Snackbar from "../../components/Snackbar";
const CreateAccount = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [isOtpVerificationMode, setIsOtpVerificationMode] = useState(true);
  const [validationResult, setValidationResult] = useState({});
  const [shouldApplyValidation, setShouldApplyValidation] = useState(false);
  const [responseError, setResponseError] = useState('');

  useEffect(() => {
    setUserDetails({ ...userData })
  }, [userData]);

  const AccountTypeOptions = [
    {
      text: "Savings Account",
      value: "SAVINGS",
    },
    {
      text: "Checking Account",
      value: "CHECKING",
    },
  ];

  const idTypeOptions = [
    {
      text: "Aadhaar Card",
      value: "AADHAAR_CARD",
    },
    {
      text: "Voter Id",
      value: "VOTER_ID",
    },
    {
      text: "Pan Card",
      value: "PAN_CARD",
    },
  ];

  const handleCreateAccount = () => {
    setShouldApplyValidation(true);
    if (shouldApplyValidation && isValidForm()) {
      makePostAPICAll(API.createAccount, userDetails)
        .then((response) => {
          if (response.success) {
            navigate(WebsitePageLinks.dashboard);
          } else {
            setResponseError(response.data);
          }
        })
        .catch(console.error);
    }

  };

  const handleInputChange = (event) => {
    userDetails[event.target.name] = event.target.value;
    setUserDetails({ ...userDetails });
  };

  const handleIsValid = (isValid, property) => {
    validationResult[property.toString()] = isValid;
    setValidationResult(validationResult);
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

  const handleOtpVerification = () => {
    setIsOtpVerificationMode(false)
  };

  return (
    <div className={css.container}>
      {isOtpVerificationMode ? (
        <OtpPage
          submitButtonText="Continue"
          titleText="Create an account"
          onVerifyOtpClick={handleOtpVerification}
          setUserData={setUserData}
          verificationType={verificationTypes.VERIFY_CREATE_ACCOUNT}
        />
      ) : (
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
            <h2 className={css.title}>Personal Details</h2>
            <div className={css.inputContainer}>
              <div className={css.inputFieldContainer}>
                <label className={css.label} htmlFor="accountType">
                  Account Type
                </label>
                <div className={css.inputField}>
                  <DropDown
                    options={AccountTypeOptions}
                    shouldShowEmptyOption={true}
                    label="Account Type"
                    onInputChange={handleInputChange}
                    keyName={"accountType"}
                    required={shouldApplyValidation}
                    value={getValue(userDetails, "accountType", "")}
                    isValid={(isValid, property) =>
                      handleIsValid(isValid, property)
                    }
                  />
                </div>
              </div>
            </div>
            <div className={css.inputContainer}>
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
                    isRequired={shouldApplyValidation}
                    isValid={(isValid, property) =>
                      handleIsValid(isValid, property)
                    }
                  />
                </div>
              </div>
            </div>
            <div className={css.inputRow}>
              <div className={css.inputContainer}>
                <div className={css.inputFieldContainer}>
                  <label className={css.label} htmlFor="phoneNumber">
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
                      pattern={
                        shouldApplyValidation && Validation.mobileNumberReg
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={css.inputContainer}>
                <div className={css.inputFieldContainer}>
                  <label className={css.label} htmlFor="dob">
                    Date of Birth
                  </label>
                  <div className={css.inputField}>
                    <DatePicker
                      keyName={"dob"}
                      label="Date of Birth"
                      onInputChange={(e) => handleInputChange(e)}
                      date={userDetails && getValue(userDetails, "dob", "")}
                      format={DateFormats.inputDate}
                      maxDate={moment(Date.now()).format(DateFormats.inputDate)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={css.inputRow}>
              <div className={css.inputContainer}>
                <div className={css.inputFieldContainer}>
                  <label className={css.label} htmlFor="state">
                    State
                  </label>
                  <div className={css.inputField}>
                    <InputText
                      value={userDetails.state}
                      keyName={"state"}
                      label="State"
                      onInputChange={handleInputChange}
                      placeholder="eg. Chhattisgarh"
                      isRequired={shouldApplyValidation}
                      isValid={(isValid, property) =>
                        handleIsValid(isValid, property)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={css.inputContainer}>
                <div className={css.inputFieldContainer}>
                  <label className={css.label} htmlFor="pincode">
                    Pincode
                  </label>
                  <div className={css.inputField}>
                    <InputText
                      value={userDetails.pincode}
                      keyName={"pincode"}
                      label="Pincode"
                      onInputChange={handleInputChange}
                      placeholder="eg. 491559"
                      isRequired={shouldApplyValidation}
                      isValid={(isValid, property) =>
                        handleIsValid(isValid, property)
                      }
                      pattern={
                        shouldApplyValidation && Validation.pinCodeReg
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={css.inputRow}>
              <div className={css.inputContainer}>
                <div className={css.inputFieldContainer}>
                  <label className={css.label} htmlFor="idType">
                    ID type
                  </label>
                  <div className={css.inputField}>
                    <DropDown
                      options={idTypeOptions}
                      shouldShowEmptyOption={true}
                      label="Id Type"
                      onInputChange={handleInputChange}
                      keyName={"idType"}
                      required={shouldApplyValidation}
                      value={getValue(userDetails, "idType", "")}
                      isValid={(isValid, property) =>
                        handleIsValid(isValid, property)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={css.inputContainer}>
                <div className={css.inputFieldContainer}>
                  <label className={css.label} htmlFor="idNumber">
                    ID Number
                  </label>
                  <div className={css.inputField}>
                    <InputText
                      value={userDetails.idNumber}
                      keyName={"idNumber"}
                      label="Unique Id Number"
                      onInputChange={handleInputChange}
                      placeholder="Document Number"
                      isRequired={shouldApplyValidation}
                      isValid={(isValid, property) =>
                        handleIsValid(isValid, property)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={css.buttonContainer}>
              <Button
                buttonText={"Create Account"}
                handleClick={handleCreateAccount}
              />
            </div>
          </div>
        </div>
      )}
      <Snackbar text={responseError} onHide={() => setResponseError('')} />
    </div>
  );
};

export default CreateAccount;
