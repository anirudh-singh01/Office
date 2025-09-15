# Synopsys.ai Copilot GTM Web UI Links

A modern, responsive web application that provides centralized access to Synopsys.ai Copilot tools and products through a clean, intuitive interface. Built with React, Vite, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Centralized Tool Access**: Single interface to access all Synopsys.ai Copilot tools
- **Responsive Design**: Mobile-first approach with collapsible sidebar navigation
- **Iframe Integration**: Seamless loading of external Synopsys tools within the application
- **Modern UI/UX**: Clean, professional interface using Tailwind CSS
- **Brand Consistency**: Synopsys purple theme throughout the application

### Navigation & Layout
- **Fixed Top Header**: Always visible header with Synopsys logo and title
- **Collapsible Sidebar**: Responsive sidebar that collapses on mobile devices
- **Active State Management**: Visual indicators for currently selected tools
- **Mobile Overlay**: Dark overlay when sidebar is open on mobile devices

### Available Tools
The application provides access to the following Synopsys tools:

#### Tools with Workflow Assistant (WA) ⭐
- **Fusion Compiler** - Advanced synthesis and physical design
- **PrimeTime** - Static timing analysis
- **Custom Compiler** - Custom compilation workflows

#### Standard Tools
- **VCS** - Verilog Compiler Simulator
- **DSO.ai** - Design Space Optimization
- **IC Validator** - Physical verification
- **PrimeSim Pro** - Circuit simulation
- **VC Formal** - Formal verification
- **VC Low Power** - Low power verification
- **VC SpyGlass** - RTL analysis and verification
- **Verdi** - Debug and analysis platform

#### Special Tools
- **Synopsys.ai Copilot** - Query-only interface for AI assistance

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.12
- **Routing**: React Router DOM 7.8.2
- **Development**: ESLint 9.33.0
- **Package Manager**: npm

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd one-point
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build for production (cross-platform)
npm run build:prod

# Preview production build
npm run preview

# Preview production build (network accessible)
npm run preview:prod

# Run ESLint for code quality
npm run lint

# Fix ESLint issues automatically
npm run lint:fix
```

## 🏗️ Project Structure

```
one-point/
├── src/
│   ├── assets/
│   │   └── synopsys_logo.png    # Synopsys brand logo
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # Application-specific styles
│   ├── Content.jsx              # Main content area with iframe
│   ├── index.css                # Global styles and Tailwind import
│   ├── main.jsx                 # Application entry point
│   ├── Sidebar.jsx              # Navigation sidebar component
│   └── TopHeader.jsx            # Top navigation header
├── public/
│   ├── env.js                   # Environment configuration
│   ├── env-company.js           # Company environment config
│   ├── web.config               # IIS configuration
│   ├── .htaccess                # Apache configuration
│   └── favicon.ico              # Site favicon
├── dist/                        # Production build output
├── package.json                 # Project dependencies and scripts
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
└── README.md                    # This file
```

## 🎨 Component Architecture

### App.jsx
- Main application component
- Manages sidebar state and active tool selection
- Sets up React Router with all tool routes
- Handles responsive layout structure

### TopHeader.jsx
- Fixed header component
- Displays Synopsys logo and application title
- Includes mobile menu toggle button
- Features help icon for user assistance

### Sidebar.jsx
- Collapsible navigation sidebar
- Lists all available Synopsys tools
- Handles tool selection and URL management
- Includes legend explaining tool capabilities
- Responsive design with mobile overlay

### Content.jsx
- Main content area component
- Renders iframe for external tool integration
- Handles fallback content when no tool is selected
- Manages iframe sandbox permissions

## 🔧 Configuration

### Vite Configuration (vite.config.js)
- React plugin for JSX support
- Tailwind CSS integration
- Development server configuration

### ESLint Configuration (eslint.config.js)
- React Hooks rules
- React Refresh for development
- Custom rules for unused variables
- Browser globals support

## 🎯 Key Features Explained

### Workflow Assistant Integration
Tools marked with ⭐ include Workflow Assistant (WA) capabilities:
- TCL code generation support
- Start commands with `/generate`
- Enhanced automation capabilities

### Iframe Security
The application uses iframe sandboxing for security:
```jsx
sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
```

### Responsive Design
- **Desktop**: Fixed sidebar with full tool access
- **Mobile**: Collapsible sidebar with overlay
- **Tablet**: Adaptive layout with touch-friendly controls

### State Management
- `isSidebarOpen`: Controls sidebar visibility on mobile
- `activeTool`: Tracks currently selected tool
- `activeUrl`: Manages iframe source URL

## 🚀 Deployment

### Production Build
```bash
npm run build
```

The build process creates optimized files in the `dist/` directory ready for deployment.

### Deployment Options
- **Static Hosting**: Deploy `dist/` folder to services like Netlify, Vercel, or GitHub Pages
- **CDN**: Serve static files through a CDN for global performance
- **Web Server**: Deploy to Apache, Nginx, or other web servers

## 🔍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software for Synopsys internal use.

## 🆘 Support

For technical support or questions about this application, please contact the development team.

---

