import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import logo from './Logo';

export default function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-light bg-white absolute-top">
        <div className="container">
          <button
            className="navbar-toggler order-2 order-md-1"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target=".navbar-collapse"
            aria-controls="navbar-left navbar-right"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse order-3 order-md-2" id="navbar-left">
            <ul className="navbar-nav me-auto">
              <li className="nav-item link-spacing cl-effect-1 ml-auto">
                <NavLink className="nav-link" to="/" activeClassName="active">
                  Home
                </NavLink>
              </li>
              <li className="nav-item link-spacing cl-effect-1 ml-auto">
                <NavLink className="nav-link" to="/portfolio" activeClassName="active">
                  Portfolio
                </NavLink>
              </li>
            </ul>
          </div>
          <Link to="/" className="navbar-brand mx-auto order-1 order-md-3">
            <span>
              EDWARD <img src={logo} width="30" height="30" alt="" style={{ verticalAlign: 'middle' }} /> NUNEZ
            </span>
          </Link>
          <div className="collapse navbar-collapse order-4 order-md-4" id="navbar-right">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item link-spacing cl-effect-1 mr-auto">
                <NavLink className="nav-link" to="/about" activeClassName="active">
                  About
                </NavLink>
              </li>
              <li className="nav-item link-spacing cl-effect-1 mr-auto">
                <NavLink className="nav-link" to="/contact" activeClassName="active">
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
