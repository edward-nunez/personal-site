import React from 'react';
import PropTypes from 'prop-types';

import { Header, Footer } from '../elements';

function DefaultLayout({ children }) {
  return (
    <>
      <Header />
      <main>
        <div className="container">{children}</div>
      </main>
      <Footer />
    </>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.elementType).isRequired,
};

export default DefaultLayout;
