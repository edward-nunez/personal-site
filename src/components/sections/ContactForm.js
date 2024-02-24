import { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';

import Input from '../elements/Input';
import InputFeedback from '../elements/InputFeedback';
import ReCaptcha from '../elements/ReCaptcha';

export default function ContactForm() {
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
    emailSent: false,
  });

  const [reCaptchaData, setReCaptchaData] = useState({
    touched: false,
    valid: false,
  });

  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const formValidation = () => {
      let isFormValid = true;

      formData.inputs.forEach((input) => {
        if (input.valid === false) {
          isFormValid = false;
        }
      });

      if (!reCaptchaData.valid) {
        isFormValid = false;
      }

      return isFormValid;
    };

    setFormValid(formValidation());
  }, [formData, reCaptchaData]);

  const updateReCaptchaState = (valid) => {
    const newData = { valid, touched: true };

    setReCaptchaData(newData);
  };

  const updateInputState = (evt, index, touched) => {
    const newFormData = { ...formData };
    newFormData.inputs[index].errorMessage = evt.target.validationMessage;
    newFormData.inputs[index].valid = evt.target.validity.valid;
    newFormData.inputs[index].value = evt.target.value;

    if (touched) {
      newFormData.inputs[index].touched = touched;
    }

    setFormData((oldFormData) => ({ ...oldFormData, ...newFormData }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault(); // Stops page from reloading when user presses Submit.

    if (formValid) {
      emailjs.sendForm('service_ccws3ss', 'contact_form', evt.target, 'user_907s5tO5hxVUSKyRsGi0U').then(
        (result) => {
          // Succesfull
          toast.success('Email has been sent, thank you!', {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });

          setFormData({ ...formData, emailSent: true });
        },
        (error) => {
          // Failed
          toast.error('Failed to send email, please try again.', {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        }
      );
    }
  };

  return (
    <>
      <div style={{ display: `${formData.emailSent ? 'block' : 'none'}` }}>Email sent!</div>
      <form onSubmit={handleSubmit} style={{ display: `${formData.emailSent ? 'none' : 'block'}` }} noValidate>
        <div className="mb-3" key={formData.inputs[0].id}>
          <Input
            elemType={formData.inputs[0].elemType}
            type={formData.inputs[0].type}
            id={formData.inputs[0].id}
            placeholder={formData.inputs[0].placeholder}
            rows={formData.inputs[0].rows}
            required={formData.inputs[0].required}
            label={formData.inputs[0].label}
            index={0}
            updateInputState={updateInputState}
          />
          <InputFeedback
            valid={formData.inputs[0].valid}
            touched={formData.inputs[0].touched}
            errorMessage={formData.inputs[0].errorMessage}
          />
        </div>
        <div className="mb-3" key={formData.inputs[1].id}>
          <Input
            elemType={formData.inputs[1].elemType}
            type={formData.inputs[1].type}
            id={formData.inputs[1].id}
            placeholder={formData.inputs[1].placeholder}
            rows={formData.inputs[1].rows}
            required={formData.inputs[1].required}
            label={formData.inputs[1].label}
            index={1}
            updateInputState={updateInputState}
          />
          <InputFeedback
            valid={formData.inputs[1].valid}
            touched={formData.inputs[1].touched}
            errorMessage={formData.inputs[1].errorMessage}
          />
        </div>
        <div className="mb-3" key={formData.inputs[2].id}>
          <Input
            elemType={formData.inputs[2].elemType}
            type={formData.inputs[2].type}
            id={formData.inputs[2].id}
            placeholder={formData.inputs[2].placeholder}
            rows={formData.inputs[2].rows}
            required={formData.inputs[2].required}
            label={formData.inputs[2].label}
            index={2}
            updateInputState={updateInputState}
          />
          <InputFeedback
            valid={formData.inputs[2].valid}
            touched={formData.inputs[2].touched}
            errorMessage={formData.inputs[2].errorMessage}
          />
        </div>
        <div className="mb-3" key={formData.inputs[3].id}>
          <Input
            elemType={formData.inputs[3].elemType}
            type={formData.inputs[3].type}
            id={formData.inputs[3].id}
            placeholder={formData.inputs[3].placeholder}
            rows={formData.inputs[3].rows}
            required={formData.inputs[3].required}
            label={formData.inputs[3].label}
            index={3}
            updateInputState={updateInputState}
          />
          <InputFeedback
            valid={formData.inputs[3].valid}
            touched={formData.inputs[3].touched}
            errorMessage={formData.inputs[3].errorMessage}
          />
        </div>
        <div className="mb-3">
          <ReCaptcha updateReCaptchaState={updateReCaptchaState} />
          <div
            className="invalid-feedback"
            style={{
              display: !reCaptchaData.valid && reCaptchaData.touched ? 'block' : 'none',
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
