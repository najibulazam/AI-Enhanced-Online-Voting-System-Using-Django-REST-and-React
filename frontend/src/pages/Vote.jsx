/**
 * Vote Page Component
 * Allows users to cast votes for different positions
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import LoadingSpinner from '../components/LoadingSpinner';
import votingService from '../services/votingService';

const Vote = () => {
  const [positions, setPositions] = useState([]);
  const [votingStatus, setVotingStatus] = useState({});
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchVotingData();
  }, []);

  const fetchVotingData = async () => {
    try {
      setLoading(true);
      const [positionsData, statusData] = await Promise.all([
        votingService.getPositions(),
        votingService.getVotingStatus(),
      ]);
      
      setPositions(positionsData);
      
      // Create a map of voted positions
      const votedMap = {};
      statusData.voting_status.forEach(status => {
        votedMap[status.position_id] = status.has_voted;
      });
      setVotingStatus(votedMap);
      
    } catch (err) {
      setError('Failed to load voting data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = (positionId, candidateId) => {
    setSelectedCandidates({
      ...selectedCandidates,
      [positionId]: candidateId,
    });
  };

  const handleVoteSubmit = async (positionId) => {
    const candidateId = selectedCandidates[positionId];
    
    if (!candidateId) {
      setError('Please select a candidate');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      await votingService.castVote({
        candidate: candidateId,
        position: positionId,
      });
      
      setSuccess('Vote cast successfully!');
      
      // Update voting status
      setVotingStatus({
        ...votingStatus,
        [positionId]: true,
      });
      
      // Clear selection
      const newSelected = { ...selectedCandidates };
      delete newSelected[positionId];
      setSelectedCandidates(newSelected);
      
      // Refresh data
      setTimeout(() => {
        fetchVotingData();
        setSuccess('');
      }, 2000);
      
    } catch (err) {
      const errorMsg = err.response?.data?.candidate || 
                      err.response?.data?.position ||
                      err.response?.data?.error ||
                      'Failed to cast vote';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading voting positions..." />;

  // Check if all positions are voted
  const allVoted = positions.every(pos => votingStatus[pos.id]);

  return (
    <>
      <NavigationBar />
      <div className="page-container bg-light">
        <Container className="content-wrapper py-4">
          <Row className="mb-4">
            <Col>
              <h2>
                <i className="bi bi-pencil-square text-primary me-2"></i>
                Cast Your Vote
              </h2>
              <p className="text-muted">Select your preferred candidate for each position</p>
            </Col>
          </Row>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {allVoted && (
            <Alert variant="info">
              <i className="bi bi-check-circle-fill me-2"></i>
              You have completed voting for all positions!{' '}
              <Button 
                variant="link" 
                className="p-0 align-baseline"
                onClick={() => navigate('/results')}
              >
                View Results
              </Button>
            </Alert>
          )}

          {positions.map((position) => {
            const hasVoted = votingStatus[position.id];
            const selectedCandidate = selectedCandidates[position.id];

            return (
              <Card key={position.id} className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-0">{position.name}</h4>
                      {position.description && (
                        <small>{position.description}</small>
                      )}
                    </div>
                    {hasVoted && (
                      <span className="badge bg-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Voted
                      </span>
                    )}
                  </div>
                </Card.Header>
                <Card.Body>
                  {hasVoted ? (
                    <Alert variant="success" className="mb-0">
                      <i className="bi bi-check-lg me-2"></i>
                      You have already voted for this position.
                    </Alert>
                  ) : (
                    <>
                      <Row className="g-3">
                        {position.candidates.map((candidate) => (
                          <Col key={candidate.id} md={6} lg={4}>
                            <Card 
                              className={`candidate-card h-100 ${
                                selectedCandidate === candidate.id ? 'selected' : ''
                              }`}
                              onClick={() => handleCandidateSelect(position.id, candidate.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <Card.Body>
                                <div className="d-flex align-items-start">
                                  <Form.Check
                                    type="radio"
                                    name={`position-${position.id}`}
                                    checked={selectedCandidate === candidate.id}
                                    onChange={() => handleCandidateSelect(position.id, candidate.id)}
                                    className="me-3"
                                  />
                                  <div className="flex-grow-1">
                                    <h5 className="mb-2">{candidate.name}</h5>
                                    {candidate.bio && (
                                      <p className="text-muted small mb-0">{candidate.bio}</p>
                                    )}
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>

                      <div className="mt-4 text-end">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => handleVoteSubmit(position.id)}
                          disabled={!selectedCandidate || submitting}
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle me-2"></i>
                              Submit Vote
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            );
          })}

          {positions.length === 0 && (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              No active positions available for voting at this time.
            </Alert>
          )}
        </Container>
      </div>
    </>
  );
};

export default Vote;
