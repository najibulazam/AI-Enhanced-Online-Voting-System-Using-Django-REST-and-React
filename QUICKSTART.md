# Quick Start - AI-Enhanced Voting System

**Author:** Md Najib Ul Azam Mahi | **GitHub:** [najibulazam](https://github.com/najibulazam) | **Repository:** [AI-Enhanced-Online-Voting-System-Using-Django-REST-and-React](https://github.com/najibulazam/AI-Enhanced-Online-Voting-System-Using-Django-REST-and-React)

## ⚡ 5-Minute Setup

### Prerequisites Check
```bash
python --version   # Should be 3.9+
node --version     # Should be 16+
npm --version      # Should be 8+
```

---

## 🚀 Backend Setup (2 minutes)

### Windows
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Mac/Linux
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Backend running at:** http://127.0.0.1:8000

---

## 🎨 Frontend Setup (2 minutes)

**Open NEW terminal:**

```bash
cd frontend
npm install
npm run dev
```

**Frontend running at:** http://localhost:3000

---

## 🔑 Get Groq API Key (1 minute)

1. Go to: https://console.groq.com/
2. Sign up (free)
3. Create API key
4. Add to `backend/.env`:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```
5. Restart backend server

---

## ✅ Quick Test

**Option 1: Use Pre-created Test Users**
1. Open http://localhost:3000
2. Login with:
   - Username: `TEST001`
   - Password: `test123`
3. Start voting! 🎉

**Option 2: Create Your Own Account**
1. Click "Register here"
2. Fill in details:
   - Student ID: 7-digit number (e.g., 2024001)
   - Email: your@email.com
   - Nickname: Your Name
   - Password: YourPassword123
3. Login and vote!

---

## 📝 Add Sample Data (30 seconds)

**One command to populate everything:**

```bash
cd backend
python manage.py populate_data
```

This creates:
- **6 Positions** (President, VP, Secretary, Treasurer, PR Officer, Sports Director)
- **16 Candidates** (2-3 per position with bios)
- **3 Test Users** ready to use:
  - Username: `TEST001`, Password: `test123` (Alice)
  - Username: `TEST002`, Password: `test123` (Bob)
  - Username: `TEST003`, Password: `test123` (Charlie)

✅ **You can now login with any test user and start voting!**

---

## 🎯 What to Do Next

1. **Register 2-3 users** (use different student IDs)
2. **Cast some votes** from each user
3. **View results** in Results page
4. **Try AI Insights** (make sure Groq API key is set)

---

## 🐛 Common Issues

### Backend won't start?
```bash
# Make sure venv is activated
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Reinstall if needed
pip install -r requirements.txt
```

### Frontend won't start?
```bash
# Clear and reinstall
rm -rf node_modules
npm install
```

### Can't connect to API?
- Make sure backend is running on port 8000
- Check frontend/src/services/api.js has correct URL

### AI not working?
- Add Groq API key to backend/.env
- Restart backend server
- Check console.groq.com for API status

---

## 📚 Full Documentation

- **Main README:** README.md
- **Setup Guide:** SETUP_GUIDE.md
- **API Docs:** backend/README.md
- **Frontend Guide:** frontend/README.md
- **Project Summary:** PROJECT_SUMMARY.md

---

## ✨ You're Ready!

**Backend:** http://127.0.0.1:8000/admin
**Frontend:** http://localhost:3000

Happy coding! 🚀
