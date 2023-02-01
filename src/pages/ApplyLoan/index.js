import React, { useEffect, useState } from "react";
import OtpPage from "../../components/OtpPage";
import css from "./ApplyLoan.module.css";
import { Outlet, Link, BrowserRouter as Router, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import phoneImage from "../../assets/phoneImage.png";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
import DropDown from "../../components/DropDown";
import { getValue } from "../../utils/Validator";
import DatePicker from "../../components/DatePicker";
import { API, DateFormats, Validation, verificationTypes, WebsitePageLinks } from "../../services/constants";
import moment from "moment";
import { makePostAPICAll } from "../../services/api";
import Snackbar from "../../components/Snackbar";
import AlertDialog from '../../components/AlertDialog'
import { Checkbox, FormControlLabel } from "@material-ui/core";

const ApplyLoan = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [userDetails, setUserDetails] = useState({});
    const [isOtpVerificationMode, setIsOtpVerificationMode] = useState(true);
    const [validationResult, setValidationResult] = useState({});
    const [isCurrentCustomer, setIsCurrentCustomer] = useState(false);
    const [shouldApplyValidation, setShouldApplyValidation] = useState(false);
    const [responseError, setResponseError] = useState('');
    const [monthlyEmi, setMonthlyEmi] = useState(0);
    const [shouldShowApplyLoanAlertDialog, setShouldShowApplyLoanAlertDialog] = useState(false);
    const successMessage = "Application Submitted successfully!"


    useEffect(() => {
        setUserDetails({ ...userData })
    }, [userData]);

    const employmentTypeOptions = [
        {
            text: "Salaried",
            value: "SALARIED",
        },
        {
            text: "Self Employed",
            value: "SELF_EMPLOYED",
        },
    ];

    const loanTypeOptions = [
        {
            text: "Home Loan",
            value: "HOME_LOAN",
        },
        {
            text: "Car Loan",
            value: "CAR_LOAN",
        },
        {
            text: "Gold Loan",
            value: "GOLD_LOAN",
        },
        {
            text: "Personal Loan",
            value: "PERSONAL_LOAN",
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

    const handleApplyButtonClicked = () => {
        setShouldApplyValidation(true);
        if (shouldApplyValidation && isValidForm()) {
            let payload = {
                loanTenure: Number(userDetails.loanTenure),
                monthlyExpense: Number(userDetails.monthlyExpense),
                monthlyIncome: Number(userDetails.monthlyIncome),
                loanAmount: Number(userDetails.loanAmount),
            }
            makePostAPICAll(API.checkEligibility, payload)
                .then((response) => {
                    if (response.success) {
                        setMonthlyEmi(response.data);
                        setShouldShowApplyLoanAlertDialog(true);
                    } else {
                        setResponseError(response.data);
                    }
                })
                .catch(error => setResponseError(error))
        }
    };

    const applyForLoan = (payload) => {
        makePostAPICAll(API.applyLoan, payload)
            .then((response) => {
                if (response.success) {
                    setResponseError(successMessage);
                    setTimeout(() => {
                        navigate(WebsitePageLinks.home);
                    }, 3000);
                } else {
                    setResponseError(response.data);
                }
            })
            .catch(error => setResponseError(error))
    }

    const handleApplyLoanDialogue = (dialogAction) => {
        let payload = { ...userDetails, isBankCustomer: isCurrentCustomer }
        if (dialogAction) {
            applyForLoan(payload);
        }
        setShouldShowApplyLoanAlertDialog(false);
    }

    const handleInputChange = (event) => {
        if (event.target.name === 'isCurrentCustomer') {
            event.target.name = event.target.checked
        }
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
                    titleText="Apply for loan"
                    submitButtonText="Continue"
                    onVerifyOtpClick={handleOtpVerification}
                    setUserData={setUserData}
                    verificationType={verificationTypes.VERIFY_OTP}
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
                        <div className={css.inputRow}>

                            <div className={css.inputContainer}>
                                <div className={css.inputFieldContainer}>
                                    <label className={css.label} htmlFor="loanType">
                                        Loan Type
                                    </label>
                                    <div className={css.inputField}>
                                        <DropDown
                                            options={loanTypeOptions}
                                            shouldShowEmptyOption={true}
                                            label="Loan Type"
                                            onInputChange={handleInputChange}
                                            keyName={"loanType"}
                                            required={shouldApplyValidation}
                                            value={getValue(userDetails, "loanType", "")}
                                            isValid={(isValid, property) =>
                                                handleIsValid(isValid, property)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={css.inputContainer}>
                                <div className={css.inputFieldContainer}>
                                    <label className={css.label} htmlFor="employmentType">
                                        Employment Type
                                    </label>
                                    <div className={css.inputField}>
                                        <DropDown
                                            options={employmentTypeOptions}
                                            shouldShowEmptyOption={true}
                                            label="Employment Type"
                                            onInputChange={handleInputChange}
                                            keyName={"employmentType"}
                                            required={shouldApplyValidation}
                                            value={getValue(userDetails, "employmentType", "")}
                                            isValid={(isValid, property) =>
                                                handleIsValid(isValid, property)
                                            }
                                        />
                                    </div>
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
                                    <label className={css.label} htmlFor="monthlyIncome">
                                        Monthly Income
                                    </label>
                                    <div className={css.inputField}>
                                        <InputText
                                            value={userDetails.monthlyIncome}
                                            keyName={"monthlyIncome"}
                                            label="Monthly Income"
                                            onInputChange={handleInputChange}
                                            placeholder="Monthly income in ₹"
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
                                    <label className={css.label} htmlFor="monthlyExpense">
                                        Monthly Expense
                                    </label>
                                    <div className={css.inputField}>
                                        <InputText
                                            value={userDetails.monthlyExpense}
                                            keyName={"monthlyExpense"}
                                            label="Monthly expense in ₹"
                                            onInputChange={handleInputChange}
                                            placeholder="Monthly expense in ₹"
                                            isRequired={shouldApplyValidation}
                                            isValid={(isValid, property) =>
                                                handleIsValid(isValid, property)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={css.inputRow}>
                            <div className={css.inputContainer}>
                                <div className={css.inputFieldContainer}>
                                    <label className={css.label} htmlFor="loanAmount">
                                        Loan Amount
                                    </label>
                                    <div className={css.inputField}>
                                        <InputText
                                            value={userDetails.loanAmount}
                                            keyName={"loanAmount"}
                                            label="Loan Amount"
                                            onInputChange={handleInputChange}
                                            placeholder="Loan Amount in ₹"
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
                                    <label className={css.label} htmlFor="loanTenure">
                                        Loan Tenure
                                    </label>
                                    <div className={css.inputField}>
                                        <InputText
                                            value={userDetails.loanTenure}
                                            keyName={"loanTenure"}
                                            label="Loan Tenure"
                                            onInputChange={handleInputChange}
                                            placeholder="Loan Tenure in years"
                                            isRequired={shouldApplyValidation}
                                            isValid={(isValid, property) =>
                                                handleIsValid(isValid, property)
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
                            <FormControlLabel
                                label={"I already have an account with Ippopay"}
                                name="isCurrentCustomer"
                                control={
                                    <Checkbox
                                        color="primary"
                                        onChange={(e) => { setIsCurrentCustomer(e.target.checked) }}
                                        checked={isCurrentCustomer}
                                        name="isCurrentCustomer"
                                    />
                                }
                            />
                        </div>
                        <div className={css.buttonContainer}>
                            <Button
                                buttonText={"Submit Application"}
                                handleClick={handleApplyButtonClicked}
                            />
                        </div>
                    </div>
                </div>
            )}
            <Snackbar text={responseError} onHide={() => setResponseError('')} />
            <AlertDialog
                showAlert={shouldShowApplyLoanAlertDialog}
                onDialogActionButtonClick={(dialogAction) => handleApplyLoanDialogue(dialogAction)}
                title={`By Clicking Yes your application will be submitted!`}
                description={`Your monthly EMI for the loan will be ${monthlyEmi}₹ click Yes to confirm!`}
                disagreeText="No"
                agreeText="Yes"
            />
        </div>
    );
};

export default ApplyLoan;
