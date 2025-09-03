// DOM Elements
const sidebar = document.getElementById('sidebar');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const closeSidebar = document.getElementById('closeSidebar');
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');
const loginSubmitBtn = document.querySelector('.login-submit-btn');
const usernameInput = document.querySelector('.username-input');

// Mobile Menu Toggle
function toggleMobileMenu() {
    sidebar.classList.toggle('open');
}

// Close Mobile Menu
function closeMobileMenu() {
    sidebar.classList.remove('open');
}

// Content Navigation
function showContent(contentId) {
    // Hide all content sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected content section
    const targetSection = document.getElementById(contentId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active menu item
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeMenuItem = document.querySelector(`[data-content="${contentId}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    // Close mobile menu on mobile devices
    if (window.innerWidth <= 768) {
        closeMobileMenu();
    }
}

// Login Form Handler
function handleLogin() {
    const username = usernameInput.value.trim();
    
    if (!username) {
        showNotification('Please enter a username', 'error');
        return;
    }
    
    // Show loading state
    const originalText = loginSubmitBtn.innerHTML;
    loginSubmitBtn.innerHTML = '<span class="loading"></span> Logging in...';
    loginSubmitBtn.disabled = true;
    
    // Simulate login process
    setTimeout(() => {
        showNotification(`Welcome, ${username}!`, 'success');
        loginSubmitBtn.innerHTML = originalText;
        loginSubmitBtn.disabled = false;
        usernameInput.value = '';
    }, 2000);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });
}

// Helper functions for notifications
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#6b46c1'
    };
    return colors[type] || colors.info;
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Enter key on login form
    if (e.key === 'Enter' && document.activeElement === usernameInput) {
        handleLogin();
    }
}

// Window Resize Handler
function handleWindowResize() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

// Initialize Application
function initApp() {
    // Event Listeners
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    closeSidebar.addEventListener('click', closeMobileMenu);
    
    // Menu item click handlers
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const contentId = item.getAttribute('data-content');
            showContentWithLoading(contentId);
        });
    });
    
    // Login form handlers
    loginSubmitBtn.addEventListener('click', handleLogin);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    // Global event listeners
    document.addEventListener('keydown', handleKeyboardNavigation);
    window.addEventListener('resize', handleWindowResize);
    
    // Click outside sidebar to close on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !mobileMenuToggle.contains(e.target) &&
            sidebar.classList.contains('open')) {
            closeMobileMenu();
        }
    });
    
    // Add CSS animations for notifications and loading
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            transition: background-color 0.3s ease;
        }
        
        .notification-close:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .loading-spinner {
            text-align: center;
        }
        
        .loading-spinner p {
            margin-top: 15px;
            color: #6b46c1;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to Synopsys.ai Copilot!', 'info');
    }, 1000);
}

// Enhanced Menu Item Interactions
function enhanceMenuInteractions() {
    menuItems.forEach(item => {
        // Add hover effects
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                item.style.transform = 'translateX(5px)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
        
        // Add click feedback
        item.addEventListener('click', () => {
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Content Loading Simulation
function simulateContentLoading(contentId) {
    const targetSection = document.getElementById(contentId);
    if (targetSection) {
        // Add loading state
        targetSection.style.opacity = '0.5';
        targetSection.style.pointerEvents = 'none';
        
        setTimeout(() => {
            targetSection.style.opacity = '1';
            targetSection.style.pointerEvents = 'auto';
        }, 300);
    }
}

// Enhanced Content Navigation with Loading
function showContentWithLoading(contentId) {
    // Show loading state
    const contentWrapper = document.querySelector('.content-wrapper');
    
    // Add loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="loading"></div>
            <p>Loading ${getContentTitle(contentId)}...</p>
        </div>
    `;
    contentWrapper.appendChild(loadingOverlay);
    
    // Simulate loading time
    setTimeout(() => {
        // Remove loading overlay
        if (loadingOverlay.parentNode) {
            loadingOverlay.remove();
        }
        
        // Load custom page content
        const customUrl = getCustomUrl(contentId);
        loadCustomPageContent(contentId, customUrl);
        
        // Show notification
        showNotification(`${getContentTitle(contentId)} loaded successfully!`, 'success');
    }, 800);
}

// Helper function to get custom URLs for each menu item
function getCustomUrl(contentId) {
    const customUrls = {
        'synopsys-copilot': 'https://www.youtube.com/',
        'custom-compiler': 'https://www.youtube.com/',
        'fusion-compiler': 'https://www.youtube.com/',
        'primetime': 'https://www.youtube.com/',
        'vcs': 'https://www.youtube.com/',
        'dso-ai': 'https://www.youtube.com/',
        'ic-validator': 'https://www.youtube.com/',
        'vc-formal': 'https://www.youtube.com/',
        'vc-low-power': 'https://www.youtube.com/',
        'vc-spyglass': 'https://www.youtube.com/',
        'verdi': 'https://www.youtube.com/',
        'testmax-atpg': 'https://www.youtube.com/',
        'primesim-pro': 'https://www.youtube.com/'
    };
    return customUrls[contentId] || 'https://www.youtube.com/';
}

// Function to load custom page content in full screen
function loadCustomPageContent(contentId, customUrl) {
    // Hide all content sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Update active menu item
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeMenuItem = document.querySelector(`[data-content="${contentId}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    // Create or update custom page content section
    let customPageSection = document.getElementById('custom-page-content');
    if (!customPageSection) {
        customPageSection = document.createElement('div');
        customPageSection.id = 'custom-page-content';
        customPageSection.className = 'content-section active';
        document.querySelector('.content-wrapper').appendChild(customPageSection);
    } else {
        customPageSection.classList.add('active');
    }
    
    // Create full-screen iframe content
    customPageSection.innerHTML = `
        <div class="custom-page-header">
            <div class="page-info">
                <i class="fas fa-globe"></i>
                <span class="page-url">${customUrl}</span>
            </div>
            <div class="page-actions">
                <a href="${customUrl}" target="_blank" class="page-btn">
                    <i class="fas fa-external-link-alt"></i>
                    Open in New Tab
                </a>
                <button class="refresh-btn" onclick="refreshCustomPage('${contentId}')">
                    <i class="fas fa-sync-alt"></i>
                    Refresh
                </button>
                <button class="fullscreen-btn" onclick="toggleFullscreen()">
                    <i class="fas fa-expand"></i>
                    Fullscreen
                </button>
            </div>
        </div>
        <div class="custom-page-container">
            <iframe 
                src="${customUrl}" 
                frameborder="0" 
                class="custom-page-iframe"
                title="${getContentTitle(contentId)} Page">
            </iframe>
        </div>
    `;
    
    // Close mobile menu on mobile devices
    if (window.innerWidth <= 768) {
        closeMobileMenu();
    }
}

// Function to refresh custom page content
function refreshCustomPage(contentId) {
    const customUrl = getCustomUrl(contentId);
    if (customUrl) {
        const iframe = document.querySelector('.custom-page-iframe');
        if (iframe) {
            iframe.src = customUrl;
            showNotification('Page refreshed successfully!', 'success');
        }
    }
}

// Function to toggle fullscreen mode
function toggleFullscreen() {
    const iframe = document.querySelector('.custom-page-iframe');
    if (iframe) {
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen();
        }
    }
}

// Helper function to get content title
function getContentTitle(contentId) {
    const contentMap = {
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
    return contentMap[contentId] || 'Content';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    enhanceMenuInteractions();
});

// Export functions for potential external use
window.SynopsysApp = {
    showContent,
    handleLogin,
    showNotification,
    toggleMobileMenu,
    closeMobileMenu,
    loadCustomPageContent,
    refreshCustomPage,
    getCustomUrl,
    toggleFullscreen
};
