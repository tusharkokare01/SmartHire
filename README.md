# Smart Career hub v3 - Recruitment Platform

A comprehensive recruitment platform with two user roles: **Candidate** (Job Seeker) and **HR** (Recruiter).

## 🎯 Features

### Candidate Features

- **Resume Builder**: Create professional resumes with AI assistance
- **Job Search**: Find jobs based on your skills
- **Mock Interview**: Practice interviews with AI evaluation

### HR Features

- **Resume Browsing**: View and manage candidate resumes
- **Candidate Management**: Contact and manage candidates
- **Meeting Scheduler**: Schedule and manage interviews
- **MCQ Creator**: Create aptitude test papers

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Install additional packages** (for full functionality)

   ```bash
   npm install jspdf html2canvas docx react-webcam react-hook-form react-toastify date-fns
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   └── common/          # Reusable components (Layout, ProtectedRoute)
│   ├── contexts/           # React Context (AuthContext)
│   ├── pages/
│   │   ├── auth/           # Login, Register pages
│   │   ├── candidate/      # Candidate pages (Dashboard, ResumeBuilder, JobSearch, MockInterview)
│   │   └── hr/             # HR pages (Dashboard, Resumes, Candidates, Meetings, MCQ)
│   ├── services/           # API service (api.js)
│   ├── utils/              # Constants and utilities
│   ├── App.jsx             # Main app component with routing
│   └── main.jsx            # Entry point
├── public/
└── package.json
```

## 🛠️ Technology Stack

### Frontend

- **React 19** - UI Framework
- **Vite** - Build tool
- **React Router DOM** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend (To Be Implemented)

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- OpenAI/Gemini API (for AI features)

## 📋 User Roles

### Candidate Role

1. **Resume Builder**

   - Personal information form
   - Education, experience, skills
   - Multiple template options
   - PDF/DOCX export (to be implemented)
   - AI resume generation (to be implemented)

2. **Job Search**

   - Skill-based job search
   - Job recommendations
   - Company details
   - Application redirection

3. **Mock Interview**
   - Video recording (to be implemented)
   - AI evaluation (to be implemented)
   - Feedback and suggestions

### HR Role

1. **Resume Management**

   - Browse all candidate resumes
   - Filter and search
   - View candidate profiles
   - Download resumes

2. **Candidate Management**

   - View candidate list
   - Contact candidates
   - Track candidate status

3. **Meeting Scheduler**

   - Schedule interviews
   - Manage meetings
   - Calendar view

4. **MCQ Creator**
   - Create aptitude tests
   - Multiple choice questions
   - Assign to candidates

## 🔐 Authentication

- JWT-based authentication
- Role-based access control (Candidate/HR)
- Protected routes
- Secure password storage (backend)

## 📝 API Endpoints (To Be Implemented)

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Resume

- `POST /api/resume` - Save resume
- `GET /api/resume` - Get user's resume
- `POST /api/resume/generate` - AI generate resume

### Jobs

- `POST /api/jobs/search` - Search jobs by skills
- `GET /api/jobs` - Get all jobs

### Interview

- `POST /api/interview/evaluate` - Evaluate interview

### HR

- `GET /api/hr/resumes` - Get all resumes
- `POST /api/hr/meetings` - Schedule meeting
- `POST /api/hr/mcq` - Create MCQ paper

## 🎨 UI/UX Features

- Modern, clean design
- Responsive layout (mobile-friendly)
- Professional color scheme
- Intuitive navigation
- Loading states
- Error handling

## 📚 Documentation

- `PROJECT_PLAN.md` - Complete project plan and technology recommendations
- `SETUP_GUIDE.md` - Detailed setup instructions
- `IMPLEMENTATION_ROADMAP.md` - 7-day implementation roadmap

## 🚧 Current Status

### ✅ Completed

- Project structure
- Authentication UI (Login/Register)
- Candidate dashboard and all pages
- HR dashboard and all pages
- Routing and navigation
- Protected routes
- Basic UI components

### 🔄 In Progress

- Backend API integration
- PDF/DOCX export
- Video recording
- AI features

### 📋 To Do

- Backend server setup
- Database models
- API endpoints
- File export functionality
- Video recording integration
- AI integration

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_OPENAI_API_KEY=your_api_key_here
```

## 🤝 Contributing

This is a project in development. Follow the implementation roadmap for adding features.

## 📄 License

This project is for educational/demonstration purposes.

## 🆘 Support

For setup issues, refer to `SETUP_GUIDE.md`
For implementation details, refer to `IMPLEMENTATION_ROADMAP.md`

---

**Built with ❤️ using React + Vite**

