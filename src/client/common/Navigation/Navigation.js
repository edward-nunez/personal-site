import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import 'Styles/Navigation.scss';

export default function Navigation() {
  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      style={{ backgroundColor: '#F3F3F3' }}
    >
      <div className="container">
        <Link to="/" className="navbar-brand">
          Edward Nunez
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
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item ">
              <NavLink
                className="nav-link underline-effect"
                to="/projects"
                activeClassName="active"
              >
                Projects
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link underline-effect"
                to="/blog"
                activeClassName="active"
              >
                Blog
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link underline-effect"
                to="/about"
                activeClassName="active"
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link underline-effect"
                to="/contact"
                activeClassName="active"
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
