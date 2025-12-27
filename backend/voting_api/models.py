"""
Django models for AI-Enhanced Online Voting System
Reused from existing MVT application with clean structure
"""
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator


class Profile(models.Model):
    """
    User profile with student ID, email, and nickname
    One-to-one relationship with Django User model
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    student_id = models.CharField(
        max_length=7,
        unique=True,
        validators=[RegexValidator(r'^\d+$', 'Only numeric characters are allowed.')],
        help_text="7-digit student identification number"
    )
    nickname = models.CharField(
        max_length=50,
        default='Student',
        help_text="Display name for the student"
    )
    email = models.EmailField(
        unique=True,
        help_text="Unique email address for the student"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_id} - {self.nickname}"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Student Profile'
        verbose_name_plural = 'Student Profiles'


class Position(models.Model):
    """
    Voting position (e.g., President, Vice President, Secretary)
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Name of the position (e.g., President)"
    )
    description = models.TextField(
        blank=True,
        help_text="Description of position responsibilities"
    )
    order = models.IntegerField(
        default=0,
        help_text="Display order (lower numbers appear first)"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this position is currently accepting votes"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Position'
        verbose_name_plural = 'Positions'

    def get_total_votes(self):
        """Get total votes cast for this position"""
        return Vote.objects.filter(position=self).count()

    def get_candidates_count(self):
        """Get number of candidates for this position"""
        return self.candidates.count()


class Candidate(models.Model):
    """
    Candidate running for a specific position
    """
    position = models.ForeignKey(
        Position,
        on_delete=models.CASCADE,
        related_name='candidates',
        help_text="Position the candidate is running for"
    )
    name = models.CharField(
        max_length=100,
        help_text="Full name of the candidate"
    )
    bio = models.TextField(
        blank=True,
        help_text="Biography or campaign message"
    )
    photo_url = models.URLField(
        blank=True,
        help_text="URL to candidate's photo (optional)"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this candidate is currently in the race"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.position.name}"

    class Meta:
        ordering = ['position', 'name']
        unique_together = ('position', 'name')
        verbose_name = 'Candidate'
        verbose_name_plural = 'Candidates'

    def get_vote_count(self):
        """Get total votes received by this candidate"""
        return Vote.objects.filter(candidate=self).count()

    def get_vote_percentage(self):
        """Calculate percentage of votes for this candidate's position"""
        position_votes = self.position.get_total_votes()
        if position_votes == 0:
            return 0.0
        candidate_votes = self.get_vote_count()
        return round((candidate_votes / position_votes) * 100, 2)


class Vote(models.Model):
    """
    Individual vote cast by a user for a candidate in a specific position
    Constraint: One vote per user per position
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='votes',
        help_text="User who cast the vote"
    )
    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
        related_name='votes',
        help_text="Candidate who received the vote"
    )
    position = models.ForeignKey(
        Position,
        on_delete=models.CASCADE,
        related_name='votes',
        help_text="Position for which the vote was cast"
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text="When the vote was cast"
    )

    class Meta:
        unique_together = ('user', 'position')
        ordering = ['-timestamp']
        verbose_name = 'Vote'
        verbose_name_plural = 'Votes'

    def __str__(self):
        nickname = getattr(self.user.profile, 'nickname', self.user.username)
        return f"{nickname} voted for {self.candidate.name} ({self.position.name})"

    def clean(self):
        """Validate that candidate belongs to the position"""
        from django.core.exceptions import ValidationError
        if self.candidate.position != self.position:
            raise ValidationError('Candidate does not belong to the selected position.')
