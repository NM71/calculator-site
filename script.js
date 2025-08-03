// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateThemeIcon() {
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('i');
            if (this.theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }
}

// Search Functionality
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.calculatorItems = document.querySelectorAll('.calculator-item');
        this.categoryCards = document.querySelectorAll('.category-card');
        this.debouncedSearch = Utils.debounce((value) => this.handleSearch(value), 150);
        this.init();
    }

    init() {
        if (this.searchInput) {
            // Debounced search for better performance
            this.searchInput.addEventListener('input', (e) => this.debouncedSearch(e.target.value));
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.clearSearch();
                }
            });
        }
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.showAllItems();
            this.resetHeroSection();
            return;
        }

        let hasResults = false;

        this.categoryCards.forEach(card => {
            const calculators = card.querySelectorAll('.calculator-item');
            let hasVisibleCalculators = false;

            calculators.forEach(calculator => {
                const calculatorName = calculator.getAttribute('data-name').toLowerCase();
                const calculatorText = calculator.textContent.toLowerCase();
                
                if (calculatorName.includes(searchTerm) || calculatorText.includes(searchTerm)) {
                    calculator.classList.remove('hidden');
                    hasVisibleCalculators = true;
                    hasResults = true;
                } else {
                    calculator.classList.add('hidden');
                }
            });

            // Show/hide entire category based on whether it has visible calculators
            if (hasVisibleCalculators) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        // Auto-scroll to results and collapse hero section when searching
        if (hasResults && searchTerm.length > 0) {
            this.collapseHeroSection();
            this.scrollToResults();
        }
    }

    collapseHeroSection() {
        const hero = document.querySelector('.hero');
        if (hero && !hero.classList.contains('collapsed')) {
            hero.classList.add('collapsed');
        }
    }

    resetHeroSection() {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.classList.remove('collapsed');
            // Scroll back to top when resetting
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    scrollToResults() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Run after the min-height transition ends
        const onEnd = () => {
            const offset = hero.getBoundingClientRect().height - 50 + window.pageYOffset;
            window.scrollTo({ top: offset, behavior: 'smooth' });
            hero.removeEventListener('transitionend', onEnd);
        };

        // If the hero is already collapsed, the transition is over
        if (hero.classList.contains('collapsed')) {
            onEnd();
        } else {
            hero.addEventListener('transitionend', onEnd, { once: true });
        }
    }

    showAllItems() {
        this.calculatorItems.forEach(item => item.classList.remove('hidden'));
        this.categoryCards.forEach(card => card.classList.remove('hidden'));
    }

    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.showAllItems();
            this.resetHeroSection();
            this.searchInput.blur();
        }
    }
}

// Analytics and User Interaction
class AnalyticsManager {
    constructor() {
        this.init();
    }

    init() {
        this.trackCalculatorClicks();
        this.trackSearchUsage();
    }

    trackCalculatorClicks() {
        document.querySelectorAll('.calculator-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const calculatorName = e.currentTarget.getAttribute('data-name');
                console.log(`Calculator clicked: ${calculatorName}`);
                // Here you can integrate with Google Analytics or other tracking services
                // gtag('event', 'calculator_click', { calculator_name: calculatorName });
            });
        });
    }

    trackSearchUsage() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;

            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const query = e.target.value.trim();
                    if (query.length > 2) {
                        console.log(`Search performed: ${query}`);
                        // Track search queries
                        // gtag('event', 'search', { search_term: query });
                    }
                }, 1000);
            });
        }
    }
}

// UI Enhancements
class UIEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceKeyboardNavigation();
        this.addScrollToTop();
        this.initializeAnimations();

        this.initializeAccessibility();
        // Remove the loading state functionality that was causing issues
    }

    enhanceKeyboardNavigation() {
        // Add keyboard navigation for search
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && !e.target.matches('input')) {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
    }

    addScrollToTop() {
        // Add smooth scroll to top when clicking the logo
        const navBrand = document.querySelector('.nav-brand');
        if (navBrand) {
            navBrand.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    initializeAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all category cards for animation
        document.querySelectorAll('.category-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }



    initializeAccessibility() {
        // Add ARIA labels and roles
        document.querySelectorAll('.calculator-item').forEach(item => {
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            
            // Add keyboard support
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Navigate to the calculator page
                    window.location.href = item.href;
                }
            });
        });

        // Add skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content ID
        const mainElement = document.querySelector('.main');
        if (mainElement) {
            mainElement.id = 'main-content';
        }
    }
}

// Utility functions
const Utils = {
    // Debounce function for search
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

    // Format numbers for display
    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    },

    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    },

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    },

    // Validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const themeManager = new ThemeManager();
    const searchManager = new SearchManager();
    const analyticsManager = new AnalyticsManager();
    const uiEnhancer = new UIEnhancer();

    // Add tooltips to calculator items
    initializeTooltips();
});

// Tooltip functionality
function initializeTooltips() {
    const tooltips = {
        'age calculator': 'Calculate age in years, months, and days',
        'basic calculator': 'Perform basic arithmetic operations',
        'unit converter': 'Convert between different units of measurement',
        'percentage calculator': 'Calculate percentages, increases, and decreases',
        'fraction calculator': 'Add, subtract, multiply, and divide fractions',
        'scientific calculator': 'Advanced mathematical functions and operations',
        'loan calculator': 'Calculate monthly payments and total interest',
        'mortgage calculator': 'Estimate mortgage payments and amortization',
        'emi calculator': 'Calculate Equated Monthly Installments',
        'interest calculator': 'Calculate simple and compound interest',
        'currency converter': 'Convert between different currencies',
        'bmi calculator': 'Calculate Body Mass Index',
        'bmr calculator': 'Calculate Basal Metabolic Rate',
        'calorie calculator': 'Calculate daily calorie needs',
        'ideal weight calculator': 'Calculate ideal body weight',
        'pregnancy calculator': 'Calculate pregnancy due date',
        'gpa calculator': 'Calculate Grade Point Average',
        'grade calculator': 'Calculate final grades and requirements',
        'exam score calculator': 'Calculate required exam scores',
        'age calculator': 'Calculate age in years, months, and days',
        'time duration calculator': 'Calculate time differences',
        'area calculator': 'Calculate area and volume of shapes',
        'paint calculator': 'Calculate paint needed for walls',
        'concrete calculator': 'Calculate concrete requirements',
        'roofing calculator': 'Calculate roofing materials needed',
        'tax calculator': 'Calculate taxes and deductions',
        'profit margin calculator': 'Calculate profit margins and markup',
        'discount calculator': 'Calculate discounts and savings',
        'break even calculator': 'Calculate break-even point',
        'salary converter': 'Convert between hourly and salary rates',
        'password checker': 'Check password strength and security',
        'data converter': 'Convert between data storage units',
        'color converter': 'Convert between color formats',
        'ip calculator': 'Calculate IP subnet information',
        'qr generator': 'Generate QR codes for text and URLs'
    };

    document.querySelectorAll('.calculator-item').forEach(item => {
        const calculatorName = item.getAttribute('data-name');
        if (tooltips[calculatorName]) {
            item.setAttribute('title', tooltips[calculatorName]);
        }
    });
}

// Export for use in calculator pages
window.CalcHub = {
    Utils,
    ThemeManager
};

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle online/offline status
window.addEventListener('online', () => {
    Utils.showToast('You are back online!', 'success');
});

window.addEventListener('offline', () => {
    Utils.showToast('You are offline. Some features may not work.', 'warning');
});
