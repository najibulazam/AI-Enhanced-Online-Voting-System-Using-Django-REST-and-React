"""
URL configuration for Voting API
Clean REST API endpoints
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    # Authentication
    UserRegistrationView, UserLoginView, UserProfileView,
    # Positions & Candidates
    PositionListView, CandidateListView,
    # Voting
    CastVoteView, UserVotesView, VotingStatusView,
    # Results
    VoteResultsView, PositionResultView,
    # Analytics
    VotingStatsView, health_check
)
from .ai_views import (
    ai_summary_view, ai_prediction_view, ai_turnout_view
)

app_name = 'voting_api'

urlpatterns = [
    # Health check
    path('health/', health_check, name='health_check'),
    
    # Authentication endpoints
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Position and candidate endpoints
    path('positions/', PositionListView.as_view(), name='positions_list'),
    path('candidates/', CandidateListView.as_view(), name='candidates_list'),
    
    # Voting endpoints
    path('vote/', CastVoteView.as_view(), name='cast_vote'),
    path('votes/my-votes/', UserVotesView.as_view(), name='my_votes'),
    path('votes/status/', VotingStatusView.as_view(), name='voting_status'),
    
    # Results endpoints
    path('results/', VoteResultsView.as_view(), name='results'),
    path('results/<int:position_id>/', PositionResultView.as_view(), name='position_result'),
    
    # Analytics endpoints
    path('analytics/stats/', VotingStatsView.as_view(), name='stats'),
    
    # AI Analysis endpoints (lightweight Groq-based)
    path('ai/summary/', ai_summary_view, name='ai_summary'),
    path('ai/prediction/', ai_prediction_view, name='ai_prediction'),
    path('ai/turnout/', ai_turnout_view, name='ai_turnout'),
]
