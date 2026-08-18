/**
 * FITNESS - HEALTHY LIFESTYLE
 * Master Script: Auth, Interactive Tools, Booking, & UI State
 */

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBp1yyC1IF_rmOWwFdZRcbcsCHNbJ3Sdro",
    authDomain: "mnr-devops-2e97d.firebaseapp.com",
    projectId: "mnr-devops-2e97d",
    storageBucket: "mnr-devops-2e97d.firebasestorage.app",
    messagingSenderId: "464172080556",
    appId: "1:464172080556:web:97cecddd2e236f387aee09",
    measurementId: "G-9SXTYCDF9W"
};

// Initialize Firebase safely
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
    } catch (e) {
        console.log("Firebase already initialized or initialization error", e);
    }
}

const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;

// --------------------------------------------------------------------------
// Toast Notification Utility
// --------------------------------------------------------------------------
function showToast(message, type = 'info') {
    const existingToasts = document.querySelectorAll('.user-toast-notification');
    existingToasts.forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `user-toast-notification ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 350);
    }, 3500);
}

// --------------------------------------------------------------------------
// Theme Toggle (Dark / Light)
// --------------------------------------------------------------------------
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const savedTheme = localStorage.getItem('fit_theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeBtn?.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('fit_theme', isLight ? 'light' : 'dark');
        themeBtn.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// --------------------------------------------------------------------------
// Firebase Authentication
// --------------------------------------------------------------------------
function initAuth() {
    if (!auth) return;

    const signInBtn = document.getElementById('signInButton');
    const signOutBtn = document.getElementById('signOutButton');
    const userInfo = document.getElementById('userInfo');
    const userAvatar = document.querySelector('.user-avatar');
    const authNotice = document.getElementById('authRequiredMessage');
    const formFields = document.getElementById('formFields');

    // Google Sign In
    const handleGoogleSignIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => {
                showToast(`Welcome, ${result.user.displayName}!`, 'success');
            })
            .catch((error) => {
                showToast(`Sign in error: ${error.message}`, 'error');
            });
    };

    signInBtn?.addEventListener('click', handleGoogleSignIn);
    document.getElementById('signInButtonForm')?.addEventListener('click', (e) => {
        e.preventDefault();
        handleGoogleSignIn();
    });

    // Sign Out
    signOutBtn?.addEventListener('click', () => {
        auth.signOut()
            .then(() => showToast('Signed out successfully.', 'info'))
            .catch((err) => showToast(err.message, 'error'));
    });

    const userAvatarImg = document.getElementById('userAvatarImg');
    const userAvatarInitials = document.getElementById('userAvatarInitials');
    const userAvatarContainer = document.getElementById('userAvatarContainer');

    // Helper to get initials
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // State Change Observer
    auth.onAuthStateChanged((user) => {
        if (user) {
            if (signInBtn) signInBtn.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';

            const displayName = user.displayName || user.email?.split('@')[0] || 'User';
            const initials = getInitials(displayName);

            if (userAvatarContainer) {
                userAvatarContainer.title = `${displayName} (${user.email || 'Logged In'})`;
            }

            if (userAvatarInitials) {
                userAvatarInitials.textContent = initials;
            }

            if (userAvatarImg) {
                userAvatarImg.setAttribute('referrerpolicy', 'no-referrer');
                
                if (user.photoURL) {
                    // Try loading Google/Auth photo
                    userAvatarImg.onload = () => {
                        userAvatarImg.style.display = 'block';
                        if (userAvatarInitials) userAvatarInitials.style.display = 'none';
                    };
                    
                    userAvatarImg.onerror = () => {
                        // Image blocked or failed -> switch cleanly to initials badge
                        userAvatarImg.style.display = 'none';
                        if (userAvatarInitials) userAvatarInitials.style.display = 'flex';
                    };

                    userAvatarImg.src = user.photoURL;
                } else {
                    userAvatarImg.style.display = 'none';
                    if (userAvatarInitials) userAvatarInitials.style.display = 'flex';
                }
            }

            // Save/Update in Admin Analytics
            recordSignedInUser(user);

            // Contact form sync
            if (authNotice) authNotice.style.display = 'none';
            if (formFields) formFields.style.display = 'block';
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            if (nameInput && !nameInput.value) nameInput.value = user.displayName || '';
            if (emailInput) emailInput.value = user.email || '';
        } else {
            if (signInBtn) signInBtn.style.display = 'inline-flex';
            if (userInfo) userInfo.style.display = 'none';
            
            if (authNotice) authNotice.style.display = 'block';
            if (formFields) formFields.style.display = 'none';
        }
    });
}

// --------------------------------------------------------------------------
// Interactive Live BMI & Calorie Calculator
// --------------------------------------------------------------------------
function initBMICalculator() {
    const form = document.getElementById('bmiCalculatorForm');
    const bmiDisplay = document.getElementById('bmiValueDisplay');
    const bmiStatus = document.getElementById('bmiStatusBadge');
    const bmiReco = document.getElementById('bmiRecommendationText');

    if (!form || !bmiDisplay) return;

    form.addEventListener('input', calculateBMI);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateBMI();
    });

    function calculateBMI() {
        const height = parseFloat(document.getElementById('calcHeight')?.value);
        const weight = parseFloat(document.getElementById('calcWeight')?.value);
        const age = parseInt(document.getElementById('calcAge')?.value) || 25;
        const activity = parseFloat(document.getElementById('calcActivity')?.value) || 1.375;

        if (!height || !weight || height <= 0 || weight <= 0) {
            return;
        }

        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

        bmiDisplay.textContent = bmi;

        let category = '';
        let color = '';
        let recoText = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#00F0FF';
            recoText = `You may benefit from a muscle-building diet plan and structured hypertrophy strength training. Recommended plan: <strong>Combo Package</strong>.`;
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = 'Healthy & Optimal Weight';
            color = '#10B981';
            recoText = `Great job maintaining a healthy BMI! To tone, boost stamina, and build athletic endurance, check out our <strong>Personal Training</strong> program.`;
        } else if (bmi >= 25 && bmi < 29.9) {
            category = 'Overweight';
            color = '#F5C45E';
            recoText = `A structured calorie deficit combined with high-intensity strength training can yield rapid transformations. Recommended plan: <strong>Combo Package (3 Months)</strong>.`;
        } else {
            category = 'Obese Range';
            color = '#F43F5E';
            recoText = `Custom 1-on-1 coaching and medical-grade nutrition planning are highly advised for safe, sustainable fat loss. Contact Coach Rajashekar today.`;
        }

        bmiStatus.textContent = category;
        bmiStatus.style.borderColor = color;
        bmiStatus.style.color = color;
        bmiReco.innerHTML = recoText;
    }
}

// --------------------------------------------------------------------------
// Testimonials Carousel
// --------------------------------------------------------------------------
function initTestimonialsCarousel() {
    const slides = document.querySelectorAll('.testimonial-card-item');
    const dotsBox = document.querySelector('.slider-dots-box');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (!slides.length || !dotsBox) return;

    let currentIndex = 0;
    let autoPlayTimer;

    // Create dots
    dotsBox.innerHTML = '';
    slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `slider-dot-bullet ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(idx));
        dotsBox.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot-bullet');

    function goToSlide(idx) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        currentIndex = (idx + slides.length) % slides.length;
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    prevBtn?.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoPlay();
    });

    nextBtn?.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoPlay();
    });

    function startAutoPlay() {
        autoPlayTimer = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5500);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    startAutoPlay();
}

// --------------------------------------------------------------------------
// FAQ Accordion
// --------------------------------------------------------------------------
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question-btn');
        btn?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// --------------------------------------------------------------------------
// WhatsApp Booking Flow & Modal
// --------------------------------------------------------------------------
function initWhatsAppBooking() {
    const modal = document.getElementById('bookingModal');
    const modalClose = modal?.querySelector('.modal-close-btn');
    const cancelBtn = modal?.querySelector('.cancel-booking');
    const confirmBtn = document.getElementById('confirmBookingModal');

    if (!modal) return;

    let targetWhatsAppUrl = '';

    // Use event delegation so dynamically created program buttons work instantly
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.book-btn');
        if (!btn) return;

        const service = btn.dataset.service || 'Fitness Training';
        const price = btn.dataset.price || 'Special Pricing';
        const whatsappNumber = btn.dataset.whatsapp || '+918187808710';
        
        const user = auth ? auth.currentUser : null;
        const userName = user ? user.displayName : 'Fitness Member';
        const userEmail = user ? ` (${user.email})` : '';

        const message = `Hello Coach Rajashekar! 💪\n\nI want to book the *${service}* package (${price}).\n\nClient Name: ${userName}${userEmail}\nPlease share the onboarding details!`;
        
        targetWhatsAppUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

        // Record program interest in analytics
        recordProgramInterest(service, price);

        const modalMsg = modal.querySelector('.modal-message');
        if (modalMsg) {
            modalMsg.innerHTML = `You are about to start a direct consultation for <strong>${service}</strong> (${price}) via WhatsApp.`;
        }

        modal.classList.add('active');
    });

    const closeModal = () => modal.classList.remove('active');
    modalClose?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    confirmBtn?.addEventListener('click', () => {
        if (targetWhatsAppUrl) {
            window.open(targetWhatsAppUrl, '_blank');
            closeModal();
            showToast('Connecting you to Coach Rajashekar on WhatsApp...', 'success');
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// --------------------------------------------------------------------------
// Contact Form Submission (Formspree)
// --------------------------------------------------------------------------
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            const user = auth ? auth.currentUser : null;
            const formData = {
                name: document.getElementById('name')?.value,
                email: document.getElementById('email')?.value,
                phone: document.getElementById('phone')?.value || 'Not provided',
                service: document.getElementById('service')?.value,
                message: document.getElementById('message')?.value,
                userId: user ? user.uid : 'Guest'
            };

            // Track program interest on form submission
            recordProgramInterest(formData.service || 'General Inquiry', '');

            const response = await fetch('https://formspree.io/f/mzzenkyw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Save lead to local CRM storage for Coach Rajashekar Admin Dashboard
                try {
                    const existingLeads = JSON.parse(localStorage.getItem('fit_admin_leads') || '[]');
                    const newLead = {
                        id: 'lead-' + Date.now(),
                        name: formData.name || 'Anonymous User',
                        phone: formData.phone || 'Not provided',
                        email: formData.email || '',
                        service: formData.service || 'General Inquiry',
                        message: formData.message || '',
                        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                        status: 'New'
                    };
                    existingLeads.unshift(newLead);
                    localStorage.setItem('fit_admin_leads', JSON.stringify(existingLeads));
                } catch (e) {
                    console.warn('Could not sync lead to local CRM storage:', e);
                }

                showToast('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
                if (user) {
                    const nameInput = document.getElementById('name');
                    const emailInput = document.getElementById('email');
                    if (nameInput) nameInput.value = user.displayName || '';
                    if (emailInput) emailInput.value = user.email || '';
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                showToast(errorData.error || 'Message sending failed. Please try WhatsApp.', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Network error. Please try reaching us via WhatsApp.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// --------------------------------------------------------------------------
// Live Dynamic Programs & Pricing Synchronization (from Coach Admin Dashboard)
// --------------------------------------------------------------------------
function syncDynamicProgramsAndPricing() {
    try {
        const programsGrid = document.querySelector('#services .services-grid');
        const savedPrograms = JSON.parse(localStorage.getItem('fit_admin_programs') || 'null');
        
        if (programsGrid && savedPrograms && savedPrograms.length > 0) {
            programsGrid.innerHTML = savedPrograms.map(prog => {
                const isFeatured = !!prog.featured;
                const ribbonHtml = isFeatured ? `<div class="featured-ribbon">Most Popular</div>` : '';
                const origPriceHtml = prog.originalPrice 
                    ? `<span class="original-price">₹${Number(prog.originalPrice).toLocaleString('en-IN')}</span>` 
                    : '';
                const discountHtml = prog.discount 
                    ? `<span class="discount-pill">${escapeHtml(prog.discount)}</span>` 
                    : '';
                
                const featuresHtml = (prog.features || []).map(f => `
                    <li><i class="fas fa-check-circle"></i> <span>${escapeHtml(f)}</span></li>
                `).join('');

                const btnClass = isFeatured ? 'btn btn-primary' : 'btn btn-outline';
                const formattedPrice = `₹${Number(prog.price).toLocaleString('en-IN')}${prog.duration || '/ month'}`;

                return `
                    <div class="service-card ${isFeatured ? 'featured' : ''}">
                        ${ribbonHtml}
                        <div class="service-icon-box">
                            <i class="${escapeHtml(prog.icon || 'fas fa-dumbbell')}"></i>
                        </div>
                        <h3>${escapeHtml(prog.title)}</h3>
                        <p class="service-desc">${escapeHtml(prog.desc || '')}</p>
                        
                        <div class="pricing-box">
                            ${(origPriceHtml || discountHtml) ? `
                                <div class="price-strike-row">
                                    ${origPriceHtml}
                                    ${discountHtml}
                                </div>
                            ` : ''}
                            <div class="price-main">
                                <span class="price-amount">₹${Number(prog.price).toLocaleString('en-IN')}</span>
                                <span class="price-duration">${escapeHtml(prog.duration || '/ month')}</span>
                            </div>
                        </div>

                        <ul class="service-features-list">
                            ${featuresHtml}
                        </ul>

                        <button class="${btnClass} btn-block book-btn" 
                                data-service="${escapeHtml(prog.title)}" 
                                data-price="${escapeHtml(formattedPrice)}" 
                                data-whatsapp="+918187808710">
                            <i class="fab fa-whatsapp"></i> ${isFeatured ? 'Start Transformation' : 'Choose Program'}
                        </button>
                    </div>
                `;
            }).join('');

            // Update Contact Form Dropdown
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                let optionsHtml = savedPrograms.map(p => `
                    <option value="${escapeHtml(p.title)}" ${p.featured ? 'selected' : ''}>
                        ${escapeHtml(p.title)} (₹${Number(p.price).toLocaleString('en-IN')}${escapeHtml(p.duration || '/ mo')})
                    </option>
                `).join('');
                optionsHtml += `<option value="General Inquiry">General Inquiry / Consultation</option>`;
                serviceSelect.innerHTML = optionsHtml;
            }
        }
    } catch (e) {
        console.warn('Error syncing dynamic programs and pricing:', e);
    }
}

// --------------------------------------------------------------------------
// Live Dynamic Transformations Synchronization (from Coach Admin Dashboard)
// --------------------------------------------------------------------------
function syncDynamicTransformations() {
    // Preserve static HTML cards on index.html
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// --------------------------------------------------------------------------
// Live Website Analytics & User Tracking Helpers
// --------------------------------------------------------------------------
function recordTrafficAndVisit(pageName = 'Home Page') {
    try {
        const trafficData = JSON.parse(localStorage.getItem('fit_analytics_traffic') || '{"totalVisits": 0, "uniqueVisitors": 0, "visitsLog": []}');
        
        trafficData.totalVisits = (trafficData.totalVisits || 0) + 1;
        
        let visitorId = localStorage.getItem('fit_visitor_id');
        if (!visitorId) {
            visitorId = 'vis_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('fit_visitor_id', visitorId);
            trafficData.uniqueVisitors = (trafficData.uniqueVisitors || 0) + 1;
        }

        const visitEntry = {
            id: 'v_' + Date.now(),
            page: pageName,
            time: new Date().toISOString().slice(0, 16).replace('T', ' '),
            device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile Device' : 'Desktop / PC',
            visitorId
        };

        if (!trafficData.visitsLog) trafficData.visitsLog = [];
        trafficData.visitsLog.unshift(visitEntry);
        if (trafficData.visitsLog.length > 50) trafficData.visitsLog = trafficData.visitsLog.slice(0, 50);

        localStorage.setItem('fit_analytics_traffic', JSON.stringify(trafficData));
    } catch (e) {
        console.warn('Traffic tracking notice:', e);
    }
}

function recordSignedInUser(user) {
    if (!user) return;
    try {
        const usersList = JSON.parse(localStorage.getItem('fit_analytics_users') || '[]');
        const existingIdx = usersList.findIndex(u => u.uid === user.uid || (u.email && u.email === user.email));
        
        const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
        if (existingIdx >= 0) {
            usersList[existingIdx].lastActive = now;
            usersList[existingIdx].displayName = user.displayName || usersList[existingIdx].displayName || 'Member';
            usersList[existingIdx].photoURL = user.photoURL || usersList[existingIdx].photoURL || '';
        } else {
            usersList.unshift({
                uid: user.uid,
                displayName: user.displayName || 'Fitness Member',
                email: user.email || 'Email Private',
                photoURL: user.photoURL || '',
                joinedDate: now,
                lastActive: now
            });
        }
        localStorage.setItem('fit_analytics_users', JSON.stringify(usersList));
    } catch (e) {
        console.warn('User tracking notice:', e);
    }
}

function recordProgramInterest(programTitle, price = '') {
    try {
        const intentList = JSON.parse(localStorage.getItem('fit_analytics_program_intent') || '[]');
        const user = auth ? auth.currentUser : null;
        
        const intentEntry = {
            id: 'intent_' + Date.now(),
            program: programTitle,
            price: price,
            userName: user ? (user.displayName || 'Signed Member') : 'Interested Visitor',
            userEmail: user ? user.email : '',
            time: new Date().toISOString().slice(0, 16).replace('T', ' ')
        };

        intentList.unshift(intentEntry);
        if (intentList.length > 80) intentList.length = 80;
        localStorage.setItem('fit_analytics_program_intent', JSON.stringify(intentList));
    } catch (e) {
        console.warn('Program intent notice:', e);
    }
}

// --------------------------------------------------------------------------
// General App Initializations & DOM Listeners
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Record pageview traffic
    recordTrafficAndVisit('Home Page');

    // Hide Page Loader
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loaded');
        }, 350);
    }

    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu?.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    // PWA Install Prompt handling
    let deferredPrompt;
    const installBtn = document.getElementById('pwaInstallBtn');
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installBtn) installBtn.style.display = 'inline-flex';
    });

    installBtn?.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Install prompt outcome:', outcome);
        deferredPrompt = null;
        installBtn.style.display = 'none';
    });

    // Initialize modules & Live Dynamic Sync from Admin
    syncDynamicProgramsAndPricing();
    syncDynamicTransformations();
    initThemeToggle();
    initAuth();
    initBMICalculator();
    initTestimonialsCarousel();
    initFAQAccordion();
    initWhatsAppBooking();
    initContactForm();
});
