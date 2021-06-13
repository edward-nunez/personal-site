import React from "react";
import { NavLink, Link } from "react-router-dom";

import logo from "../../../assets/img/template/logo.svg";

export default function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand-md sticky-top">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <span>
              EDWARD{" "}
              <img
                src={logo}
                width="30"
                height="30"
                alt=""
                style={{ verticalAlign: "middle" }}
              ></img>{" "}
              NUNEZ
            </span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" style={{ color: "black" }}>
              S
            </span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item link-spacing cl-effect-1">
                <NavLink
                  className="nav-link"
                  to="/work"
                  activeClassName="active"
                >
                  Work
                </NavLink>
              </li>
              <li className="nav-item link-spacing cl-effect-1" style={{}}>
                <NavLink
                  className="nav-link"
                  to="/blog"
                  activeClassName="active"
                >
                  Blog
                </NavLink>
              </li>
              <li className="nav-item link-spacing cl-effect-1">
                <NavLink
                  className="nav-link"
                  to="/about"
                  activeClassName="active"
                >
                  About
                </NavLink>
              </li>
              <li className="nav-item link-spacing cl-effect-1">
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
    </header>
  );
}
