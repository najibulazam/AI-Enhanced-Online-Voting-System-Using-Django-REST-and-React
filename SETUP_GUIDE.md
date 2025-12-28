# Setup Guide - AI-Enhanced Online Voting System

**Author:** Md Najib Ul Azam Mahi  
**Email:** azam.mdnajibul@gmail.com  
**GitHub:** [najibulazam](https://github.com/najibulazam)  
**LinkedIn:** [najibulazam](https://linkedin.com/in/najibulazam)  
**Repository:** [AI-Enhanced-Online-Voting-System-Using-Django-REST-and-React](https://github.com/najibulazam/AI-Enhanced-Online-Voting-System-Using-Django-REST-and-React)

---

Complete step-by-step setup instructions for both backend and frontend.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Groq API Setup](#groq-api-setup)
5. [First Run](#first-run)
6. [Sample Data](#sample-data)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, install these on your system:

### Required Software

1. **Python 3.9 or higher**
   - Download: https://www.python.org/downloads/
   - Verify installation:
     ```bash
     python --version
     # Should show: Python 3.9.x or higher
     ```

2. **Node.js 16 or higher**
   - Download: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     # Should show: v16.x.x or higher
     
     npm --version
     # Should show: 8.x.x or higher
     ```

3. **Git** (optional, for version control)
   - Download: https://git-scm.com/

4. **Code Editor** (recommended)
   - VS Code: https://code.visualstudio.com/

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

*Note: Use the appropriate path to your project directory*

### Step 2: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

Wait for all packages to install (may take 2-3 minutes).

### Step 4: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

2. Open `.env` file and edit:
   ```env
   SECRET_KEY=your-secret-key-here-change-this
   DEBUG=True
   GROQ_API_KEY=your-groq-api-key-here
   ```

   **Note:** We'll add the Groq API key later.

### Step 5: Run Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

This creates the SQLite database with all tables.

### Step 6: Create Admin User

```bash
python manage.py createsuperuser
```

Enter details when prompted:
- Username: admin (or your choice)
- Email: admin@example.com
- Password: (your secure password)
- Password confirmation: (same password)

### Step 7: Start Backend Server

```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

**Keep this terminal open!**

Test in browser: http://127.0.0.1:8000/admin
- You should see the Django admin login page

---

## Frontend Setup

**Open a NEW terminal** (keep backend running).

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

*Note: Use the appropriate path to your project directory*

### Step 2: Install Dependencies

```bash
npm install
```

Wait for all packages to install (may take 3-5 minutes).

### Step 3: Start Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.7  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

### Step 4: Open Application

Open browser and visit: http://localhost:3000

You should see the login page!

---

## Groq API Setup

AI features require a Groq API key (free).

### Step 1: Get API Key

1. Visit: https://console.groq.com/
2. Sign up for free account
3. Click "API Keys" in sidebar
4. Click "Create API Key"
5. Copy the generated key

### Step 2: Add to Backend

1. Open `backend/.env` file
2. Add your key:
   ```env
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Save file
4. Restart backend server:
   - Stop: Ctrl+C
   - Start: `python manage.py runserver`

---

## First Run

### 1. Access Admin Panel

1. Visit: http://127.0.0.1:8000/admin
2. Login with superuser credentials
3. You should see the admin dashboard

### 2. Create Sample Data

**Easy Method (Recommended):**

Run the populate_data command to create all sample data automatically:

```bash
python manage.py populate_data
```

This creates 6 positions, 16 candidates, and 3 test users. See the [Sample Data](#sample-data) section below for details.

**Manual Method (Alternative):**

Or create data manually through the admin panel:

**Positions:**
1. Click "+ Add" next to "Positions"
2. Add:
   - Name: "President"
   - Order: 1
   - Is active: ✓ (checked)
3. Save

Repeat for:
- Vice President (Order: 2)
- Secretary (Order: 3)

**Candidates:**
1. Click "+ Add" next to "Candidates"
2. For President position, add:
   - Position: President
   - Name: "John Doe"
   - Bio: "Experienced leader with vision"
   - Is active: ✓
3. Save

Add more candidates (at least 2 per position).

### 3. Register Test Users

**If you used populate_data command:**

Three test users are already created! Just login with:
- Student ID: `TEST001` (or `TEST002`, `TEST003`)
- Password: `test123`

**If creating manually:**

1. Go to frontend: http://localhost:3000
2. Click "Register here"
3. Create test user:
   - Student ID: 1234567 (7 digits)
   - Email: test1@example.com
   - Nickname: Test User 1
   - Password: TestPass123
   - Confirm Password: TestPass123
4. Click "Create Account"

Create 2-3 more test users.

### 4. Cast Some Votes

1. Login with test user
2. Go to "Vote" page
3. Select candidates and submit votes
4. Logout and repeat with other users

### 5. View Results

1. Click "Results" in navigation
2. See vote counts and percentages
3. Winners are highlighted

### 6. Test AI Insights

1. Click "AI Insights"
2. Try each tab:
   - Voting Summary
   - Predictions
   - Turnout Analysis
3. Click "Generate" buttons

If you get "API key not configured" error:
- Check Groq API key in backend/.env
- Restart backend server

---

## Sample Data

### Quick Setup with Management Command

The easiest way to populate the database with sample data is using the built-in management command:

```bash
python manage.py populate_data
```

This command automatically creates:
- **6 Positions**: President, Vice President, Secretary, Treasurer, PR Officer, Sports Director
- **16 Candidates**: 2-3 candidates per position with detailed bios
- **3 Test Users**: Ready-to-use accounts for testing

**Test User Credentials:**
| Student ID | Password | Nickname |
|------------|----------|----------|
| TEST001    | test123  | TestUser1 |
| TEST002    | test123  | TestUser2 |
| TEST003    | test123  | TestUser3 |

**Usage:**
1. Run the command (venv activated, in backend directory)
2. Login with any test user credentials
3. Start voting and testing immediately

**Note:** If data already exists, the command will skip duplicate entries.

---

## Troubleshooting

### Backend Issues

**Problem: "No module named 'django'"**
```bash
# Solution: Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

**Problem: Port 8000 already in use**
```bash
# Solution: Kill process or use different port
python manage.py runserver 8001
# Update frontend API_BASE_URL accordingly
```

**Problem: Database errors**
```bash
# Solution: Delete db and remake
del db.sqlite3  # Windows
rm db.sqlite3   # Mac/Linux
python manage.py migrate
python manage.py createsuperuser
```

### Frontend Issues

**Problem: "Cannot find module 'react'"**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules  # or manually delete folder
npm install
```

**Problem: CORS errors in console**
```bash
# Solution: Check backend CORS settings
# In backend/voting_backend/settings.py:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

**Problem: API connection refused**
```bash
# Solution: Ensure backend is running
# Check backend terminal - should show:
# "Starting development server at http://127.0.0.1:8000/"
```

### AI Features Issues

**Problem: "AI analysis unavailable"**
```bash
# Solution: Add Groq API key
# 1. Get key from console.groq.com
# 2. Add to backend/.env:
GROQ_API_KEY=gsk_your_key_here
# 3. Restart backend server
```

**Problem: "Failed to generate AI summary"**
```bash
# Solution: Check API key and internet
# 1. Verify key is correct in .env
# 2. Test internet connection
# 3. Check Groq API status: status.groq.com
```

### General Issues

**Problem: Changes not reflecting**
```bash
# Solution: Hard refresh browser
# Windows/Linux: Ctrl + Shift + R
# Mac: Cmd + Shift + R
```

**Problem: White screen in frontend**
```bash
# Solution: Check browser console for errors
# Press F12 to open DevTools
# Look at Console and Network tabs
```

---

## Verification Checklist

Before considering setup complete, verify:

✅ Backend:
- [ ] Virtual environment activated
- [ ] Dependencies installed
- [ ] Database migrated
- [ ] Superuser created
- [ ] Server running on port 8000
- [ ] Admin panel accessible

✅ Frontend:
- [ ] Dependencies installed
- [ ] Server running on port 3000
- [ ] Login page loads
- [ ] Can register new user

✅ Integration:
- [ ] Frontend can reach backend API
- [ ] Login/register works
- [ ] Can view positions and candidates
- [ ] Can cast votes
- [ ] Results display correctly

✅ AI Features:
- [ ] Groq API key configured
- [ ] AI insights generate successfully

---

## Next Steps

Once setup is complete:

1. **Explore Features:**
   - Register multiple users
   - Cast votes from different accounts
   - View results
   - Try AI insights

2. **Customize:**
   - Add your own positions
   - Create candidate profiles
   - Modify UI styling
   - Add new features

3. **Learn:**
   - Explore backend code
   - Understand React components
   - Study API interactions
   - Review AI integration

---

## Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review error messages carefully
3. Check browser console (F12)
4. Verify all prerequisites are installed
5. Ensure both servers are running

---

**Setup Complete! 🎉**

Your AI-Enhanced Voting System is now ready to use!

**Backend:** http://127.0.0.1:8000/admin
**Frontend:** http://localhost:3000
