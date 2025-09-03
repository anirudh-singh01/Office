# Synopsys.ai Copilot Web Application

A modern, responsive web application that replicates the Synopsys.ai Copilot interface using plain HTML, CSS, and JavaScript.

## Features

### 🎨 **Modern Design**
- Clean, professional interface with Synopsys brand colors
- Purple theme with gradient backgrounds
- Smooth animations and transitions
- Modern typography and spacing

### 📱 **Fully Responsive**
- Desktop-first design with mobile optimization
- Collapsible sidebar that becomes a hamburger menu on mobile
- Adaptive layouts for tablets and phones
- Touch-friendly interface elements

### 🧭 **Dynamic Navigation**
- Fixed left sidebar with menu items
- Active state indicators
- Smooth content switching with fade animations
- Keyboard navigation support (Escape to close mobile menu)

### 🔧 **Interactive Features**
- Login form with validation and loading states
- Notification system with different message types
- Hover effects and click feedback
- Content loading simulations

### ♿ **Accessibility**
- Keyboard navigation support
- Focus states for all interactive elements
- Screen reader friendly structure
- High contrast color scheme

## File Structure

```
synopsys-copilot/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## Menu Items

The sidebar includes all the Synopsys tools with appropriate icons:

- **Synopsys.ai Copilot** (default active)
- **Custom Compiler ***
- **Fusion Compiler ***
- **PrimeTime ***
- **VCS**
- **DSO.ai**
- **IC Validator**
- **VC Formal**
- **VC Low Power**
- **VC SpyGlass**
- **Verdi**
- **TestMAX ATPG**
- **PrimeSim Pro**

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Dynamic functionality and interactions
- **Font Awesome**: Icons for menu items and UI elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **No build process required** - it's ready to use!

## Customization

### Adding New Menu Items

1. Add a new `<li>` element to the sidebar menu in `index.html`:
```html
<li class="menu-item" data-content="new-tool">
    <i class="fas fa-icon-name"></i>
    <span>New Tool</span>
</li>
```

2. Create a corresponding content section:
```html
<div class="content-section" id="new-tool">
    <div class="content-header">
        <h1>New Tool</h1>
        <p class="subtitle">Description of the new tool</p>
    </div>
    <div class="content-body">
        <!-- Your content here -->
    </div>
</div>
```

### Modifying Colors

The main color variables are defined in `styles.css`:
- Primary Purple: `#6b46c1`
- Light Purple: `#f0f2ff`
- Background: `#f8f9ff`

### Adding New Features

The JavaScript is modular and extensible. You can add new functionality by:
1. Adding event listeners in the `initApp()` function
2. Creating new functions and exposing them through `window.SynopsysApp`
3. Extending the notification system for different message types

## Performance Features

- **Optimized CSS**: Efficient selectors and minimal reflows
- **Smooth Animations**: Hardware-accelerated transitions
- **Lazy Loading**: Content sections load only when needed
- **Responsive Images**: Optimized for different screen sizes

## Future Enhancements

- [ ] Dark mode toggle
- [ ] User authentication system
- [ ] Real-time data integration
- [ ] Advanced search functionality
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Offline functionality

## License

This project is created for educational and demonstration purposes. The Synopsys brand and design elements are property of Synopsys, Inc.

## Contributing

Feel free to fork this project and submit pull requests for improvements or bug fixes.

---

**Note**: This is a frontend-only implementation. For production use, you would need to integrate with backend services for authentication, data management, and other server-side functionality.
