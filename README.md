# Levitation Invoice Generator

A full-stack MERN application for generating professional PDF invoices with a modern, responsive UI. Built with React, Node.js, TypeScript, and following industry best practices.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with registration and login
- **Product Management**: Add multiple products with quantities and rates
- **Automatic Calculations**: Real-time calculation of totals and 18% GST
- **PDF Generation**: Server-side PDF generation using Puppeteer
- **Professional Design**: Pixel-perfect UI following Figma specifications
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **State Management**: Redux Toolkit for predictable state management
- **Form Validation**: Comprehensive validation using Zod and React Hook Form
- **Modern UI**: Shadcn/ui components with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Redux Toolkit** for state management
- **TanStack Query** for server state management
- **React Router v6** for routing
- **React Hook Form + Zod** for form validation
- **Tailwind CSS + Shadcn/ui** for styling
- **Lucide React** for icons

### Backend
- **Node.js** with TypeScript
- **Express.js** for API development
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Puppeteer** for PDF generation
- **bcryptjs** for password hashing
- **Express Validator** for input validation

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mern-pdf-generator
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install-all
```

### 3. Environment Setup

#### Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/invoice-generator
JWT_SECRET=your_super_secure_jwt_secret_change_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

#### Frontend Environment
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# For macOS with Homebrew
brew services start mongodb-community

# For Ubuntu/Debian
sudo systemctl start mongod

# For Windows - start MongoDB service or run mongod.exe
```

### 5. Run the Application

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
# Backend (Terminal 1)
npm run server

# Frontend (Terminal 2)
npm run client
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📱 Application Flow

1. **Registration**: Users create an account with name, email, and password
2. **Login**: Secure authentication with email and password
3. **Add Products**: Add multiple products with quantities and rates
4. **Review**: View calculated totals including 18% GST
5. **Generate PDF**: Create professional PDF invoice using backend Puppeteer
6. **Download**: Download the generated PDF invoice

## 🎨 UI Components

The application uses a modern component-based architecture with:
- Reusable UI components (Button, Input, Card, etc.)
- Consistent design system with Tailwind CSS
- Responsive layouts that work on all devices
- Loading states and error handling
- Toast notifications for user feedback

## 📖 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Invoice Endpoints

#### POST /api/invoice/generate
Generate PDF invoice (Protected)
```json
{
  "products": [
    {
      "name": "Product 1",
      "qty": 2,
      "rate": 100.00
    }
  ]
}
```

## 🏗 Project Structure

```
mern-pdf-generator/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── types/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── ui/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── lib/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── globals.css
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── package.json
└── README.md
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your hosting platform
3. Update environment variables in your hosting dashboard

### Backend Deployment (Vercel/Railway/Heroku)

1. Build the backend:
```bash
cd backend
npm run build
```

2. Deploy to your preferred platform
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `CORS_ORIGIN` (your frontend URL)

### Environment Variables for Production

#### Backend
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_super_secure_jwt_secret_for_production
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-domain.com
PORT=5000
```

#### Frontend
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🔧 Development Scripts

```bash
# Root level scripts
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run install-all  # Install all dependencies
npm run build        # Build frontend for production

# Backend scripts
cd backend
npm run dev          # Start with ts-node-dev
npm run build        # Compile TypeScript
npm run start        # Start production server

# Frontend scripts
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS protection
- MongoDB injection protection
- Rate limiting ready (can be added)

## 📝 Additional Notes

- The application follows MVC architecture in the backend
- Uses Redux Toolkit for predictable state management
- Implements proper error handling throughout the application
- PDF generation is handled server-side for security
- All forms have comprehensive validation
- Responsive design works on all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@levitation.com or create an issue in the repository. 