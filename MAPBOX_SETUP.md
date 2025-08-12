# Mapbox Integration Setup Guide

This guide will help you set up Mapbox Geocoding API for location search and traffic alerts in your Wedding Logistics Dashboard.

## 🚀 **Step 1: Get Mapbox API Key**

1. **Visit [Mapbox](https://www.mapbox.com/)**
2. **Sign up** for a free account or **login** if you already have one
3. **Go to Account → Access Tokens**
4. **Create a new token** or use your default public token
5. **Copy the token** (it starts with `pk.`)

## 🔧 **Step 2: Update Configuration**

1. **Open `src/lib/mapbox.ts`**
2. **Replace `YOUR_MAPBOX_ACCESS_TOKEN_HERE`** with your actual token:

```typescript
export const MAPBOX_CONFIG = {
  ACCESS_TOKEN: 'pk.your_actual_token_here',
  // ... rest of config
};
```

## 📍 **Step 3: Test Location Search**

1. **Start your development server**: `npm run dev`
2. **Go to "Create New Task"** page
3. **Type in the location field** (e.g., "Bhilwara", "Ajmer")
4. **Verify location suggestions appear**

## 🚦 **Step 4: Test Traffic Alerts**

1. **Go to "Live ETA View"** page
2. **Check if traffic alerts section loads**
3. **Verify real-time traffic data appears**

## 🌐 **API Endpoints Used**

### **Geocoding API**
- **Endpoint**: `https://api.mapbox.com/geocoding/v5/mapbox.places`
- **Purpose**: Convert text to coordinates and vice versa
- **Usage**: Location search in TaskForm

### **Directions API**
- **Endpoint**: `https://api.mapbox.com/directions/v5/mapbox/driving`
- **Purpose**: Get route information with traffic data
- **Usage**: Calculate ETA and traffic delays

### **Traffic Matrix API**
- **Endpoint**: `https://api.mapbox.com/directions-matrix/v1/mapbox/driving-traffic`
- **Purpose**: Get traffic conditions for multiple routes
- **Usage**: Bulk traffic analysis

## 💰 **Pricing & Limits**

### **Free Tier (50,000 requests/month)**
- **Geocoding**: 100,000 requests/month
- **Directions**: 100,000 requests/month
- **Perfect for development and small to medium projects**

### **Paid Plans**
- **Pay-as-you-go**: $0.75 per 1,000 additional requests
- **Enterprise**: Custom pricing for high-volume usage

## 🔒 **Security Best Practices**

1. **Never commit your API key** to version control
2. **Use environment variables** in production
3. **Restrict token permissions** to only what you need
4. **Monitor usage** to prevent unexpected charges

## 🌍 **Geographic Restrictions**

The current setup is configured for **India** (`country: 'IN'`). To change:

1. **Update `handleLocationChange`** in `TaskForm.tsx`
2. **Modify the country code** as needed
3. **Common codes**: `US` (USA), `GB` (UK), `DE` (Germany), etc.

## 🚨 **Traffic Alert Types**

### **Congestion**
- **Description**: Heavy traffic, slow movement
- **Severity**: Based on delay duration
- **Action**: Suggest alternate routes

### **Construction**
- **Description**: Road work, lane closures
- **Severity**: Medium (usually predictable)
- **Action**: Plan for delays

### **Accident**
- **Description**: Road incidents, emergency response
- **Severity**: High (unpredictable)
- **Action**: Immediate route changes

### **Weather**
- **Description**: Rain, snow, fog conditions
- **Severity**: Variable based on conditions
- **Action**: Adjust ETA expectations

## 🔄 **Real-time Updates**

Traffic alerts are fetched:
- **When active tasks change**
- **Every 5 minutes** (configurable)
- **Based on task locations**

## 🛠 **Customization Options**

### **Add More Alert Types**
1. **Extend `TrafficAlert` interface** in `mapbox.ts`
2. **Update `getTrafficAlerts` function**
3. **Add new alert rendering** in `EtaPage.tsx`

### **Change Update Frequency**
1. **Modify `useEffect`** in `EtaPage.tsx`
2. **Add interval-based updates**
3. **Consider user preferences**

### **Add Route Visualization**
1. **Integrate Mapbox GL JS**
2. **Show routes on interactive map**
3. **Display traffic conditions visually**

## 🐛 **Troubleshooting**

### **"No locations found"**
- **Check API key** is correct
- **Verify internet connection**
- **Check API usage limits**
- **Ensure location query is 3+ characters**

### **Traffic alerts not loading**
- **Check browser console** for errors
- **Verify Mapbox service** is accessible
- **Check network requests** in DevTools

### **CORS errors**
- **Mapbox APIs support CORS** by default
- **Check if using correct endpoints**
- **Verify API key permissions**

## 📱 **Mobile Optimization**

- **Touch-friendly location search**
- **Responsive traffic alert display**
- **Optimized for mobile browsers**

## 🚀 **Production Deployment**

1. **Set environment variables** for API keys
2. **Enable HTTPS** (required for production)
3. **Monitor API usage** and costs
4. **Set up error tracking** and logging

## 📞 **Support**

- **Mapbox Documentation**: [docs.mapbox.com](https://docs.mapbox.com/)
- **Community Forum**: [support.mapbox.com](https://support.mapbox.com/)
- **API Status**: [status.mapbox.com](https://status.mapbox.com/)

---

**Happy coding! 🎉**
