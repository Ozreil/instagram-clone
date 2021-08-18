import React, {useState, useEffect} from 'react';
import  './Nvbar.css';

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { NavDropdown, Figure} from 'react-bootstrap';
import FormControl from 'react-bootstrap/FormControl';
import { MDBIcon } from "mdbreact";
import {useAuth} from "../../context/AuthContext";
import {useHistory} from 'react-router-dom';

function Nvibar() {
    const [error, setError] = useState("");
    const {currentUser, logout, currentUserData} = useAuth();  
    const history = useHistory();

    async function handleLogout() {
        setError("")
    
        try {
          await logout()
          history.push("/login")
        } catch {
          setError("Failed to log out")
        }
      }

    return (
        <div className="navbar">
            <Navbar expand="sm" fixed="top" bg="light" variant="light">
                <Container>
                <Navbar.Brand href="/"><img height='50' src='https://www.citypng.com/public/uploads/preview/-11590321548vfiwckfjs3.png' /></Navbar.Brand>
                <Form className="d-flex">
                <FormControl
                    type="search"
                    placeholder="Search"
                    className="mr-2 navbar__search"
                    aria-label="Search"
                />
                </Form> 
                
                <Nav className="me-auto navbar__link">

                    <Nav.Link href="/"><MDBIcon icon="home" size="2x"/></Nav.Link>
                    <Nav.Link href="/inbox"><MDBIcon fab icon="facebook-messenger" size="2x" /></Nav.Link>
    
                    <Navbar.Toggle aria-controls="navbar-dark-example" />
                    <Navbar.Collapse id="navbar-dark-example">
                    <Nav>
                        <NavDropdown
                        id="nav-dropdown-dark-example"
                        title={
                            <img src={currentUserData.userData?.profileImg} width={30} className="nav__profimg"/>
                        }
                        >
                        <NavDropdown.Item href="/profile"><MDBIcon far icon="user"/> Profile</NavDropdown.Item>
                        <NavDropdown.Item href="/profile/saved"><MDBIcon far icon="bookmark" />  Saved</NavDropdown.Item>
                        <NavDropdown.Item href="/edit"><MDBIcon far icon="edit" /> Edit </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLogout}><MDBIcon icon="sign-out-alt" /> Log Out</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    </Navbar.Collapse>

                </Nav>
                </Container>
            </Navbar> 
        </div>
    )
}

export default Nvibar
