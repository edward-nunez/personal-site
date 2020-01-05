import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faLinkedinIn,
  faFacebook,
} from '@fortawesome/free-brands-svg-icons';

import '../App.style.scss';
import './BlogPost.style.scss';

export default function BlogPost(props) {
  const recaptchaRef = React.createRef();

  const onSubmit = () => {
    const value = recaptchaRef.current.getValue();

    if (value === null) {
      console.log('Captcha value:', value);
    } else if (value) {
      console.log('Captcha value:', value);
    }
  };

  const onChange = value => {
    console.log('Captcha value:', value);
  };

  return (
    <div className="container content">
      <div className="row" style={{ margin: '20px 0px' }}>
        <div className="col-12">
          <div className="card-subtitle mb-2 text-muted">December 27, 2019</div>
        </div>
        <div className="col-12">
          <h1>Blog Post {props.match.params.id} </h1>
        </div>
        <div className="col-12">
          <p>Placholder body</p>
        </div>
        <div className="col-6">
          <a href="#" className="tag">
            #JavaScript
          </a>
        </div>
        <div className="col-6 text-right">
          <span className="font-weight-bold">Share:</span>{' '}
          <a
            className="social-link"
            rel="noopener noreferrer"
            href="#"
            target="_blank"
          >
            <FontAwesomeIcon icon={faTwitter} className="social-icon" />
          </a>
          <a
            className="social-link"
            rel="noopener noreferrer"
            href="#"
            target="_blank"
          >
            <FontAwesomeIcon icon={faLinkedinIn} className="social-icon" />
          </a>
          <a
            className="social-link"
            rel="noopener noreferrer"
            href="#"
            target="_blank"
          >
            <FontAwesomeIcon icon={faFacebook} className="social-icon" />
          </a>
        </div>
      </div>
    </div>
  );
}
