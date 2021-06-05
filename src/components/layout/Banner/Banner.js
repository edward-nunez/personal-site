import React from "react";

import { connect } from "react-redux";

import "./Banner.style.scss";
import Logo from "../../elements/Logo";

function Banner(props) {
  const setBanner = () => {
    let obj;

    switch (props.pathname) {
      case "/":
        obj = {
          img: "/assets/img/template/logo.svg",
          body: "Hello and welcome! I appreciate you taking the time \
            to view my portfolio.",
        };
        break;
      case "/projects":
        obj = {
          body: "projects body",
        };
        break;
      case "/blog":
        obj = {
          body: "blog body",
        };
        break;
      case "/about":
        obj = {
          body: "about body",
        };
        break;
      case "/contact":
        obj = {
          body: "contact body",
        };
        break;
      default:
        obj = null;
        break;
    }

    return obj;
  };

  const banner = setBanner();

  return (
    <div className="container banner" hidden={!banner}>
      <div className="row">
        <div className="col-12" hidden={!banner.img}>
          <Logo />
        </div>
        <div className="col-12">
          <p>{banner.body}</p>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  pathname: state.router.location.pathname,
  search: state.router.location.search,
  hash: state.router.location.hash,
});

export default connect(mapStateToProps)(Banner);
