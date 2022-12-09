import { useState } from 'react';
import emailjs from 'emailjs-com';

import Input from '../elements/Input';
import InputFeedback from '../elements/InputFeedback';
import ReCaptcha from '../elements/ReCaptcha';

export default function ContactForm() {
  const [reCaptchaValid, setreCaptchaValid] = useState(false);
  const [formData, setFormData] = useState({
    inputs: [
      {
        elemType: 'input',
        type: 'text',
        id: 'name',
        required: true,
        placeholder: 'Name',
        label: 'Name',
        valid: false,
        errorMessage: 'Please fill out this field.',
        touched: false,
        value: '',
      },
      {
        elemType: 'input',
        type: 'email',
        id: 'email',
        required: true,
        placeholder: 'E-mail',
        label: 'E-mail',
        valid: false,
        touched: false,
        errorMessage: 'Please fill out this field.',
        value: '',
      },
      {
        elemType: 'input',
        type: 'text',
        id: 'company',
        required: false,
        placeholder: 'Company',
        label: 'Company (optional)',
        valid: true,
        touched: false,
        value: '',
      },
      {
        elemType: 'textarea',
        id: 'message',
        required: true,
        placeholder: 'Message',
        label: 'Message',
        valid: false,
        errorMessage: 'Please fill out this field.',
        touched: false,
        rows: 3,
        value: '',
      },
    ],
    reCaptcha: { touched: false, valid: false },
    allFieldsValid: false,
    emailSent: false,
  });

  const updateValid = (valid) => {
    setreCaptchaValid(valid);
  };

  const handleReCAPTCHA = () => {
    const newFormData = { ...formData };
    newFormData.reCaptcha.valid = reCaptchaValid;
    newFormData.reCaptcha.touched = true;

    setFormData(newFormData);
  };

  const handleInputEvent = (evt, index, touched) => {
    const newFormData = { ...formData };

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
    const newFormData = formData.inputs.map((input) => {
      const newInput = input;

      if (newInput.valid === false) {
        allFieldsValid = false;
      }

      newInput.touched = true;

      return newInput;
    });

    newFormData.allFieldsValid = allFieldsValid;
    setFormData(newFormData);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault(); // Stops page from reloading when user presses Submit.
    handleValidity();

    console.log(formData.reCaptcha.valid, formData.allFieldsValid);
    if (formData.reCaptcha.valid && formData.allFieldsValid) {
      emailjs.sendForm('edwardnnz_service', 'contact_form', evt.target, 'user_907s5tO5hxVUSKyRsGi0U').then(
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
    formData.inputs.map((input, index) => (
      <div className="mb-3" key={input.id}>
        <Input
          elemType={input.elemType}
          type={input.type}
          id={input.id}
          placeholder={input.placeholder}
          rows={input.rows}
          required={input.required}
          label={input.label}
          index={index}
          onChange={handleInputEvent}
          onClick={handleInputEvent}
        />
        <InputFeedback valid={input.valid} touched={input.touched} errorMessage={input.errorMessage} />
      </div>
    ));

  return (
    <>
      <div style={{ display: `${formData.emailSent ? 'block' : 'none'}` }}>Email sent!</div>
      <form onSubmit={handleSubmit} style={{ display: `${formData.emailSent ? 'none' : 'block'}` }} noValidate>
        {renderInputs()}
        <div className="mb-3">
          <ReCaptcha onChange={handleReCAPTCHA} updateValid={updateValid} />
          <div
            className="invalid-feedback"
            style={{
              display: !formData.reCaptcha.valid && formData.reCaptcha.touched ? 'block' : 'none',
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
