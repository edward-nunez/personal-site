import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import './Navigation.style.scss';

export default function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img
            src="/assets/img/template/logo.svg"
            width="30"
            height="30"
            alt=""
            style={{ verticalAlign: 'middle' }}
          ></img>
          <span style={{ margin: '0px 20px' }}>EDWARD NUNEZ</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon
            icon={faBars}
            className="social-icon"
            style={{ color: '#000' }}
          />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item" style={{ margin: '0px 20px' }}>
              <NavLink
                className="nav-link underline-effect"
                to="/"
                activeClassName="active"
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item" style={{ margin: '0px 20px' }}>
              <NavLink
                className="nav-link underline-effect"
                to="/projects"
                activeClassName="active"
              >
                Projects
              </NavLink>
            </li>
            <li className="nav-item" style={{ margin: '0px 20px' }}>
              <NavLink
                className="nav-link underline-effect"
                to="/blog"
                activeClassName="active"
              >
                Blog
              </NavLink>
            </li>
            <li className="nav-item" style={{ margin: '0px 20px' }}>
              <NavLink
                className="nav-link underline-effect"
                to="/about"
                activeClassName="active"
              >
                About
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
