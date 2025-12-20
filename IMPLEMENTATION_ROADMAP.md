# SmartRecruit v3 - Implementation Roadmap (7 Days)

## ✅ Day 1-2: Foundation Complete
- [x] Project structure setup
- [x] Routing configuration
- [x] Authentication pages (Login/Register)
- [x] Role-based routing (Candidate/HR)
- [x] Dashboard layouts
- [x] All UI components created

## 📋 Remaining Tasks

### Day 3: Backend Setup & Authentication
**Priority: HIGH**

1. **Backend Server Setup**
   - Create Node.js/Express server
   - Set up MongoDB connection
   - Configure environment variables
   - Set up CORS middleware

2. **Authentication API**
   - Implement user registration endpoint
   - Implement login endpoint with JWT
   - Password hashing with bcrypt
   - User model schema (name, email, password, role)

3. **Database Models**
   - User model
   - Resume model
   - Job model
   - Interview model
   - Meeting model
   - MCQ model

**Files to Create:**
```
server/
├── models/
│   ├── User.js
│   ├── Resume.js
│   ├── Job.js
│   ├── Interview.js
│   ├── Meeting.js
│   └── MCQ.js
├── routes/
│   ├── auth.js
│   ├── resume.js
│   ├── jobs.js
│   ├── interview.js
│   └── hr.js
├── middleware/
│   └── auth.js
├── config/
│   └── database.js
└── server.js
```

### Day 4: Resume Builder & Export Features
**Priority: HIGH**

1. **Resume API Integration**
   - Save resume data endpoint
   - Get resume endpoint
   - Update resume endpoint

2. **PDF Export**
   - Install and configure jsPDF
   - Create resume PDF template
   - Implement download functionality

3. **DOCX Export**
   - Install and configure docx library
   - Create resume DOCX template
   - Implement download functionality

4. **AI Resume Generation** (Optional but Recommended)
   - Integrate OpenAI API
   - Create prompt for resume generation
   - Format AI response into resume structure

**Implementation Steps:**
```javascript
// PDF Export Example
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const exportToPDF = async () => {
  const element = document.getElementById('resume-preview');
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  pdf.addImage(imgData, 'PNG', 0, 0);
  pdf.save('resume.pdf');
};
```

### Day 5: Job Search & Mock Interview
**Priority: MEDIUM**

1. **Job Search Backend**
   - Create job database/model
   - Implement skill-based job matching algorithm
   - Job recommendation API endpoint
   - Seed database with sample jobs

2. **Mock Interview Video Recording**
   - Integrate react-webcam
   - Implement MediaRecorder API
   - Video upload to backend/storage
   - Video playback functionality

3. **Interview Evaluation** (AI Integration)
   - Integrate AI API for evaluation
   - Analyze video/audio for:
     - Confidence score
     - Speech clarity
     - Answer relevance
     - Body language (basic)
   - Generate feedback report

**Video Recording Implementation:**
```javascript
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user'
};

const [recording, setRecording] = useState(false);
const [recordedChunks, setRecordedChunks] = useState([]);

const startRecording = () => {
  setRecording(true);
  // MediaRecorder setup
};

const stopRecording = () => {
  setRecording(false);
  // Process video chunks
};
```

### Day 6: HR Features Backend
**Priority: HIGH**

1. **Resume Browsing**
   - API to fetch all candidate resumes
   - Filter and search functionality
   - Resume detail endpoint

2. **Candidate Management**
   - Candidate list API
   - Contact candidate functionality
   - Candidate status management

3. **Meeting Scheduler**
   - Create meeting endpoint
   - Get meetings endpoint
   - Update/delete meeting endpoints
   - Email notification (optional)

4. **MCQ Paper Creator**
   - Save MCQ paper endpoint
   - Get MCQ papers endpoint
   - Assign MCQ to candidates
   - MCQ submission tracking

### Day 7: Polish, Testing & Deployment
**Priority: HIGH**

1. **Error Handling**
   - Add error boundaries
   - Form validation
   - API error handling
   - User-friendly error messages

2. **Loading States**
   - Add loading spinners
   - Skeleton screens
   - Progress indicators

3. **Responsive Design**
   - Test on mobile devices
   - Fix responsive issues
   - Optimize for tablets

4. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Bundle size optimization

5. **Testing**
   - Test all user flows
   - Fix bugs
   - Cross-browser testing

6. **Deployment**
   - Frontend: Vercel/Netlify
   - Backend: Railway/Heroku/Render
   - Database: MongoDB Atlas
   - Environment variables setup

## 🛠️ Technology Stack Summary

### Frontend (✅ Complete)
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React

### Backend (To Be Implemented)
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt
- Multer (for file uploads)
- OpenAI API / Gemini API

### Additional Frontend Packages Needed
```bash
npm install jspdf html2canvas docx react-webcam react-hook-form react-toastify date-fns
```

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('candidate' | 'hr'),
  createdAt: Date,
  updatedAt: Date
}
```

### Resume Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  personalInfo: Object,
  profileSummary: String,
  education: Array,
  experience: Array,
  skills: Array,
  projects: Array,
  certifications: Array,
  languages: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Job Collection
```javascript
{
  _id: ObjectId,
  company: String,
  role: String,
  skills: Array,
  location: String,
  description: String,
  website: String,
  createdAt: Date
}
```

### Interview Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  question: String,
  videoUrl: String,
  evaluation: Object,
  createdAt: Date
}
```

### Meeting Collection
```javascript
{
  _id: ObjectId,
  hrId: ObjectId (ref: User),
  candidateId: ObjectId (ref: User),
  candidateName: String,
  position: String,
  date: Date,
  time: String,
  type: String,
  location: String,
  status: String,
  createdAt: Date
}
```

### MCQ Collection
```javascript
{
  _id: ObjectId,
  hrId: ObjectId (ref: User),
  title: String,
  duration: Number,
  questions: Array,
  createdAt: Date
}
```

## 🎯 Quick Wins (Can Be Done Quickly)

1. **Add Toast Notifications**
   - Install react-toastify
   - Add to App.jsx
   - Use for success/error messages

2. **Form Validation**
   - Add react-hook-form
   - Implement validation rules
   - Better UX

3. **Loading States**
   - Add loading spinners to all async operations
   - Better user feedback

4. **Error Boundaries**
   - Catch React errors
   - Display friendly error messages

## 🔥 Critical Path (Must Have)

1. Backend authentication ✅ (Day 3)
2. Resume save/load ✅ (Day 4)
3. PDF export ✅ (Day 4)
4. Job search backend ✅ (Day 5)
5. HR resume browsing ✅ (Day 6)
6. Meeting scheduler ✅ (Day 6)

## 💡 Nice to Have (Can Skip if Time Short)

1. AI resume generation
2. AI interview evaluation
3. Video recording (can use mock data)
4. MCQ assignment to candidates
5. Email notifications

## 📝 Notes

- Focus on core functionality first
- Mock data is acceptable for demo
- Can use localStorage for temporary data storage
- Backend can be simplified initially
- Add features incrementally

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection string set
- [ ] CORS configured properly
- [ ] API endpoints tested
- [ ] Frontend build successful
- [ ] Backend deployed and accessible
- [ ] Database accessible from backend
- [ ] All features working in production

