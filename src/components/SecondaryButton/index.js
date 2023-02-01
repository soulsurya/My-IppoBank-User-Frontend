import React from "react";

import css from "./SecondaryButton.module.css";

const SecondaryButton = (props) => {
  return (
    <button onClick={props.onClick} className={css.secondaryButton} disabled={props.disabled}>
      <p className={css.secondaryButtonText}>{props.text}</p>
    </button>
  );
};

export default SecondaryButton;
