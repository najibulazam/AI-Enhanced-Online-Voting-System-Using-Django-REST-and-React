# AI-Enhanced Online Voting System Using Django REST and React

**Author:** Md Najib Ul Azam Mahi  
**Email:** azam.mdnajibul@gmail.com  
**GitHub:** [najibulazam](https://github.com/najibulazam)  
**LinkedIn:** [najibulazam](https://linkedin.com/in/najibulazam)  
**Repository:** [AI-Enhanced-Online-Voting-System-Using-Django-REST-and-React](https://github.com/najibulazam/AI-Enhanced-Online-Voting-System-Using-Django-REST-and-React)

---

A modern, full-stack web application for online voting with AI-powered insights. This project demonstrates clean REST API design, React component architecture, and lightweight AI analysis using Groq LLM.

## 🎯 Project Overview

**Academic Project Focus:** Full-Stack Web Development with AI Integration

This system allows students to:
- Register and authenticate securely
- Cast votes for various positions
- View real-time results
- Get AI-powered voting insights

### Key Features

✨ **Full-Stack Architecture**
- Django REST Framework backend
- React.js frontend with lazy loading
- JWT authentication
- Clean API design with caching

🤖 **AI Analysis (Lightweight)**
- Voting summaries using Groq LLM (llama-3.3-70b-versatile)
- Winner predictions with markdown formatting
- Turnout analysis
- Explainable insights (not heavy ML)

🎨 **Modern UI/UX**
- Bootstrap 5 components
- Responsive design
- Real-time updates with smart caching
- Intuitive navigation
- Password visibility toggles
- Markdown-rendered AI insights

⚡ **Performance Optimizations**
- Code splitting with React lazy loading
- API response caching (15-60s TTL)
- Reduced bundle size
- Faster page navigation

## 📁 Project Structure

```
Voting Application/
├── backend/                    # Django REST Framework Backend
│   ├── voting_backend/        # Project settings
│   │   ├── settings.py       # Django configuration
│   │   ├── urls.py          # Root URL routing
│   │   └── ...
│   ├── voting_api/           # Main API app
│   │   ├── models.py        # Database models
│   │   ├── serializers.py   # DRF serializers
│   │   ├── views.py         # API views
│   │   ├── ai_analysis.py   # Groq AI integration
│   │   ├── ai_views.py      # AI API endpoints
│   │   └── urls.py          # API routing
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                  # React Frontend
    ├── src/
    │   ├── components/       # Reusable components
    │   │   ├── NavigationBar.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/          # React context
    │   │   └── AuthContext.jsx
    │   ├── pages/            # Main pages
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Vote.jsx
    │   │   ├── Results.jsx
    │   │   ├── AIInsights.jsx
    │   │   └── NotFound.jsx
    │   ├── services/         # API services
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── votingService.js
    │   │   └── aiService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 🛠️ Technology Stack

### Backend
- **Framework:** Django 5.0.1
- **API:** Django REST Framework 3.14.0
- **Authentication:** SimpleJWT (JWT tokens)
- **Database:** SQLite (development)
- **AI:** Groq API (llama-3.3-70b-versatile)
- **CORS:** django-cors-headers
- **Environment:** python-dotenv

### Frontend
- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.0.8
- **Routing:** React Router v6
- **UI Framework:** Bootstrap 5.3.2 + React Bootstrap
- **HTTP Client:** Axios 1.6.5
- **Icons:** Bootstrap Icons
- **Markdown:** react-markdown

## 📋 Prerequisites

Before you begin, ensure you have:

- **Python 3.9+** installed
- **Node.js 16+** and npm installed
- **Groq API Key** (free at [console.groq.com](https://console.groq.com))

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env and add your Groq API key

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (for admin panel)
python manage.py createsuperuser

# Populate database with sample data
python manage.py populate_data

# Start development server
python manage.py runserver
```

**Note:** The `populate_data` command creates:
- 6 positions (President, VP, Secretary, etc.)
- 16 candidates with detailed bios
- 3 test users (TEST001/002/003, password: test123)

Backend will run on: `http://127.0.0.1:8000`

### 2. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 🔑 Configuration

### Backend Configuration (.env)

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True
GROQ_API_KEY=your-groq-api-key-here
```

**Get Groq API Key:**
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for free
3. Create an API key
4. Add it to your `.env` file

### Frontend Configuration

API base URL is configured in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/api';
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login user |
| GET | `/api/auth/profile/` | Get user profile |
| POST | `/api/auth/token/refresh/` | Refresh JWT token |

### Voting Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/positions/` | Get all positions with candidates |
| GET | `/api/candidates/` | Get all candidates |
| POST | `/api/vote/` | Cast a vote |
| GET | `/api/votes/my-votes/` | Get user's votes |
| GET | `/api/votes/status/` | Get voting status |

### Results Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/results/` | Get all results |
| GET | `/api/results/{id}/` | Get position-specific results |
| GET | `/api/analytics/stats/` | Get voting statistics |

### AI Analysis Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ai/summary/` | Get AI voting summary |
| GET | `/api/ai/prediction/` | Get AI predictions |
| GET | `/api/ai/turnout/` | Get turnout analysis |

## 🎓 Usage Guide

### For Students (Voters)

1. **Register:**
   - Visit the registration page
   - Enter your 7-digit student ID, email, nickname, and password
   - Your student ID becomes your username

2. **Login:**
   - Use your student ID and password
   - JWT token is stored securely

3. **Vote:**
   - Navigate to the "Vote" page
   - Select one candidate per position
   - Submit your vote (one vote per position)

4. **View Results:**
   - Check real-time voting results
   - See vote counts and percentages
   - Winners are highlighted

5. **AI Insights:**
   - Get AI-generated voting summaries
   - View winner predictions
   - Understand turnout patterns

### For Administrators

1. **Access Admin Panel:**
   - Visit `http://127.0.0.1:8000/admin`
   - Login with superuser credentials

2. **Manage Elections:**
   - Add positions
   - Add candidates to positions
   - View all votes
   - Manage users

## 🧪 Testing the Application

### Create Sample Data

Use Django admin or shell to create test data:

```bash
python manage.py shell
```

```python
from voting_api.models import Position, Candidate

# Create positions
president = Position.objects.create(name="President", order=1)
vp = Position.objects.create(name="Vice President", order=2)

# Create candidates
Candidate.objects.create(
    position=president,
    name="John Doe",
    bio="Experienced leader"
)
Candidate.objects.create(
    position=president,
    name="Jane Smith",
    bio="Change advocate"
)
```

### Test Workflow

1. Register 2-3 test users
2. Login as each user
3. Cast votes
4. View results
5. Check AI insights

## 🔒 Security Features

- **JWT Authentication:** Secure token-based auth
- **Password Hashing:** Django's built-in password hashing
- **CORS Protection:** Configured for specific origins
- **Vote Integrity:** One vote per user per position
- **Input Validation:** Comprehensive form validation

## 🤖 AI Integration Details

### Groq API Usage

The AI analysis module (`ai_analysis.py`) uses Groq's LLM for:

1. **Voting Summary:**
   - Analyzes overall statistics
   - Identifies competitive races
   - Highlights clear winners

2. **Winner Prediction:**
   - Evaluates competitiveness
   - Explains vote distributions
   - Provides likelihood assessments

3. **Turnout Analysis:**
   - Interprets participation rates
   - Suggests engagement insights
   - Contextualizes turnout

**Note:** This is lightweight LLM-based analysis, NOT heavy machine learning or data science.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError`
```bash
# Solution: Ensure virtual environment is activated and dependencies installed
pip install -r requirements.txt
```

**Problem:** CORS errors
```bash
# Solution: Check CORS_ALLOWED_ORIGINS in settings.py
# Should include: http://localhost:3000
```

### Frontend Issues

**Problem:** `Cannot connect to API`
```bash
# Solution: Ensure backend is running on port 8000
# Check API_BASE_URL in src/services/api.js
```

**Problem:** AI features not working
```bash
# Solution: Add Groq API key to backend .env file
GROQ_API_KEY=your-key-here
```

## 📈 Future Enhancements

Possible improvements:
- Real-time updates with WebSockets
- Email notifications
- Vote verification system
- Advanced analytics dashboard
- Mobile app version
- Multi-language support

## 👨‍💻 Development Notes

### Code Quality
- Clean, commented code
- Modular architecture
- Reusable components
- REST best practices
- Academic-friendly structure

### Project Purpose
This is designed as a **university final-year project** demonstrating:
- Full-stack development skills
- Modern web technologies
- API design and integration
- UI/UX principles
- AI integration (lightweight)

## 📝 License

This project is created for educational purposes.

## 🤝 Contributing

This is an academic project. Feel free to fork and customize for your own learning.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check Groq API documentation: [console.groq.com/docs](https://console.groq.com/docs)

---

## 👨‍💻 Author

**Md Najib Ul Azam Mahi**
- 📧 Email: azam.mdnajibul@gmail.com
- 🐙 GitHub: [najibulazam](https://github.com/najibulazam)
- 💼 LinkedIn: [najibulazam](https://linkedin.com/in/najibulazam)

---

**Built with ❤️ for academic excellence**

*AI-Enhanced Online Voting System - Django REST + React*
