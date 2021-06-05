import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import "./Navigation.style.scss";
import logo from "../../../assets/img/template/logo.svg";

export default function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img
            src={logo}
            width="30"
            height="30"
            alt=""
            style={{ verticalAlign: "middle" }}
          ></img>
          <span style={{ margin: "0px 20px" }}>EDWARD NUNEZ</span>
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
            style={{ color: "#000" }}
          />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item link-spacing cl-effect-1">
              <NavLink className="nav-link" to="/" activeClassName="active">
                Home
              </NavLink>
            </li>
            <li className="nav-item link-spacing cl-effect-1">
              <NavLink className="nav-link" to="/work" activeClassName="active">
                Work
              </NavLink>
            </li>
            <li className="nav-item link-spacing cl-effect-1" style={{}}>
              <NavLink className="nav-link" to="/blog" activeClassName="active">
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
  );
}
