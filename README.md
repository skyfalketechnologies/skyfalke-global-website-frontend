# Skyfalke Website

A modern, professional website for Skyfalke - Leading Digital Marketing & Technology Solutions in Africa. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with TailwindCSS.

## 🌟 Features

### Frontend
- **Modern React Application** with functional components and hooks
- **Responsive Design** with TailwindCSS and mobile-first approach
- **Smooth Animations** using Framer Motion
- **SEO Optimized** with React Helmet Async and structured data
- **Performance Optimized** with lazy loading and code splitting

### Pages & Components
- **Hero Section** with animated slider showcasing key services
- **About Page** with company story, values, and team
- **Services Page** with detailed service offerings and pricing
- **Case Studies** with client success stories
- **Blog System** with categories, tags, and search
- **Contact Page** with form validation and integration
- **Admin Dashboard** with authentication and content management

### Backend
- **Express.js API** with RESTful endpoints
- **MongoDB Integration** with Mongoose ODM
- **Authentication System** with JWT tokens
- **Role-based Access Control** (Admin/Editor)
- **Email Integration** for contact forms
- **Analytics Tracking** for visitor insights
- **Security Features** with helmet, rate limiting, and validation

### Admin Features
- **Content Management System** for blogs and site content
- **User Management** with role-based permissions
- **Contact Form Management** with status tracking
- **Analytics Dashboard** with visitor statistics
- **SEO Management** with meta tags and schema

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/skyfalke-website.git
   cd skyfalke-website
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/env.example server/.env
   
   # Edit the .env file with your configuration
   nano server/.env
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend development server on http://localhost:3000

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skyfalke
JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure
JWT_EXPIRE=7d

# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Admin credentials
ADMIN_EMAIL=admin@skyfalke.com
ADMIN_PASSWORD=admin123
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Clone and configure**
   ```bash
   git clone https://github.com/your-username/skyfalke-website.git
   cd skyfalke-website
   cp server/env.example .env
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - MongoDB database
   - Redis cache
   - Skyfalke application
   - Nginx reverse proxy

3. **Access the application**
   - Website: http://localhost
   - Admin: http://localhost/admin/login

### Manual Docker Build

```bash
# Build the image
docker build -t skyfalke-website .

# Run the container
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://your-mongo-host:27017/skyfalke \
  -e JWT_SECRET=your-secret-key \
  skyfalke-website
```

## 📁 Project Structure

```
skyfalke-website/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── styles/        # CSS and styling
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── index.js          # Server entry point
├── docker-compose.yml    # Docker services
├── Dockerfile           # Container build
├── nginx.conf          # Nginx configuration
└── README.md          # This file
```

## 🛠️ Development

### Available Scripts

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Build for production
npm run build

# Start production server
npm start
```

### Code Style & Standards

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Conventional Commits** for commit messages

### Testing

```bash
# Run frontend tests
cd client && npm test

# Run backend tests
cd server && npm test
```

## 🌐 Deployment

### Production Environment

1. **Set production environment variables**
2. **Build the application**
   ```bash
   npm run build
   ```
3. **Deploy using your preferred method:**
   - Docker containers
   - Cloud platforms (AWS, Google Cloud, Azure)
   - Traditional VPS hosting

### Environment-specific Configuration

- **Development**: Hot reloading, detailed error messages
- **Production**: Optimized builds, error logging, security headers

## 📊 Features Overview

### Public Website
- ✅ Modern, responsive design
- ✅ SEO optimized with meta tags and structured data
- ✅ Animated hero slider
- ✅ Service pages with pricing
- ✅ Case studies and testimonials
- ✅ Blog system with categories
- ✅ Contact form with validation
- ✅ Performance optimized

### Admin Dashboard
- ✅ Secure authentication
- ✅ Content management system
- ✅ Blog post management
- ✅ Contact form management
- ✅ User management
- ✅ Analytics dashboard
- 🔄 Advanced analytics (coming soon)
- 🔄 Email marketing integration (coming soon)

### Technical Features
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ Rate limiting and security headers
- ✅ Error handling and logging
- ✅ Database optimization
- ✅ Caching strategies

## 🔒 Security

- **Authentication**: JWT tokens with secure storage
- **Authorization**: Role-based access control
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: API endpoint protection
- **Security Headers**: Helmet.js implementation
- **Data Sanitization**: MongoDB injection prevention
- **HTTPS Ready**: SSL/TLS configuration included

## 🚀 Performance

- **Frontend Optimization**: Code splitting, lazy loading, image optimization
- **Backend Optimization**: Database indexing, caching, compression
- **SEO Optimization**: Meta tags, structured data, sitemap
- **CDN Ready**: Static asset optimization
- **Monitoring**: Health checks and performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: developer@skyfalke.com
- **Website**: https://skyfalke.com
- **Documentation**: https://docs.skyfalke.com

## 🙏 Acknowledgments

- **Design Inspiration**: npdigital.com
- **Icons**: React Icons
- **Animations**: Framer Motion
- **Styling**: TailwindCSS
- **Database**: MongoDB
- **Hosting**: Docker & Cloud platforms

---

**Built with ❤️ by the Skyfalke Team**
