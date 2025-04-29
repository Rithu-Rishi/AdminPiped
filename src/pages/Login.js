import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Button, Form, Alert, Spinner } from 'react-bootstrap';
import API, { setAuthToken } from '../config/api.js'
import Logo from '../assets/images/logo.png'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Get CSRF token (for Laravel/Sanctum)
      await API.get("/sanctum/csrf-cookie");

      // Step 2: Make login request
      const response = await API.post("/api/admin-login", { email, password });
      if (response.data.token) {
        // Step 3: Store Token and Set Authorization Header
        setAuthToken(response.data.token);
        localStorage.setItem("role", response.data.user.role);
        // Redirect after login
        if (response.data.user.role === "Super Admin" || response.data.user.role === "Admin") {
          navigate("/dashboard");
        } else {
          navigate("/menuItems");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='loginMain'>
      <div className=' d-flex justify-content-center align-items-center h-100'>
        <Col md='4'>
          <div className='pe-3'>
            <img src={Logo} alt="logo" className="img-fluid" />
          </div>
        </Col>
        <Col md='4'>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <h1><span className='text-danger'>Welcome</span> back!</h1>
            <p className='mb-5'>Please enter your credentials to sign in!</p>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Forgot Password" />
            </Form.Group> */}
            <Button variant="danger" type="submit" className='rounded-5 px-5' disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Login"}
            </Button>
          </Form>
        </Col>

      </div>
    </div>


  );
}

export default Login;
