# Wedding Memories - Frontend

A beautiful React frontend for the Wedding Memories application, built with modern web technologies.

## Features

- 🎨 **Beautiful UI/UX** - Modern, responsive design with Tailwind CSS
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔐 **Authentication** - User login and registration
- 📸 **Photo Upload** - Drag and drop file upload with progress tracking
- 🎭 **Album Management** - Create and browse wedding albums
- 🎥 **Video Support** - Upload and view videos
- ⚡ **Fast Performance** - Optimized with React 18 and modern practices

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.jsx     # Navigation component
├── context/            # React context providers
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Albums.jsx      # Albums listing
│   ├── AlbumDetail.jsx # Individual album view
│   ├── Upload.jsx      # File upload page
│   ├── Login.jsx       # Login form
│   └── Register.jsx    # Registration form
├── styles/             # CSS files
│   └── index.css       # Main styles with Tailwind
├── utils/              # Utility functions
├── App.jsx             # Main app component
└── index.jsx           # React entry point
```

## API Integration

The frontend connects to the FastAPI backend running on `http://localhost:8000`. The proxy is configured in `package.json` to handle CORS issues during development.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 