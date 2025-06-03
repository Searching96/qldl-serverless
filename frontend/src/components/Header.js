import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import "../styles/Header.css";

export const Header = () => {
  const location = useLocation();

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Link className="navbar-brand" to="/">
          Quản lý đại lý
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
              Tiếp nhận đại lý
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
              Lập phiếu xuất hàng
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/sprint03"
              className={
                location.pathname === "/sprint03" ||
                location.pathname === "/tim-kiem-dai-ly"
                  ? "active"
                  : ""
              }
            >
              Tìm kiếm đại lý
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/sprint04"
              className={
                location.pathname === "/sprint04" ||
                location.pathname === "/lap-phieu-thu-tien"
                  ? "active"
                  : ""
              }
            >
              Lập phiếu thu tiền
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/sprint05"
              className={
                location.pathname === "/sprint05" ||
                location.pathname === "/lap-bao-cao-doanh-so"
                  ? "active"
                  : ""
              }
            >
              Lập báo cáo doanh số
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/sprint06"
              className={
                location.pathname === "/sprint06" ||
                location.pathname === "/thay-doi-quy-dinh"
                  ? "active"
                  : ""
              }
            >
              Thay đổi quy định
            </Nav.Link>
            {/* <Nav.Link
              as={Link}
              to="/thao-tac-db"
              className={
                location.pathname === "/thao-tac-db"
                  ? "active"
                  : ""
              }
            >
              Thao Tác DB
            </Nav.Link> */}
            {/* Add more Nav.Link items here as needed */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
