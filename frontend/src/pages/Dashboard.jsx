/**
 * Dashboard Page Component
 * Shows voting statistics and user status
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import LoadingSpinner from '../components/LoadingSpinner';
import votingService from '../services/votingService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [votingStatus, setVotingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, statusData] = await Promise.all([
        votingService.getStats(),
        votingService.getVotingStatus(),
      ]);
      setStats(statsData);
      setVotingStatus(statusData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <>
      <NavigationBar />
      <div className="page-container bg-light">
        <Container className="content-wrapper py-4">
          {/* Welcome Section */}
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h2 className="mb-3">
                    <i className="bi bi-house-door text-primary me-2"></i>
                    Welcome, {user?.nickname?.toUpperCase()}!
                  </h2>
                  <p className="text-muted mb-0">
                    <i className="bi bi-person-badge me-2"></i>
                    Student ID: {user?.student_id}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Voting Status Alert */}
          {votingStatus && (
            <Row className="mb-4">
              <Col>
                {votingStatus.voted_count === votingStatus.total_positions ? (
                  <Alert variant="success">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    You have completed voting for all {votingStatus.total_positions} positions!
                  </Alert>
                ) : (
                  <Alert variant="info">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    You have voted for {votingStatus.voted_count} out of {votingStatus.total_positions} positions.
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="ms-3"
                      onClick={() => navigate('/vote')}
                    >
                      Continue Voting
                    </Button>
                  </Alert>
                )}
              </Col>
            </Row>
          )}

          {/* Statistics Cards */}
          {stats && (
            <>
              <Row className="g-4 mb-4">
                <Col md={3}>
                  <Card className="stats-card border-0 h-100">
                    <Card.Body className="text-center">
                      <i className="bi bi-people-fill" style={{ fontSize: '3rem' }}></i>
                      <h3 className="mt-3 mb-1">{stats.total_registered_users}</h3>
                      <p className="mb-0">Registered Users</p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={3}>
                  <Card className="stats-card border-0 h-100">
                    <Card.Body className="text-center">
                      <i className="bi bi-person-check-fill" style={{ fontSize: '3rem' }}></i>
                      <h3 className="mt-3 mb-1">{stats.total_voters}</h3>
                      <p className="mb-0">Total Voters</p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={3}>
                  <Card className="stats-card border-0 h-100">
                    <Card.Body className="text-center">
                      <i className="bi bi-bar-chart-fill" style={{ fontSize: '3rem' }}></i>
                      <h3 className="mt-3 mb-1">{stats.voter_turnout_percentage}%</h3>
                      <p className="mb-0">Voter Turnout</p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={3}>
                  <Card className="stats-card border-0 h-100">
                    <Card.Body className="text-center">
                      <i className="bi bi-check-square-fill" style={{ fontSize: '3rem' }}></i>
                      <h3 className="mt-3 mb-1">{stats.total_votes_cast}</h3>
                      <p className="mb-0">Total Votes</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Voting Status by Position */}
              <Row>
                <Col md={8}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom">
                      <h5 className="mb-0">
                        <i className="bi bi-list-check me-2"></i>
                        Your Voting Status
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      {votingStatus?.voting_status.map((status, index) => (
                        <div key={index} className="mb-3 pb-3 border-bottom">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-0">{status.position_name}</h6>
                            </div>
                            <div>
                              {status.has_voted ? (
                                <span className="badge bg-success">
                                  <i className="bi bi-check-circle me-1"></i>
                                  Voted
                                </span>
                              ) : (
                                <span className="badge bg-warning text-dark">
                                  <i className="bi bi-clock me-1"></i>
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card className="border-0 shadow-sm mb-3">
                    <Card.Header className="bg-white border-bottom">
                      <h5 className="mb-0">
                        <i className="bi bi-speedometer me-2"></i>
                        Quick Actions
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-grid gap-2">
                        <Button 
                          variant="primary" 
                          onClick={() => navigate('/vote')}
                          disabled={votingStatus?.voted_count === votingStatus?.total_positions}
                        >
                          <i className="bi bi-pencil-square me-2"></i>
                          Cast Your Vote
                        </Button>
                        <Button variant="outline-primary" onClick={() => navigate('/results')}>
                          <i className="bi bi-bar-chart me-2"></i>
                          View Results
                        </Button>
                        <Button variant="outline-secondary" onClick={() => navigate('/ai-insights')}>
                          <i className="bi bi-robot me-2"></i>
                          AI Insights
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>

                  <Card className="border-0 shadow-sm bg-light">
                    <Card.Body>
                      <h6 className="mb-3">
                        <i className="bi bi-info-circle me-2"></i>
                        Election Info
                      </h6>
                      <p className="small mb-2">
                        <strong>Positions:</strong> {stats.positions_count}
                      </p>
                      <p className="small mb-2">
                        <strong>Candidates:</strong> {stats.candidates_count}
                      </p>
                      {stats.most_competitive_position && (
                        <p className="small mb-0">
                          <strong>Most Competitive:</strong> {stats.most_competitive_position}
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
