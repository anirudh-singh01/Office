/**
 * Synopsys.ai Copilot Dashboard JavaScript
 * Handles sidebar navigation, active state management, and iframe content switching
 */

// Development mode flag - set to false for production
const DEV_MODE = true;

// Console logging utility
const logger = {
    log: (message, ...args) => DEV_MODE && console.log(message, ...args),
    error: (message, ...args) => DEV_MODE && console.error(message, ...args),
    warn: (message, ...args) => DEV_MODE && console.warn(message, ...args)
};

// Configuration object for menu items and their corresponding URLs
const MENU_CONFIG = {
    'Custom Compiler *': 'https://snpsai-copilot-gtm/?product=cc',
    'DSO.ai': 'https://snpsai-copilot-gtm/?product=dso',
    'Fusion Compiler *': 'https://snpsai-copilot-gtm/?product=fc',
    'IC Validator': 'https://snpsai-copilot-gtm/?product=icv',
    'PrimeSim Pro': 'https://snpsai-copilot-gtm/?product=psim_pro',
    'PrimeSim SPICE': 'https://snpsai-copilot-gtm/?product=psim_spice',
    'PrimeSim XA': 'https://snpsai-copilot-gtm/?product=psim_xa',
    'PrimeTime *': 'https://snpsai-copilot-gtm/?product=pt',
    'S-Litho': 'https://snpsai-copilot-gtm/?product=slitho',
    'Synopsys.ai Copilot **': 'https://snpsai-copilot-gtm/?product=copilot',
    'TestMAX ATPG': 'https://snpsai-copilot-gtm/?product=tmax_atpg',
    'VCS': 'https://snpsai-copilot-gtm/?product=vcs',
    'VC Formal': 'https://snpsai-copilot-gtm/?product=vcformal',
    'VC Low Power': 'https://snpsai-copilot-gtm/?product=vclp',
    'VC SpyGlass': 'https://snpsai-copilot-gtm/?product=vcspyglass',
    'Verdi': 'https://snpsai-copilot-gtm/?product=verdi',
};

// URL routing configuration - maps URL parameters to tool names
const URL_ROUTES = {
    'cc': 'Custom Compiler *',
    'dso': 'DSO.ai',
    'fc': 'Fusion Compiler *',
    'icv': 'IC Validator',
    'psim_pro': 'PrimeSim Pro',
    'psim_spice': 'PrimeSim SPICE',
    'psim_xa': 'PrimeSim XA',
    'pt': 'PrimeTime *',
    'slitho': 'S-Litho',
    'copilot': 'Synopsys.ai Copilot **',
    'tmax_atpg': 'TestMAX ATPG',
    'vcs': 'VCS',
    'vcformal': 'VC Formal',
    'vclp': 'VC Low Power',
    'vcspyglass': 'VC SpyGlass',
    'verdi': 'Verdi',
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
        this.logoLink = null;
        this.isMobileMenuOpen = false;
        this.isSidebarCollapsed = false;
        this.welcomePage = null;
        this.mainContainer = null;
        this.loadingScreen = null;
        this.loadingToolName = null;
        
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
            this.checkWelcomePageState();
        });
    }

    /**
     * Set initial active state based on URL or default to no selection
     */
    setInitialActiveState() {
        const currentTool = this.getCurrentToolFromURL();
        
        if (currentTool) {
            this.switchToMenuItem(currentTool);
        } else {
            // No default selection - user should choose from welcome page
            // Clear any existing active states
            this.removeActiveState();
            
            // Ensure iframe is empty
            if (this.iframe) {
                this.iframe.src = '';
            }
            
            logger.log('No initial tool selected - user should choose from welcome page');
        }
    }

    /**
     * Cache DOM elements for better performance
     */
    setupElements() {
        this.welcomePage = document.getElementById('welcomePage');
        this.mainContainer = document.getElementById('mainContainer');
        this.iframe = document.getElementById('content-frame');
        this.sidebar = document.querySelector('.sidebar');
        this.hamburgerMenu = document.getElementById('hamburgerMenu');
        this.sidebarOverlay = document.querySelector('.sidebar-overlay');
        this.logoLink = document.getElementById('logoLink');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.loadingToolName = document.getElementById('loadingToolName');
        
        if (!this.welcomePage) {
            logger.error('Welcome page not found');
        }
        if (!this.mainContainer) {
            logger.error('Main container not found');
        }
        if (!this.iframe) {
            logger.error('Content iframe not found');
        }
        if (!this.sidebar) {
            logger.error('Sidebar not found');
        }
        if (!this.hamburgerMenu) {
            logger.error('Hamburger menu button not found');
        }
        if (!this.logoLink) {
            logger.error('Logo link not found');
        }
        if (!this.loadingScreen) {
            logger.error('Loading screen not found');
        }
        if (!this.loadingToolName) {
            logger.error('Loading tool name element not found');
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
        this.setupWelcomePageListeners();
        this.setupMenuClickListeners();
        this.setupMobileMenuListener();
        this.setupLogoClickListener();
        this.setupResizeListener();
        this.setupBrowserNavigationListener();
        this.setupSearchFunctionality();
        this.setupSidebarSearchFunctionality();
    }

    /**
     * Set up welcome page event listeners
     */
    setupWelcomePageListeners() {
        // Set up tool card click listeners
        this.setupToolCardListeners();
    }

    /**
     * Check if user should see welcome page
     */
    checkWelcomePageState() {
        // Check if there's a URL parameter indicating a specific tool
        const urlParams = new URLSearchParams(window.location.search);
        const product = urlParams.get('product');
        
        if (product && URL_ROUTES[product]) {
            // User has a specific tool in URL, show dashboard
            this.showDashboard();
            // Initialize dashboard functionality
            this.setInitialActiveState();
        } else {
            // No specific tool, show welcome page
            this.showWelcomePage();
        }
    }

    /**
     * Show welcome page
     */
    showWelcomePage() {
        if (this.welcomePage && this.mainContainer) {
            this.welcomePage.style.display = 'flex';
            this.mainContainer.style.display = 'none';
            // Hide hamburger menu on welcome page
            document.body.classList.add('welcome-page-active');
            logger.log('Welcome page displayed');
        }
    }

    /**
     * Show main dashboard
     */
    showDashboard() {
        if (this.welcomePage && this.mainContainer) {
            this.welcomePage.style.display = 'none';
            this.mainContainer.style.display = 'flex';
            // Show hamburger menu on dashboard
            document.body.classList.remove('welcome-page-active');
            logger.log('Dashboard displayed');
        }
    }


    /**
     * Set up tool card click listeners on welcome page
     */
    setupToolCardListeners() {
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
            card.addEventListener('click', () => {
                const toolName = card.getAttribute('data-tool');
                if (toolName) {
                    this.selectToolFromWelcome(toolName);
                }
            });
            
            // Add keyboard accessibility
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const toolName = card.getAttribute('data-tool');
                    if (toolName) {
                        this.selectToolFromWelcome(toolName);
                    }
                }
            });
            
            // Make cards focusable
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Select ${card.getAttribute('data-tool')}`);
        });
    }

    /**
     * Handle tool selection from welcome page
     * @param {string} toolName - The name of the selected tool
     */
    selectToolFromWelcome(toolName) {
        // Show dashboard first
        this.showDashboard();
        
        // Initialize dashboard functionality
        this.setInitialActiveState();
        
        // Switch to the selected tool
        this.switchToMenuItem(toolName);
        
        logger.log(`User selected tool from welcome page: ${toolName}`);
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
            logger.error('Invalid menu item or link provided');
            return;
        }
        
        const menuText = link.textContent.trim();
        const dataSrc = link.getAttribute('data-src');
        
        if (!menuText) {
            logger.error('Menu item has no text content');
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
        
        logger.log(`Switched to: ${menuText} - Loading: ${dataSrc}`);
    }

    /**
     * Remove active state from all menu items
     */
    removeActiveState() {
        // Remove active class from all nav items
        const allNavItems = document.querySelectorAll('.nav-item');
        allNavItems.forEach(item => {
            item.classList.remove('active');
            const link = item.querySelector('.nav-link');
            if (link) {
                link.removeAttribute('aria-current');
            }
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
        const link = item.querySelector('.nav-link');
        if (link) {
            link.setAttribute('aria-current', 'page');
        }
        this.currentActiveItem = item;
    }

    /**
     * Update iframe source based on menu selection
     * @param {string} menuText - The text content of the clicked menu item
     * @param {string} dataSrc - The data-src attribute from the clicked link
     */
    updateIframeSource(menuText, dataSrc) {
        if (!this.iframe) {
            logger.error('Iframe element not found');
            return;
        }
        
        // Use data-src if available, otherwise fall back to MENU_CONFIG
        const url = dataSrc || MENU_CONFIG[menuText];
        
        if (!url) {
            logger.error(`No URL found for menu item: ${menuText}`);
            return;
        }
        
        // Show loading screen
        this.showLoadingScreen(menuText);
        
        // Update iframe source
        this.iframe.src = url;
        
        // Handle iframe load events
        this.iframe.onload = () => {
            this.hideLoadingScreen();
            logger.log(`Iframe loaded successfully: ${url}`);
        };
        
        this.iframe.onerror = () => {
            this.hideLoadingScreen();
            logger.error(`Failed to load iframe: ${url}`);
            // Optionally show user-friendly error message
            this.showErrorMessage('Failed to load content. Please try again.');
        };
        
        logger.log(`Iframe source updated to: ${url}`);
    }

    /**
     * Set up hamburger menu functionality for both mobile and desktop
     */
    setupMobileMenuListener() {
        if (this.hamburgerMenu) {
            this.hamburgerMenu.addEventListener('click', () => {
                if (window.innerWidth <= 1366) {
                    // Mobile/Tablet/Small Laptop behavior: toggle overlay menu
                    this.toggleMobileMenu();
                } else {
                    // Large Desktop behavior: toggle sidebar collapse
                    this.toggleSidebarCollapse();
                }
            });
        }
    }

    /**
     * Set up logo click functionality to return to default state
     */
    setupLogoClickListener() {
        if (this.logoLink) {
            this.logoLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetToDefaultState();
            });
        }
    }

    /**
     * Reset application to default state (like when first opened)
     */
    resetToDefaultState() {
        // Always return to welcome page when logo is clicked
        this.showWelcomePage();
        
        // Clear URL parameters to return to clean state
        const newURL = window.location.pathname;
        window.history.pushState({ product: null }, '', newURL);
        
        // Close mobile menu if open
        this.closeMobileMenu();
        
        logger.log('Application reset to welcome page');
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
     * Toggle sidebar collapse state for desktop
     */
    toggleSidebarCollapse() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
        const mainContent = document.querySelector('.main-content');
        
        if (this.isSidebarCollapsed) {
            // Collapse sidebar
            if (this.sidebar) {
                this.sidebar.classList.add('collapsed');
            }
            if (mainContent) {
                mainContent.classList.add('sidebar-collapsed');
            }
            // Update ARIA attributes
            if (this.hamburgerMenu) {
                this.hamburgerMenu.setAttribute('aria-expanded', 'false');
            }
            logger.log('Sidebar collapsed');
        } else {
            // Expand sidebar
            if (this.sidebar) {
                this.sidebar.classList.remove('collapsed');
            }
            if (mainContent) {
                mainContent.classList.remove('sidebar-collapsed');
            }
            // Update ARIA attributes
            if (this.hamburgerMenu) {
                this.hamburgerMenu.setAttribute('aria-expanded', 'true');
            }
            logger.log('Sidebar expanded');
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
        
        // Update ARIA attributes
        if (this.hamburgerMenu) {
            this.hamburgerMenu.setAttribute('aria-expanded', 'true');
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
        
        // Update ARIA attributes
        if (this.hamburgerMenu) {
            this.hamburgerMenu.setAttribute('aria-expanded', 'false');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    /**
     * Set up window resize listener for responsive behavior
     */
    setupResizeListener() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1366) {
                // Switched to large desktop mode (15.5+ inch screens)
                if (this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
                // If sidebar was collapsed, expand it on large desktop
                if (this.isSidebarCollapsed && this.sidebar) {
                    this.sidebar.classList.remove('collapsed');
                    const mainContent = document.querySelector('.main-content');
                    if (mainContent) {
                        mainContent.classList.remove('sidebar-collapsed');
                    }
                    this.isSidebarCollapsed = false;
                }
            } else {
                // Switched to mobile/tablet/small laptop mode (below 15.5 inch screens)
                // Reset sidebar collapse state and close mobile menu if open
                if (this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
                if (this.isSidebarCollapsed && this.sidebar) {
                    this.sidebar.classList.remove('collapsed');
                    const mainContent = document.querySelector('.main-content');
                    if (mainContent) {
                        mainContent.classList.remove('sidebar-collapsed');
                    }
                    this.isSidebarCollapsed = false;
                }
            }
        });
    }



    /**
     * Show loading screen while iframe loads
     * @param {string} toolName - The name of the tool being loaded
     */
    showLoadingScreen(toolName) {
        if (this.loadingScreen && this.loadingToolName) {
            // Update the tool name in the loading screen
            this.loadingToolName.textContent = toolName;
            
            // Show the loading screen
            this.loadingScreen.classList.add('active');
            
            logger.log(`Loading screen shown for: ${toolName}`);
        }
    }

    /**
     * Hide loading screen after iframe loads
     */
    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('active');
            logger.log('Loading screen hidden');
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
            logger.error('Invalid menu text provided');
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
        
        logger.warn(`Menu item not found: ${menuText}`);
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
            logger.log(`URL updated to: ${newURL}`);
        }
    }

    /**
     * Set up search functionality for tools
     */
    setupSearchFunctionality() {
        const searchInput = document.getElementById('toolSearch');
        const clearButton = document.getElementById('clearSearch');
        const resultsInfo = document.getElementById('searchResultsInfo');
        
        if (!searchInput || !clearButton || !resultsInfo) {
            logger.error('Search elements not found');
            return;
        }
        
        // Search input event listener
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // Clear button event listener
        clearButton.addEventListener('click', () => {
            this.clearSearch();
        });
        
        // Keyboard shortcuts
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
                searchInput.blur();
            }
        });
        
        logger.log('Search functionality initialized');
    }
    
    /**
     * Handle search input
     * @param {string} searchTerm - The search term entered by user
     */
    handleSearch(searchTerm) {
        const clearButton = document.getElementById('clearSearch');
        const resultsInfo = document.getElementById('searchResultsInfo');
        const toolCards = document.querySelectorAll('.tool-card');
        
        if (!searchTerm || searchTerm.trim() === '') {
            this.clearSearch();
            return;
        }
        
        // Show clear button
        clearButton.classList.add('visible');
        
        const searchLower = searchTerm.toLowerCase().trim();
        let visibleCount = 0;
        
        toolCards.forEach(card => {
            const toolName = card.getAttribute('data-tool').toLowerCase();
            const toolTitle = card.querySelector('h3').textContent.toLowerCase();
            const toolDescription = card.querySelector('p').textContent.toLowerCase();
            
            // Check if search term matches tool name, title, or description
            const isMatch = toolName.includes(searchLower) || 
                          toolTitle.includes(searchLower) || 
                          toolDescription.includes(searchLower);
            
            if (isMatch) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.3s ease-out';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update results info
        if (visibleCount === 0) {
            resultsInfo.textContent = 'No tools found matching your search';
            resultsInfo.style.color = '#ef4444';
        } else if (visibleCount === toolCards.length) {
            resultsInfo.textContent = '';
        } else {
            resultsInfo.textContent = `Found ${visibleCount} tool${visibleCount === 1 ? '' : 's'}`;
            resultsInfo.style.color = '#6b7280';
        }
        
        logger.log(`Search completed: "${searchTerm}" - ${visibleCount} results`);
    }
    
    /**
     * Clear search and show all tools
     */
    clearSearch() {
        const searchInput = document.getElementById('toolSearch');
        const clearButton = document.getElementById('clearSearch');
        const resultsInfo = document.getElementById('searchResultsInfo');
        const toolCards = document.querySelectorAll('.tool-card');
        
        // Clear search input
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Hide clear button
        if (clearButton) {
            clearButton.classList.remove('visible');
        }
        
        // Clear results info
        if (resultsInfo) {
            resultsInfo.textContent = '';
        }
        
        // Show all tool cards
        toolCards.forEach(card => {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.3s ease-out';
        });
        
        logger.log('Search cleared - all tools visible');
    }

    /**
     * Set up sidebar search functionality for tools
     */
    setupSidebarSearchFunctionality() {
        const sidebarSearchInput = document.getElementById('sidebarToolSearch');
        const sidebarClearButton = document.getElementById('sidebarClearSearch');
        const sidebarResultsInfo = document.getElementById('sidebarSearchResultsInfo');
        
        if (!sidebarSearchInput || !sidebarClearButton || !sidebarResultsInfo) {
            logger.error('Sidebar search elements not found');
            return;
        }
        
        // Search input event listener
        sidebarSearchInput.addEventListener('input', (e) => {
            this.handleSidebarSearch(e.target.value);
        });
        
        // Clear button event listener
        sidebarClearButton.addEventListener('click', () => {
            this.clearSidebarSearch();
        });
        
        // Keyboard shortcuts
        sidebarSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSidebarSearch();
                sidebarSearchInput.blur();
            }
        });
        
        logger.log('Sidebar search functionality initialized');
    }
    
    /**
     * Handle sidebar search input
     * @param {string} searchTerm - The search term entered by user
     */
    handleSidebarSearch(searchTerm) {
        const sidebarClearButton = document.getElementById('sidebarClearSearch');
        const sidebarResultsInfo = document.getElementById('sidebarSearchResultsInfo');
        const navItems = document.querySelectorAll('.nav-item');
        
        if (!searchTerm || searchTerm.trim() === '') {
            this.clearSidebarSearch();
            return;
        }
        
        // Show clear button
        sidebarClearButton.classList.add('visible');
        
        const searchLower = searchTerm.toLowerCase().trim();
        let visibleCount = 0;
        
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (!link) return;
            
            const toolText = link.textContent.toLowerCase();
            
            // Check if search term matches tool name
            const isMatch = toolText.includes(searchLower);
            
            if (isMatch) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.2s ease-out';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update results info
        if (visibleCount === 0) {
            sidebarResultsInfo.textContent = 'No tools found';
            sidebarResultsInfo.style.color = '#ef4444';
        } else if (visibleCount === navItems.length) {
            sidebarResultsInfo.textContent = '';
        } else {
            sidebarResultsInfo.textContent = `${visibleCount} tool${visibleCount === 1 ? '' : 's'}`;
            sidebarResultsInfo.style.color = '#6b7280';
        }
        
        logger.log(`Sidebar search completed: "${searchTerm}" - ${visibleCount} results`);
    }
    
    /**
     * Clear sidebar search and show all tools
     */
    clearSidebarSearch() {
        const sidebarSearchInput = document.getElementById('sidebarToolSearch');
        const sidebarClearButton = document.getElementById('sidebarClearSearch');
        const sidebarResultsInfo = document.getElementById('sidebarSearchResultsInfo');
        const navItems = document.querySelectorAll('.nav-item');
        
        // Clear search input
        if (sidebarSearchInput) {
            sidebarSearchInput.value = '';
        }
        
        // Hide clear button
        if (sidebarClearButton) {
            sidebarClearButton.classList.remove('visible');
        }
        
        // Clear results info
        if (sidebarResultsInfo) {
            sidebarResultsInfo.textContent = '';
        }
        
        // Show all nav items
        navItems.forEach(item => {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.2s ease-out';
        });
        
        logger.log('Sidebar search cleared - all tools visible');
    }

    /**
     * Set up browser back/forward navigation listener
     */
    setupBrowserNavigationListener() {
        window.addEventListener('popstate', (event) => {
            const urlParams = new URLSearchParams(window.location.search);
            const product = urlParams.get('product');
            
            if (product && URL_ROUTES[product]) {
                // There's a product parameter, show dashboard and switch to that tool
                this.showDashboard();
                const productName = URL_ROUTES[product];
                this.switchToMenuItem(productName);
            } else {
                // No product parameter, show welcome page
                this.showWelcomePage();
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
     * Set initial active state based on URL or default to no selection
     */
    setInitialActiveState() {
        const currentTool = this.getCurrentToolFromURL();
        
        if (currentTool) {
            this.switchToMenuItem(currentTool);
        } else {
            // No default selection - user should choose from welcome page
            // Clear any existing active states
            this.removeActiveState();
            
            // Ensure iframe is empty
            if (this.iframe) {
                this.iframe.src = '';
            }
            
            logger.log('No initial tool selected - user should choose from welcome page');
        }
    }
}

// Initialize the dashboard when the script loads
const dashboard = new Dashboard();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}