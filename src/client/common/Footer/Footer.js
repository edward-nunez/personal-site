import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faDribbble,
  faMediumM,
  faInstagram,
  faLinkedinIn,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

import './Footer.style.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div
          className="row"
          style={{ paddingTop: '40px', paddingBottom: '50px' }}
        >
          <div
            className="col-lg-6 col-sm-12 row"
            style={{ marginBottom: '10px', fontSize: '18px' }}
          >
            <div className="col-12">
              <h2>Contact</h2>
            </div>
            <div className="col-12">
              <form>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Name"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Email"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    id="message"
                    rows="3"
                    placeholder="Your Message"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary mb-2">
                  Submit
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-6 col-sm-12 row">
            <div className="col-12">
              <h2>Follow Me</h2>
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
                  />{' '}
                </a>
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
              </div>
            </div>
          </div>
          <div className="col-12" style={{ textAlign: 'center' }}>
            EDWARD NUNEZ ©2019
          </div>
        </div>
      </div>
    </footer>
  );
}
