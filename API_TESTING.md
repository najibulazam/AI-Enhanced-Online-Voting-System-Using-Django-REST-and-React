# API Testing Guide

**Author:** Md Najib Ul Azam Mahi  
**GitHub:** [najibulazam](https://github.com/najibulazam)  
**Repository:** [AI-Enhanced-Online-Voting-System-Using-Django-REST-and-React](https://github.com/najibulazam/AI-Enhanced-Online-Voting-System-Using-Django-REST-and-React)

Quick reference for testing all API endpoints.

## Base URL
```
http://127.0.0.1:8000/api
```

## Authentication Required

Most endpoints require JWT token in header:
```
Authorization: Bearer {your_access_token}
```

---

## Test User Credentials

If you ran `python manage.py populate_data`, use these ready-made test accounts:

| Student ID | Password | Nickname  |
|------------|----------|-----------|
| TEST001    | test123  | TestUser1 |
| TEST002    | test123  | TestUser2 |
| TEST003    | test123  | TestUser3 |

---

## Quick Test Sequence

### 1. Login with Test User (Easy Start)
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "TEST001",
    "password": "test123"
  }'
```

**Save access_token for next requests!**

### 2. Register New User (Alternative)
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "1234567",
    "email": "test@example.com",
    "nickname": "Test User",
    "password": "SecurePass123",
    "password_confirm": "SecurePass123"
  }'
```

**Response:** JWT tokens + user info

### 3. Get Profile
```bash
curl -X GET http://127.0.0.1:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Get Positions
```bash
curl -X GET http://127.0.0.1:8000/api/positions/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Cast Vote
```bash
curl -X POST http://127.0.0.1:8000/api/vote/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate": 1,
    "position": 1
  }'
```

### 6. Get Results
```bash
curl -X GET http://127.0.0.1:8000/api/results/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 7. Get Statistics
```bash
curl -X GET http://127.0.0.1:8000/api/analytics/stats/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 8. AI Summary
```bash
curl -X GET http://127.0.0.1:8000/api/ai/summary/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Using Postman

### Import Collection

Create requests for each endpoint:

1. **Create New Collection:** "Voting System API"

2. **Add Environment Variables:**
   - `base_url`: http://127.0.0.1:8000/api
   - `access_token`: (set after login)

3. **Setup Requests:**

#### Register
```
POST {{base_url}}/auth/register/
Body (JSON):
{
  "student_id": "1234567",
  "email": "test@example.com",
  "nickname": "Test User",
  "password": "SecurePass123",
  "password_confirm": "SecurePass123"
}
```

#### Login
```
POST {{base_url}}/auth/login/
Body (JSON):
{
  "student_id": "1234567",
  "password": "SecurePass123"
}

Tests (save token):
pm.environment.set("access_token", pm.response.json().tokens.access);
```

#### Protected Endpoints
```
Headers:
Authorization: Bearer {{access_token}}
```

---

## Testing with VS Code Thunder Client

1. Install "Thunder Client" extension
2. Create new request
3. Set URL and method
4. Add headers/body as shown above
5. Save to collection

---

## Expected Status Codes

- `200 OK` - Success (GET requests)
- `201 Created` - Resource created (POST)
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Common Errors

### 401 Unauthorized
**Cause:** No token or expired token
**Fix:** Login again to get new token

### 400 Bad Request
**Cause:** Invalid data format
**Fix:** Check request body matches expected format

### Already voted
**Response:**
```json
{
  "position": ["You have already voted for President."]
}
```

---

## Test Scenarios

### Scenario 1: New User Journey
1. Register ✓
2. Auto-login ✓
3. View positions ✓
4. Cast votes ✓
5. View results ✓

### Scenario 2: Vote Validation
1. Login
2. Cast vote for Position 1 ✓
3. Try voting again for Position 1 ✗ (should fail)
4. Check voting status ✓

### Scenario 3: Results Analysis
1. Multiple users vote
2. Get results ✓
3. Get statistics ✓
4. Get AI insights ✓

---

## Sample Test Data

### Users
```json
[
  {
    "student_id": "1111111",
    "email": "user1@test.com",
    "nickname": "Alice",
    "password": "Pass1234"
  },
  {
    "student_id": "2222222",
    "email": "user2@test.com",
    "nickname": "Bob",
    "password": "Pass1234"
  },
  {
    "student_id": "3333333",
    "email": "user3@test.com",
    "nickname": "Charlie",
    "password": "Pass1234"
  }
]
```

### Votes (per user)
```json
[
  { "candidate": 1, "position": 1 },
  { "candidate": 3, "position": 2 },
  { "candidate": 5, "position": 3 }
]
```

---

## Automation Script

### Python Test Script
```python
import requests

BASE_URL = "http://127.0.0.1:8000/api"

# Register
response = requests.post(f"{BASE_URL}/auth/register/", json={
    "student_id": "9999999",
    "email": "auto@test.com",
    "nickname": "Auto User",
    "password": "Test1234",
    "password_confirm": "Test1234"
})

# Get token
token = response.json()["tokens"]["access"]
headers = {"Authorization": f"Bearer {token}"}

# Get positions
positions = requests.get(f"{BASE_URL}/positions/", headers=headers).json()
print(f"Positions: {len(positions)}")

# Cast vote
vote = requests.post(f"{BASE_URL}/vote/", headers=headers, json={
    "candidate": positions[0]["candidates"][0]["id"],
    "position": positions[0]["id"]
})
print(f"Vote: {vote.status_code}")

# Get results
results = requests.get(f"{BASE_URL}/results/", headers=headers).json()
print(f"Results: {results['results'][0]['position_name']}")
```

---

## Browser Console Test

Open browser console (F12) and run:

```javascript
// Register
const register = await fetch('http://127.0.0.1:8000/api/auth/register/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_id: '8888888',
    email: 'browser@test.com',
    nickname: 'Browser User',
    password: 'Test1234',
    password_confirm: 'Test1234'
  })
});

const data = await register.json();
console.log('Token:', data.tokens.access);

// Store token
const token = data.tokens.access;

// Get positions
const positions = await fetch('http://127.0.0.1:8000/api/positions/', {
  headers: { 'Authorization': `Bearer ${token}` }
});

console.log('Positions:', await positions.json());
```

---

**Happy Testing! 🧪**
