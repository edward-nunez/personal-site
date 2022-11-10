import React, { useState } from "react";
import emailjs from "emailjs-com";

import Input from "../elements/Input";
import InputFeedback from "../elements/InputFeedback";
import ReCaptcha from "../elements/ReCaptcha";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    inputs: [
      {
        elemType: "input",
        type: "text",
        id: "name",
        required: true,
        placeholder: "Name",
        label: "Name",
        valid: false,
        errorMessage: "Please fill out this field.",
        touched: false,
        value: "",
      },
      {
        elemType: "input",
        type: "email",
        id: "email",
        required: true,
        placeholder: "E-mail",
        label: "E-mail",
        valid: false,
        touched: false,
        errorMessage: "Please fill out this field.",
        value: "",
      },
      {
        elemType: "input",
        type: "text",
        id: "company",
        required: false,
        placeholder: "Company",
        label: "Company (optional)",
        valid: true,
        touched: false,
        value: "",
      },
      {
        elemType: "textarea",
        id: "message",
        required: true,
        placeholder: "Message",
        label: "Message",
        valid: false,
        errorMessage: "Please fill out this field.",
        touched: false,
        rows: 3,
        value: "",
      },
    ],
    reCaptcha: { touched: false, valid: false },
    allFieldsValid: false,
    emailSent: false,
  });

  const handleReCAPTCHA = (valid) => {
    let newFormData = { ...formData };
    newFormData.reCaptcha.valid = valid;
    newFormData.reCaptcha.touched = true;

    setFormData(newFormData);
  };

  const handleInputEvent = (evt, index, touched) => {
    let newFormData = { ...formData };

    if (touched) {
      newFormData.inputs[index].touched = touched;
    }

    newFormData.inputs[index].errorMessage = evt.target.validationMessage;
    newFormData.inputs[index].valid = evt.target.validity.valid;
    newFormData.inputs[index].value = evt.target.value;

    setFormData(newFormData);
  };

  const handleValidity = () => {
    let allFieldsValid = true;
    const newFormData = { ...formData };

    newFormData.inputs.forEach((input) => {
      if (input.valid === false) {
        allFieldsValid = false;
      }

      input.touched = true;
    });

    newFormData.allFieldsValid = allFieldsValid;
    setFormData(newFormData);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault(); // Stops page from reloading when user presses Submit.
    handleValidity();

    console.log(formData.reCaptcha.valid, formData.allFieldsValid);
    if (formData.reCaptcha.valid && formData.allFieldsValid) {
      emailjs
        .sendForm(
          "edwardnnz_service",
          "contact_form",
          evt.target,
          "user_907s5tO5hxVUSKyRsGi0U"
        )
        .then(
          (result) => {
            console.log(result.text);
            setFormData({ ...formData, emailSent: true });
          },
          (error) => {
            console.log(error.text);
          }
        );
    }
  };

  const renderInputs = () =>
    formData.inputs.map((input, index) => {
      return (
        <div className="mb-3" key={index}>
          <Input
            {...input}
            index={index}
            onChange={handleInputEvent}
            onClick={handleInputEvent}
          />
          <InputFeedback
            valid={input.valid}
            touched={input.touched}
            errorMessage={input.errorMessage}
          />
        </div>
      );
    });

  return (
    <>
      <div style={{ display: `${formData.emailSent ? "block" : "none"}` }}>
        Email sent!
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ display: `${formData.emailSent ? "none" : "block"}` }}
        noValidate
      >
        {renderInputs()}
        <div className="mb-3">
          <ReCaptcha onChange={handleReCAPTCHA} />
          <div
            className="invalid-feedback"
            style={{
              display:
                !formData.reCaptcha.valid && formData.reCaptcha.touched
                  ? "block"
                  : "none",
            }}
          >
            Please complete ReCAPTCHA
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
}
