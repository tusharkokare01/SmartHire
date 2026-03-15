# Smart Career hub v3 - Technology Stack & APIs Documentation

This document provides a comprehensive overview of all technologies, APIs, libraries, frameworks, and tools used in the Smart Career hub v3 project.

---

## 📚 TABLE OF CONTENTS

1. [Frontend Technologies](#frontend-technologies)
2. [Backend Technologies](#backend-technologies)
3. [Database](#database)
4. [External APIs & Services](#external-apis--services)
5. [Authentication & Security](#authentication--security)
6. [AI & Machine Learning Services](#ai--machine-learning-services)
7. [Payment Gateway](#payment-gateway)
8. [Meeting & Video Conferencing](#meeting--video-conferencing)
9. [File Generation & Processing](#file-generation--processing)
10. [UI/UX Libraries](#uiux-libraries)
11. [Development Tools](#development-tools)
12. [Environment Variables](#environment-variables)
13. [API Endpoints Summary](#api-endpoints-summary)
14. [Frontend Pages Explanation](#frontend-pages-explanation)

---

## 🎨 FRONTEND TECHNOLOGIES

### Core Framework
- **React 19.2.0**
  - UI framework for building user interfaces
  - Latest React version with improved performance
  - Component-based architecture

- **React DOM 19.2.0**
  - React rendering library for web
  - Handles DOM manipulation

### Build Tools
- **Vite 6.0.0**
  - Next-generation frontend build tool
  - Fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Zero-config setup

### Routing
- **React Router DOM 7.9.6**
  - Client-side routing for React applications
  - Navigation between pages
  - Protected route handling
  - History API integration

### Styling
- **Tailwind CSS 3.4.15**
  - Utility-first CSS framework
  - Responsive design utilities
  - Custom theme configuration
  - PostCSS integration

- **PostCSS 8.5.6**
  - CSS transformation tool
  - Autoprefixer integration

- **Autoprefixer 10.4.22**
  - Automatic vendor prefixing for CSS

### Form Management
- **React Hook Form 7.68.0**
  - Performance-focused form library
  - Minimal re-renders
  - Form validation integration

- **Zod 4.1.13**
  - TypeScript-first schema validation
  - Runtime type checking
  - Form validation schemas

- **@hookform/resolvers 5.2.2**
  - Validation resolvers for React Hook Form
  - Zod resolver integration

### HTTP Client
- **Axios 1.13.2**
  - Promise-based HTTP client
  - Request/response interceptors
  - Automatic JSON transformation
  - Error handling

### PDF & Document Generation
- **jsPDF 3.0.4**
  - PDF generation library
  - Client-side PDF creation
  - Resume export functionality

- **html2canvas 1.4.1**
  - HTML to canvas conversion
  - Used for PDF generation from HTML
  - Screenshot functionality

- **docx 9.5.1**
  - DOCX file generation library
  - Microsoft Word document creation
  - Resume export in DOCX format

- **@react-pdf/renderer 4.3.1**
  - React component for PDF generation
  - Alternative PDF generation method

### Video & Media
- **react-webcam 7.2.0**
  - Webcam access for React
  - Video recording for mock interviews
  - Browser MediaRecorder API wrapper

### Data Visualization
- **Recharts 3.5.1**
  - Composable charting library
  - Dashboard statistics visualization
  - Charts and graphs

### UI Components & Icons
- **Lucide React 0.555.0**
  - Modern icon library
  - SVG icons
  - Tree-shakeable

### Notifications
- **react-toastify 11.0.5**
  - Toast notification library
  - Success/error messages
  - Customizable notifications

### Utilities
- **date-fns 4.1.0**
  - Date utility library
  - Date formatting and manipulation
  - Relative time calculations

- **react-to-print 3.2.0**
  - Print functionality for React components

- **react-razorpay 3.0.1**
  - Razorpay payment integration for React
  - Payment form components

### Development Tools
- **ESLint 9.39.1**
  - JavaScript linting
  - Code quality enforcement
  - React-specific rules

- **@eslint/js 9.39.1**
  - ESLint JavaScript configuration

- **eslint-plugin-react-hooks 7.0.1**
  - React Hooks linting rules

- **eslint-plugin-react-refresh 0.4.24**
  - React Refresh linting

- **globals 16.5.0**
  - Global variables for ESLint

- **@types/react 19.2.5**
  - TypeScript definitions for React

- **@types/react-dom 19.2.3**
  - TypeScript definitions for React DOM

---

## ⚙️ BACKEND TECHNOLOGIES

### Core Framework
- **Node.js**
  - JavaScript runtime environment
  - Server-side execution

- **Express 4.19.2**
  - Web application framework
  - RESTful API server
  - Middleware support
  - Route handling

### Database
- **MongoDB**
  - NoSQL document database
  - Flexible schema design
  - Document storage

- **Mongoose 8.8.0**
  - MongoDB object modeling library
  - Schema definitions
  - Data validation
  - Query building
  - Middleware support

### Authentication & Security
- **jsonwebtoken 9.0.2**
  - JWT token generation and verification
  - User authentication
  - Token-based auth system

- **bcryptjs 2.4.3**
  - Password hashing library
  - Secure password storage
  - Password comparison

- **crypto-js 4.2.0**
  - Cryptographic functions
  - Hash generation
  - Encryption utilities

### CORS & Middleware
- **cors 2.8.5**
  - Cross-Origin Resource Sharing middleware
  - API access control
  - Browser security

### Configuration
- **dotenv 16.4.5**
  - Environment variable management
  - Configuration loading
  - Secret management

### Development Tools
- **nodemon 3.1.7**
  - Development server with auto-restart
  - File watching
  - Development convenience

---

## 🤖 AI & MACHINE LEARNING SERVICES

### AI Providers (Hybrid Fallback Chain)

#### 1. Groq API (Primary)
- **Library:** OpenAI-compatible API
- **Model:** llama-3.1-8b-instant
- **Use Case:** Fast AI responses (primary choice)
- **Environment Variable:** `GROQ_API_KEY`
- **Base URL:** `https://api.groq.com/openai/v1`

#### 2. Google Gemini (Fallback)
- **Library:** @google/generative-ai 0.24.1
- **Model:** gemini-2.5-flash-lite
- **Use Case:** AI responses when Groq fails
- **Environment Variable:** `GEMINI_API_KEY`
- **Provider:** Google AI

#### 3. Perplexity AI (Final Fallback)
- **Library:** OpenAI-compatible API
- **Model:** sonar-pro
- **Use Case:** Final fallback for AI responses
- **Environment Variable:** `PERPLEXITY_API_KEY`
- **Base URL:** `https://api.perplexity.ai`

### AI Features Implemented
1. **Resume Generation**
   - AI-powered resume content creation
   - Role-based resume generation
   - Industry-specific tailoring

2. **Resume Scoring (ATS)**
   - Applicant Tracking System scoring
   - Keyword matching
   - Job description comparison

3. **Interview Questions Generation**
   - Role-specific questions
   - Skill-based questions
   - Technical and behavioral questions

4. **Interview Evaluation**
   - Answer analysis
   - Confidence scoring
   - Clarity and relevance scoring
   - Improvement suggestions

5. **MCQ Generation**
   - Topic-based question generation
   - Multiple choice questions
   - Difficulty levels

6. **Cover Letter Generation**
   - Job-specific cover letters
   - Resume data integration

7. **Career Coaching Chatbot**
   - Conversational AI assistant
   - Career advice
   - Guidance and recommendations

---

## 💳 PAYMENT GATEWAY

### Razorpay
- **Library:** razorpay 2.9.6
- **React Integration:** react-razorpay 3.0.1
- **Purpose:** Payment processing for subscriptions
- **Features:**
  - Order creation
  - Payment verification
  - Signature validation
  - Subscription management
  - Payment gateway integration

### Environment Variables
- `RAZORPAY_KEY_ID` - Razorpay API key ID
- `RAZORPAY_KEY_SECRET` - Razorpay API secret key

### Payment Flow
1. Create order via Razorpay API
2. User completes payment
3. Verify payment signature
4. Update user subscription status
5. Grant premium features

---

## 📹 MEETING & VIDEO CONFERENCING

### Zoom Integration
- **Library:** axios (for API calls)
- **Purpose:** Create Zoom meeting links
- **API:** Zoom Meeting API
- **Features:**
  - OAuth authentication
  - Meeting creation
  - Password generation
  - Join URL generation

### Environment Variables
- `ZOOM_ACCOUNT_ID` - Zoom account ID
- `ZOOM_CLIENT_ID` - Zoom OAuth client ID
- `ZOOM_CLIENT_SECRET` - Zoom OAuth client secret

### Google Meet Integration
- **Library:** googleapis 167.0.0
- **Purpose:** Create Google Meet links
- **API:** Google Calendar API
- **Features:**
  - Calendar event creation
  - Meet link generation
  - Service account authentication

### Environment Variables
- `GOOGLE_CLIENT_EMAIL` - Google service account email
- `GOOGLE_PRIVATE_KEY` - Google service account private key

### Meeting Platforms Supported
1. **Zoom** - Via OAuth API
2. **Google Meet** - Via Calendar API
3. **Phone** - Manual phone number
4. **In-Person** - Physical location

---

## 📄 FILE GENERATION & PROCESSING

### PDF Generation
- **jsPDF 3.0.4**
  - Client-side PDF creation
  - Resume export to PDF
  - Custom formatting

- **html2canvas 1.4.1**
  - HTML to image conversion
  - PDF generation from HTML
  - Screenshot functionality

- **@react-pdf/renderer 4.3.1**
  - React-based PDF generation
  - Component-to-PDF conversion

### DOCX Generation
- **docx 9.5.1**
  - Microsoft Word document creation
  - Resume export to DOCX
  - Structured document generation
  - Formatting support

### Use Cases
- Resume export (PDF/DOCX)
- Document generation
- File downloads
- Professional formatting

---

## 🎨 UI/UX LIBRARIES

### Styling Framework
- **Tailwind CSS 3.4.15**
  - Utility-first CSS
  - Responsive design
  - Custom theme
  - Dark mode support (configured)

### Icon Library
- **Lucide React 0.555.0**
  - 1000+ icons
  - SVG format
  - Customizable
  - Tree-shakeable

### Animation & Effects
- Custom CSS animations (in index.css)
  - Fade-in animations
  - Text reveal effects
  - Hover effects
  - Loading shimmer
  - Float animations

### Data Visualization
- **Recharts 3.5.1**
  - Line charts
  - Bar charts
  - Area charts
  - Dashboard widgets

### Notifications
- **react-toastify 11.0.5**
  - Toast notifications
  - Success/error messages
  - Customizable styles
  - Auto-dismiss

---

## 🔧 DEVELOPMENT TOOLS

### Frontend Development
- **Vite 6.0.0** - Build tool and dev server
- **ESLint 9.39.1** - Code linting
- **React DevTools** - React debugging
- **Browser DevTools** - Debugging and profiling

### Backend Development
- **Nodemon 3.1.7** - Auto-restart development server
- **Postman/Insomnia** - API testing
- **MongoDB Compass** - Database GUI

### Code Quality
- **ESLint** - JavaScript linting
- **Prettier** (implicit) - Code formatting
- **React Hooks ESLint Plugin** - Hooks validation

### Version Control
- **Git** - Version control system

---

## 🔐 AUTHENTICATION & SECURITY

### Authentication Method
- **JWT (JSON Web Tokens)**
  - Token-based authentication
  - Stateless authentication
  - 24-hour token expiry
  - Refresh mechanism

### Password Security
- **bcryptjs 2.4.3**
  - Password hashing
  - Salt rounds: 10
  - Secure password storage

### Token Management
- **jsonwebtoken 9.0.2**
  - Token generation
  - Token verification
  - Payload encoding

### Security Features
- CORS protection
- Password hashing
- JWT token authentication
- Protected routes
- Role-based access control
- Token expiration

---

## 🗄️ DATABASE

### Database System
- **MongoDB**
  - NoSQL document database
  - Flexible schema
  - JSON-like documents
  - Scalable

### ODM (Object Document Mapper)
- **Mongoose 8.8.0**
  - Schema definitions
  - Data validation
  - Query building
  - Middleware support
  - Relationships (references)

### Database Models
1. **User** - User accounts (candidates & HR)
2. **Resume** - Resume documents
3. **Job** - Job postings
4. **Application** - Job applications
5. **Interview** - Interview records
6. **Assessment** - MCQ assessments
7. **AssessmentResult** - Assessment submissions
8. **Message** - Internal messages

### Database Features
- Timestamps (createdAt, updatedAt)
- References between collections
- Indexing for performance
- Data validation
- Schema validation

---

## 🌐 EXTERNAL APIS & SERVICES

### AI Services
1. **Groq API** - Fast AI responses
2. **Google Gemini API** - AI generation
3. **Perplexity API** - AI fallback

### Payment Services
1. **Razorpay API** - Payment processing

### Meeting Services
1. **Zoom Meeting API** - Video conferencing
2. **Google Calendar API** - Google Meet integration

### Internal APIs
- RESTful API endpoints (see API Endpoints Summary)

---

## 📡 API ENDPOINTS SUMMARY

### Authentication APIs
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/change-password` - Change password
- `PUT /api/auth/preferences` - Update preferences

### Resume APIs
- `POST /api/resume` - Create/update resume
- `GET /api/resume/user/:userId` - Get user's resumes
- `GET /api/resume` - Get all resumes (HR)
- `GET /api/resume/:id` - Get single resume
- `DELETE /api/resume/:resumeId` - Delete resume

### Job APIs
- `POST /api/jobs` - Create job posting
- `GET /api/jobs` - Get all open jobs
- `GET /api/jobs/hr/:userId` - Get HR's jobs
- `GET /api/jobs/:id` - Get job details
- `PATCH /api/jobs/:id/status` - Update job status
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Application APIs
- `POST /api/applications` - Create application
- `GET /api/applications` - Get applications
- `GET /api/applications/candidate/:candidateId` - Get candidate's applications
- `PATCH /api/applications/:applicationId/status` - Update status
- `DELETE /api/applications/:id` - Cancel application

### HR APIs
- `GET /api/hr/stats` - Dashboard statistics
- `GET /api/hr/activity` - Recent activity
- `GET /api/hr/candidates` - List candidates
- `GET /api/hr/interviews/upcoming` - Upcoming interviews
- `GET /api/hr/jobs` - Recent jobs
- `GET /api/hr/interviews` - All interviews
- `POST /api/hr/generate-link` - Generate meeting link
- `POST /api/hr/interviews` - Create interview
- `PATCH /api/hr/interviews/:id/cancel` - Cancel interview
- `GET /api/hr/stats/trends` - Application trends
- `GET /api/hr/applications/recent` - Recent applications

### Candidate APIs
- `GET /api/candidate/interviews` - Get candidate's interviews

### AI APIs
- `POST /api/ai/generate-resume` - Generate resume with AI
- `POST /api/ai/score-resume` - Score resume (ATS)
- `POST /api/ai/generate-questions` - Generate interview questions
- `POST /api/ai/evaluate-interview` - Evaluate interview answer
- `POST /api/ai/generate-mcq` - Generate MCQ assessment
- `POST /api/ai/generate-cover-letter` - Generate cover letter
- `POST /api/ai/career-coach` - Career coaching chatbot

### Assessment APIs
- `GET /api/assessments` - Get all assessments
- `POST /api/assessments` - Create assessment
- `PUT /api/assessments/:id` - Update assessment
- `DELETE /api/assessments/:id` - Delete assessment
- `POST /api/assessments/assign` - Assign assessment
- `GET /api/assessments/results` - Get all results
- `GET /api/assessments/my-assessments/:userId` - Get candidate's assessments
- `POST /api/assessments/submit` - Submit assessment

### Message APIs
- `POST /api/messages` - Send message
- `GET /api/messages/my-messages/:userId` - Get inbox
- `PATCH /api/messages/:id/read` - Mark as read
- `DELETE /api/messages/:id` - Delete message
- `GET /api/messages/conversation` - Get conversation

### Payment APIs
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify-payment` - Verify payment
- `POST /api/payment/cancel-subscription` - Cancel subscription

---

## 🏗️ ARCHITECTURE OVERVIEW

### Frontend Architecture
- **Component-Based:** React components
- **State Management:** Context API (AuthContext)
- **Routing:** React Router (client-side)
- **Form Handling:** React Hook Form + Zod
- **Styling:** Tailwind CSS (utility-first)
- **Build Tool:** Vite
- **Package Manager:** npm

### Backend Architecture
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT tokens
- **API Style:** RESTful
- **Error Handling:** Try-catch with status codes
- **Middleware:** CORS, JSON parser, Auth middleware

### Data Flow
1. **Frontend** makes HTTP request via Axios
2. **Backend** receives request, validates, processes
3. **Database** stores/retrieves data via Mongoose
4. **Backend** returns JSON response
5. **Frontend** updates UI with response

---

## 📦 DEPENDENCY SUMMARY

### Frontend Dependencies
- **Total:** 25+ production dependencies
- **Major:** React, React Router, Tailwind, Axios, React Hook Form, Zod
- **File Generation:** jsPDF, html2canvas, docx
- **UI:** Lucide React, Recharts, react-toastify
- **Utilities:** date-fns, react-webcam

### Backend Dependencies
- **Total:** 15+ production dependencies
- **Major:** Express, Mongoose, JWT, bcryptjs
- **AI:** @google/generative-ai, openai (for Groq/Perplexity)
- **Payment:** razorpay
- **Meeting:** googleapis, axios (for Zoom)
- **Utilities:** dotenv, cors, crypto-js

---

## 🔄 VERSION INFORMATION

### Node.js
- **Recommended:** Node.js 18+ or 20+
- **Package Manager:** npm

### Key Version Numbers
- React: 19.2.0
- Express: 4.19.2
- MongoDB: Latest (via Mongoose 8.8.0)
- Vite: 6.0.0
- Tailwind CSS: 3.4.15

---


---

## 📄 FRONTEND PAGES EXPLANATION

This section provides detailed explanations of all frontend pages in the Smart Career hub v3 application.

---

## 👤 CANDIDATE PAGES

### 1. **Dashboard** (`/candidate/dashboard`)
**File:** `client/src/pages/candidate/Dashboard.jsx`

**Purpose:** Main landing page for candidates after login

**Features:**
- Welcome banner with personalized greeting
- Key statistics cards:
  - Total Resumes count
  - Total Applications count
  - Scheduled Interviews count
  - Pending Assessments count
- Quick action cards linking to:
  - Resume Builder
  - Resume Scorer
  - Job Search
  - Mock Interview
  - Cover Letter Generator
- Interview schedule section showing upcoming interviews
- Job recommendations section (skill-based matching)
- Activity tracking (last 7 days)
- Career Coach chatbot integration

**Technologies Used:**
- React Hooks (useState, useEffect)
- Axios for API calls
- LocalStorage for resume data
- React Router for navigation

---

### 2. **Resume Builder** (`/candidate/resume-builder/:id?`)
**File:** `client/src/pages/candidate/ResumeBuilder.jsx`

**Purpose:** Create and edit resumes with multiple templates

**Features:**
- 13 professional resume templates
- Form-based resume creation with sections:
  - Personal Information
  - Profile Summary
  - Education
  - Work Experience
  - Projects
  - Skills
  - Certifications
  - Languages
  - Strengths
  - Extra Sections
- Live preview of resume
- Template selection and switching
- AI-powered resume generation
- PDF export functionality
- DOCX export functionality
- Resume validation with Zod schemas
- Content suggestions and tips
- Save to backend and localStorage
- Zoom controls for preview

**Technologies Used:**
- React Hook Form for form management
- Zod for validation
- jsPDF for PDF generation
- html2canvas for HTML to PDF conversion
- docx library for DOCX export
- Axios for AI API calls

---

### 3. **My Resumes** (`/candidate/my-resumes`)
**File:** `client/src/pages/candidate/MyResumes.jsx`

**Purpose:** Manage all created resumes

**Features:**
- List all saved resumes (backend + local)
- Resume cards with preview information
- Quick actions: Edit, Download PDF, Delete
- Resume name editing
- Time ago display for last updated
- Empty state when no resumes exist
- Merge functionality for local and backend resumes
- PDF download with template rendering

**Technologies Used:**
- LocalStorage for local resume storage
- Backend API for resume retrieval
- jsPDF and html2canvas for PDF generation
- Template rendering for preview

---

### 4. **Job Search** (`/candidate/job-search`)
**File:** `client/src/pages/candidate/JobSearch.jsx`

**Purpose:** Search and browse job opportunities

**Features:**
- Search jobs by keyword
- Location-based filtering
- Skill tags input
- Integration with Remotive API (external job board)
- Integration with JSearch API (external job board)
- Job cards with company information
- Apply functionality with resume selection
- Application tracking
- Job details modal
- Mock jobs fallback
- Race condition handling for API calls

**Technologies Used:**
- Axios for external API calls (Remotive, JSearch)
- React useRef for race condition handling
- LocalStorage for resume selection
- Backend API for application submission

---

### 5. **Applied Jobs** (`/candidate/applied-jobs`)
**File:** `client/src/pages/candidate/AppliedJobs.jsx`

**Purpose:** Track all job applications

**Features:**
- List all applications with status
- Status filtering (All, Applied, In Review, Shortlisted, Rejected, Hired)
- Status badges with color coding
- Search functionality
- Application cancellation
- Job details view
- External link to job posting
- Status timeline view
- Empty state handling

**Technologies Used:**
- Backend API for fetching applications
- React Router for navigation with state
- Status management and filtering

---

### 6. **Resume Scorer** (`/candidate/resume-scorer`)
**File:** `client/src/pages/candidate/ResumeScorer.jsx`

**Purpose:** ATS (Applicant Tracking System) resume scoring

**Features:**
- Resume selection dropdown
- Job description input
- AI-powered resume analysis
- Match score (0-100)
- Missing keywords detection
- Improvement tips
- Summary of analysis
- Visual score display
- Tips for ATS optimization

**Technologies Used:**
- AI API for resume scoring
- Resume data normalization
- Axios for API calls
- LocalStorage for resume loading

---

### 7. **Mock Interview** (`/candidate/mock-interview`)
**File:** `client/src/pages/candidate/MockInterview.jsx`

**Purpose:** Practice interviews with AI evaluation

**Features:**
- Interview setup form (role, skills, experience level)
- Resume selection for context
- AI-powered question generation
- Video recording capability (via WebRTC)
- Question navigation
- Answer submission
- AI evaluation of answers:
  - Overall rating
  - Confidence score
  - Clarity score
  - Relevance score
  - Improvement suggestions
  - Ideal answer examples
- Interview completion summary
- Speech-to-text transcription (optional)

**Technologies Used:**
- React Webcam for video recording
- MediaRecorder API
- AI API for question generation and evaluation
- Browser Speech Recognition API
- LocalStorage for resume data

---

### 8. **Cover Letter Generator** (`/candidate/cover-letter`)
**File:** `client/src/pages/candidate/CoverLetterGenerator.jsx`

**Purpose:** Generate personalized cover letters

**Features:**
- Resume selection
- Job details input (company, title, description)
- AI-powered cover letter generation
- Generated letter preview
- Copy to clipboard
- Download as DOC file
- Regenerate functionality
- Professional formatting

**Technologies Used:**
- AI API for cover letter generation
- LocalStorage for resume data
- Browser clipboard API
- DOC file generation

---

### 9. **Candidate Interviews** (`/candidate/interviews`)
**File:** `client/src/pages/candidate/CandidateInterviews.jsx`

**Purpose:** View scheduled interviews

**Features:**
- List all scheduled interviews
- Interview details (date, time, platform, link)
- Interview status tracking
- Meeting link access
- Interview history
- Upcoming interviews highlight
- Countdown timer for next interview
- Copy meeting link functionality

**Technologies Used:**
- Backend API for interview data
- React Router for navigation
- Date formatting utilities
- Timer functionality

---

### 10. **Candidate Assessments** (`/candidate/assessments`)
**File:** `client/src/pages/candidate/CandidateAssessments.jsx`

**Purpose:** View and take assigned MCQ assessments

**Features:**
- List assigned assessments
- Assessment status (Pending, In Progress, Completed)
- Take assessment functionality
- Question display with multiple choice options
- Timer functionality (countdown)
- Proctoring (tab switch detection)
- Submit assessment
- Score display
- Assessment history
- Warning system for violations

**Technologies Used:**
- Backend API for assessments
- Timer management
- Form handling for answers
- Browser visibility API for proctoring

---

### 11. **Messages Page** (`/candidate/messages`)
**File:** `client/src/pages/candidate/MessagesPage.jsx`

**Purpose:** Internal messaging system

**Features:**
- Inbox view
- Conversation threads
- Send messages
- Read/unread status
- Message timestamps
- Chat interface

**Technologies Used:**
- Backend API for messages
- Real-time polling for new messages
- React state management

---

### 12. **Subscription** (`/candidate/subscription`)
**File:** `client/src/pages/candidate/Subscription.jsx`

**Purpose:** Manage subscription and payments

**Features:**
- Subscription plans display
- Payment integration (Razorpay)
- Current subscription status
- Upgrade/downgrade options
- Payment history
- Subscription cancellation
- Razorpay checkout integration

**Technologies Used:**
- Razorpay payment gateway
- Backend API for subscription management
- Razorpay checkout script
- React state for payment flow

---

### 13. **Settings** (`/candidate/settings`)
**File:** `client/src/pages/candidate/Settings.jsx`

**Purpose:** Application settings and preferences

**Features:**
- Settings menu with navigation
- Profile settings link
- Change password link
- Notification preferences
- Language selection
- Two-factor authentication
- Account preferences
- Subscription cancellation

**Technologies Used:**
- React Router for navigation
- Backend API for preferences
- Form handling for settings

---

### 14. **Profile Settings** (`/candidate/profile-settings`)
**File:** `client/src/pages/candidate/ProfileSettings.jsx`

**Purpose:** Edit user profile information

**Features:**
- Edit name, email, bio
- Profile picture (if implemented)
- Save changes
- Form validation

**Technologies Used:**
- React Hook Form
- Backend API for profile updates
- Form validation

---

### 15. **Change Password** (`/candidate/change-password`)
**File:** `client/src/pages/candidate/ChangePassword.jsx`

**Purpose:** Change account password

**Features:**
- Current password input
- New password input
- Confirm password input
- Password strength indicator
- Form validation
- Success/error messages

**Technologies Used:**
- React Hook Form
- Backend API for password change
- Password validation

---

## 🏢 HR PAGES

### 1. **HR Dashboard** (`/hr/dashboard`)
**File:** `client/src/pages/hr/Dashboard.jsx`

**Purpose:** Main dashboard for HR professionals

**Features:**
- Statistics cards:
  - Total Candidates (with trend)
  - Hired Candidates (with trend)
  - Active Jobs (with trend)
  - Interviews Scheduled (with trend)
- Application trends chart (last 6 months)
- Recent applications table
- Activity feed
- Quick navigation to key sections
- Clickable stats for detailed views

**Technologies Used:**
- Backend API for statistics
- Recharts for data visualization
- Custom chart widgets
- Heatmap widget

---

### 2. **HR Applications** (`/hr/candidates`)
**File:** `client/src/pages/hr/HRApplications.jsx`

**Purpose:** Manage candidate applications

**Features:**
- List all applications with candidate details
- Status filtering (Applied, In Review, Shortlisted, Rejected, Hired, etc.)
- Search functionality
- Application status update
- Resume viewing (all 13 templates supported)
- Candidate profile view
- Send message to candidate
- Schedule interview
- Add notes to candidates
- Bulk actions
- Application details modal
- Export functionality

**Technologies Used:**
- Backend API for applications
- Resume template rendering
- Chat dialog component
- Status management
- Filtering and search

---

### 3. **HR Jobs** (`/hr/jobs`)
**File:** `client/src/pages/hr/HRJobs.jsx`

**Purpose:** Manage job postings

**Features:**
- List all posted jobs
- Job status filtering (All, Open, Closed, Draft)
- Search functionality
- View job details
- Edit job posting
- Delete job posting
- Update job status (Open/Closed)
- Applicant count display
- Grid/List view toggle
- Create new job button

**Technologies Used:**
- Backend API for jobs
- React Router for navigation
- Modal dialogs for actions

---

### 4. **Post Job** (`/hr/post-job` or `/hr/jobs/edit/:id`)
**File:** `client/src/pages/hr/PostJob.jsx`

**Purpose:** Create or edit job postings

**Features:**
- Job posting form:
  - Title, Company, Location
  - Job Type (Full-time, Part-time, Contract, etc.)
  - Work Mode (On-site, Remote, Hybrid)
  - Description (rich text)
  - Requirements (multi-line)
  - Salary range (min/max)
- Create new job
- Edit existing job
- Form validation
- Success/error handling
- Auto-save draft (if implemented)

**Technologies Used:**
- React Hook Form (implied)
- Backend API for job creation/update
- React Router useParams for edit mode

---

### 5. **HR Meetings** (`/hr/meetings`)
**File:** `client/src/pages/hr/HRMeetings.jsx`

**Purpose:** Manage scheduled interviews

**Features:**
- List all scheduled interviews
- Filter by status (Upcoming, Completed, Cancelled)
- Interview details:
  - Candidate name
  - Job role
  - Date and time
  - Platform (Zoom, Google Meet, Phone, In-Person)
  - Meeting link
  - Meeting password
- Cancel interview with reason
- Candidate notification option
- Chat with candidate
- Search functionality
- Meeting link generation

**Technologies Used:**
- Backend API for interviews
- Chat dialog component
- Zoom/Google Meet integration
- Date formatting

---

### 6. **HR MCQ** (`/hr/mcq-creator`)
**File:** `client/src/pages/hr/HRMCQ.jsx`

**Purpose:** Create and manage MCQ assessments

**Features:**
- Dashboard view with assessment list
- Assessment statistics
- Create new assessment
- Edit existing assessment
- Delete assessment
- AI-powered question generation
- Manual question creation
- Question editor:
  - Question text
  - 4 multiple choice options
  - Correct answer selection
  - Add/remove questions
- Assign assessment to candidates
- View assessment results
- Results dashboard
- Candidate performance tracking

**Technologies Used:**
- Backend API for assessments
- AI API for question generation
- Form management for questions
- Result tracking

---

### 7. **HR Messages** (`/hr/messages`)
**File:** `client/src/pages/hr/HRMessages.jsx`

**Purpose:** Internal messaging system for HR

**Features:**
- Inbox view
- Conversation threads with candidates
- Send messages
- Reply to messages
- Read/unread status
- Message search
- Delete messages (single or bulk)
- Candidate selection

**Technologies Used:**
- Backend API for messages
- Real-time polling
- Chat interface components

---

### 8. **HR Settings** (`/hr/settings`)
**File:** `client/src/pages/hr/HRSettings.jsx`

**Purpose:** HR account settings

**Features:**
- Settings menu
- Profile settings link
- Change password link
- Notification preferences
- Account settings

**Technologies Used:**
- React Router navigation
- Backend API for preferences

---

### 9. **HR Profile Settings** (`/hr/settings/profile`)
**File:** `client/src/pages/hr/HRProfileSettings.jsx`

**Purpose:** Edit HR profile information

**Features:**
- Edit name, email, bio
- Company information
- Profile picture (if implemented)
- Save changes

**Technologies Used:**
- React Hook Form
- Backend API for profile updates

---

### 10. **HR Change Password** (`/hr/settings/change-password`)
**File:** `client/src/pages/hr/HRChangePassword.jsx`

**Purpose:** Change HR account password

**Features:**
- Current password input
- New password input
- Confirm password input
- Password validation
- Success/error messages

**Technologies Used:**
- React Hook Form
- Backend API for password change

---

## 📊 PAGE FEATURES SUMMARY

### Common Features Across Pages:
- **Layout Wrapper:** All pages use Layout component (Candidate or HR)
- **Authentication:** All pages require authentication
- **Loading States:** Loading indicators during data fetching
- **Error Handling:** Error messages and fallback states
- **Responsive Design:** Mobile-friendly layouts
- **Navigation:** React Router for page navigation
- **API Integration:** Axios for backend communication
- **State Management:** React Hooks (useState, useEffect)
- **Form Handling:** React Hook Form for forms
- **Validation:** Zod schemas for validation

### Page Statistics:
- **Total Candidate Pages:** 15 pages
- **Total HR Pages:** 10 pages
- **Total Pages:** 25 pages

---

## 📚 ADDITIONAL RESOURCES

### Documentation Links
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Razorpay Documentation](https://razorpay.com/docs)
- [Groq API Documentation](https://console.groq.com/docs)
- [Google Gemini API Documentation](https://ai.google.dev/docs)

---

## ✅ TECHNOLOGY CHECKLIST

- ✅ React 19 for frontend
- ✅ Express.js for backend
- ✅ MongoDB for database
- ✅ JWT for authentication
- ✅ Tailwind CSS for styling
- ✅ Razorpay for payments
- ✅ Multiple AI providers (Groq, Gemini, Perplexity)
- ✅ Zoom & Google Meet integration
- ✅ PDF/DOCX generation
- ✅ Video recording support
- ✅ Real-time features (polling)
- ✅ Responsive design
- ✅ RESTful API architecture

---

*This document provides a comprehensive overview of all technologies, APIs, and tools used in the Smart Career hub v3 project. Keep this document updated as new technologies are added or existing ones are updated.*


