import React from "react";

function Footer() {
    return (
        <div className="content-footer">
            <footer className="footer bg-footer-theme">
                <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
                    <div className="mb-2 mb-md-0">
            <span className="footer-text">
              © {new Date().getFullYear()}, Made with ❤️ by{" "}
                <a
                    href="https://upfinzo.in/"
                    target="_blank"
                    className="footer-link fw-semibold"
                    rel="noopener noreferrer"
                >
                Upfinzo
              </a>
            </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
