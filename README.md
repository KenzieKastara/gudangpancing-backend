# Gudang Pancing Backend API

Production-ready Node.js/Fastify backend with PostgreSQL database, JWT authentication, CMS, and analytics.

## 🚀 Tech Stack

- **Backend**: Node.js + Fastify
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

## 📋 Features

1. **Analytics** - Unique page view tracking with time-range analytics
2. **Product Carousel CMS** - Manage product displays
3. **Instagram Feed CMS** - Manage Instagram posts with hyperlinks
4. **Global Settings** - Configure site-wide settings without redeployment
5. **Admin Authentication** - JWT-based secure authentication

## 🔑 Admin Credentials

```
Email: admin@gudangpancing.com
Username: admin
Password: admin123
```

## 📡 API Endpoints

### Public Endpoints

#### Health Check
```bash
GET /api/health
```

#### Get Settings
```bash
GET /api/settings
```

#### Get Carousel Items
```bash
GET /api/carousel
```

#### Get Instagram Feed
```bash
GET /api/instagram-feed
```

#### Track Page View
```bash
POST /api/analytics/track
```

### Authentication Endpoints

#### Register Admin
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "username": "admin",
  "password": "password123"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "data": {
    "admin": { ... },
    "token": "eyJhbGci..."
  }
}
```

#### Get Profile (Protected)
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

### Admin Endpoints (Protected - Require JWT)

#### Analytics

**Get Analytics**
```bash
GET /api/analytics?range=7d
Authorization: Bearer <token>

Valid ranges: 1h, 1d, 7d, 1m, 1y, all

Response:
{
  "range": "7d",
  "total_views": 1234,
  "chart": [
    { "label": "2026-02-01", "views": 120 },
    { "label": "2026-02-02", "views": 210 }
  ]
}
```

#### Carousel Management

**Get All Carousel Items** (including inactive)
```bash
GET /api/carousel/all
Authorization: Bearer <token>
```

**Create Carousel Item**
```bash
POST /api/carousel
Authorization: Bearer <token>
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg",
  "productName": "Product Name",
  "price": 50000,
  "currency": "IDR",
  "link": "https://shopee.co.id/product",
  "badge": "Best Seller",
  "isActive": true,
  "sortOrder": 1
}
```

**Update Carousel Item**
```bash
PUT /api/carousel/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 60000,
  "badge": "Ready Stock"
}
```

**Delete Carousel Item**
```bash
DELETE /api/carousel/:id
Authorization: Bearer <token>
```

#### Instagram Management

**Get All Instagram Posts** (including inactive)
```bash
GET /api/instagram-feed/all
Authorization: Bearer <token>
```

**Create Instagram Post**
```bash
POST /api/instagram-feed
Authorization: Bearer <token>
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg",
  "postUrl": "https://instagram.com/p/ABC123",
  "caption": "Optional caption",
  "isActive": true,
  "sortOrder": 1
}
```

**Update Instagram Post**
```bash
PUT /api/instagram-feed/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "caption": "New caption",
  "isActive": false
}
```

**Delete Instagram Post**
```bash
DELETE /api/instagram-feed/:id
Authorization: Bearer <token>
```

#### Settings Management

**Update Settings**
```bash
PUT /api/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone_number": "0813-1234-5678",
  "whatsapp_number": "628131234567",
  "instagram_link": "https://instagram.com/shop"
}
```

**Initialize Default Settings**
```bash
POST /api/settings/initialize
Authorization: Bearer <token>
Content-Type: application/json

{}
```

## 🗄️ Database Schema

### Tables

- **admins** - Admin users
- **page_views** - Analytics tracking
- **carousel_items** - Product carousel
- **instagram_posts** - Instagram feed
- **site_settings** - Key-value settings

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS enabled
- Bot/crawler detection for analytics

## 🛠️ Development

### Setup
```bash
cd /app/backend
yarn install
yarn prisma generate
yarn prisma migrate dev
node seed.js  # Seed database
```

### Start Server
```bash
yarn start
# or
node src/server.js
```

### Environment Variables
```
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
JWT_SECRET=your-secret-key
PORT=8001
NODE_ENV=development
```

## 📊 Analytics

The analytics system tracks **unique views only** using hashed IP and User-Agent.

**Features:**
- Bot/crawler detection
- 24-hour unique view window
- Time-range grouping (minute, hour, day, month)
- Chart-ready JSON output

## 💡 Usage Example

```javascript
// Login and get token
const loginResponse = await fetch('http://localhost:8001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    usernameOrEmail: 'admin',
    password: 'admin123'
  })
});

const { data } = await loginResponse.json();
const token = data.token;

// Use token for protected endpoints
const analyticsResponse = await fetch('http://localhost:8001/api/analytics?range=7d', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const analytics = await analyticsResponse.json();
console.log(analytics.data.total_views);
```

## 🎯 Production Ready

This backend is designed for commercial use with:
- Clean architecture (services, controllers, routes)
- Error handling
- Input validation
- Scalable database design
- Easy to customize and extend
- Ready for frontend dashboard integration

## 📝 Notes

- All timestamps are in UTC
- Prices are stored as Float (suitable for IDR currency)
- Sort order determines display sequence (ascending)
- Inactive items are excluded from public endpoints
