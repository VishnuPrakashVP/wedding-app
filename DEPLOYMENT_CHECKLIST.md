# 🚀 Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. GitHub Setup
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Set up GitHub Actions secrets

### 2. Database Setup
- [ ] Create MongoDB Atlas account
- [ ] Create database cluster
- [ ] Get connection string
- [ ] Test database connection

### 3. Storage Setup
- [ ] Create Supabase account
- [ ] Create storage bucket
- [ ] Get API keys
- [ ] Test file upload

### 4. Payment Setup (Optional)
- [ ] Create Razorpay account
- [ ] Get API keys
- [ ] Test payment flow

## 🎯 Quick Deployment Steps

### Step 1: GitHub Repository
```bash
# Create new repository on GitHub
# Then run:
git remote add origin https://github.com/yourusername/wedding-memories-app.git
git branch -M main
git push -u origin main
```

### Step 2: Frontend Deployment (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Connect GitHub repository
3. Set environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
   ```
4. Deploy!

### Step 3: Backend Deployment (Railway)
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Set environment variables:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/wedding_app
   DB_NAME=wedding_app
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   JWT_SECRET=your_jwt_secret
   ```
4. Deploy!

### Step 4: Update Frontend API URL
1. Get your Railway backend URL
2. Update Vercel environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-app.railway.app
   ```
3. Redeploy frontend

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/wedding_app
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

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
```

## 🧪 Testing Checklist

### Backend Testing
- [ ] Health check endpoint
- [ ] User registration
- [ ] User login
- [ ] Album creation
- [ ] Media upload
- [ ] Payment processing

### Frontend Testing
- [ ] Home page loads
- [ ] User registration
- [ ] User login
- [ ] Album browsing
- [ ] Album creation
- [ ] Media upload
- [ ] Admin dashboard

### Integration Testing
- [ ] Frontend can connect to backend
- [ ] File uploads work
- [ ] Payments work
- [ ] Admin features work

## 📊 Monitoring Setup

### Vercel
- [ ] Enable analytics
- [ ] Set up error tracking
- [ ] Monitor performance

### Railway
- [ ] Check application logs
- [ ] Monitor resource usage
- [ ] Set up alerts

### MongoDB Atlas
- [ ] Enable monitoring
- [ ] Set up alerts
- [ ] Configure backups

## 🔒 Security Checklist

- [ ] Environment variables set
- [ ] JWT secret configured
- [ ] CORS configured
- [ ] SSL certificates active
- [ ] API keys secured

## 🎉 Post-Deployment

### Marketing
- [ ] Create landing page
- [ ] Set up social media
- [ ] Write blog posts
- [ ] Contact wedding photographers

### Analytics
- [ ] Set up Google Analytics
- [ ] Configure conversion tracking
- [ ] Monitor user behavior

### Support
- [ ] Set up support email
- [ ] Create FAQ page
- [ ] Prepare customer support

## 🚀 Launch!

Your Wedding Memories App is now live! Share it with the world:

- **Frontend URL**: https://your-app.vercel.app
- **Backend URL**: https://your-app.railway.app
- **API Docs**: https://your-app.railway.app/docs

---

**Congratulations! 🎉 Your app is now in production!** 