import React from 'react';

import Header from '../header/header.jsx';
import Router from '../../router/Routers.js'; // Matches import
import Footer from '../footer/footer.jsx';

const Layout = () => {
  return (
    <>
      <Header />
      <Router /> {/* Fixed typo */}
      <Footer />
    </>
  );
};

export default Layout;
