import React, { useState } from "react";

import InputLabel from "./InputLabel";

/**
 * TODO
 */
export default function Input({
  elemType,
  type,
  id,
  placeholder,
  rows,
  required,
  label,
  index,
  valid,
  onChange,
  onClick,
}) {
  const Element = elemType === "textarea" ? "textarea" : "input";
  const [touched, setTouched] = useState(false);

  const handleOnChange = (evt) => {
    onChange(evt, index);
  };

  const handleOnClick = (evt) => {
    setTouched(true);

    onClick(evt, index, true);
  };

  const isInvalid = () => {
    if (required && touched) {
      return !valid ? true : false;
    }

    return false;
  };

  return (
    <>
      {label && <InputLabel id={id}>{label}</InputLabel>}
      <Element
        type={elemType !== "textarea" ? type : null}
        className={`form-control ${isInvalid() ? "is-invalid" : ""}`}
        id={id}
        name={id}
        placeholder={placeholder}
        rows={elemType === "textarea" ? (rows ? rows : 3) : null}
        required={required}
        onChange={handleOnChange}
        onClick={handleOnClick}
        onSelect={handleOnClick}
      />
    </>
  );
}
