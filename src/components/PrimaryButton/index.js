import React from "react";

import css from "./PrimaryButton.module.css";

const PrimaryButton = (props) => {
  return (
    <button onClick={props.onClick} className={css.primaryButton} disabled={props.disabled} style={props.style}>
      <p className={css.primaryButtonText}>{props.text}</p>
    </button>
  );
};

export default PrimaryButton;
