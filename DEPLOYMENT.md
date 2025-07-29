# 🚀 Deployment Guide

This guide will help you deploy the Wedding Memories App to production.

## 📋 Prerequisites

1. **GitHub Account** - For version control
2. **Vercel Account** - For frontend deployment
3. **Railway Account** - For backend deployment
4. **MongoDB Atlas** - For database
5. **Supabase Account** - For file storage
6. **Razorpay Account** - For payments (optional)

## 🎯 Quick Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/wedding-memories-app.git
git push -u origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Connect your GitHub repository
- Set environment variables:
  ```
  REACT_APP_API_URL=https://your-railway-app.railway.app
  REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
  ```
- Deploy!

#### Backend (Railway)
1. **Deploy to Railway**
- Go to [railway.app](https://railway.app)
- Connect your GitHub repository
- Set environment variables:
  ```
  MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/wedding_app
  DB_NAME=wedding_app
  SUPABASE_URL=your_supabase_url
  SUPABASE_KEY=your_supabase_key
  RAZORPAY_KEY_ID=your_razorpay_key
  RAZORPAY_KEY_SECRET=your_razorpay_secret
  JWT_SECRET=your_jwt_secret
  ```
- Deploy!

### Option 2: Heroku

#### Frontend (Heroku)
1. **Create Heroku App**
```bash
heroku create your-wedding-app-frontend
```

2. **Deploy**
```bash
cd client
heroku buildpacks:set mars/create-react-app
git subtree push --prefix client heroku main
```

#### Backend (Heroku)
1. **Create Heroku App**
```bash
heroku create your-wedding-app-backend
```

2. **Add MongoDB**
```bash
heroku addons:create mongolab:sandbox
```

3. **Set Environment Variables**
```bash
heroku config:set MONGO_URL=$MONGODB_URI
heroku config:set SUPABASE_URL=your_supabase_url
heroku config:set SUPABASE_KEY=your_supabase_key
heroku config:set JWT_SECRET=your_jwt_secret
```

4. **Deploy**
```bash
cd server
git subtree push --prefix server heroku main
```

### Option 3: AWS

#### Frontend (S3 + CloudFront)
1. **Create S3 Bucket**
```bash
aws s3 mb s3://your-wedding-app-frontend
```

2. **Build and Upload**
```bash
cd client
npm run build
aws s3 sync build/ s3://your-wedding-app-frontend
```

3. **Create CloudFront Distribution**
- Go to AWS CloudFront
- Create distribution pointing to S3 bucket
- Set custom domain (optional)

#### Backend (EC2)
1. **Launch EC2 Instance**
2. **Install Dependencies**
```bash
sudo apt update
sudo apt install python3 python3-pip nginx
```

3. **Deploy Application**
```bash
git clone https://github.com/yourusername/wedding-memories-app.git
cd wedding-memories-app/server
pip3 install -r requirements.txt
```

4. **Setup Systemd Service**
```bash
sudo nano /etc/systemd/system/wedding-app.service
```

Add:
```ini
[Unit]
Description=Wedding App Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/wedding-memories-app/server
Environment=PATH=/home/ubuntu/wedding-memories-app/server/venv/bin
ExecStart=/home/ubuntu/wedding-memories-app/server/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

5. **Start Service**
```bash
sudo systemctl enable wedding-app
sudo systemctl start wedding-app
```

## 🔧 Environment Setup

### MongoDB Atlas
1. Create account at [mongodb.com](https://mongodb.com)
2. Create new cluster
3. Get connection string
4. Add to environment variables

### Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get API keys
4. Add to environment variables

### Razorpay (Optional)
1. Create account at [razorpay.com](https://razorpay.com)
2. Get API keys
3. Add to environment variables

## 🌐 Domain Setup

### Custom Domain (Optional)
1. **Buy Domain** (e.g., from Namecheap, GoDaddy)
2. **Configure DNS**:
   - Frontend: Point to Vercel/CloudFront
   - Backend: Point to Railway/EC2
3. **SSL Certificate**: Automatically handled by Vercel/Railway

## 📊 Monitoring

### Vercel Analytics
- Built-in analytics
- Performance monitoring
- Error tracking

### Railway Monitoring
- Application logs
- Performance metrics
- Error tracking

### MongoDB Atlas
- Database monitoring
- Performance insights
- Backup management

## 🔒 Security

### Environment Variables
- Never commit `.env` files
- Use platform-specific secret management
- Rotate keys regularly

### SSL/TLS
- Automatically handled by Vercel/Railway
- For AWS, use ACM certificates

### CORS
- Configure allowed origins
- Set up proper headers

## 🚀 CI/CD

### GitHub Actions
The repository includes GitHub Actions for:
- Automated testing
- Automated deployment
- Code quality checks

### Manual Deployment
```bash
# Frontend
cd client
npm run build
# Upload build folder to hosting

# Backend
cd server
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## 📈 Scaling

### Frontend Scaling
- Vercel: Automatic scaling
- Heroku: Add dynos as needed
- AWS: Use Auto Scaling Groups

### Backend Scaling
- Railway: Automatic scaling
- Heroku: Add dynos as needed
- AWS: Use Load Balancer + Auto Scaling

### Database Scaling
- MongoDB Atlas: Upgrade cluster
- Add read replicas
- Implement caching (Redis)

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version
   - Verify all dependencies
   - Check environment variables

2. **Runtime Errors**
   - Check application logs
   - Verify database connection
   - Check API endpoints

3. **Performance Issues**
   - Monitor database queries
   - Implement caching
   - Optimize images

### Support
- Check application logs
- Monitor error tracking
- Use platform-specific debugging tools

## 🎉 Success!

Your Wedding Memories App is now live! Share the URL with couples around the world.

---

**Happy Deploying! 🚀** 