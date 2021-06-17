import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const LayoutDefault = ({ children }) => (
  <>
    <Header />
    <main className="flex-shrink-0">
      <div className="container">{children}</div>
    </main>
    <Footer />
  </>
);

export default LayoutDefault;
