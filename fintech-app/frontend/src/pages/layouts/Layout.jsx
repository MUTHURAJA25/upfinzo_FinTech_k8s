import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import Footer from "./Footer.jsx";

function Layout(props) {
  const [scrolled, setScrolled] = useState(false);
  const layoutOverlay = (event) => {
    document
      .getElementsByClassName("layout-navbar-fixed")[0]
      .classList.remove("layout-menu-expanded");
  };
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <div className="layout-wrapper layout-content-navbar ">
      <div className="layout-container">
        <Sidebar />
        <div className="menu-mobile-toggler d-xl-none rounded-1">
          <a
            href="javascript:void(0);"
            className="layout-menu-toggle menu-link text-large text-bg-secondary p-2 rounded-1"
          >
            <i className="ri ri-menu-line icon-base"></i>
            <i className="ri ri-arrow-right-s-line icon-base"></i>
          </a>
        </div>

        <div className={`layout-page ${scrolled ? "window-scrolled" : ""}`}>
          <Header />
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="col-lg-12">
                <h6 className="fw-bold py-3 mb-4">
                  <span className="text-muted fw-light">Home /</span> <span>{props.page}</span>
                </h6>
              </div>
              <div className="row">
                <div className="col-12">{props.children}</div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>

      <div onClick={layoutOverlay} className="layout-overlay"></div>
    </div>
  );
}

export default Layout;
