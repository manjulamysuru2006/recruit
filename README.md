# Aayush - AI-Powered Recruitment Platform# Aayush - AI-Powered Recruitment Platform



A modern, full-stack recruitment platform built with Next.js 14, featuring AI-powered job matching, ATS resume scanning, and real-time messaging between candidates and recruiters.A comprehensive, feature-rich recruitment platform with separate portals for recruiters and candidates, powered by machine learning models for intelligent job matching and recommendations.



## 🚀 Features## 🚀 Features



### For Candidates### For Candidates

- **Smart Job Search**: Browse and search jobs with advanced filters- **AI-Powered Job Recommendations**: Machine learning algorithms match candidates with perfect job opportunities

- **AI Resume Scanner (ATS)**: Analyze your resume compatibility with job descriptions- **Smart Resume Builder**: Build and optimize resumes with AI assistance

- **ML-Powered Matching**: Get personalized job recommendations based on your profile- **Application Tracking**: Track all applications with real-time status updates

- **Application Tracking**: Monitor all your job applications in one place- **Skill Recommendations**: Get personalized skill recommendations based on career goals

- **Real-time Messaging**: Communicate directly with recruiters- **Salary Insights**: ML-powered salary predictions based on skills and experience

- **Profile Management**: Build and maintain your professional profile- **Interview Scheduling**: Schedule and manage video interviews

- **Real-time Chat**: Communicate directly with recruiters

### For Recruiters- **Career Analytics**: Data-driven insights on career growth

- **Job Posting**: Create and manage job listings

- **Application Management**: Review applications with AI match scores### For Recruiters

- **Interview Pipeline**: Track candidates through interview stages- **Intelligent Candidate Matching**: AI-powered candidate recommendations for job postings

- **Analytics Dashboard**: View hiring metrics and trends- **Advanced Job Posting**: Create detailed job listings with ML-based requirements analysis

- **Candidate Messaging**: Engage with applicants in real-time- **Application Management**: Comprehensive ATS (Applicant Tracking System)

- **ATS Integration**: Automated resume parsing and scoring- **Candidate Screening**: Automated resume parsing and candidate scoring

- **Analytics Dashboard**: Deep insights into recruitment metrics

### Technical Features- **Interview Management**: Schedule and track interviews

- **AI/ML Integration**: TensorFlow.js for intelligent matching algorithms- **Team Collaboration**: Add notes and collaborate with hiring team

- **Persistent Messaging**: MongoDB-backed chat system- **Bulk Actions**: Process multiple applications efficiently

- **JWT Authentication**: Secure user authentication

- **Responsive Design**: Mobile-first, modern UI with Tailwind CSS### ML Features

- **Real-time Updates**: Polling mechanism for live data refresh- **Resume Parsing**: Extract skills, experience, and education from resumes

- **RESTful API**: Well-structured API routes- **Job-Candidate Matching**: Neural network-based matching algorithm

- **Salary Prediction**: Predict market-rate salaries based on multiple factors

## 🛠️ Tech Stack- **Skill Gap Analysis**: Identify missing skills for career progression

- **Candidate Scoring**: Automatic scoring based on job requirements

- **Framework**: Next.js 14 (App Router)

- **Language**: TypeScript## 🛠️ Technology Stack

- **Database**: MongoDB with Mongoose ODM

- **Authentication**: JWT (JSON Web Tokens)- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS

- **AI/ML**: TensorFlow.js- **Backend**: Next.js API Routes

- **Styling**: Tailwind CSS- **Database**: MongoDB Atlas (with Mongoose ODM)

- **Icons**: Lucide React- **Authentication**: JWT, bcrypt

- **Deployment**: Vercel (Frontend) / Render (Optional)- **ML/AI**: TensorFlow.js, Natural Language Processing

- **UI Components**: Radix UI, Lucide Icons, Framer Motion

## 📋 Prerequisites- **Charts**: Recharts, Chart.js

- **Real-time**: Socket.io (for chat and notifications)

- Node.js 18+ installed

- MongoDB Atlas account (or local MongoDB)## 📋 Prerequisites

- Git installed

- Node.js 18+ 

## 🔧 Installation & Setup- npm or yarn

- MongoDB Atlas account (connection string provided)

### 1. Clone the Repository

## 🔧 Installation

```bash

git clone <your-github-repo-url>1. **Clone/Navigate to the project**

cd aa   ```bash

```   cd /Users/adi/Desktop/College/aa

   ```

### 2. Install Dependencies

2. **Install dependencies**

```bash   ```bash

npm install   npm install

```   ```



### 3. Environment Variables3. **Environment Setup**

   

Create a `.env.local` file in the root directory:   The `.env.local` file is already configured with:

   ```env

```env   MONGODB_URI=mongodb+srv://Adithya:adi01@cluster0.w8drv7e.mongodb.net/aayush?retryWrites=true&w=majority&appName=Cluster0

# MongoDB Connection   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/recruitment-platform?retryWrites=true&w=majority   NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production

   NEXTAUTH_URL=http://localhost:3000

# JWT Secret (generate a random string)   ```

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

4. **Install additional required package**

# Next.js   ```bash

NEXT_PUBLIC_APP_URL=http://localhost:3000   npm install tailwindcss-animate

```   ```



**Important**: Replace the MongoDB URI with your actual MongoDB Atlas connection string.5. **Run the development server**

   ```bash

### 4. Run Development Server   npm run dev

   ```

```bash

npm run dev6. **Open your browser**

```   Navigate to [http://localhost:3000](http://localhost:3000)



Open [http://localhost:3000](http://localhost:3000) in your browser.## 🗂️ Project Structure



### 5. Build for Production```

aayush/

```bash├── app/

npm run build│   ├── api/

npm start│   │   ├── auth/

```│   │   │   ├── login/route.ts

│   │   │   └── register/route.ts

## 📁 Project Structure│   │   ├── jobs/route.ts

│   │   ├── applications/route.ts

```│   │   └── ml/

aa/│   │       ├── match/route.ts

├── app/                      # Next.js App Router│   │       └── recommend/route.ts

│   ├── api/                  # API Routes│   ├── auth/

│   │   ├── auth/            # Authentication endpoints│   │   ├── login/page.tsx

│   │   ├── jobs/            # Job management│   │   └── register/page.tsx

│   │   ├── applications/    # Application handling│   ├── candidate/

│   │   ├── messages/        # Messaging system│   │   ├── dashboard/page.tsx

│   │   ├── ats/             # ATS scanning│   │   ├── jobs/page.tsx

│   │   └── ml/              # ML recommendations│   │   ├── applications/page.tsx

│   ├── candidate/           # Candidate dashboard pages│   │   ├── messages/page.tsx

│   ├── recruiter/           # Recruiter dashboard pages│   │   └── profile/page.tsx

│   └── auth/                # Login/Register pages│   ├── recruiter/

├── components/              # React components│   │   ├── dashboard/page.tsx

│   ├── ui/                  # UI components│   │   ├── jobs/page.tsx

│   ├── ATSScanner.tsx│   │   ├── candidates/page.tsx

│   └── InterviewPipelineManager.tsx│   │   ├── analytics/page.tsx

├── models/                  # MongoDB Mongoose models│   │   └── settings/page.tsx

│   ├── User.ts│   ├── globals.css

│   ├── Job.ts│   ├── layout.tsx

│   ├── Application.ts│   └── page.tsx

│   ├── Chat.ts├── components/

│   └── ...│   └── ui/

├── lib/                     # Utilities│       └── button.tsx

│   ├── mongodb.ts          # Database connection├── lib/

│   ├── ml-models.ts        # ML utilities│   ├── mongodb.ts

│   └── utils.ts│   ├── ml-models.ts

└── public/                  # Static assets│   └── utils.ts

```├── models/

│   ├── User.ts

## 🌐 API Endpoints│   ├── Job.ts

│   ├── Application.ts

### Authentication│   ├── Chat.ts

- `POST /api/auth/register` - User registration│   └── Notification.ts

- `POST /api/auth/login` - User login├── .env.local

├── next.config.js

### Jobs├── tailwind.config.ts

- `GET /api/jobs` - List all jobs├── tsconfig.json

- `POST /api/jobs` - Create new job (recruiter only)└── package.json

- `GET /api/jobs/[id]` - Get job details```

- `PUT /api/jobs/[id]` - Update job

- `DELETE /api/jobs/[id]` - Delete job## 🎯 Usage



### Applications### For Job Seekers (Candidates)

- `GET /api/applications` - Get user's applications

- `POST /api/applications` - Submit application1. **Register**: Visit `/auth/register?role=candidate`

- `GET /api/applications/[id]` - Get application details2. **Complete Profile**: Add skills, experience, education

- `PUT /api/applications/[id]` - Update application status3. **Browse Jobs**: AI will recommend matching jobs

- `GET /api/jobs/[id]/applications` - Get applications for a job4. **Apply**: Submit applications with one click

5. **Track Progress**: Monitor application status in dashboard

### Messages6. **Communicate**: Chat with recruiters

- `GET /api/messages` - Get all chats for user

- `POST /api/messages` - Create chat or send message### For Recruiters

- `GET /api/messages/[id]` - Get messages for specific application

- `POST /api/messages/[id]` - Send message to application chat1. **Register**: Visit `/auth/register?role=recruiter`

2. **Setup Company Profile**: Add company details

### ML/ATS3. **Post Jobs**: Create detailed job listings

- `POST /api/ats/analyze` - Analyze resume compatibility4. **Review Candidates**: AI-ranked candidate list

- `POST /api/ml/match` - Get ML job matches5. **Schedule Interviews**: Send interview invitations

- `POST /api/ml/recommend` - Get personalized recommendations6. **Make Offers**: Process candidates through pipeline



## 🚀 Deployment## 🤖 ML Models



### Deploy to Vercel (Recommended)### Job Matching Model

- **Type**: Neural Network (TensorFlow.js)

1. **Push to GitHub**- **Architecture**: 

   ```bash  - Input: 50 features (candidate + job)

   git init  - Hidden Layers: 128 → 64 → 32 neurons

   git add .  - Output: Match score (0-100%)

   git commit -m "Initial commit"- **Features**: Skills, experience, location, salary expectations

   git branch -M main

   git remote add origin <your-github-repo>### Salary Prediction Model

   git push -u origin main- **Type**: Regression Model

   ```- **Inputs**: Experience years, skills, location, education

- **Output**: Predicted salary range

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)### Resume Analyzer

   - Click "New Project"- **Type**: NLP-based parser

   - Import your GitHub repository- **Capabilities**: 

   - Configure environment variables:  - Extract skills

     - `MONGODB_URI`  - Parse work experience

     - `JWT_SECRET`  - Identify education

     - `NEXT_PUBLIC_APP_URL` (your vercel domain)  - Score resume quality

   - Click "Deploy"

## 🔐 Authentication Flow

3. **Update MongoDB Network Access**

   - In MongoDB Atlas, go to Network Access1. User registers with email/password

   - Add `0.0.0.0/0` to allow connections from anywhere (Vercel)2. Password hashed with bcrypt (10 rounds)

3. JWT token generated on login (7-day expiry)

### Deploy to Render (Alternative)4. Token stored in localStorage

5. Protected routes verify token

1. Create a new Web Service on Render6. Role-based access control (candidate/recruiter)

2. Connect your GitHub repository

3. Set build command: `npm install && npm run build`## 📊 Database Schema

4. Set start command: `npm start`

5. Add environment variables (same as above)### Users Collection

6. Deploy- Authentication credentials

- Role (candidate/recruiter)

## 🔐 Security Notes- Profile information

- Role-specific data

- **Never commit `.env.local`** - It's already in `.gitignore`

- **Change JWT_SECRET** in production to a strong random string### Jobs Collection

- **Enable MongoDB IP Whitelist** for production (or use 0.0.0.0/0 for Vercel)- Job details

- **Use HTTPS** in production (automatically handled by Vercel)- Requirements & responsibilities

- Salary range

## 🐛 Known Issues & Fixes- Status tracking



- **Messages not persisting**: Fixed - now using MongoDB Chat model### Applications Collection

- **Recruiter can't see applications**: Fixed - created proper API endpoints- Job-candidate linking

- **ATS scanner errors**: Fixed - updated MongoDB connection imports- Application status

- **Field name mismatches**: Fixed - standardized salary fields- ML match scores

- Interview data

## 📝 Environment Variables Reference- Timeline tracking



| Variable | Description | Example |## 🎨 UI/UX Features

|----------|-------------|---------|

| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |- **Responsive Design**: Works on all devices

| `JWT_SECRET` | Secret key for JWT tokens | `your-random-secret-key` |- **Modern Animations**: Framer Motion for smooth transitions

| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |- **Gradient Themes**: Beautiful color schemes

- **Icon System**: Lucide React icons

## 🤝 Contributing- **Dark Mode Ready**: Theme infrastructure in place

- **Loading States**: Skeleton screens and spinners

1. Fork the repository- **Error Handling**: User-friendly error messages

2. Create your feature branch (`git checkout -b feature/amazing-feature`)

3. Commit your changes (`git commit -m 'Add some amazing feature'`)## 🚀 API Endpoints

4. Push to the branch (`git push origin feature/amazing-feature`)

5. Open a Pull Request### Authentication

- `POST /api/auth/register` - Register new user

## 📄 License- `POST /api/auth/login` - Login user



This project is licensed under the MIT License.### Jobs

- `GET /api/jobs` - List all jobs

## 🙋‍♂️ Support- `POST /api/jobs` - Create job (recruiter only)

- `GET /api/jobs/:id` - Get job details

For issues or questions, please open an issue on GitHub.- `PUT /api/jobs/:id` - Update job



## 🎯 Roadmap### Applications

- `POST /api/applications` - Submit application

- [ ] WebSocket integration for real-time messaging- `GET /api/applications` - Get user applications

- [ ] Email notifications- `PUT /api/applications/:id` - Update application status

- [ ] Resume upload and parsing

- [ ] Video interview scheduling### ML APIs

- [ ] Advanced analytics- `POST /api/ml/match` - Calculate job-candidate match

- [ ] Multi-language support- `POST /api/ml/recommend` - Get job recommendations

- [ ] Mobile app (React Native)- `POST /api/ml/salary` - Predict salary

- `POST /api/ml/skills` - Recommend skills

---

## 🔄 Development Workflow

**Built with ❤️ using Next.js and modern web technologies**

1. **Start Development**: `npm run dev`
2. **Build for Production**: `npm run build`
3. **Start Production**: `npm start`
4. **Lint Code**: `npm run lint`

## 📱 Pages Overview

### Public Pages
- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page

### Candidate Pages
- `/candidate/dashboard` - Overview & stats
- `/candidate/jobs` - Job search & browse
- `/candidate/applications` - Application tracking
- `/candidate/messages` - Chat with recruiters
- `/candidate/profile` - Profile management

### Recruiter Pages
- `/recruiter/dashboard` - Recruitment overview
- `/recruiter/jobs` - Job management
- `/recruiter/candidates` - Candidate pool
- `/recruiter/analytics` - Recruitment metrics
- `/recruiter/settings` - Account settings

## 🎯 Key Highlights

✅ **Dual Login System** - Separate portals for candidates and recruiters
✅ **ML-Powered** - TensorFlow.js models for matching and predictions
✅ **Real-time Features** - Live chat and notifications
✅ **Beautiful UI** - Modern, gradient-based design system
✅ **Fully Responsive** - Mobile, tablet, and desktop optimized
✅ **Type Safe** - Full TypeScript implementation
✅ **Scalable Architecture** - Modular and maintainable code
✅ **Production Ready** - Error handling and validation

## 🐛 Troubleshooting

If you encounter TypeScript errors during development, run:
```bash
npm install
```

The errors shown are due to packages not being installed yet. They will resolve after running npm install.

## 📝 Next Steps

1. Install dependencies: `npm install`
2. Install missing package: `npm install tailwindcss-animate`
3. Start dev server: `npm run dev`
4. Register as a candidate or recruiter
5. Explore the platform!

## 🤝 Contributing

This is a college project. For any issues or suggestions, please create an issue in the repository.

## 📄 License

This project is for educational purposes.

---

**Built with ❤️ for Aayush's Major Project**
