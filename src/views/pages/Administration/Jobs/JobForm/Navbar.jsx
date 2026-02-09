import React from "react";
import { Navbar, Container, Nav, Image } from "react-bootstrap";
import companylogo from "../../../../../assets/img/company/companylogo.png"
const AppNavbar = ({ children }) => {
  return (
    <>
      <Navbar expand="lg" sticky="top" style={{
        backgroundColor: "#c3bdbdff", // ✅ Change this color
        borderBottom: "1px solid #dee2e6", // Optional subtle border
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)", // Optional shadow
      }}>
        <Container>
          <Navbar.Brand href="https://bilvaleaf.com/" className="text-light">
            <Image
              src={companylogo}
              width="120"
              height="50"
              className="d-inline-block align-top"
              alt="Logo"
            />
          </Navbar.Brand>

          {/* <Nav className="ms-auto">
            <Nav.Link href="#home" className="text-light">
              Home
            </Nav.Link>
          </Nav> */}
        </Container>
      </Navbar>

      {/* Render children below navbar */}
      {children}
    </>
  );
};

export default AppNavbar;
