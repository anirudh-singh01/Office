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
            this.setInitialActiveState();
        });
    }

    /**
     * Cache DOM elements for better performance
     */
    setupElements() {
        this.iframe = document.getElementById('content-frame');
        this.sidebar = document.querySelector('.sidebar');
        this.hamburgerMenu = document.getElementById('hamburgerMenu');
        
        if (!this.iframe) {
            console.error('Content iframe not found');
        }
        if (!this.sidebar) {
            console.error('Sidebar not found');
        }
        if (!this.hamburgerMenu) {
            console.error('Hamburger menu button not found');
        }
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        this.setupMenuClickListeners();
        this.setupMobileMenuListener();
        this.setupResizeListener();
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
        const menuText = link.textContent.trim();
        const dataSrc = link.getAttribute('data-src');
        
        // Remove active class from current active item
        this.removeActiveState();
        
        // Add active class to clicked item
        this.setActiveState(item);
        
        // Update iframe source
        this.updateIframeSource(menuText, dataSrc);
        
        // Close mobile menu if open
        this.closeMobileMenu();
        
        console.log(`Switched to: ${menuText} - Loading: ${dataSrc}`);
    }

    /**
     * Remove active state from current active menu item
     */
    removeActiveState() {
        if (this.currentActiveItem) {
            this.currentActiveItem.classList.remove('active');
        }
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
        if (!this.iframe) return;
        
        // Use data-src if available, otherwise fall back to MENU_CONFIG
        const url = dataSrc || MENU_CONFIG[menuText] || 'https://example.com';
        
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
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        if (this.sidebar) {
            this.sidebar.classList.remove('open');
            this.isMobileMenuOpen = false;
        }
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
     * Set initial active state (Synopsys.ai Copilot)
     */
    setInitialActiveState() {
        const initialItem = document.querySelector('.nav-item.active');
        if (initialItem) {
            this.currentActiveItem = initialItem;
        }
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
     * Public method to programmatically switch to a menu item
     * @param {string} menuText - The menu item text to switch to
     */
    switchToMenuItem(menuText) {
        const navItems = document.querySelectorAll('.nav-item');
        
        for (let item of navItems) {
            const link = item.querySelector('.nav-link');
            if (link && link.textContent.trim() === menuText) {
                this.handleMenuClick(item, link);
                break;
            }
        }
    }

    /**
     * Public method to update iframe source programmatically
     * @param {string} url - The URL to load in the iframe
     */
    loadIframeContent(url) {
        if (!this.iframe) return;
        
        this.showLoadingIndicator();
        this.iframe.src = url;
        
        this.iframe.onload = () => {
            this.hideLoadingIndicator();
            console.log(`Iframe loaded successfully: ${url}`);
        };
        
        this.iframe.onerror = () => {
            this.hideLoadingIndicator();
            console.error(`Failed to load iframe: ${url}`);
        };
    }
}

// Initialize the dashboard when the script loads
const dashboard = new Dashboard();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}