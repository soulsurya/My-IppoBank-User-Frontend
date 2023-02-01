import moment from "moment";
import React, { useEffect, useState } from "react";
import { makePostAPICAll } from "../../services/api";
import { API, DateFormats } from "../../services/constants";
import { getValue } from "../../utils/Validator";
import Button from "../Button";
import DropDown from "../DropDown";
import InputText from "../InputText";
import Modal from "../Modal";
import ModalHeader from "./../ModalHeader";
import css from "./AccountDetails.module.css";
import Snackbar from "../../components/Snackbar";

const AccountDetails = ({ accounts }) => {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState({});
  const [shouldApplyValidation, setShouldApplyValidation] = useState(false);
  const [responseError, setResponseError] = useState("");
  const [validationResult, setValidationResult] = useState({});
  const [shouldShowTransactionModel, setShouldShowTransactionModal] =
    useState(false);
  const successMessage = "Transaction successful!";
  let accountsMap = {},
    accountTypes = [];

  accounts?.forEach((account) => {
    accountsMap[account.accountId] = account;
    accountTypes.push({
      text: account.accountType,
      value: account.accountId,
    });
  });

  const handleInputChange = (event) => {
    transactionDetails[event.target.name] = event.target.value;
    setTransactionDetails({ ...transactionDetails });
  };

  useEffect(() => {
    setSelectedAccount(accountTypes?.[0]?.value);
  }, [accountTypes]);

  useEffect(() => {
    setFilteredTransactions(accountsMap[selectedAccount]?.transactions || []);
    setTransactionDetails({});
  }, [selectedAccount]);

  const onModalClose = () => {
    setShouldShowTransactionModal(false);
    setShouldApplyValidation(false);
    setTransactionDetails({});
  };

  const handleIsValid = (isValid, property) => {
    validationResult[property.toString()] = isValid;
    setValidationResult(validationResult);
  };

  const transactionTypes = [
    { text: "Send Money", value: "DEBIT" },
    { text: "Add Money", value: "CREDIT" },
  ];

  const handleInitiateTransaction = () => {
    setShouldApplyValidation(true);
    if (shouldApplyValidation && isValidForm()) {
      let payload = {
        customerId: accountsMap[selectedAccount]?.customerId,
        accountId: accountsMap[selectedAccount]?.accountId,
        transactionValue: transactionDetails.transactionValue,
        transactionType: transactionDetails.transactionType,
        paidToAccountId: transactionDetails.accountId,
        paidToIfsc: transactionDetails.ifsc,
        paymentMode: "NET_BANKING",
      };

      makePostAPICAll(API.createTransaction, payload)
        .then((response) => {
          if (response.success) {
            setResponseError(successMessage);
            setShouldShowTransactionModal(false);
          } else {
            setResponseError(response.data);
          }
        })
        .catch((error) => setResponseError(error));
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
      <div className={css.dropDownContainer}>
        <label className={css.label} htmlFor="AccountType">
          Select Account:
        </label>
        <DropDown
          options={accountTypes}
          shouldShowEmptyOption={false}
          label="Account Type"
          onInputChange={(e) => {
            setSelectedAccount(e.target.value);
          }}
          keyName={"AccountType"}
          value={selectedAccount}
        />
      </div>

      <div className={css.transactionBox}>
        <h2 className={css.transactionsText}>Transactions</h2>
        <Button
          buttonText={"Make Transaction"}
          handleClick={() => {
            setShouldShowTransactionModal(true);
          }}
        />
      </div>

      <table className="table is-fullwidth">
        <thead className={css.tableHeaderContainer}>
          <tr>
            <th className={`${css.tableHeader} has-text-centered`}>Date</th>
            <th className={`${css.tableHeader} has-text-centered`}>Amount</th>
            <th className={`${css.tableHeader} has-text-centered`}>
              Transaction Type
            </th>
            <th className={`${css.tableHeader} has-text-centered`}>
              Payment Id
            </th>
            <th className={`${css.tableHeader} has-text-centered`}>Status</th>
            <th className={`${css.tableHeader} has-text-centered`}>
              Closing Balance
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions?.length > 0 &&
            filteredTransactions?.map((transaction, index) => {
              return (
                <React.Fragment key={index}>
                  <tr>
                    <td className={`${css.tableData} has-text-centered`}>
                      {moment(transaction.createdAt).format(
                        DateFormats.secondary
                      )}
                    </td>
                    <td className={`${css.tableData} has-text-centered`}>
                      ₹ {transaction?.transactionValue}
                    </td>
                    <td className={`${css.tableData} has-text-centered`}>
                      {transaction?.transactionType}
                    </td>
                    <td className={`${css.tableData} has-text-centered`}>
                      {transaction?.paymentId}
                    </td>
                    <td className={`${css.tableData} has-text-centered`}>
                      {transaction?.isPaymentComplete ? "Success" : "Failed"}
                    </td>
                    <td className={`${css.tableData} has-text-centered`}>
                      ₹ {transaction?.closingBalance}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
        </tbody>
      </table>

      <Modal
        isModalOpen={shouldShowTransactionModel}
        handleClose={onModalClose}
      >
        <div className={css.modalContainer}>
          <ModalHeader
            title={"Create Transaction"}
            onModalClose={onModalClose}
          />
          <div className={css.modalContainer}>
            <div className={css.inputContainerBox}>
              <div className={css.inputContainer}>
                <div className={css.inputFieldContainer}>
                  <label className={css.label} htmlFor="transactionType">
                    Transaction Type
                  </label>
                  <div className={css.inputField}>
                    <DropDown
                      options={transactionTypes}
                      shouldShowEmptyOption={true}
                      label="Transaction Type"
                      onInputChange={handleInputChange}
                      keyName={"transactionType"}
                      required={shouldApplyValidation}
                      value={getValue(
                        transactionDetails,
                        "transactionType",
                        ""
                      )}
                      isValid={(isValid, property) =>
                        handleIsValid(isValid, property)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className={css.inputContainer}>
                <div className={css.inputFieldContainer}>
                  <label className={css.label} htmlFor="currentBalance">
                    Current Balance
                  </label>
                  <div className={css.inputField}>
                    <InputText
                      value={accountsMap[selectedAccount]?.currentBalance || 0}
                      keyName={"currentBalance"}
                      label="Current Balance"
                      onInputChange={() => {}}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              {getValue(transactionDetails, "transactionType", "") ===
                "DEBIT" && (
                <>
                  <div className={css.inputContainer}>
                    <div className={css.inputFieldContainer}>
                      <label className={css.label} htmlFor="accountId">
                        Account Id
                      </label>
                      <div className={css.inputField}>
                        <InputText
                          value={transactionDetails.accountId}
                          keyName={"accountId"}
                          label="Account Id"
                          onInputChange={handleInputChange}
                          placeholder="Receiver's account Id"
                          isRequired={
                            getValue(
                              transactionDetails,
                              "transactionType",
                              ""
                            ) === "DEBIT" && shouldApplyValidation
                          }
                          isValid={(isValid, property) =>
                            handleIsValid(isValid, property)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className={css.inputContainer}>
                    <div className={css.inputFieldContainer}>
                      <label className={css.label} htmlFor="ifsc">
                        IFSC
                      </label>
                      <div className={css.inputField}>
                        <InputText
                          value={transactionDetails.ifsc}
                          keyName={"ifsc"}
                          label="IFSC"
                          onInputChange={handleInputChange}
                          placeholder="IFSC code"
                          isRequired={
                            getValue(
                              transactionDetails,
                              "transactionType",
                              ""
                            ) === "DEBIT" && shouldApplyValidation
                          }
                          isValid={(isValid, property) =>
                            handleIsValid(isValid, property)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className={css.inputContainer}>
                <div className={css.inputFieldContainer}>
                  <label className={css.label} htmlFor="transactionValue">
                    Transaction Amount
                  </label>
                  <div className={css.inputField}>
                    <InputText
                      value={transactionDetails.transactionValue}
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
                  buttonText={"Make Transaction"}
                  handleClick={handleInitiateTransaction}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Snackbar text={responseError} onHide={() => setResponseError("")} />
    </div>
  );
};

export default AccountDetails;
