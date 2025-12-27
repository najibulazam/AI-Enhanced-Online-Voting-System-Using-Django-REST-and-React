"""
DRF Serializers for AI-Enhanced Online Voting System
Clean REST API design with proper validation
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Profile, Position, Candidate, Vote


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile information
    """
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Profile
        fields = ['id', 'username', 'student_id', 'nickname', 'email', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration with profile data
    Academic project requirement: student ID as username
    """
    student_id = serializers.CharField(
        max_length=7,
        min_length=7,
        help_text="7-digit student ID"
    )
    email = serializers.EmailField(required=True)
    nickname = serializers.CharField(max_length=50, required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['student_id', 'email', 'nickname', 'password', 'password_confirm']

    def validate_student_id(self, value):
        """Validate student ID format and uniqueness"""
        if not value.isdigit():
            raise serializers.ValidationError("Student ID must contain only digits.")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this Student ID already exists.")
        if Profile.objects.filter(student_id=value).exists():
            raise serializers.ValidationError("This Student ID is already registered.")
        return value

    def validate_email(self, value):
        """Validate email uniqueness"""
        if Profile.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email address is already registered.")
        return value

    def validate(self, attrs):
        """Validate password confirmation"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        """Create user and profile"""
        # Remove password_confirm as it's not needed for user creation
        validated_data.pop('password_confirm')
        
        # Extract profile data
        student_id = validated_data.pop('student_id')
        email = validated_data.pop('email')
        nickname = validated_data.pop('nickname')
        password = validated_data.pop('password')
        
        # Create user with student_id as username
        user = User.objects.create_user(
            username=student_id,
            password=password
        )
        
        # Create profile with all required fields at once
        profile = Profile.objects.create(
            user=user,
            student_id=student_id,
            email=email,
            nickname=nickname
        )
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    Uses student ID and password
    """
    student_id = serializers.CharField(max_length=7)
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user data with profile
    """
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'profile']
        read_only_fields = ['id', 'username']


class CandidateSerializer(serializers.ModelSerializer):
    """
    Serializer for candidate information
    Includes vote count and percentage
    """
    position_name = serializers.CharField(source='position.name', read_only=True)
    vote_count = serializers.SerializerMethodField()
    vote_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Candidate
        fields = [
            'id', 'name', 'bio', 'photo_url', 'position',
            'position_name', 'vote_count', 'vote_percentage',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_vote_count(self, obj):
        """Get total votes for this candidate"""
        return obj.get_vote_count()

    def get_vote_percentage(self, obj):
        """Get vote percentage for this candidate"""
        return obj.get_vote_percentage()


class PositionSerializer(serializers.ModelSerializer):
    """
    Serializer for position information
    Includes list of candidates
    """
    candidates = CandidateSerializer(many=True, read_only=True)
    total_votes = serializers.SerializerMethodField()
    candidates_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Position
        fields = [
            'id', 'name', 'description', 'order', 'is_active',
            'candidates', 'total_votes', 'candidates_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_total_votes(self, obj):
        """Get total votes cast for this position"""
        return obj.get_total_votes()

    def get_candidates_count(self, obj):
        """Get number of candidates"""
        return obj.get_candidates_count()


class VoteSerializer(serializers.ModelSerializer):
    """
    Serializer for casting votes
    Validates that user hasn't already voted for this position
    """
    user_nickname = serializers.CharField(source='user.profile.nickname', read_only=True)
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    position_name = serializers.CharField(source='position.name', read_only=True)
    
    class Meta:
        model = Vote
        fields = [
            'id', 'candidate', 'position', 'timestamp',
            'user_nickname', 'candidate_name', 'position_name'
        ]
        read_only_fields = ['id', 'timestamp', 'user_nickname', 'candidate_name', 'position_name']

    def validate(self, attrs):
        """
        Validate that:
        1. User hasn't already voted for this position
        2. Candidate belongs to the specified position
        3. Both candidate and position are active
        """
        user = self.context['request'].user
        candidate = attrs.get('candidate')
        position = attrs.get('position')
        
        # Check if user already voted for this position
        if Vote.objects.filter(user=user, position=position).exists():
            raise serializers.ValidationError(
                f"You have already voted for {position.name}."
            )
        
        # Check if candidate belongs to position
        if candidate.position != position:
            raise serializers.ValidationError(
                "Candidate does not belong to the selected position."
            )
        
        # Check if candidate and position are active
        if not candidate.is_active:
            raise serializers.ValidationError("This candidate is no longer active.")
        
        if not position.is_active:
            raise serializers.ValidationError("Voting for this position is currently closed.")
        
        return attrs

    def create(self, validated_data):
        """Create vote with current user"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class VoteResultSerializer(serializers.Serializer):
    """
    Serializer for vote results summary
    Used in analytics and results endpoints
    """
    position_id = serializers.IntegerField()
    position_name = serializers.CharField()
    total_votes = serializers.IntegerField()
    candidates = serializers.ListField(
        child=serializers.DictField()
    )
    winner = serializers.DictField(allow_null=True)


class VotingStatsSerializer(serializers.Serializer):
    """
    Serializer for overall voting statistics
    Used for dashboard and AI analysis
    """
    total_registered_users = serializers.IntegerField()
    total_voters = serializers.IntegerField()
    total_votes_cast = serializers.IntegerField()
    voter_turnout_percentage = serializers.FloatField()
    positions_count = serializers.IntegerField()
    candidates_count = serializers.IntegerField()
    most_competitive_position = serializers.CharField(allow_null=True)
