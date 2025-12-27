/**
 * Results Page Component
 * Displays voting results for all positions
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import LoadingSpinner from '../components/LoadingSpinner';
import votingService from '../services/votingService';

const Results = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await votingService.getResults();
      setResults(data.results);
    } catch (err) {
      setError('Failed to load results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading results..." />;

  return (
    <>
      <NavigationBar />
      <div className="page-container bg-light">
        <Container className="content-wrapper py-4">
          <Row className="mb-4">
            <Col>
              <h2>
                <i className="bi bi-bar-chart text-primary me-2"></i>
                Election Results
              </h2>
              <p className="text-muted">Live voting results for all positions</p>
            </Col>
          </Row>

          {results && results.map((position) => (
            <Card key={position.position_id} className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">{position.position_name}</h4>
                  <Badge bg="light" text="dark">
                    {position.total_votes} {position.total_votes === 1 ? 'vote' : 'votes'}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                {position.total_votes === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-3">No votes cast yet for this position</p>
                  </div>
                ) : (
                  <>
                    {position.candidates.map((candidate, index) => {
                      const isWinner = position.winner && candidate.id === position.winner.id;
                      const progressVariant = isWinner ? 'success' : 
                                             index === 0 ? 'primary' :
                                             index === 1 ? 'info' : 'secondary';

                      return (
                        <div key={candidate.id} className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center">
                              {isWinner && (
                                <i className="bi bi-trophy-fill text-warning me-2" style={{ fontSize: '1.5rem' }}></i>
                              )}
                              <div>
                                <h5 className="mb-0">
                                  {candidate.name}
                                  {isWinner && (
                                    <Badge bg="success" className="ms-2">Winner</Badge>
                                  )}
                                </h5>
                                {candidate.bio && (
                                  <small className="text-muted">{candidate.bio}</small>
                                )}
                              </div>
                            </div>
                            <div className="text-end">
                              <h5 className="mb-0">{candidate.percentage}%</h5>
                              <small className="text-muted">{candidate.vote_count} votes</small>
                            </div>
                          </div>
                          <ProgressBar 
                            now={candidate.percentage} 
                            variant={progressVariant}
                            label={`${candidate.percentage}%`}
                            style={{ height: '30px' }}
                          />
                        </div>
                      );
                    })}
                  </>
                )}
              </Card.Body>
            </Card>
          ))}

          {results && results.length === 0 && (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <i className="bi bi-inbox text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3 text-muted">No Results Available</h4>
                <p className="text-muted">Results will appear once voting begins</p>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>
    </>
  );
};

export default Results;
