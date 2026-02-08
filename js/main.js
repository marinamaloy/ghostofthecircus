/**
 * 《马戏团的幽魂》Landing Page JavaScript
 * Ghost of the Circus - Partnership Landing
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');

    // ========================================
    // Navbar Scroll Effect
    // ========================================
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ========================================
    // Mobile Navigation Toggle
    // ========================================
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Intersection Observer for Fade-in Animations
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for fade-in
    document.querySelectorAll('.feature-item, .stat-card, .team-card, .proposal-card, .review-card, .expert-card, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        fadeInObserver.observe(el);
    });

    // ========================================
    // Stagger Animation for Grid Items
    // ========================================
    function addStaggerAnimation(containerSelector, itemSelector, delayIncrement = 100) {
        const containers = document.querySelectorAll(containerSelector);
        
        containers.forEach(container => {
            const items = container.querySelectorAll(itemSelector);
            
            items.forEach((item, index) => {
                item.style.animationDelay = `${index * delayIncrement}ms`;
            });
        });
    }

    // Add stagger animations
    addStaggerAnimation('.about-features', '.feature-item');
    addStaggerAnimation('.about-stats', '.stat-card');
    addStaggerAnimation('.team-grid', '.team-card');
    addStaggerAnimation('.proposal-cards', '.proposal-card');
    addStaggerAnimation('.reviews-grid', '.review-card');
    addStaggerAnimation('.gallery-grid', '.gallery-item');

    // ========================================
    // Contact Form Handling
    // ========================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!data.name || !data.organization || !data.phone || !data.email) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('请输入有效的邮箱地址', 'error');
                return;
            }
            
            // Phone validation (Chinese mobile)
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(data.phone)) {
                showNotification('请输入有效的手机号码', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('提交成功！我们会尽快与您联系。', 'success');
            contactForm.reset();
            
            // In production, you would send the data to your server here
            // Example:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // })
        });
    }

    // ========================================
    // Notification System
    // ========================================
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
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? 'rgba(39, 174, 96, 0.95)' : type === 'error' ? 'rgba(231, 76, 60, 0.95)' : 'rgba(201, 162, 39, 0.95)'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 16px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        
        // Add close button styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(style);
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ========================================
    // Gallery Lightbox (Simple)
    // ========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.gallery-caption')?.textContent || '';
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}">
                    ${caption ? `<p class="lightbox-caption">${caption}</p>` : ''}
                    <button class="lightbox-close">&times;</button>
                </div>
            `;
            
            // Add lightbox styles
            const lightboxStyle = document.createElement('style');
            lightboxStyle.textContent = `
                .lightbox {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .lightbox-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.95);
                }
                .lightbox-content {
                    position: relative;
                    z-index: 1;
                    max-width: 90vw;
                    max-height: 90vh;
                }
                .lightbox-content img {
                    max-width: 100%;
                    max-height: 80vh;
                    object-fit: contain;
                    border-radius: 8px;
                }
                .lightbox-caption {
                    text-align: center;
                    color: white;
                    margin-top: 16px;
                    font-size: 14px;
                }
                .lightbox-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 36px;
                    cursor: pointer;
                }
            `;
            document.head.appendChild(lightboxStyle);
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Close functionality
            const closeLightbox = () => {
                lightbox.remove();
                lightboxStyle.remove();
                document.body.style.overflow = '';
            };
            
            lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
            lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
            
            // Close on Escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    });

    // ========================================
    // Lazy Loading for Images
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // Performance: Preload Critical Resources
    // ========================================
    function preloadCriticalResources() {
        const criticalImages = [
            'assets/images/logo.png',
            'assets/images/gallery-5.jpg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Preload after initial render
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preloadCriticalResources);
    } else {
        preloadCriticalResources();
    }

    // ========================================
    // Analytics Event Tracking (Placeholder)
    // ========================================
    function trackEvent(eventName, eventData = {}) {
        // Placeholder for analytics tracking
        // In production, integrate with Baidu Tongji or other analytics
        console.log('Track Event:', eventName, eventData);
        
        // Example Baidu Tongji integration:
        // if (typeof _hmt !== 'undefined') {
        //     _hmt.push(['_trackEvent', category, action, label, value]);
        // }
    }

    // Track CTA clicks
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.textContent.trim();
            const href = this.getAttribute('href') || '';
            trackEvent('cta_click', { text, href });
        });
    });

    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            const text = this.textContent.trim();
            trackEvent('nav_click', { text });
        });
    });

    // ========================================
    // Console Welcome Message
    // ========================================
    console.log('%c《马戏团的幽魂》', 'color: #C9A227; font-size: 24px; font-weight: bold;');
    console.log('%cGhost of the Circus - Partnership Landing', 'color: #666; font-size: 14px;');
    console.log('%c上海浸门文化传媒有限公司', 'color: #999; font-size: 12px;');

})();
