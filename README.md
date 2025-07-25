# MERN Stack PDF Generator - Invoice Application

A full-stack web application for generating professional invoices in PDF format using the MERN stack (MongoDB, Express.js, React, Node.js) with TypeScript, Redux, TanStack Query, and Tailwind CSS.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Product Management**: Add multiple products with automatic calculations
- **Invoice Generation**: Create professional invoices with GST calculations
- **PDF Download**: Generate and download invoices as PDF files
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Calculations**: Automatic GST (18%) and total calculations
- **Form Validation**: Comprehensive client and server-side validation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Redux Toolkit** for state management
- **TanStack Query** for server state management
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **Tailwind CSS** with Shadcn/ui components
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Puppeteer** for PDF generation
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd mern-pdf-generator
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pdf-generator
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 4. Start the application

#### Development Mode
```bash
# From the root directory
npm run dev
```

This will start both frontend (port 3000) and backend (port 5000) in development mode.

#### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```

## 📱 Application Flow

1. **Registration/Login**: Users can create an account or sign in
2. **Add Products**: Add multiple products with name, quantity, and rate
3. **Automatic Calculations**: System calculates totals and GST (18%)
4. **Generate Invoice**: Create invoice in the database
5. **Download PDF**: Download professional PDF invoice

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Invoices
- `POST /api/invoice/create` - Create new invoice
- `GET /api/invoice/generate-pdf/:id` - Generate PDF for invoice
- `GET /api/invoice/my-invoices` - Get user's invoices

## 🎨 UI Components

The application uses a modern design system with:
- Clean and intuitive interface
- Responsive design for all screen sizes
- Professional color scheme
- Smooth animations and transitions
- Accessible form controls

## 📄 PDF Features

Generated PDFs include:
- Professional invoice layout
- Company and customer information
- Detailed product breakdown
- GST calculations
- Professional styling
- Print-ready format

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Protected routes
- CORS configuration
- Helmet.js security headers

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your preferred platform
3. Set environment variables for API URL

### Backend (Railway/Render)
1. Deploy the backend code
2. Set environment variables
3. Connect to MongoDB Atlas or other cloud database

## 📁 Project Structure

```
mern-pdf-generator/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   └── lib/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🎯 Future Enhancements

- Invoice templates customization
- Email invoice functionality
- Invoice history and management
- Multi-currency support
- Advanced reporting features
- Mobile app version

---

**Note**: This application is designed for educational purposes and demonstrates modern web development practices with the MERN stack. 