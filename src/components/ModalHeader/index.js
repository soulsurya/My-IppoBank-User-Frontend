import React from "react";

import css from "./ModalHeader.module.css";

import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const ModalHeader = (props) => {
  const { title, onModalClose, shouldShowBackButton, onBackClick } = props;
  return (
    <div>
      <div className={css.closeButtonContainer}>
        <CloseIcon onClick={onModalClose} />
      </div>
      <div className={css.header}>
        {shouldShowBackButton &&
          <div className={css.arrowBackContainer}>
            <ArrowBackIcon onClick={onBackClick} />
          </div>
        }
        <p className={css.headerText}>
          {title}
        </p>
      </div>
    </div>
  )
}

export default ModalHeader;