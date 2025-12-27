/**
 * Register Page Component
 * New user registration with validation
 */
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    email: '',
    nickname: '',
    password: '',
    password_confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      return;
    }

    // Validate student ID format
    if (!/^\d{7}$/.test(formData.student_id)) {
      setError('Student ID must be exactly 7 digits');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        // Handle field-specific errors
        const errorMessages = Object.values(errorData).flat().join(' ');
        setError(errorMessages || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container className="content-wrapper">
        <Row className="justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0 rounded-lg fade-in">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-person-plus text-primary" style={{ fontSize: '3rem' }}></i>
                  <h2 className="mt-3">Create Account</h2>
                  <p className="text-muted">Register to participate in voting</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-person-badge me-2"></i>
                      Student ID
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="student_id"
                      placeholder="Enter 7-digit student ID"
                      value={formData.student_id}
                      onChange={handleChange}
                      required
                      maxLength="7"
                      pattern="\d{7}"
                      title="Please enter a 7-digit student ID"
                    />
                    <Form.Text className="text-muted">
                      Your student ID will be your username
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-envelope me-2"></i>
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-person me-2"></i>
                      Nickname
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="nickname"
                      placeholder="Enter display name"
                      value={formData.nickname}
                      onChange={handleChange}
                      required
                      maxLength="50"
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="bi bi-lock me-2"></i>
                          Password
                        </Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="8"
                            style={{ paddingRight: '40px' }}
                          />
                          <Button
                            variant="link"
                            className="position-absolute top-50 end-0 translate-middle-y text-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ textDecoration: 'none', padding: '0.375rem 0.75rem' }}
                            type="button"
                          >
                            <i className={`bi bi-eye${showPassword ? '-slash' : ''}-fill`}></i>
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>
                          <i className="bi bi-lock-fill me-2"></i>
                          Confirm Password
                        </Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            name="password_confirm"
                            placeholder="Confirm password"
                            value={formData.password_confirm}
                            onChange={handleChange}
                            required
                            style={{ paddingRight: '40px' }}
                          />
                          <Button
                            variant="link"
                            className="position-absolute top-50 end-0 translate-middle-y text-secondary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ textDecoration: 'none', padding: '0.375rem 0.75rem' }}
                            type="button"
                          >
                            <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}-fill`}></i>
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-check me-2"></i>
                        Create Account
                      </>
                    )}
                  </Button>
                </Form>

                <hr />

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-3 text-white">
              <small>© 2024 AI-Enhanced Online Voting System</small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
