import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// SerpAPI proxy endpoint
app.get('/api/search-locations', async (req, res) => {
  try {
    const { q, country = 'IN', regionName, nearCenter } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Build SerpAPI URL
    const params = new URLSearchParams({
      engine: 'google_maps',
      q: q,
      api_key: process.env.SERP_API_KEY,
      hl: 'en',
      type: 'search',
      gl: country
    });

    // Add location bias if provided
    if (nearCenter) {
      const { lat, lng } = JSON.parse(nearCenter);
      params.set('ll', `@${lat},${lng},14z`);
    }

    // Make request to SerpAPI
    const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`SerpAPI error: HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the response to match our frontend expectations
    const suggestions = [];
    
    if (Array.isArray(data.local_results) && data.local_results.length > 0) {
      for (const result of data.local_results) {
        const id = result.place_id || result.data_id || `${result.position || ''}-${result.title}`;
        const title = result.title || result.name || '';
        const address = result.address || result.full_address || result.description || '';
        const coords = result.gps_coordinates;

        suggestions.push({
          id,
          text: title,
          place_name: `${title}, ${address}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
          coordinates: coords ? [coords.longitude, coords.latitude] : undefined,
          address: address || undefined,
          source: 'serpapi'
        });
      }
    }

    // Fallback to place_results if no local_results
    if (suggestions.length === 0 && data.place_results) {
      const pr = data.place_results;
      const id = pr.place_id || pr.data_id || pr.title || pr.name || q;
      const title = pr.title || pr.name || q;
      const address = pr.address || pr.formatted_address || '';
      const coords = pr.gps_coordinates;

      suggestions.push({
        id,
        text: title,
        place_name: `${title}, ${address}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
        coordinates: coords ? [coords.longitude, coords.latitude] : undefined,
        address: address || undefined,
        source: 'serpapi'
      });
    }

    res.json(suggestions);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend proxy server running on port ${PORT}`);
  console.log(`📍 SerpAPI proxy: http://localhost:${PORT}/api/search-locations`);
});
