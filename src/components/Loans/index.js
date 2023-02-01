import React, { useState } from 'react'
import { makePostAPICAll } from '../../services/api';

import css from './Loans.module.css';

import InputText from "../InputText";
import { API } from '../../services/constants';
import Button from '../Button';
import DropDown from '../DropDown';
import Modal from "../Modal";
import ModalHeader from "./../ModalHeader";
import Snackbar from "../../components/Snackbar";

const Loans = ({ loanDetails }) => {
    const { approvedLoans, loanApplications } = loanDetails;
    const [selectedLoan, setSelectedLoan] = useState({})
    const [selectedLoanType, setSelectedLoanType] = useState('APPROVED');
    const [emiDetails, setEmiDetails] = useState({});
    const [shouldApplyValidation, setShouldApplyValidation] = useState(false);
    const [responseError, setResponseError] = useState("");
    const [validationResult, setValidationResult] = useState({});
    const [shouldShowPayEmiModal, setShouldShowPayEmiModal] = useState(false);
    const loanTypeOptions = [{ text: "Approved", value: "APPROVED" }, { text: "Pending", value: "PENDING" }]
    const successMessage = "Transaction successful!";

    const handlePayEMI = (loan) => {
        setSelectedLoan({ ...loan })
        setShouldShowPayEmiModal(true);
    }

    const handleInputChange = (event) => {
        emiDetails[event.target.name] = event.target.value;
        setEmiDetails({ ...emiDetails });
    };

    const onModalClose = () => {
        setShouldShowPayEmiModal(false);
        setShouldApplyValidation(false);
        setSelectedLoan({});
        setEmiDetails({})
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

    const handleEmiPayment = () => {
        setShouldApplyValidation(true);
        if (shouldApplyValidation && isValidForm()) {
            let payload = {
                customerId: selectedLoan?.customerId?.toString(),
                loanId: selectedLoan?.loanId?.toString(),
                transactionValue: emiDetails.transactionValue,
                paymentMode: "NET_BANKING",
            };

            makePostAPICAll(API.payEmi, payload)
                .then((response) => {
                    if (response.success) {
                        setResponseError(successMessage);
                        setShouldShowPayEmiModal(false);
                    } else {
                        setResponseError(response.data);
                    }
                })
                .catch((error) => setResponseError(error));
        }
    };
    return (
        <div className={css.container}>
            <div className={css.dropDownContainer}>
                <label className={css.label} htmlFor="AccountType">
                    Select Loan Status
                </label>
                <DropDown
                    options={loanTypeOptions}
                    shouldShowEmptyOption={false}
                    label="Loan Status"
                    onInputChange={(e) => {
                        setSelectedLoanType(e.target.value);
                    }}
                    keyName={"loanStatus"}
                    value={selectedLoanType}
                />
            </div>

            <div className={css.title}>
                <h2 className={css.label} >{selectedLoanType === 'APPROVED' ? 'Approved' : 'Pending'} Loans</h2>
            </div>

            <table className="table is-fullwidth">
                <thead className={css.tableHeaderContainer}>
                    <tr>
                        <th className={`${css.tableHeader} has-text-centered`}>User Name</th>
                        <th className={`${css.tableHeader} has-text-centered`}>Phone Number</th>
                        <th className={`${css.tableHeader} has-text-centered`}>Address</th>
                        <th className={`${css.tableHeader} has-text-centered`}>Status</th>
                        <th className={`${css.tableHeader} has-text-centered`}>Loan Amount</th>
                        {selectedLoanType === 'APPROVED' && <th className={`${css.tableHeader} has-text-centered`}>Due Amount</th>}
                        <th className={`${css.tableHeader} has-text-centered`}>Loan Type</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {(selectedLoanType === 'APPROVED' ? (approvedLoans || []) : (loanApplications || [])).map((loan, index) => {
                        return (
                            <React.Fragment key={index}>
                                <tr>
                                    <td className={`${css.tableData} has-text-centered`}>{loan.userName}</td>
                                    <td className={`${css.tableData} has-text-centered`}>{loan.phoneNumber}</td>
                                    <td className={`${css.tableData} has-text-centered`}>{loan.address.state}-{loan.address.pincode}</td>
                                    <td className={`${css.tableData} has-text-centered`}>{loan.status ?? loan?.approvalStatus}</td>
                                    <td className={`${css.tableData} has-text-centered`}>₹{loan.loanAmount}</td>
                                    {selectedLoanType === 'APPROVED' && <td className={`${css.tableData} has-text-centered`}>₹{loan.loanAmountDue}</td>}
                                    <td className={`${css.tableData} has-text-centered`}>{loan.loanType}</td>
                                    <td className={`${css.tableData} has-text-centered`}>
                                        {selectedLoanType === 'APPROVED' &&
                                            <button className="button is-info" onClick={() => handlePayEMI(loan)}>
                                                Pay EMI
                                            </button>
                                        }
                                    </td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>


            <Modal
                isModalOpen={shouldShowPayEmiModal}
                handleClose={onModalClose}
            >
                <div className={css.modalContainer}>
                    <ModalHeader
                        title={"Pay Loan Emi"}
                        onModalClose={onModalClose}
                    />
                    <div className={css.modalContainer}>
                        <div className={css.inputContainerBox}>

                            <div className={css.inputContainer}>
                                <div className={css.inputFieldContainer}>
                                    <label className={css.label} htmlFor="loanId">
                                        Loan Id
                                    </label>
                                    <div className={css.inputField}>
                                        <InputText
                                            value={selectedLoan?.loanId}
                                            keyName={"loanId"}
                                            label="Loan Id"
                                            onInputChange={() => { }}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={css.inputContainer}>
                                <div className={css.inputFieldContainer}>
                                    <label className={css.label} htmlFor="currentBalance">
                                        Total Payment Due
                                    </label>
                                    <div className={css.inputField}>
                                        <InputText
                                            value={selectedLoan?.loanAmountDue}
                                            keyName={"loanAmountDue"}
                                            label="Due Amount"
                                            onInputChange={() => { }}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={css.inputContainer}>
                                <div className={css.inputFieldContainer}>
                                    <label className={css.label} htmlFor="transactionValue">
                                        Transaction Amount
                                    </label>
                                    <div className={css.inputField}>
                                        <InputText
                                            value={emiDetails.transactionValue}
                                            keyName={"transactionValue"}
                                            label="Transaction Value"
                                            onInputChange={handleInputChange}
                                            placeholder="Transaction Value in Rs."
                                            isRequired={shouldApplyValidation}
                                            isValid={(isValid, property) =>
                                                handleIsValid(isValid, property)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={css.buttonContainer}>
                                <Button
                                    buttonText={"Pay EMI"}
                                    handleClick={handleEmiPayment}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Snackbar text={responseError} onHide={() => setResponseError("")} />
        </div>
    )
}

export default Loans