"""
Django Management Command to Populate Database with Dummy Data
Usage: python manage.py populate_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from voting_api.models import Position, Candidate, Profile


class Command(BaseCommand):
    help = 'Populate database with dummy voting data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting data population...')
        
        # Clear existing data (optional)
        self.stdout.write('Clearing existing positions and candidates...')
        Candidate.objects.all().delete()
        Position.objects.all().delete()
        
        # Create Positions
        positions_data = [
            {'name': 'President', 'description': 'Lead the student body and represent all students', 'order': 1},
            {'name': 'Vice President', 'description': 'Assist the President and oversee committees', 'order': 2},
            {'name': 'Secretary', 'description': 'Manage records and communications', 'order': 3},
            {'name': 'Treasurer', 'description': 'Handle finances and budget planning', 'order': 4},
            {'name': 'Public Relations Officer', 'description': 'Manage external communications and events', 'order': 5},
            {'name': 'Sports Director', 'description': 'Organize sports activities and tournaments', 'order': 6},
        ]
        
        self.stdout.write('Creating positions...')
        positions = {}
        for pos_data in positions_data:
            position = Position.objects.create(**pos_data)
            positions[pos_data['name']] = position
            self.stdout.write(f'  ✓ Created position: {pos_data["name"]}')
        
        # Create Candidates
        candidates_data = [
            # President Candidates
            {'position': 'President', 'name': 'John Anderson', 'bio': 'Senior with 3 years of leadership experience. Focused on student welfare and campus improvements.'},
            {'position': 'President', 'name': 'Sarah Williams', 'bio': 'Passionate about environmental sustainability and student mental health initiatives.'},
            {'position': 'President', 'name': 'Michael Chen', 'bio': 'Former VP with proven track record in organizing successful campus events.'},
            
            # Vice President Candidates
            {'position': 'Vice President', 'name': 'Emily Johnson', 'bio': 'Dedicated to improving student-faculty communication and academic support.'},
            {'position': 'Vice President', 'name': 'David Martinez', 'bio': 'Experienced in coordinating large-scale student projects and initiatives.'},
            {'position': 'Vice President', 'name': 'Lisa Thompson', 'bio': 'Advocate for diversity and inclusion programs on campus.'},
            
            # Secretary Candidates
            {'position': 'Secretary', 'name': 'Robert Brown', 'bio': 'Detail-oriented with excellent organizational and communication skills.'},
            {'position': 'Secretary', 'name': 'Jennifer Davis', 'bio': 'Former newsletter editor with strong writing and documentation abilities.'},
            
            # Treasurer Candidates
            {'position': 'Treasurer', 'name': 'James Wilson', 'bio': 'Economics major with experience in budget management and financial planning.'},
            {'position': 'Treasurer', 'name': 'Amanda Garcia', 'bio': 'Accounting background with transparent and efficient fund management approach.'},
            {'position': 'Treasurer', 'name': 'Christopher Lee', 'bio': 'Business student committed to maximizing student organization funding.'},
            
            # Public Relations Officer Candidates
            {'position': 'Public Relations Officer', 'name': 'Sophia Rodriguez', 'bio': 'Social media expert with creative marketing and outreach strategies.'},
            {'position': 'Public Relations Officer', 'name': 'Daniel White', 'bio': 'Communications major focused on building strong community partnerships.'},
            
            # Sports Director Candidates
            {'position': 'Sports Director', 'name': 'Ryan Taylor', 'bio': 'Varsity athlete dedicated to promoting sports and fitness for all students.'},
            {'position': 'Sports Director', 'name': 'Michelle Adams', 'bio': 'Former team captain with experience organizing intramural tournaments.'},
            {'position': 'Sports Director', 'name': 'Kevin Harris', 'bio': 'PE major committed to inclusive sports programs and wellness initiatives.'},
        ]
        
        self.stdout.write('Creating candidates...')
        for cand_data in candidates_data:
            position_title = cand_data.pop('position')
            candidate = Candidate.objects.create(
                position=positions[position_title],
                **cand_data
            )
            self.stdout.write(f'  ✓ Created candidate: {candidate.name} for {position_title}')
        
        # Create sample test users (optional)
        self.stdout.write('Creating sample test users...')
        test_users = [
            {'student_id': 'TEST001', 'email': 'alice@test.com', 'nickname': 'Alice', 'password': 'test123'},
            {'student_id': 'TEST002', 'email': 'bob@test.com', 'nickname': 'Bob', 'password': 'test123'},
            {'student_id': 'TEST003', 'email': 'charlie@test.com', 'nickname': 'Charlie', 'password': 'test123'},
        ]
        
        for user_data in test_users:
            # Check if user already exists
            if not User.objects.filter(username=user_data['student_id']).exists():
                user = User.objects.create_user(
                    username=user_data['student_id'],
                    password=user_data['password']
                )
                Profile.objects.create(
                    user=user,
                    student_id=user_data['student_id'],
                    email=user_data['email'],
                    nickname=user_data['nickname']
                )
                self.stdout.write(f'  ✓ Created test user: {user_data["nickname"]} ({user_data["student_id"]})')
            else:
                self.stdout.write(f'  → User {user_data["student_id"]} already exists, skipping')
        
        # Summary
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS('✓ Data population completed successfully!'))
        self.stdout.write('='*50)
        self.stdout.write(f'Total Positions: {Position.objects.count()}')
        self.stdout.write(f'Total Candidates: {Candidate.objects.count()}')
        self.stdout.write(f'Total Users: {User.objects.count()}')
        self.stdout.write('\nTest User Credentials:')
        self.stdout.write('  Username: TEST001, Password: test123')
        self.stdout.write('  Username: TEST002, Password: test123')
        self.stdout.write('  Username: TEST003, Password: test123')
        self.stdout.write('='*50)
