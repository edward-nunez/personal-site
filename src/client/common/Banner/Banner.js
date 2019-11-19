import React from 'react';
import { connect } from 'react-redux';

import 'Styles/Banner.scss';

function Banner(props) {
  const setBanner = () => {
    let obj;

    switch (props.pathname) {
      case '/':
        obj = {
          title: 'Full Stack Engineer',
          body:
            'Hello and welcome! I appreciate you taking the time to view my portfolio. ',
        };
        break;
      case '/projects':
        obj = {
          title: 'Projects',
          body: 'projects body',
        };
        break;
      case '/blog':
        obj = {
          title: 'Blog',
          body: 'blog body',
        };
        break;
      case '/about':
        obj = {
          title: 'About',
          body: 'about body',
        };
        break;
      case '/contact':
        obj = {
          title: 'contact test',
          body: 'contact body',
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
    <div
      className="container banner"
      hidden={!banner}
      style={{ height: '400px', paddingTop: '100px' }}
    >
      <div className="row">
        <div className="col-md-4" hidden={!banner.img}>
          <h1>image placeholder</h1>
        </div>
        <div className="col-lg-8 col-md-8">
          <h1 className="banner-title">{banner.title}</h1>
          <p className="banner-body">{banner.body}</p>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
  search: state.router.location.search,
  hash: state.router.location.hash,
});

export default connect(mapStateToProps)(Banner);
