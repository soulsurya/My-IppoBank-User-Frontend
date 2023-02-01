import React, { useState, useEffect } from "react";

import css from "./DatePicker.module.css";

import moment from "moment";

import TextField from "@material-ui/core/TextField";

import { isLessThanDate, isGreaterThanDate } from "../../utils/DateFormat";

import { DateFormats, defaultMinDate } from "./../../services/constants";
import { getValue } from "../../utils/Validator";

export default function DatePicker(props) {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    validate(props.date);
  }, []);

  useEffect(() => {
    validate(props.date);
  }, [props.minDate, props.maxDate, props.date, props.isRequired]);

  const validate = (value) => {
    setErrorMessage("");
    props.isValid && props.isValid(true, props.keyName);
    //handle required validation
    if (props.isRequired && !value) {
      setErrorMessage("Enter " + props.label);
      props.isValid && props.isValid(false, props.keyName);
      return;
    }

    if (getValue(props, "minDate", defaultMinDate) && isLessThanDate(value, getValue(props, "minDate", defaultMinDate))) {
      setErrorMessage(
        `Enter ${props.label} ${moment(getValue(props, "minDate", defaultMinDate)).format(DateFormats.primary)} or greater`
      );
      props.isValid && props.isValid(false, props.keyName);
      return;
    }

    if (props.maxDate && isGreaterThanDate(value, props.maxDate)) {
      setErrorMessage(
        `Enter ${props.label} ${moment(props.maxDate).format(DateFormats.primary)} or older`
      );
      props.isValid && props.isValid(false, props.keyName);
      return;
    }
  };

  //when input change this method call
  const handleInputChange = (e) => {
    setErrorMessage("");
    props.isValid && props.isValid(true, props.keyName);
    e.target.value = e.target.value || props.date;
    validate(e.target.value);
    props.onInputChange(e);
  };

  return (
    <div className={css.datePickerContainer}>
      <TextField
        id="date"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: getValue(props, "minDate", defaultMinDate),
          className: css.datePicker,
        }}
        format={props.format}
        value={props.date ? moment(props.date).format(props.format) : ""}
        name={props.keyName}
        onChange={(e) => handleInputChange(e)}
        style={{ width: "100%" }}
        disabled={props.isDisabled}
      />
      <p className="help is-danger">{errorMessage}</p>
    </div>
  );
}
