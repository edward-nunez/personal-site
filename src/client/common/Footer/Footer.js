import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitterSquare,
  faGithubSquare,
  faDribbbleSquare,
  faMedium,
  faInstagram,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';

import 'Styles/Footer.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container row" style={{ paddingTop: '40px' }}>
        <div className="col-sm-12 col-md-6 row">
          <div className="col-12">
            <h1>Edward Nunez</h1>
            <p>
              “When you don’t have resources, you become resourceful.” - KR
              Sridhar
            </p>
          </div>
        </div>
        <div className="col-sm-12 col-md-6 row">
          <div className="col-12" style={{ marginBottom: '10px' }}>
            Where you can find me:
          </div>
          <div className="col-6" style={{ marginBottom: '10px' }}>
            <a
              className="social-link"
              href="https://github.com/dotRollen"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faGithubSquare}
                size="2x"
                className="social-icon"
              />
              GitHub
            </a>
          </div>
          <div className="col-6" style={{ marginBottom: '10px' }}>
            <a
              className="social-link"
              href="https://twitter.com/edwardnnz"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faTwitterSquare}
                size="2x"
                className="social-icon"
              />
              Twitter
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
              Instagram
            </a>
          </div>
          <div className="col-6" style={{ marginBottom: '10px' }}>
            <a
              className="social-link"
              href="https://medium.com/@edwardnnz"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faMedium}
                size="2x"
                className="social-icon"
              />
              Medium
            </a>
          </div>
          <div className="col-6" style={{ marginBottom: '10px' }}>
            <a
              className="social-link"
              href="https://www.linkedin.com/in/edwardnunez/"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faLinkedin}
                size="2x"
                className="social-icon"
              />
              LinkedIn
            </a>
          </div>
          <div className="col-6" style={{ marginBottom: '10px' }}>
            <a
              className="social-link"
              href="https://dribbble.com/dotRollen"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faDribbbleSquare}
                size="2x"
                className="social-icon"
              />
              Dribbble
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
