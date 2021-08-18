import React, {useRef, useState} from 'react'
import './Signup.css';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import {useAuth} from '../../context/AuthContext';
import { Alert } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom"

function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef  = useRef();
    const history = useHistory()

    const {signup, currentUser} = useAuth();

    const [error, setError ] = useState('');
    const [loading, setLoading ] = useState(false);
 
    async function handleSubmit(e) {
        e.preventDefault()
    
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
          return setError("Passwords do not match")
        }
    
        try {
          setError("")
          setLoading(true)
          await signup(emailRef.current.value, passwordRef.current.value)
          history.push("/signupdata")
        } catch {
          setError("Failed to create an account")
        }
    
        setLoading(false)
    }
    
    return (
        <div className="signup">
            <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Sign Up</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label className="text-center">Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group id="password">
                    <Form.Label className="text-center" >Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <Form.Group id="password-confirm">
                    <Form.Label className="text-center">Password Confirmation</Form.Label>
                    <Form.Control type="password" ref={passwordConfirmRef} required />
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit">
                    Sign Up
                </Button>
                </Form>
            </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
            Already have an account? <Link to="/signupdata">Log In</Link>
            </div>
        </div>
    )
}

export default Signup
