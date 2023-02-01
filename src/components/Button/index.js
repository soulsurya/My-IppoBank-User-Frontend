import React from "react";
import { ButtonAttributes } from "./ButtonAttributes";

import css from "./Button.module.css";

/**
 * props for this component:
 * All the Values can be found in ButtonAttributes.js
 * buttonText: string - text to be displayed
 * handleClick: function - function to be called on click event
 * variant: string - variant of the button (solid or outline)
 * size: string - size of the button 
 * buttonType: string - type of the button (button, submit, reset)
 * color: string - color of the button 
 * textColor: string - color of the text 
 */
const Button = (props) => {
  const { variant = ButtonAttributes.variant.default,
    size = ButtonAttributes.size.default,
    buttonType = ButtonAttributes.buttonType.default,
    color = ButtonAttributes.color, handleClick, buttonText,
    textColor = ButtonAttributes.textColor, isDisabled = false } = props;

  return (
    <>
      {variant === ButtonAttributes.variant.solid ? (
        <button
          className={`${css.button}  ${size === ButtonAttributes.size.large ? css.large : css.small}`}
          style={{ backgroundColor: color, color: textColor, borderColor: color }}
          onClick={handleClick}
          disabled={isDisabled}
          type={buttonType}>
          {buttonText}
        </button>
      ) : (
        <button
          className={`${css.button}  ${size === ButtonAttributes.size.large ? css.large : css.small}`}
          style={{ backgroundColor: "transparent", color: textColor, borderColor: color }}
          onClick={handleClick}
          type={buttonType}
          disabled={isDisabled}>
          {buttonText}
        </button>
      )}
    </>
  );
};

export default Button;
