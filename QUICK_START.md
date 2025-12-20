# Quick Start Guide - SmartRecruit v3

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install base dependencies
npm install

# Install additional packages for full functionality
npm install jspdf html2canvas docx react-webcam react-hook-form react-toastify date-fns
```

**If you get PowerShell errors:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Open Browser

Navigate to: `http://localhost:5173`

## 🎯 Test the Application

### As a Candidate:
1. Click "Sign up"
2. Select "Candidate" role
3. Fill in registration form
4. You'll be redirected to Candidate Dashboard
5. Explore:
   - Resume Builder
   - Job Search
   - Mock Interview

### As HR:
1. Click "Sign up"
2. Select "HR Recruiter" role
3. Fill in registration form
4. You'll be redirected to HR Dashboard
5. Explore:
   - Browse Resumes
   - Candidates
   - Meetings
   - MCQ Creator

## 📝 Current Status

### ✅ What Works Now:
- ✅ User registration and login UI
- ✅ Role-based routing
- ✅ Candidate dashboard and all pages
- ✅ HR dashboard and all pages
- ✅ Navigation and protected routes
- ✅ Beautiful, responsive UI

### ⚠️ What Needs Backend:
- ⚠️ Actual authentication (currently uses localStorage)
- ⚠️ Resume saving/loading
- ⚠️ PDF/DOCX export
- ⚠️ Job search (currently shows mock data)
- ⚠️ Video recording
- ⚠️ AI features

## 🔧 Next Steps

1. **Set up Backend** (See `IMPLEMENTATION_ROADMAP.md`)
   - Create Node.js/Express server
   - Set up MongoDB
   - Implement authentication API

2. **Add Export Features**
   - Implement PDF export
   - Implement DOCX export

3. **Integrate APIs**
   - Connect frontend to backend
   - Add real data fetching

## 📚 Documentation Files

- `README.md` - Project overview
- `PROJECT_PLAN.md` - Complete project plan
- `SETUP_GUIDE.md` - Detailed setup instructions
- `IMPLEMENTATION_ROADMAP.md` - 7-day roadmap
- `QUICK_START.md` - This file

## 🐛 Troubleshooting

### Port Already in Use
Change port in `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

### Module Not Found
Run `npm install` again

### Styling Issues
Make sure Tailwind CSS is properly configured in `tailwind.config.js`

## 💡 Tips

- Use browser DevTools to see API calls
- Check console for any errors
- All forms are functional but need backend integration
- Mock data is used where backend is not connected

---

**Ready to build? Check `IMPLEMENTATION_ROADMAP.md` for the 7-day plan!**

