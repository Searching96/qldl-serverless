import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import "../styles/Header.css";

export const Header = () => {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Link className="navbar-brand" to="/">
          QLDL
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={location.pathname === "/" ? "active" : ""}
            >
              Trang chủ
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/sprint01"
              className={
                location.pathname === "/sprint01" ||
                location.pathname === "/tiep-nhan-dai-ly"
                  ? "active"
                  : ""
              }
            >
              Sprint 01
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/sprint02"
              className={
                location.pathname === "/sprint02" ||
                location.pathname === "/lap-phieu-xuat-hang"
                  ? "active"
                  : ""
              }
            >
              Sprint 02
            </Nav.Link>
            {/* Add more Nav.Link items here as needed */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
