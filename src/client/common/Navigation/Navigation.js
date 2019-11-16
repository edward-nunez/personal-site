import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import 'Styles/Navigation.scss';

export default function Navigation() {
  return (
    <nav
      className="navbar navbar-light navbar-expand-lg navbar-fix-top"
      style={{ backgroundColor: '#c6c5b9' }}
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
          <ul className="navbar-nav">
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
              <NavLink className="nav-link" to="/blog" activeClassName="active">
                Blog
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/about"
                activeClassName="underline-active active"
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
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
