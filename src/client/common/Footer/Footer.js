import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faGithubAlt,
  faDribbble,
  faMediumM,
  faInstagram,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';

import './Footer.style.scss';

export default function Footer() {
  return (
    <footer className="footer fixed-bottom">
      <div className="container">
        <div className="row" style={{ paddingTop: '40px' }}>
          <div className="col-12 row">
            <div
              className="col-12"
              style={{ marginBottom: '10px', fontSize: '18px' }}
            >
              Where you can find me:
            </div>
            <div className="col-6" style={{ marginBottom: '10px' }}>
              <a
                className="social-link"
                href="https://github.com/dotRollen"
                target="_blank"
              >
                <FontAwesomeIcon
                  icon={faGithubAlt}
                  size="2x"
                  className="social-icon"
                />
              </a>
            </div>
            <div className="col-6" style={{ marginBottom: '10px' }}>
              <a
                className="social-link"
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
            <div className="col-6" style={{ marginBottom: '10px' }}>
              <a
                className="social-link"
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
            <div className="col-6" style={{ marginBottom: '10px' }}>
              <a
                className="social-link"
                href="https://medium.com/@edwardnnz"
                target="_blank"
              >
                <FontAwesomeIcon
                  icon={faMediumM}
                  size="2x"
                  className="social-icon"
                />
              </a>
            </div>
            <div className="col-6" style={{ marginBottom: '10px' }}>
              <a
                className="social-link"
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
            <div className="col-6" style={{ marginBottom: '10px' }}>
              <a
                className="social-link"
                href="https://dribbble.com/dotRollen"
                target="_blank"
              >
                <FontAwesomeIcon
                  icon={faDribbble}
                  size="2x"
                  className="social-icon"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
