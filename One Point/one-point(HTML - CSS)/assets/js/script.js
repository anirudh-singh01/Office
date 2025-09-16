/**
 * Synopsys.ai Copilot - Main JavaScript File
 * Handles sidebar navigation, mobile menu toggle, and content loading
 */

class SynopsysApp {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.getElementById('main-content');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileOverlay = document.getElementById('mobile-overlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMobileMenuOpen = false;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.bindEvents();
        this.setActiveMenuItem();
        this.handleResize();
        
        // Load welcome page by default with a small delay for smooth initialization
        setTimeout(() => {
            this.loadPageContent('welcome');
        }, 100);
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Mobile menu toggle
        this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        
        // Mobile overlay click to close menu
        this.mobileOverlay.addEventListener('click', () => this.closeMobileMenu());
        
        // Navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /**
     * Toggle mobile menu visibility
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
        this.sidebar.classList.add('open');
        this.mobileOverlay.classList.add('active');
        this.mobileToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isMobileMenuOpen = true;
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        this.sidebar.classList.remove('open');
        this.mobileOverlay.classList.remove('active');
        this.mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
        this.isMobileMenuOpen = false;
    }

    /**
     * Handle navigation link clicks
     */
    handleNavClick(e) {
        e.preventDefault();
        
        const clickedLink = e.currentTarget;
        const pageName = clickedLink.getAttribute('data-page');
        
        // Update active menu item
        this.setActiveMenuItem(clickedLink);
        
        // Load content for the selected page
        this.loadPageContent(pageName);
        
        // Close mobile menu if open
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Set active menu item
     */
    setActiveMenuItem(activeLink = null) {
        // Remove active class from all items
        this.navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
        });
        
        // Add active class to clicked item or first item by default
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
        } else {
            // Set first item as active by default
            this.navLinks[0].parentElement.classList.add('active');
        }
    }

    /**
     * Load page content dynamically using fetch()
     */
    async loadPageContent(pageName) {
        const contentContainer = this.mainContent.querySelector('.content-container');
        
        // Add loading state
        contentContainer.classList.add('content-loading');
        
        try {
            // Load content from corresponding HTML file
            const response = await fetch(`assets/pages/${pageName}.html`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const htmlContent = await response.text();
            
            // Parse the HTML content and extract the page content
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            const pageContent = doc.querySelector('.page-content');
            
            if (pageContent) {
                // Update content with loaded HTML
                contentContainer.innerHTML = `
                    <div class="content-placeholder">
                        ${pageContent.innerHTML}
                    </div>
                `;
            } else {
                // Fallback to default content if page content not found
                this.updateContentForPage(pageName, contentContainer);
            }
            
        } catch (error) {
            console.error('Error loading content:', error);
            this.showErrorContent(contentContainer);
        } finally {
            // Remove loading state
            contentContainer.classList.remove('content-loading');
        }
    }

    /**
     * Update content based on selected page (fallback method)
     */
    updateContentForPage(pageName, container) {
        const pageTitles = {
            'synopsys-copilot': 'Synopsys.ai Copilot',
            'custom-compiler': 'Custom Compiler',
            'fusion-compiler': 'Fusion Compiler',
            'primetime': 'PrimeTime',
            'vcs': 'VCS',
            'dso-ai': 'DSO.ai',
            'ic-validator': 'IC Validator',
            'vc-formal': 'VC Formal',
            'vc-low-power': 'VC Low Power',
            'vc-spyglass': 'VC SpyGlass',
            'verdi': 'Verdi',
            'testmax-atpg': 'TestMAX ATPG',
            'primesim-pro': 'PrimeSim Pro'
        };

        const title = pageTitles[pageName] || 'Unknown Tool';
        
        container.innerHTML = `
            <div class="content-placeholder">
                <h2>${title}</h2>
                <p>Welcome to ${title}. This is a placeholder for the ${title} tool interface.</p>
                <div class="tool-info">
                    <p><strong>Status:</strong> Coming Soon</p>
                    <p><strong>Description:</strong> This tool will be integrated into the Synopsys.ai Copilot platform.</p>
                </div>
            </div>
        `;
    }

    /**
     * Show error content
     */
    showErrorContent(container) {
        container.innerHTML = `
            <div class="content-placeholder">
                <h2>Error</h2>
                <p>Sorry, there was an error loading the content. Please try again.</p>
            </div>
        `;
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (!isMobile && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboard(e) {
        // Close mobile menu with Escape key
        if (e.key === 'Escape' && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Toggle mobile menu with Ctrl+M
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            this.toggleMobileMenu();
        }
    }
}

/**
 * Utility functions
 */
const Utils = {
    /**
     * Debounce function to limit function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the main application
    window.synopsysApp = new SynopsysApp();
    
    // Add any additional initialization here
    console.log('Synopsys.ai Copilot initialized successfully');
});

/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause any animations or timers
        console.log('Page hidden');
    } else {
        // Page is visible, resume animations or timers
        console.log('Page visible');
    }
});
