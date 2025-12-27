/**
 * Login Page Component
 * User authentication with student ID and password
 */
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({
        student_id: studentId,
        password: password,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container className="content-wrapper">
        <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0 rounded-lg fade-in">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-check2-square text-primary" style={{ fontSize: '3rem' }}></i>
                  <h2 className="mt-3">AI Voting System</h2>
                  <p className="text-muted">Sign in to cast your vote</p>
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
                      placeholder="Enter 7-digit student ID"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                      maxLength="7"
                      pattern="\d{7}"
                      title="Please enter a 7-digit student ID"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      <i className="bi bi-lock me-2"></i>
                      Password
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>
                </Form>

                <hr />

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none">
                      Register here
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

export default Login;
