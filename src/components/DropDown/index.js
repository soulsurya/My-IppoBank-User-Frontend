import React, { useState, useEffect } from "react";
import { getValue } from "../../utils/Validator";

import css from "./DropDown.module.css";

const DropDown = (props) => {
  const [statusDropdownData, setStatusDropdownData] = useState();

  useEffect(() => {
    validateInput(props.value);
    setStatusDropdownData(props.options);
  }, [props.required, props.options]);

  const handleInputChange = (event) => {
    validateInput(event.target.value);
    props.onInputChange(event);
  };

  const validateInput = (value) => {
    props.required && props.isValid(Boolean(value), props.keyName);
  };

  return (
    <div
      className={`select is-fullwidth  ${props.value || !props.required ? "" : "is-danger"
        } ${css.dropdownContainer}`}
    >
      <select
        className={`${css.dropdown} is-fullwidth`}
        name={props.keyName}
        value={props.value}
        onChange={handleInputChange}
        disabled={props.disabled}
      >
        {props.shouldShowEmptyOption && (
          <option
            value=""
            disabled={getValue(props, "disableEmptyOption", false)}
            defaultValue={getValue(props, "disableEmptyOption", false)}
          >
            Select {getValue(props, "label", "Status")}
          </option>
        )}
        {statusDropdownData &&
          statusDropdownData.map((data) => {
            return (
              <option value={data.value} key={data.value}>
                {data.text}
              </option>
            );
          })}
      </select>
      {(!props.value && props.required) && <p className="help is-danger">Select {getValue(props, "label", "Status")}</p>}
    </div>
  );
};

export default DropDown;
