# Vercel Deployment Guide

## Overview
This guide will help you deploy both the React frontend and FastAPI backend on Vercel.

## Prerequisites
- Vercel account (free tier available)
- GitHub repository with your code
- MongoDB Atlas account (for database)
- Supabase account (for storage)

## Step 1: Prepare Your Repository

### 1.1 Update Frontend API Configuration
The frontend is already configured to use environment variables. Make sure your `client/src/services/api.js` uses:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

### 1.2 Backend Configuration
The backend is configured to use environment variables for all services.

## Step 2: Deploy Backend First

### 2.1 Connect Backend Repository to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `server` directory as the root directory
5. Set the following build settings:
   - **Framework Preset**: Other
   - **Build Command**: `pip install -r requirements.txt`
   - **Output Directory**: Leave empty
   - **Install Command**: `pip install -r requirements.txt`

### 2.2 Configure Environment Variables
In your Vercel project settings, add these environment variables:

#### Database
- `MONGODB_URL`: Your MongoDB Atlas connection string

#### Storage (Choose one)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon key
- OR
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `AWS_BUCKET_NAME`: Your S3 bucket name

#### Payments
- `RAZORPAY_KEY_ID`: Your Razorpay key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay secret key

#### Content Moderation
- `NSFW_API_URL`: Your NSFW API endpoint
- `NSFW_API_KEY`: Your NSFW API key

#### Authentication
- `JWT_SECRET_KEY`: A secure random string for JWT signing

### 2.3 Deploy Backend
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://your-backend.vercel.app`)

## Step 3: Deploy Frontend

### 3.1 Connect Frontend Repository to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository again
4. Select the `client` directory as the root directory
5. Vercel will auto-detect it as a React app

### 3.2 Configure Environment Variables
Add this environment variable:
- `REACT_APP_API_URL`: Your backend URL from Step 2.3

### 3.3 Deploy Frontend
1. Click "Deploy"
2. Wait for deployment to complete
3. Your frontend will be available at `https://your-frontend.vercel.app`

## Step 4: Configure Custom Domains (Optional)

### 4.1 Add Custom Domain
1. In your Vercel project settings, go to "Domains"
2. Add your custom domain
3. Configure DNS as instructed by Vercel

### 4.2 Update API URL
Update the `REACT_APP_API_URL` environment variable to use your custom domain.

## Step 5: Test Your Deployment

### 5.1 Test Backend
```bash
curl https://your-backend.vercel.app/health
```

### 5.2 Test Frontend
Visit your frontend URL and test:
- User registration/login
- Album creation
- Media upload
- Payment integration

## Troubleshooting

### Common Issues

#### 1. Build Failures
- Check that all dependencies are in `requirements.txt`
- Ensure Python version is compatible (3.8+)

#### 2. Environment Variables
- Double-check all environment variable names
- Ensure sensitive keys are properly set

#### 3. CORS Issues
- The backend is configured to allow all origins
- If issues persist, check the CORS configuration in `main.py`

#### 4. Database Connection
- Ensure MongoDB Atlas allows connections from Vercel's IP ranges
- Check your connection string format

### Performance Optimization

#### 1. Enable Caching
Add to your `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### 2. Image Optimization
Vercel automatically optimizes images served from the `/static` directory.

## Monitoring and Analytics

### 1. Vercel Analytics
- Enable Vercel Analytics in your project settings
- Monitor performance and user behavior

### 2. Error Tracking
- Consider integrating Sentry for error tracking
- Monitor your application logs in Vercel dashboard

## Security Considerations

### 1. Environment Variables
- Never commit sensitive keys to your repository
- Use Vercel's environment variable system
- Rotate keys regularly

### 2. API Security
- Implement rate limiting for production
- Add API key authentication for admin endpoints
- Use HTTPS for all communications

## Cost Optimization

### 1. Vercel Free Tier Limits
- 100GB bandwidth per month
- 100 serverless function executions per day
- 100GB storage

### 2. Upgrade When Needed
- Monitor your usage in Vercel dashboard
- Upgrade to Pro plan if needed ($20/month)

## Next Steps

1. Set up monitoring and alerting
2. Configure automated backups for your database
3. Implement CI/CD with GitHub Actions
4. Add custom domain and SSL certificate
5. Set up staging environment for testing

Your wedding app is now ready for production on Vercel! 🎉 