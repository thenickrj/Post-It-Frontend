import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { Redirect } from "react-router";
// import { useDispatch, useSelector } from "react-redux";
// import {} from "react-router-dom";
// import { logout } from "../actions/userActions";

function Header() {
  let history = useHistory();

  var userInfo = localStorage.userInfo
    ? JSON.parse(localStorage.userInfo)
    : undefined;

  function logout() {
    localStorage.removeItem("userInfo");
    // window.location.href = "/login";
    history.push("/login");
  }

  const gotoLogin = () => {
    history.push("/login");
  };

  // console.log(userInfo);

  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand>
          <h1>Post It!</h1>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="m-auto">
            {/* <Form inline>
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
                // onChange={(e) => setSearch(e.target.value)}
              />
            </Form> */}
          </Nav>
          <Nav>
            <>
              <NavDropdown
                title={userInfo ? userInfo.name : "Guest"}
                id="collasible-nav-dropdown"
              >
                {userInfo ? (
                  <>
                    {/* <NavDropdown.Item href="/profile">Profile</NavDropdown.Item> */}
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </>
                ) : (
                  <NavDropdown.Item onClick={gotoLogin}>Login</NavDropdown.Item>
                )}
              </NavDropdown>
            </>
            {/* <Nav.Link href="/login">Login</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
