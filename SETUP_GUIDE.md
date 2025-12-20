# SmartRecruit v3 - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Additional Packages** (if npm install fails due to PowerShell policy)
   ```bash
   npm install jspdf html2canvas docx react-webcam react-hook-form zustand react-toastify date-fns
   ```

   If you encounter PowerShell execution policy errors, run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:5173`

## 📦 Required Packages

The following packages need to be installed for full functionality:

### Core Dependencies
- `jspdf` - PDF generation
- `html2canvas` - HTML to canvas conversion for PDF
- `docx` - DOCX file generation
- `react-webcam` - Video recording for mock interviews
- `react-hook-form` - Form management
- `zustand` - State management (optional, Context API is used)
- `react-toastify` - Toast notifications
- `date-fns` - Date formatting

### Already Installed
- `react` - UI framework
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - Styling
- `lucide-react` - Icons

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## 🏗️ Project Structure

```
client/
├── src/
│   ├── components/
│   │   └── common/          # Reusable components
│   ├── contexts/            # React Context (Auth)
│   ├── pages/
│   │   ├── auth/            # Login, Register
│   │   ├── candidate/       # Candidate pages
│   │   └── hr/              # HR pages
│   ├── services/            # API calls
│   ├── utils/               # Helper functions
│   └── App.jsx              # Main app component
├── public/
└── package.json
```

## 🔐 Authentication

The app uses JWT-based authentication. The auth context stores:
- User data
- Authentication token
- Login/logout functions

## 🎨 Features Implemented

### Candidate Features
- ✅ Dashboard
- ✅ Resume Builder (UI complete, needs PDF/DOCX export)
- ✅ Job Search (UI complete, needs backend integration)
- ✅ Mock Interview (UI complete, needs video recording)

### HR Features
- ✅ Dashboard
- ✅ Resume Browsing
- ✅ Candidate Management
- ✅ Meeting Scheduler
- ✅ MCQ Paper Creator

## 🔌 Backend Integration

### API Endpoints Needed

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Resume
- `POST /api/resume` - Save resume
- `GET /api/resume` - Get user's resume
- `POST /api/resume/generate` - AI generate resume
- `GET /api/resume/:id` - Get resume by ID

#### Jobs
- `POST /api/jobs/search` - Search jobs by skills
- `GET /api/jobs` - Get all jobs

#### Interview
- `POST /api/interview/start` - Start interview session
- `POST /api/interview/evaluate` - Evaluate interview recording

#### HR Endpoints
- `GET /api/hr/resumes` - Get all candidate resumes
- `GET /api/hr/candidates` - Get all candidates
- `POST /api/hr/meetings` - Schedule meeting
- `POST /api/hr/mcq` - Create MCQ paper

## 🎯 Next Steps

1. **Backend Development**
   - Set up Node.js/Express server
   - Configure MongoDB database
   - Implement authentication endpoints
   - Create API routes for all features

2. **AI Integration**
   - Integrate OpenAI/Gemini API for resume generation
   - Implement interview evaluation AI
   - Add job recommendation algorithm

3. **File Export**
   - Implement PDF export using jsPDF
   - Implement DOCX export using docx library

4. **Video Recording**
   - Integrate react-webcam
   - Implement video upload to backend
   - Add video playback functionality

5. **Testing**
   - Test all user flows
   - Fix any bugs
   - Optimize performance

## 📝 Notes

- All forms are currently using local state management
- Backend API calls are mocked/placeholder
- Video recording needs MediaRecorder API integration
- PDF/DOCX export needs implementation
- AI features require API keys and backend integration

## 🐛 Troubleshooting

### PowerShell Execution Policy Error
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use
Change the port in `vite.config.js` or kill the process using port 5173

### Module Not Found
Run `npm install` again to ensure all dependencies are installed

## 📚 Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vite.dev)

