"""
REST API Views for AI-Enhanced Online Voting System
Clean REST design with proper authentication and permissions
"""
from rest_framework import status, generics, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Count, Q
from .models import Profile, Position, Candidate, Vote
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer,
    ProfileSerializer, PositionSerializer, CandidateSerializer,
    VoteSerializer, VoteResultSerializer, VotingStatsSerializer
)


# ==================== Authentication Views ====================

class UserRegistrationView(APIView):
    """
    User registration endpoint
    Creates new user with profile (student ID, email, nickname)
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Register a new user"""
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Registration successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'student_id': user.profile.student_id,
                    'nickname': user.profile.nickname,
                    'email': user.profile.email,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """
    User login endpoint
    Authenticates with student ID and password, returns JWT tokens
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Authenticate user and return tokens"""
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            student_id = serializer.validated_data['student_id']
            password = serializer.validated_data['password']
            
            # Authenticate using student_id as username
            user = authenticate(username=student_id, password=password)
            
            if user is not None:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'student_id': user.profile.student_id,
                        'nickname': user.profile.nickname,
                        'email': user.profile.email,
                    },
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid student ID or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    """
    Get current user's profile information
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get authenticated user's profile"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ==================== Position & Candidate Views ====================

class PositionListView(generics.ListAPIView):
    """
    List all active positions with their candidates
    Used for voting page
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PositionSerializer
    
    def get_queryset(self):
        """Get active positions ordered by display order"""
        return Position.objects.filter(is_active=True).prefetch_related('candidates')


class CandidateListView(generics.ListAPIView):
    """
    List all candidates or filter by position
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CandidateSerializer
    
    def get_queryset(self):
        """Get active candidates, optionally filtered by position"""
        queryset = Candidate.objects.filter(is_active=True).select_related('position')
        
        position_id = self.request.query_params.get('position', None)
        if position_id is not None:
            queryset = queryset.filter(position_id=position_id)
        
        return queryset


# ==================== Voting Views ====================

class CastVoteView(APIView):
    """
    Cast a vote for a candidate
    Validates that user hasn't already voted for this position
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Cast a vote"""
        serializer = VoteSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            vote = serializer.save()
            return Response({
                'message': 'Vote cast successfully',
                'vote': VoteSerializer(vote).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserVotesView(APIView):
    """
    Get all votes cast by the current user
    Used to check which positions user has already voted for
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get user's voting history"""
        votes = Vote.objects.filter(user=request.user).select_related(
            'candidate', 'position', 'candidate__position'
        )
        serializer = VoteSerializer(votes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class VotingStatusView(APIView):
    """
    Check which positions the user has voted for
    Returns list of position IDs that user has already voted for
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get user's voting status"""
        voted_positions = Vote.objects.filter(
            user=request.user
        ).values_list('position_id', flat=True)
        
        all_positions = Position.objects.filter(is_active=True)
        
        status_data = []
        for position in all_positions:
            status_data.append({
                'position_id': position.id,
                'position_name': position.name,
                'has_voted': position.id in voted_positions
            })
        
        return Response({
            'voting_status': status_data,
            'total_positions': all_positions.count(),
            'voted_count': len(voted_positions)
        }, status=status.HTTP_200_OK)


# ==================== Results Views ====================

class VoteResultsView(APIView):
    """
    Get voting results for all positions
    Shows vote counts and percentages for each candidate
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get comprehensive voting results"""
        positions = Position.objects.all().prefetch_related('candidates')
        results = []
        
        for position in positions:
            candidates_data = []
            total_votes = position.get_total_votes()
            
            for candidate in position.candidates.filter(is_active=True):
                vote_count = candidate.get_vote_count()
                percentage = candidate.get_vote_percentage()
                
                candidates_data.append({
                    'id': candidate.id,
                    'name': candidate.name,
                    'bio': candidate.bio,
                    'vote_count': vote_count,
                    'percentage': percentage
                })
            
            # Sort candidates by vote count (descending)
            candidates_data.sort(key=lambda x: x['vote_count'], reverse=True)
            
            # Determine winner (if there are votes)
            winner = candidates_data[0] if candidates_data and total_votes > 0 else None
            
            results.append({
                'position_id': position.id,
                'position_name': position.name,
                'total_votes': total_votes,
                'candidates': candidates_data,
                'winner': winner
            })
        
        return Response({
            'results': results,
            'timestamp': self.request.build_absolute_uri()
        }, status=status.HTTP_200_OK)


class PositionResultView(APIView):
    """
    Get detailed results for a specific position
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, position_id):
        """Get results for specific position"""
        try:
            position = Position.objects.get(id=position_id)
        except Position.DoesNotExist:
            return Response({
                'error': 'Position not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        candidates = position.candidates.filter(is_active=True)
        total_votes = position.get_total_votes()
        
        candidates_data = []
        for candidate in candidates:
            vote_count = candidate.get_vote_count()
            percentage = candidate.get_vote_percentage()
            
            candidates_data.append({
                'id': candidate.id,
                'name': candidate.name,
                'bio': candidate.bio,
                'vote_count': vote_count,
                'percentage': percentage
            })
        
        # Sort by vote count
        candidates_data.sort(key=lambda x: x['vote_count'], reverse=True)
        winner = candidates_data[0] if candidates_data and total_votes > 0 else None
        
        return Response({
            'position_id': position.id,
            'position_name': position.name,
            'position_description': position.description,
            'total_votes': total_votes,
            'candidates': candidates_data,
            'winner': winner
        }, status=status.HTTP_200_OK)


# ==================== Analytics Views ====================

class VotingStatsView(APIView):
    """
    Get overall voting statistics
    Used for dashboard and AI analysis
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get comprehensive voting statistics"""
        # Total registered users
        total_users = User.objects.count()
        
        # Total unique voters
        total_voters = Vote.objects.values('user').distinct().count()
        
        # Total votes cast
        total_votes = Vote.objects.count()
        
        # Voter turnout percentage
        turnout = round((total_voters / total_users * 100), 2) if total_users > 0 else 0
        
        # Positions and candidates count
        positions_count = Position.objects.filter(is_active=True).count()
        candidates_count = Candidate.objects.filter(is_active=True).count()
        
        # Most competitive position (smallest vote margin)
        most_competitive = self._get_most_competitive_position()
        
        # Votes by position
        votes_by_position = []
        for position in Position.objects.filter(is_active=True):
            votes_by_position.append({
                'position_name': position.name,
                'vote_count': position.get_total_votes(),
                'candidates_count': position.get_candidates_count()
            })
        
        return Response({
            'total_registered_users': total_users,
            'total_voters': total_voters,
            'total_votes_cast': total_votes,
            'voter_turnout_percentage': turnout,
            'positions_count': positions_count,
            'candidates_count': candidates_count,
            'most_competitive_position': most_competitive,
            'votes_by_position': votes_by_position
        }, status=status.HTTP_200_OK)
    
    def _get_most_competitive_position(self):
        """Find position with smallest vote margin between top 2 candidates"""
        positions = Position.objects.filter(is_active=True)
        min_margin = float('inf')
        most_competitive = None
        
        for position in positions:
            candidates = position.candidates.filter(is_active=True)
            if candidates.count() < 2:
                continue
            
            # Get vote counts for top 2 candidates
            vote_counts = [c.get_vote_count() for c in candidates]
            vote_counts.sort(reverse=True)
            
            if len(vote_counts) >= 2:
                margin = vote_counts[0] - vote_counts[1]
                if margin < min_margin:
                    min_margin = margin
                    most_competitive = position.name
        
        return most_competitive


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def health_check(request):
    """
    API health check endpoint
    """
    return Response({
        'status': 'healthy',
        'message': 'AI-Enhanced Voting System API is running',
        'user': request.user.username if request.user.is_authenticated else 'anonymous'
    }, status=status.HTTP_200_OK)
