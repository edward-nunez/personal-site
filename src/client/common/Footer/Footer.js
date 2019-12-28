import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  // faDribbble,
  // faMediumM,
  faInstagram,
  faLinkedinIn,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

import './Footer.style.scss';

export default function Footer() {
  return (
    <footer className="fixed-bottom">
      <div className="container">
        <div className="bottom-right">
          <div>
            <a
              className="social-link"
              rel="noopener noreferrer"
              href="https://github.com/dotRollen"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faGithub}
                size="2x"
                className="social-icon"
              />
            </a>
          </div>
          <div>
            <a
              className="social-link"
              rel="noopener noreferrer"
              href="https://twitter.com/edwardnnz"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faTwitter}
                size="2x"
                className="social-icon"
              />
            </a>
          </div>
          <div>
            <a
              className="social-link"
              rel="noopener noreferrer"
              href="https://www.instagram.com/dotrollen/"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faInstagram}
                size="2x"
                className="social-icon"
              />
            </a>
          </div>
          {/* <div>
            <a
              className="social-link"
              rel="noopener noreferrer"
              href="https://medium.com/@edwardnnz"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faMediumM}
                size="2x"
                className="social-icon"
              />
            </a>
          </div> */}
          <div>
            <a
              className="social-link"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/edwardnunez/"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faLinkedinIn}
                size="2x"
                className="social-icon"
              />
            </a>
          </div>
          {/* <div>
            <a
              className="social-link"
              rel="noopener noreferrer"
              href="https://dribbble.com/dotRollen"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faDribbble}
                size="2x"
                className="social-icon"
              />
            </a>
          </div> */}
        </div>
        <div className="row">
          <div className="col-12" style={{ textAlign: 'center' }}>
            EDWARD NUNEZ ©2019
          </div>
        </div>
      </div>
    </footer>
  );
}
