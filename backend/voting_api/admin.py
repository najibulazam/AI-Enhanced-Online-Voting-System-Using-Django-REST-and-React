"""
Django admin configuration for Voting API
Academic-friendly admin interface
"""
from django.contrib import admin
from .models import Profile, Position, Candidate, Vote


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """Admin interface for user profiles"""
    list_display = ['student_id', 'nickname', 'email', 'user', 'created_at']
    search_fields = ['student_id', 'nickname', 'email', 'user__username']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'student_id', 'nickname', 'email')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    """Admin interface for positions"""
    list_display = ['name', 'order', 'is_active', 'candidates_count', 'total_votes', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['order', 'name']
    
    fieldsets = (
        ('Position Details', {
            'fields': ('name', 'description', 'order', 'is_active')
        }),
        ('Statistics', {
            'fields': (),
            'description': 'View candidates and votes in the respective sections'
        }),
    )
    
    def candidates_count(self, obj):
        """Display number of candidates"""
        return obj.get_candidates_count()
    candidates_count.short_description = 'Candidates'
    
    def total_votes(self, obj):
        """Display total votes"""
        return obj.get_total_votes()
    total_votes.short_description = 'Total Votes'


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    """Admin interface for candidates"""
    list_display = ['name', 'position', 'is_active', 'vote_count', 'vote_percentage', 'created_at']
    list_filter = ['position', 'is_active', 'created_at']
    search_fields = ['name', 'bio']
    ordering = ['position', 'name']
    
    fieldsets = (
        ('Candidate Information', {
            'fields': ('name', 'position', 'bio', 'photo_url', 'is_active')
        }),
        ('Statistics', {
            'fields': (),
            'description': 'Vote counts are calculated dynamically'
        }),
    )
    
    def vote_count(self, obj):
        """Display vote count"""
        return obj.get_vote_count()
    vote_count.short_description = 'Votes'
    
    def vote_percentage(self, obj):
        """Display vote percentage"""
        return f"{obj.get_vote_percentage()}%"
    vote_percentage.short_description = 'Percentage'


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    """Admin interface for votes"""
    list_display = ['user_nickname', 'candidate', 'position', 'timestamp']
    list_filter = ['position', 'timestamp']
    search_fields = ['user__username', 'candidate__name', 'position__name']
    readonly_fields = ['user', 'candidate', 'position', 'timestamp']
    ordering = ['-timestamp']
    
    def user_nickname(self, obj):
        """Display user nickname"""
        return obj.user.profile.nickname if hasattr(obj.user, 'profile') else obj.user.username
    user_nickname.short_description = 'Voter'
    
    def has_add_permission(self, request):
        """Prevent manual vote creation through admin"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Prevent vote modification"""
        return False
