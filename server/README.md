# Backend Proxy Server

This backend server acts as a secure proxy for SerpAPI calls, keeping your API key secure.

## Setup

1. **Install dependencies:**
```bash
cd server
npm install
```

2. **Create environment file:**
```bash
cp env.example .env
```

3. **Add your SerpAPI key to `.env`:**
```bash
SERP_API_KEY=your_actual_serpapi_key_here
```

4. **Start development server:**
```bash
npm run dev
```

## Deployment

### Option 1: Deploy to Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy backend:**
```bash
cd server
vercel --prod
```

3. **Set environment variable in Vercel dashboard:**
   - Go to your project settings
   - Add `SERP_API_KEY` with your actual key

### Option 2: Deploy to Railway/Render

1. **Push to GitHub**
2. **Connect to Railway/Render**
3. **Set environment variables:**
   - `SERP_API_KEY`
   - `PORT` (optional, defaults to 3001)

## API Endpoints

- `GET /api/search-locations?q=query&country=IN&nearCenter={"lat":25.340739,"lng":74.631318}`
- `GET /health` - Health check

## Security Benefits

- ✅ API key never exposed to frontend
- ✅ CORS protection
- ✅ Request validation
- ✅ Error handling
- ✅ Rate limiting (can be added)
