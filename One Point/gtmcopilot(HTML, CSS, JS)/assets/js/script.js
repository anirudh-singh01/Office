/**
 * Synopsys.ai Copilot Dashboard JavaScript
 * Handles sidebar navigation, active state management, and iframe content switching
 */

// Configuration object for menu items and their corresponding URLs
const MENU_CONFIG = {
    'Fusion Compiler *': 'https://snpsai-copilot-gtm/?product=fc',
    'PrimeTime *': 'https://snpsai-copilot-gtm/?product=pt',
    'Custom Compiler *': 'https://snpsai-copilot-gtm/?product=cc',
    'VCS': 'https://snpsai-copilot-gtm/?product=vcs',
    'DSO.ai': 'https://snpsai-copilot-gtm/?product=dso',
    'IC Validator': 'https://snpsai-copilot-gtm/?product=icv',
    'PrimeSim Pro': 'https://snpsai-copilot-gtm/?product=psim_pro',
    'VC Formal': 'https://snpsai-copilot-gtm/?product=vcformal',
    'VC Low Power': 'https://snpsai-copilot-gtm/?product=vclp',
    'VC SpyGlass': 'https://snpsai-copilot-gtm/?product=vcspyglass',
    'Verdi': 'https://snpsai-copilot-gtm/?product=verdi',
    'Synopsys.ai Copilot': 'https://snpsai-copilot-gtm/?product=copilot'
};

// URL routing configuration - maps URL parameters to tool names
const URL_ROUTES = {
    'fc': 'Fusion Compiler *',
    'pt': 'PrimeTime *',
    'cc': 'Custom Compiler *',
    'vcs': 'VCS',
    'dso': 'DSO.ai',
    'icv': 'IC Validator',
    'psim_pro': 'PrimeSim Pro',
    'vcformal': 'VC Formal',
    'vclp': 'VC Low Power',
    'vcspyglass': 'VC SpyGlass',
    'verdi': 'Verdi',
    'copilot': 'Synopsys.ai Copilot'
};

/**
 * Main Dashboard Class
 * Manages all dashboard functionality including navigation and mobile menu
 */
class Dashboard {
    constructor() {
        this.currentActiveItem = null;
        this.iframe = null;
        this.sidebar = null;
        this.hamburgerMenu = null;
        this.sidebarOverlay = null;
        this.isMobileMenuOpen = false;
        
        this.init();
    }

    /**
     * Initialize the dashboard
     * Sets up event listeners and initial state
     */
    init() {
        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.setupElements();
            this.setupEventListeners();
            this.handleInitialRoute();
            this.ensureProperInitialState();
        });
    }

    /**
     * Ensure proper initial state - remove any stray active classes
     */
    ensureProperInitialState() {
        // Remove active class from all items first
        this.removeActiveState();
        
        // Then set the correct initial state
        this.setInitialActiveState();
    }

    /**
     * Cache DOM elements for better performance
     */
    setupElements() {
        this.iframe = document.getElementById('content-frame');
        this.sidebar = document.querySelector('.sidebar');
        this.hamburgerMenu = document.getElementById('hamburgerMenu');
        this.sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        if (!this.iframe) {
            console.error('Content iframe not found');
        }
        if (!this.sidebar) {
            console.error('Sidebar not found');
        }
        if (!this.hamburgerMenu) {
            console.error('Hamburger menu button not found');
        }
        
        // Create overlay if it doesn't exist
        if (!this.sidebarOverlay) {
            this.createSidebarOverlay();
        }
    }

    /**
     * Create sidebar overlay for mobile
     */
    createSidebarOverlay() {
        this.sidebarOverlay = document.createElement('div');
        this.sidebarOverlay.className = 'sidebar-overlay';
        this.sidebarOverlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });
        document.body.appendChild(this.sidebarOverlay);
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        this.setupMenuClickListeners();
        this.setupMobileMenuListener();
        this.setupResizeListener();
        this.setupBrowserNavigationListener();
    }

    /**
     * Add click event listeners to all navigation menu items
     */
    setupMenuClickListeners() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleMenuClick(item, link);
                });
            }
        });
    }

    /**
     * Handle menu item click
     * @param {HTMLElement} item - The nav item element
     * @param {HTMLElement} link - The nav link element
     */
    handleMenuClick(item, link) {
        if (!item || !link) {
            console.error('Invalid menu item or link provided');
            return;
        }
        
        const menuText = link.textContent.trim();
        const dataSrc = link.getAttribute('data-src');
        
        if (!menuText) {
            console.error('Menu item has no text content');
            return;
        }
        
        // Remove active class from current active item
        this.removeActiveState();
        
        // Add active class to clicked item
        this.setActiveState(item);
        
        // Update iframe source
        this.updateIframeSource(menuText, dataSrc);
        
        // Update URL to reflect current tool
        this.updateURL(menuText);
        
        // Close mobile menu if open
        this.closeMobileMenu();
        
        console.log(`Switched to: ${menuText} - Loading: ${dataSrc}`);
    }

    /**
     * Remove active state from all menu items
     */
    removeActiveState() {
        // Remove active class from all nav items
        const allNavItems = document.querySelectorAll('.nav-item');
        allNavItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Clear current active item reference
        this.currentActiveItem = null;
    }

    /**
     * Set active state for the clicked menu item
     * @param {HTMLElement} item - The nav item element to activate
     */
    setActiveState(item) {
        item.classList.add('active');
        this.currentActiveItem = item;
    }

    /**
     * Update iframe source based on menu selection
     * @param {string} menuText - The text content of the clicked menu item
     * @param {string} dataSrc - The data-src attribute from the clicked link
     */
    updateIframeSource(menuText, dataSrc) {
        if (!this.iframe) {
            console.error('Iframe element not found');
            return;
        }
        
        // Use data-src if available, otherwise fall back to MENU_CONFIG
        const url = dataSrc || MENU_CONFIG[menuText];
        
        if (!url) {
            console.error(`No URL found for menu item: ${menuText}`);
            return;
        }
        
        // Add loading indicator
        this.showLoadingIndicator();
        
        // Update iframe source
        this.iframe.src = url;
        
        // Handle iframe load events
        this.iframe.onload = () => {
            this.hideLoadingIndicator();
            console.log(`Iframe loaded successfully: ${url}`);
        };
        
        this.iframe.onerror = () => {
            this.hideLoadingIndicator();
            console.error(`Failed to load iframe: ${url}`);
            // Optionally show user-friendly error message
            this.showErrorMessage('Failed to load content. Please try again.');
        };
        
        console.log(`Iframe source updated to: ${url}`);
    }

    /**
     * Set up mobile hamburger menu functionality
     */
    setupMobileMenuListener() {
        if (this.hamburgerMenu) {
            this.hamburgerMenu.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    /**
     * Toggle mobile menu open/closed state
     */
    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        if (this.isMobileMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        if (this.sidebar) {
            this.sidebar.classList.add('open');
            this.isMobileMenuOpen = true;
        }
        
        if (this.sidebarOverlay) {
            this.sidebarOverlay.classList.add('active');
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        if (this.sidebar) {
            this.sidebar.classList.remove('open');
            this.isMobileMenuOpen = false;
        }
        
        if (this.sidebarOverlay) {
            this.sidebarOverlay.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    /**
     * Set up window resize listener for responsive behavior
     */
    setupResizeListener() {
        window.addEventListener('resize', () => {
            // Close mobile menu on desktop resize
            if (window.innerWidth > 768 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }


    /**
     * Public method to update menu configuration
     * @param {Object} newConfig - New menu configuration object
     */
    updateMenuConfig(newConfig) {
        Object.assign(MENU_CONFIG, newConfig);
        console.log('Menu configuration updated');
    }

    /**
     * Show loading indicator while iframe loads
     */
    showLoadingIndicator() {
        if (this.iframe) {
            this.iframe.style.opacity = '0.5';
            this.iframe.style.transition = 'opacity 0.3s ease';
        }
    }

    /**
     * Hide loading indicator after iframe loads
     */
    hideLoadingIndicator() {
        if (this.iframe) {
            this.iframe.style.opacity = '1';
        }
    }

    /**
     * Show error message to user
     * @param {string} message - Error message to display
     */
    showErrorMessage(message) {
        // Create error message element if it doesn't exist
        let errorElement = document.getElementById('error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'error-message';
            errorElement.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ff4444;
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                z-index: 10000;
                font-family: 'Segoe UI', sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    /**
     * Public method to programmatically switch to a menu item
     * @param {string} menuText - The menu item text to switch to
     */
    switchToMenuItem(menuText) {
        if (!menuText || typeof menuText !== 'string') {
            console.error('Invalid menu text provided');
            return;
        }
        
        const navItems = document.querySelectorAll('.nav-item');
        
        for (let item of navItems) {
            const link = item.querySelector('.nav-link');
            if (link && link.textContent.trim() === menuText) {
                this.handleMenuClick(item, link);
                return;
            }
        }
        
        console.warn(`Menu item not found: ${menuText}`);
    }

    /**
     * Public method to update iframe source programmatically
     * @param {string} url - The URL to load in the iframe
     */
    loadIframeContent(url) {
        if (!this.iframe) {
            console.error('Iframe element not found');
            return;
        }
        
        if (!url || typeof url !== 'string') {
            console.error('Invalid URL provided');
            return;
        }
        
        this.showLoadingIndicator();
        this.iframe.src = url;
        
        this.iframe.onload = () => {
            this.hideLoadingIndicator();
            console.log(`Iframe loaded successfully: ${url}`);
        };
        
        this.iframe.onerror = () => {
            this.hideLoadingIndicator();
            console.error(`Failed to load iframe: ${url}`);
            this.showErrorMessage('Failed to load content. Please try again.');
        };
    }

    /**
     * Handle initial route from URL parameters
     */
    handleInitialRoute() {
        const urlParams = new URLSearchParams(window.location.search);
        const product = urlParams.get('product');
        
        if (product && URL_ROUTES[product]) {
            const productName = URL_ROUTES[product];
            this.switchToMenuItem(productName);
        } else {
            // Default to Fusion Compiler if no valid product parameter
            this.setInitialActiveState();
        }
    }

    /**
     * Update browser URL to reflect current product
     * @param {string} menuText - The menu item text
     */
    updateURL(menuText) {
        // Find the URL parameter for this product
        const productParam = Object.keys(URL_ROUTES).find(key => URL_ROUTES[key] === menuText);
        
        if (productParam) {
            const newURL = `${window.location.pathname}?product=${productParam}`;
            window.history.pushState({ product: productParam }, '', newURL);
            console.log(`URL updated to: ${newURL}`);
        }
    }

    /**
     * Set up browser back/forward navigation listener
     */
    setupBrowserNavigationListener() {
        window.addEventListener('popstate', (event) => {
            const urlParams = new URLSearchParams(window.location.search);
            const product = urlParams.get('product');
            
            if (product && URL_ROUTES[product]) {
                const productName = URL_ROUTES[product];
                this.switchToMenuItem(productName);
            } else {
                // Default to Fusion Compiler if no valid product parameter
                this.switchToMenuItem('Fusion Compiler *');
            }
        });
    }

    /**
     * Get current product from URL
     * @returns {string|null} - Current product name or null
     */
    getCurrentToolFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const product = urlParams.get('product');
        return product ? URL_ROUTES[product] : null;
    }

    /**
     * Set initial active state based on URL or default to Fusion Compiler
     */
    setInitialActiveState() {
        const currentTool = this.getCurrentToolFromURL();
        
        if (currentTool) {
            this.switchToMenuItem(currentTool);
        } else {
            // Default to Fusion Compiler - find the first nav item with active class
            const initialItem = document.querySelector('.nav-item.active');
            if (initialItem) {
                this.currentActiveItem = initialItem;
                // Ensure the iframe loads the correct content
                const link = initialItem.querySelector('.nav-link');
                if (link) {
                    const dataSrc = link.getAttribute('data-src');
                    if (dataSrc && this.iframe) {
                        this.iframe.src = dataSrc;
                    }
                }
            }
        }
    }
}

// Initialize the dashboard when the script loads
const dashboard = new Dashboard();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}