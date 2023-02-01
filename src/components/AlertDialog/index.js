import React from "react";

import css from "./AlertDialog.module.css";

import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";

import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";

export default function AlertDialog(props) {
  const {
    showAlert,
    title,
    description,
    onDialogActionButtonClick,
    agreeText,
    disagreeText,
  } = props;
  return (
    <>
      <Dialog
        open={showAlert}
        onClose={(event) => onDialogActionButtonClick(false, event)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className={css.alertTitleContainer}>
          <DialogTitle id="alert-dialog-title" style={{ verticalAlign: 'middle' }}>
            {props.showIcon && props.showIcon}
            <p className={css.alertTitleText}>{title}</p>
          </DialogTitle>
        </div>
        {description && (
          <div className={css.dialogDescriptionContainer}>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <p className={css.descriptionText}>{description}</p>
              </DialogContentText>
            </DialogContent>
          </div>
        )}
        <div className={css.buttonContainer}>
          {disagreeText &&
            <div className={css.button}>
              <SecondaryButton
                text={disagreeText}
                onClick={(event) => onDialogActionButtonClick(false, event)}
              />
            </div>
          }
          {agreeText &&
            <div className={css.button}>
              <PrimaryButton text={agreeText} onClick={(event) => onDialogActionButtonClick(true, event)} />
            </div>
          }
        </div>
      </Dialog>
    </>
  );
}
