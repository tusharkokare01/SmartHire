# Smart Career hub v3 - Comprehensive File Analysis

This document provides a deep analysis of every file in the Smart Career hub v3 project.

---

## 📁 PROJECT STRUCTURE OVERVIEW

### Root Level
```
Smart Career hub_v3/
├── client/          # React frontend application
├── server/          # Node.js/Express backend API
├── check_db.js      # Database utility script
└── Documentation files (README, PROJECT_PLAN, etc.)
```

---

## 📄 ROOT LEVEL FILES

### 1. `check_db.js`
**Purpose:** Database inspection utility script
- Connects to MongoDB database
- Queries and displays AssessmentResult documents
- Lists all candidate users
- Used for debugging and database verification
- Uses mongoose to connect and query
- Reads from environment variable `MONGO_URL`

### 2. Documentation Files

#### `README.md`
- Main project documentation
- Overview of features for Candidate and HR roles
- Technology stack (React 19, Vite, MongoDB, Express)
- Quick start guide
- API endpoints documentation
- Current status and roadmap

#### `PROJECT_SUMMARY.md`
- Complete feature list
- Files created and their purposes
- Integration points
- Technology stack details
- Project statistics

#### `PROJECT_PLAN.md`
- 7-day development roadmap
- Technology recommendations
- Project structure guidelines
- Feature specifications
- Implementation strategy

#### `IMPLEMENTATION_ROADMAP.md`
- Detailed day-by-day implementation plan
- Database schema definitions
- Critical path items
- Quick wins
- Deployment checklist

#### `QUICK_START.md`
- 5-minute setup guide
- Installation instructions
- Testing procedures
- Troubleshooting tips

#### `SETUP_GUIDE.md`
- Detailed setup instructions
- Required packages
- Environment variables
- Backend integration points
- Next steps

#### `SETUP_MONGODB.md`
- MongoDB installation guide for Windows
- Verification steps
- Service management

---

## 🎨 CLIENT-SIDE FILES (Frontend)

### Configuration Files

#### `client/package.json`
**Dependencies:**
- React 19.2.0 - UI framework
- React Router DOM 7.9.6 - Navigation
- Axios 1.13.2 - HTTP client
- Tailwind CSS 3.4.15 - Styling
- React Hook Form 7.68.0 - Form management
- Zod 4.1.13 - Schema validation
- jsPDF 3.0.4 - PDF generation
- html2canvas 1.4.1 - HTML to canvas conversion
- docx 9.5.1 - DOCX file generation
- react-webcam 7.2.0 - Video recording
- react-toastify 11.0.5 - Notifications
- Recharts 3.5.1 - Data visualization
- Lucide React 0.555.0 - Icons
- date-fns 4.1.0 - Date formatting

#### `client/vite.config.js`
- Vite configuration
- React plugin setup
- Basic build configuration

#### `client/tailwind.config.js`
- Tailwind CSS configuration
- Custom color palette (primary: emerald-600)
- Custom font family (Inter)
- Theme extensions

#### `client/eslint.config.js`
- ESLint configuration
- React hooks and refresh plugins
- Browser globals
- Code quality rules

#### `client/postcss.config.js`
- PostCSS configuration
- Tailwind and Autoprefixer plugins

#### `client/index.html`
- Main HTML template
- Font imports (Playfair Display, Plus Jakarta Sans)
- Root div for React
- Meta tags and title

---

### Core Application Files

#### `client/src/main.jsx`
**Purpose:** Application entry point
- React 19 StrictMode wrapper
- Renders App component
- Imports global CSS

#### `client/src/App.jsx`
**Purpose:** Main application component with routing
- BrowserRouter setup
- AuthProvider wrapper
- Protected routes for Candidate and HR roles
- Route definitions for all pages
- Navigation redirects

**Routes Defined:**
- `/login`, `/register` - Public auth routes
- `/candidate/*` - Candidate routes (dashboard, resume, jobs, interviews, etc.)
- `/hr/*` - HR routes (dashboard, candidates, jobs, meetings, MCQ, etc.)

#### `client/src/index.css`
**Purpose:** Global styles and animations
- Tailwind directives
- Custom scrollbar styles
- Text reveal animations
- Fade-in animations
- Hover card effects
- Loading shimmer effects
- Float animations
- Pulse animations

---

### Context & State Management

#### `client/src/contexts/AuthContext.jsx`
**Purpose:** Authentication context provider
- Manages user authentication state
- localStorage integration for token persistence
- Login, logout, refreshUser functions
- User state management
- Loading state handling
- Token refresh mechanism

**Functions:**
- `login(userData, token)` - Stores token and user data
- `logout()` - Clears authentication
- `refreshUser()` - Fetches updated user data from API
- `useAuth()` - Hook to access auth context

---

### Services & API

#### `client/src/services/api.js`
**Purpose:** Axios instance with interceptors
- Base URL configuration from environment
- Request interceptor: Adds JWT token to headers
- Response interceptor: Handles 401 errors, redirects to login
- Console logging for debugging
- Error handling

---

### Utilities

#### `client/src/utils/constants.js`
**Purpose:** Application constants
- User roles: CANDIDATE, HR
- Route paths for all pages
- Resume template definitions

#### `client/src/utils/storage.js`
**Purpose:** LocalStorage wrapper utilities
- `loadJSON(key, fallback)` - Safe JSON loading
- `saveJSON(key, value)` - Safe JSON saving
- Error handling for quota exceeded

#### `client/src/utils/resumeValidation.js`
**Purpose:** Zod schema for resume validation
- Validates resume structure
- Personal info, education, experience, skills, projects
- Certifications, languages, extra sections
- Optional field handling

#### `client/src/data/mockJobs.js`
**Purpose:** Mock job data for testing
- 30 sample job listings
- Various job types and companies
- Used when backend is unavailable

---

### Common Components

#### `client/src/components/common/ProtectedRoute.jsx`
**Purpose:** Route protection wrapper
- Checks authentication status
- Verifies user roles
- Loading state display
- Redirects unauthorized users
- Role-based access control

#### `client/src/components/common/Layout.jsx`
**Purpose:** Main layout wrapper for Candidate role
- Top navigation header with scroll effects
- Logo and branding
- Navigation pills for desktop
- Mobile menu
- Search functionality
- User profile dropdown
- Messages icon with notification badge
- Subscription status indicator
- Responsive design

#### `client/src/components/common/HRLayout.jsx`
**Purpose:** Sidebar layout for HR role
- Fixed sidebar navigation
- Collapsible mobile menu
- Search bar in header
- Section-based navigation (Platform, Recruitment, Management)
- User profile in sidebar footer
- Active route highlighting
- Settings and messages icons

#### `client/src/components/common/ChatDialog.jsx`
**Purpose:** Chat/messaging dialog component
- Real-time conversation view
- Message sending functionality
- Auto-scroll to latest message
- Polling for new messages (5s interval)
- Message timestamps
- Loading states
- Sender/receiver distinction

#### `client/src/components/common/MessagesPanel.jsx`
**Purpose:** Messages inbox panel
- Lists all messages for user
- Mark as read functionality
- Expandable message content
- Unread count badge
- Loading states
- Empty state handling

---

## 🔐 SERVER-SIDE FILES (Backend)

### Main Server File

#### `server/src/index.js`
**Purpose:** Express server entry point
- Express app initialization
- CORS middleware
- JSON body parser
- MongoDB connection (mongoose)
- Route mounting:
  - `/api/auth` - Authentication
  - `/api/ai` - AI features
  - `/api/hr` - HR endpoints
  - `/api/resume` - Resume management
  - `/api/applications` - Job applications
  - `/api/jobs` - Job postings
  - `/api/candidate` - Candidate endpoints
  - `/api/messages` - Messaging
  - `/api/assessments` - MCQ assessments
  - `/api/payment` - Payment processing
- Server startup on PORT 5000

---

### Database Models

#### `server/src/models/User.js`
**Schema:**
- name (String, required)
- email (String, unique, indexed)
- password (String, hashed)
- role (enum: 'candidate', 'hr')
- subscriptionStatus (enum: 'free', 'active', 'canceled', 'past_due')
- subscriptionId, customerId (Razorpay)
- bio, notifications settings
- language, twoFactor
- timestamps

#### `server/src/models/Resume.js`
**Schema:**
- userId (ObjectId ref: User)
- personalInfo (object: fullName, email, phone, address, linkedin, github, portfolio)
- profileSummary (String)
- education (array: institution, degree, year, gpa)
- experience (array: company, title, duration, description)
- skills (array of strings)
- projects (array: name, description, technologies, link)
- certifications (array: name, issuer, year)
- languages (array of strings)
- templateId (Number, default: 1)
- resumeName (String, default: 'My Resume')
- timestamps

#### `server/src/models/Job.js`
**Schema:**
- title, company, location (required strings)
- type (enum: Full-time, Part-time, Contract, Freelance, Internship)
- workMode (enum: On-site, Remote, Hybrid)
- description (required)
- requirements (array of strings)
- salary (object: min, max, currency)
- postedBy (ObjectId ref: User)
- status (enum: Open, Closed, Draft)
- applicantsCount (Number)
- timestamps

#### `server/src/models/Application.js`
**Schema:**
- candidateId (ObjectId ref: User)
- resumeId (ObjectId ref: Resume)
- jobId (String - external job ID)
- jobTitle, company, location, type, source, url
- status (enum: Applied, In Review, Shortlisted, Rejected, Hired, Interview Scheduled, Offer Extended)
- timestamps

#### `server/src/models/Interview.js`
**Schema:**
- candidateId (ObjectId ref: User)
- hrId (ObjectId ref: User, optional)
- jobRole (String)
- interviewType (enum: Mock, Technical, HR, Behavioral)
- scheduledAt (Date)
- status (enum: Scheduled, Completed, Cancelled, Pending)
- score (Number)
- feedback (object: overall, strengths, improvements)
- duration (Number, minutes)
- platform (enum: Zoom, Google Meet, Phone, In-Person)
- meetingLink, meetingPassword
- timestamps

#### `server/src/models/Assessment.js`
**Schema:**
- title, description
- duration (Number, minutes)
- questions (array: id, question, options, correctAnswer)
- createdBy (ObjectId ref: User)
- timestamps

#### `server/src/models/AssessmentResult.js`
**Schema:**
- assessmentId (ObjectId ref: Assessment)
- candidateId (ObjectId ref: User)
- status (enum: Pending, In Progress, Completed)
- score (Number)
- totalQuestions (Number)
- responses (array: questionId, selectedAnswer, isCorrect)
- completedAt (Date)
- timestamps

#### `server/src/models/Message.js`
**Schema:**
- senderId (ObjectId ref: User)
- receiverId (ObjectId ref: User)
- subject (String)
- content (String)
- read (Boolean, default: false)
- timestamps

---

### Middleware

#### `server/src/middleware/auth.js`
**Purpose:** JWT authentication middleware
- Extracts Bearer token from Authorization header
- Verifies JWT signature
- Attaches decoded user info to req.user
- Returns 401 for invalid/missing tokens
- Uses JWT_SECRET from environment

---

### API Routes

#### `server/src/routes/auth.js`
**Endpoints:**
- `POST /register` - User registration with bcrypt password hashing
- `POST /login` - User authentication, returns JWT token
- `GET /me` - Get current user profile
- `PUT /me` - Update user profile
- `POST /change-password` - Update password
- `PUT /preferences` - Update user preferences (notifications, language, 2FA)

**Features:**
- Password hashing with bcrypt
- JWT token generation (24h expiry)
- Email uniqueness validation
- Role assignment

#### `server/src/routes/resume.js`
**Endpoints:**
- `POST /` - Create or update resume (upsert logic)
- `GET /user/:userId` - Get all resumes for user
- `GET /` - Get all resumes (for HR, only applied candidates)
- `GET /:id` - Get single resume by ID
- `DELETE /:resumeId` - Delete resume

**Features:**
- Upsert logic to prevent duplicates
- Resume name normalization
- User filtering

#### `server/src/routes/jobs.js`
**Endpoints:**
- `POST /` - Create new job posting
- `GET /` - Get all open jobs (for candidates)
- `GET /hr/:userId` - Get jobs posted by HR user
- `GET /:id` - Get job details
- `PATCH /:id/status` - Update job status (Open/Closed)
- `PUT /:id` - Update job
- `DELETE /:id` - Delete job

**Features:**
- Dynamic applicant count calculation
- Status filtering
- Default user assignment if postedBy missing

#### `server/src/routes/applications.js`
**Endpoints:**
- `POST /` - Create job application
- `GET /` - Get all applications (filterable by candidateId)
- `GET /candidate/:candidateId` - Get candidate's applications
- `PATCH /:applicationId/status` - Update application status
- `DELETE /:id` - Cancel/delete application

**Features:**
- Automatic interview cancellation on rejection
- Status validation
- Duplicate prevention

#### `server/src/routes/hr.js`
**Endpoints:**
- `GET /stats` - Dashboard statistics with trends
- `GET /activity` - Recent activity feed
- `GET /candidates` - List all candidates
- `GET /interviews/upcoming` - Upcoming interviews
- `GET /jobs` - Recent job postings
- `GET /interviews` - All scheduled interviews
- `POST /generate-link` - Generate meeting link (Zoom/Google Meet)
- `POST /interviews` - Create interview
- `PATCH /interviews/:id/cancel` - Cancel interview
- `GET /stats/trends` - Application trends (6 months)
- `GET /applications/recent` - Recent applications

**Features:**
- Trend calculations (month-over-month)
- Meeting link generation
- Application status management
- Interview cancellation with status reversion

#### `server/src/routes/candidate.js`
**Endpoints:**
- `GET /interviews` - Get candidate's scheduled interviews

#### `server/src/routes/messages.js`
**Endpoints:**
- `POST /` - Send message
- `GET /my-messages/:userId` - Get user's inbox
- `PATCH /:id/read` - Mark message as read
- `DELETE /:id` - Delete message
- `GET /conversation` - Get conversation between two users

#### `server/src/routes/ai.js`
**Purpose:** AI-powered features using hybrid AI providers
**AI Providers:** Groq (primary), Gemini (fallback), Perplexity (final fallback)

**Endpoints:**
- `POST /generate-resume` - AI resume generation
  - Takes role, yearsExp, industry, currentData
  - Generates complete resume with all sections
  - Returns structured JSON
  
- `POST /score-resume` - ATS resume scoring
  - Compares resume with job description
  - Returns match score, missing keywords, tips
  
- `POST /generate-questions` - Interview question generation
  - Generates 5 questions for role/skills
  - Returns JSON array with questions
  
- `POST /evaluate-interview` - Interview answer evaluation
  - Evaluates candidate's answer
  - Returns scores (confidence, clarity, relevance)
  - Provides suggestions and ideal answer
  
- `POST /generate-mcq` - MCQ assessment generation
  - Generates multiple choice questions
  - Takes topic, difficulty, questionCount
  
- `POST /generate-cover-letter` - Cover letter generation
  - Uses resume data and job details
  
- `POST /career-coach` - Career coaching chat
  - Conversational AI assistant
  - Maintains conversation history

**Features:**
- Fallback chain: Groq → Gemini → Perplexity
- JSON extraction utility
- Mock data fallbacks on AI failure

#### `server/src/routes/assessments.js`
**Endpoints:**
- `GET /` - Get all assessments
- `POST /` - Create assessment
- `PUT /:id` - Update assessment
- `DELETE /:id` - Delete assessment (cascades pending results)
- `POST /assign` - Assign assessment to candidate
- `GET /results` - Get all assessment results
- `GET /my-assessments/:userId` - Get candidate's assessments
- `POST /submit` - Submit assessment answers and calculate score

**Features:**
- Score calculation
- Status tracking (Pending, In Progress, Completed)
- Duplicate assignment prevention

#### `server/src/routes/paymentRoutes.js`
**Purpose:** Payment processing with Razorpay
**Endpoints:**
- `POST /create-order` - Create Razorpay order
- `POST /verify-payment` - Verify payment signature
- `POST /cancel-subscription` - Cancel user subscription

**Middleware:** Protected routes (requires authentication)

---

### Controllers

#### `server/src/controllers/paymentController.js`
**Functions:**
- `createOrder()` - Creates Razorpay order, handles mock orders for testing
- `verifyPayment()` - Verifies payment signature, updates user subscription
- `cancelSubscription()` - Updates user subscription status to 'canceled'

**Features:**
- Mock order support for testing
- Signature verification with crypto
- User subscription management

---

### Utilities

#### `server/src/utils/meetingService.js`
**Purpose:** Meeting link generation service
**Functions:**
- `createZoomMeeting()` - Creates Zoom meeting via OAuth API
- `createGoogleMeet()` - Creates Google Meet via Calendar API

**Features:**
- OAuth token management for Zoom
- Google Calendar API integration
- Mock link generation when credentials missing
- Password handling for Zoom

---

## 📊 KEY FEATURES SUMMARY

### Authentication System
- JWT-based authentication
- Role-based access control (Candidate/HR)
- Password hashing with bcrypt
- Token refresh mechanism
- Protected routes on both frontend and backend

### Resume Management
- Multi-template resume builder (13 templates)
- Form-based resume creation
- PDF and DOCX export
- AI-powered resume generation
- Resume validation with Zod
- Local and backend storage sync

### Job Management
- Job posting by HR
- Job search and filtering
- Skill-based job matching
- Application tracking
- Status management

### Interview System
- Interview scheduling
- Zoom and Google Meet integration
- Mock interviews with AI evaluation
- Interview status tracking
- Feedback storage

### Assessment System
- MCQ creation by HR
- Assessment assignment to candidates
- Online test taking
- Automatic scoring
- Results tracking

### Messaging System
- Internal messaging between HR and candidates
- Conversation threads
- Read/unread status
- Real-time polling

### AI Features
- Resume generation
- Resume scoring (ATS)
- Interview question generation
- Interview evaluation
- Cover letter generation
- Career coaching chatbot
- MCQ generation

### Payment System
- Razorpay integration
- Subscription management
- Order creation and verification
- Subscription cancellation

---

## 🔧 TECHNOLOGY STACK

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- React Hook Form + Zod
- Axios
- jsPDF + html2canvas
- docx library
- React Webcam
- Recharts
- Lucide React icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Razorpay SDK
- Google APIs (Calendar)
- OpenAI-compatible APIs (Groq, Gemini, Perplexity)

---

## 📝 NOTES

1. **Hybrid Storage:** Resumes use both localStorage and MongoDB backend
2. **Mock Data Fallbacks:** Multiple components fall back to mock data when backend unavailable
3. **AI Provider Chain:** AI features use fallback chain for reliability
4. **Meeting Integration:** Supports Zoom and Google Meet with mock fallbacks
5. **Subscription System:** Integrated with Razorpay for payments
6. **Real-time Updates:** Message polling every 5 seconds
7. **Responsive Design:** Mobile-first approach with Tailwind CSS
8. **Error Handling:** Comprehensive error handling with user-friendly messages
9. **Loading States:** Loading indicators throughout the application
10. **Form Validation:** Zod schemas for type-safe validation

---

## 🚀 DEPLOYMENT READINESS

**Frontend:** Ready for Vercel/Netlify deployment
**Backend:** Ready for Railway/Heroku/Render deployment
**Database:** MongoDB Atlas compatible
**Environment Variables:** Required for API keys, database URL, JWT secret

---

*This analysis covers all major files in the Smart Career hub v3 project. Each file is designed to work together in a cohesive recruitment platform with comprehensive features for both candidates and HR professionals.*


