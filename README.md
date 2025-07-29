# Wedding Memories App

A beautiful full-stack web application for sharing and managing wedding photos and videos. Built with React, FastAPI, and MongoDB.

## 🌟 Features

### Frontend (React)
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **User Authentication**: Register, login, and user management
- **Album Management**: Create, view, and manage wedding albums
- **Media Upload**: Drag & drop photo/video upload with progress tracking
- **Content Moderation**: Automatic NSFW detection
- **Admin Dashboard**: Analytics and content moderation
- **Payment Integration**: Razorpay payment processing
- **Mobile Responsive**: Works perfectly on all devices

### Backend (FastAPI)
- **RESTful API**: Complete CRUD operations
- **Authentication**: JWT-based security
- **File Storage**: Multi-cloud support (Supabase, AWS S3, Local)
- **Content Moderation**: NSFW detection via external API
- **Payment Processing**: Razorpay integration
- **Database**: MongoDB with Motor async driver
- **Real-time**: WebSocket support for live updates

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB
- Supabase account (for storage)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/wedding-memories-app.git
cd wedding-memories-app
```

2. **Backend Setup**
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd client
npm install
```

4. **Environment Variables**
Create `.env` files in both `server/` and `client/` directories:

**server/.env:**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=wedding_app
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=your_bucket_name
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NSFW_API_URL=your_nsfw_api_url
```

**client/.env:**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
```

5. **Run the Application**
```bash
# Terminal 1 - Backend
cd server
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd client
npm start
```

Visit `http://localhost:3000` to see the application!

## 🏗️ Architecture

```
wedding-app/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   └── styles/        # CSS styles
│   └── public/            # Static assets
├── server/                # FastAPI Backend
│   ├── app/
│   │   ├── routers/       # API routes
│   │   ├── models/        # Pydantic models
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities
│   └── requirements.txt   # Python dependencies
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Context API** - State management

### Backend
- **FastAPI** - Web framework
- **MongoDB** - Database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **JWT** - Authentication
- **Supabase** - File storage
- **Razorpay** - Payment processing

## 📱 API Endpoints

### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /users/logout` - User logout

### Albums
- `GET /albums/` - List all albums
- `GET /albums/{id}` - Get album details
- `POST /albums/` - Create new album
- `PUT /albums/{id}` - Update album
- `DELETE /albums/{id}` - Delete album

### Media
- `GET /media/album/{id}` - Get album media
- `POST /media/upload/` - Upload media
- `GET /media/flagged` - Get flagged media
- `PATCH /media/approve/{id}` - Approve media

### Payments
- `POST /payments/create-order` - Create payment order
- `POST /payments/verify-payment` - Verify payment
- `POST /payments/upgrade-plan` - Upgrade user plan

### Admin
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/users` - List all users
- `GET /admin/flagged-media` - Get flagged content

## 🚀 Deployment

### Option 1: Vercel + Railway
1. **Frontend**: Deploy to Vercel
2. **Backend**: Deploy to Railway
3. **Database**: Use MongoDB Atlas

### Option 2: Heroku
1. **Frontend**: Deploy to Heroku
2. **Backend**: Deploy to Heroku
3. **Database**: Use MongoDB Atlas

### Option 3: AWS
1. **Frontend**: Deploy to S3 + CloudFront
2. **Backend**: Deploy to EC2 or ECS
3. **Database**: Use MongoDB Atlas

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=wedding_app
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=your_bucket_name
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NSFW_API_URL=your_nsfw_api_url
JWT_SECRET=your_jwt_secret
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
```

## 📊 Features

### User Features
- ✅ User registration and login
- ✅ Create and manage wedding albums
- ✅ Upload photos and videos
- ✅ Share albums with guests
- ✅ View album analytics
- ✅ Upgrade plans with payments

### Admin Features
- ✅ Content moderation dashboard
- ✅ User management
- ✅ Analytics and insights
- ✅ Flagged content review
- ✅ System health monitoring

### Technical Features
- ✅ Real-time file uploads
- ✅ Automatic content moderation
- ✅ Multi-cloud storage
- ✅ Payment processing
- ✅ Responsive design
- ✅ Progressive Web App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- FastAPI team for the high-performance API framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and users

## 📞 Support

For support, email support@weddingmemories.app or create an issue in this repository.

---

**Made with ❤️ for couples around the world**
