import React, { useState, useEffect } from "react";

import css from "./InputText.module.css";

export default function InputText(props) {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    validateInput(props.value);
  }, [props.value, props.isRequired, props.pattern, props.minLength]);

  //when input change this method call
  const handleInputChange = (event) => {
    validateInput(event.target.value);
    if (props.value || (event.target.value && event.target.value.trim())) {
      props.onInputChange(event);
    }
  };

  const validateInput = (value) => {
    let isValid = true;
    let message = "";
    if (props.isRequired && (!value || !value.trim())) {
      isValid = false;
      message = "Enter " + props.label;
    } else if (props.pattern && !props.pattern.test(value)) {
      isValid = false;
      message = props.patternMessage
        ? props.patternMessage
        : "Please enter valid " + props.label;
    } else if (props.minLength && value.length < props.minLength) {
      isValid = false;
      message =
        props.label + " should be at least " + props.minLength + " characters";
    } else if (props.maxLength && value.length > props.maxLength) {
      isValid = false;
      message = props.label + " cannot exceed " + props.maxLength + " characters";
    }
    props.isValid && props.isValid(isValid, props.keyName);
    setErrorMessage(message);
  };

  return (
    <>
      <div
        className={`control ${props.leftIcon ? "has-icons-left" : ""} ${css.inputContainer
          }`}
      >
        <input
          name={props.keyName}
          className={errorMessage ? "input is-danger" : "input"}
          type="text"
          value={props.value ? props.value : ""}
          onChange={(e) => handleInputChange(e)}
          disabled={props.disabled}
          placeholder={props.placeholder}
          onFocus={props.onFocus}
          onKeyDown={props.onKeyDown}
        />
        {props.leftIcon && (
          <span className="icon is-small is-left">{props.leftIcon}</span>
        )}
        <p className="help is-danger">{errorMessage}</p>
      </div>
    </>
  );
}
