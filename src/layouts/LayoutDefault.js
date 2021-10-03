import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const LayoutDefault = ({ children }) => (
  <>
    <Header />
    <main>
      <div className="container">{children}</div>
    </main>
    <Footer />
  </>
);

export default LayoutDefault;
