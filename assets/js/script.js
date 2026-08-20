/**
 * FITNESS - HEALTHY LIFESTYLE
 * Master Script: Auth, Interactive Tools, Booking, & UI State
 */

// Firebase Configuration (Dynamic with Admin Override Support)
const defaultFirebaseConfig = {
    apiKey: "AIzaSyBp1yyC1IF_rmOWwFdZRcbcsCHNbJ3Sdro",
    authDomain: "mnr-devops-2e97d.firebaseapp.com",
    projectId: "mnr-devops-2e97d",
    storageBucket: "mnr-devops-2e97d.firebasestorage.app",
    messagingSenderId: "464172080556",
    appId: "1:464172080556:web:97cecddd2e236f387aee09",
    measurementId: "G-9SXTYCDF9W"
};

let firebaseConfig = defaultFirebaseConfig;
try {
    const customConfig = localStorage.getItem('fit_custom_firebase_config');
    if (customConfig) {
        firebaseConfig = Object.assign({}, defaultFirebaseConfig, JSON.parse(customConfig));
    }
} catch (e) {
    console.warn('Firebase config notice:', e);
}

// Initialize Firebase safely only if configured
if (typeof firebase !== 'undefined' && firebaseConfig.apiKey) {
    try {
        if (!firebase.apps || !firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    } catch (e) {
        console.log("Firebase initialization notice:", e);
    }
}

const auth = (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) ? firebase.auth() : null;

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
        error: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> <span>${escapeHtml(message)}</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 400);
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
    const signInBtn = document.getElementById('signInButton');
    const signOutBtn = document.getElementById('signOutButton');
    const userInfo = document.getElementById('userInfo');
    const userAvatar = document.querySelector('.user-avatar');
    const authNotice = document.getElementById('authRequiredMessage');
    const formFields = document.getElementById('formFields');

    if (!auth) {
        signInBtn?.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
        document.getElementById('signInButtonForm')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'login.html';
        });
        return;
    }

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
            // Save lead to Cloud Firestore & LocalStorage via FitDB
            if (window.FitDB && window.FitDB.leads) {
                await window.FitDB.leads.add({
                    name: formData.name || 'Anonymous User',
                    phone: formData.phone || 'Not provided',
                    email: formData.email || '',
                    service: formData.service || 'General Inquiry',
                    message: formData.message || '',
                    source: 'Homepage Consultation Form'
                });
            }

            // Also post to Formspree fallback
            fetch('https://formspree.io/f/mzzenkyw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            }).catch(() => {});

            showToast('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
            if (user) {
                const nameInput = document.getElementById('name');
                const emailInput = document.getElementById('email');
                if (nameInput) nameInput.value = user.displayName || '';
                if (emailInput) emailInput.value = user.email || '';
            }
        } catch (err) {
            console.error(err);
            showToast('Thank you! Your inquiry was received.', 'success');
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
    function renderProgramsCatalog(programsList) {
        if (!programsList || !Array.isArray(programsList) || programsList.length === 0) return;

        const programsGrid = document.querySelector('#services .services-grid');
        if (programsGrid) {
            programsGrid.innerHTML = programsList.map(prog => {
                const isFeatured = !!prog.featured;
                const ribbonHtml = isFeatured 
                    ? `<div class="featured-ribbon">Most Popular</div>` 
                    : (prog.discount === 'VIP Flagship' ? `<div class="featured-ribbon" style="background: linear-gradient(135deg, #00F0FF, #0080FF); color: #0A0D14;">VIP Coaching</div>` : '');
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
                            <i class="fab fa-whatsapp"></i> ${isFeatured ? 'Start Transformation' : (prog.id === 'prog-one-on-one' ? 'Book 1-on-1 VIP' : 'Choose Plan')}
                        </button>
                    </div>
                `;
            }).join('');

            // Update Contact Form Dropdown
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                let optionsHtml = programsList.map(p => `
                    <option value="${escapeHtml(p.title)}" ${p.featured ? 'selected' : ''}>
                        ${escapeHtml(p.title)} (₹${Number(p.price).toLocaleString('en-IN')}${escapeHtml(p.duration || '/ mo')})
                    </option>
                `).join('');
                optionsHtml += `<option value="General Inquiry">General Inquiry / Consultation</option>`;
                serviceSelect.innerHTML = optionsHtml;
            }
        }
    }

    if (window.FitDB && window.FitDB.programs) {
        window.FitDB.programs.listen((cloudPrograms) => {
            if (cloudPrograms && cloudPrograms.length > 0) {
                renderProgramsCatalog(cloudPrograms);
            }
        });
    }
}

// --------------------------------------------------------------------------
// Live Dynamic Transformations Synchronization (from Coach Admin Dashboard)
// --------------------------------------------------------------------------
function syncDynamicTransformations() {
    // Preserve static HTML cards on index.html
}

// --------------------------------------------------------------------------
// Dynamic Products & Affiliate Gear Showcase
// --------------------------------------------------------------------------
function initDynamicProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const filterTabs = document.getElementById('productFilterTabs');
    if (!productsGrid) return;

    let activeCategory = 'all';
    let currentProducts = [];

    function renderProducts() {
        const filtered = currentProducts.filter(p => {
            if (activeCategory === 'all') return true;
            return p.category === activeCategory;
        });

        if (filtered.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
                    <i class="fas fa-shopping-bag" style="font-size: 2.2rem; opacity: 0.4; margin-bottom: 12px; display: block;"></i>
                    <h4 style="font-family: var(--font-heading); color: var(--text-main); margin-bottom: 6px;">No Products in this Category</h4>
                    <p style="font-size: 0.9rem;">Check other categories or view all gear recommendations.</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = filtered.map(p => {
            const isFeatured = !!p.featured;
            const origPriceHtml = p.originalPrice 
                ? `<span class="prod-original-price">₹${Number(p.originalPrice).toLocaleString('en-IN')}</span>` 
                : '';
            const discountHtml = p.discount 
                ? `<span class="prod-discount-pill">${escapeHtml(p.discount)}</span>` 
                : '';
            
            const couponHtml = p.couponCode ? `
                <div class="prod-coupon-badge copy-coupon-btn" data-code="${escapeHtml(p.couponCode)}" title="Click to copy coach coupon code">
                    <span class="coupon-label"><i class="fas fa-ticket-alt"></i> Code:</span>
                    <span class="coupon-code">${escapeHtml(p.couponCode)}</span>
                    <i class="far fa-copy copy-icon"></i>
                </div>
            ` : '';

            const coachTipHtml = p.coachTip ? `
                <div class="prod-coach-tip">
                    <i class="fas fa-quote-left"></i>
                    <span>${escapeHtml(p.coachTip)}</span>
                </div>
            ` : '';

            return `
                <div class="product-card ${isFeatured ? 'featured' : ''}">
                    ${isFeatured ? `<div class="prod-top-pick-badge"><i class="fas fa-crown"></i> Coach Top Choice</div>` : ''}
                    <div class="prod-img-wrap">
                        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80'">
                        <span class="prod-category-tag">${escapeHtml((p.category || 'gear').toUpperCase())}</span>
                    </div>

                    <div class="prod-content">
                        <div class="prod-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <span>(${p.rating || 4.9} Verified)</span>
                        </div>

                        <h3 class="prod-title">${escapeHtml(p.title)}</h3>
                        <p class="prod-desc">${escapeHtml(p.desc || '')}</p>

                        ${coachTipHtml}

                        <div class="prod-price-row">
                            <div class="prod-pricing">
                                <span class="prod-price">₹${Number(p.price).toLocaleString('en-IN')}</span>
                                ${origPriceHtml}
                            </div>
                            ${discountHtml}
                        </div>

                        ${couponHtml}

                        <a href="${escapeHtml(p.affiliateUrl)}" target="_blank" rel="noopener noreferrer" 
                           class="btn ${isFeatured ? 'btn-primary' : 'btn-outline'} btn-block prod-buy-btn"
                           data-title="${escapeHtml(p.title)}"
                           data-category="${escapeHtml(p.category || '')}">
                            <i class="fas fa-external-link-alt"></i> Buy with Deal
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        // Attach Coupon Copy Listeners
        document.querySelectorAll('.copy-coupon-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const code = btn.getAttribute('data-code');
                if (code) {
                    navigator.clipboard.writeText(code).then(() => {
                        const originalHtml = btn.innerHTML;
                        btn.innerHTML = `<span class="coupon-label"><i class="fas fa-check"></i> Copied!</span><span class="coupon-code">${escapeHtml(code)}</span>`;
                        btn.classList.add('copied');
                        showToast(`Coupon "${code}" copied! Paste at checkout for discount.`);
                        setTimeout(() => {
                            btn.innerHTML = originalHtml;
                            btn.classList.remove('copied');
                        }, 2500);
                    }).catch(() => {
                        showToast(`Coupon Code: ${code}`);
                    });
                }
            });
        });

        // Attach Affiliate Click Tracking
        document.querySelectorAll('.prod-buy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const title = btn.getAttribute('data-title');
                const cat = btn.getAttribute('data-category');
                if (window.FitDB && window.FitDB.analytics && window.FitDB.analytics.recordProductClick) {
                    window.FitDB.analytics.recordProductClick(title, cat);
                }
            });
        });
    }

    // Filter Buttons
    if (filterTabs) {
        filterTabs.querySelectorAll('.prod-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterTabs.querySelectorAll('.prod-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategory = btn.getAttribute('data-category') || 'all';
                renderProducts();
            });
        });
    }

    // Listen to FitDB
    if (window.FitDB && window.FitDB.products) {
        window.FitDB.products.listen(products => {
            currentProducts = products || [];
            renderProducts();
        });
    }
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
    if (window.FitDB && window.FitDB.analytics) {
        window.FitDB.analytics.recordProgramIntent(programTitle, price);
    }
}

// --------------------------------------------------------------------------
// Interactive "Choose Your Fitness Goal" Selector
// --------------------------------------------------------------------------
function initGoalSelector() {
    const goalChips = document.querySelectorAll('.goal-chip-btn');
    const recTitle = document.getElementById('goalRecTitle');
    const recDesc = document.getElementById('goalRecDesc');
    const recBtn = document.getElementById('goalRecActionBtn');

    if (!goalChips.length || !recTitle) return;

    const goalData = {
        fatloss: {
            title: 'Recommended: Personal Training & Transformation (₹849/mo)',
            desc: 'Comprehensive gym/home workout regimen + custom nutrition blueprint + daily accountability to burn stubborn fat fast.',
            msg: 'Hi Coach Rajashekar, my goal is Fat Loss & Shred. I want to enroll in Personal Training (₹849/mo).'
        },
        muscle: {
            title: 'Recommended: Personal Training & Transformation (₹849/mo)',
            desc: 'Hypertrophy-focused progressive overload split + high-protein diet calculations + weekly strength progression audits.',
            msg: 'Hi Coach Rajashekar, my goal is Lean Muscle & Bulk. I want to enroll in Personal Training (₹849/mo).'
        },
        livevip: {
            title: 'Recommended: Elite 1-on-1 VIP Live Training (₹3,999/mo)',
            desc: 'Dedicated private daily live coaching with 5 live online classes per week and continuous real-time form correction.',
            msg: 'Hi Coach Rajashekar, I want to join the Elite 1-on-1 VIP Live Training (₹3,999/mo) with 5 live classes per week.'
        },
        dietonly: {
            title: 'Recommended: Customized Diet Plan (₹199/mo)',
            desc: 'Science-backed macro breakdown tailored to your food habits, lifestyle schedule, and metabolic wellness.',
            msg: 'Hi Coach Rajashekar, I would like to get a 100% Customized Diet Plan (₹199/mo).'
        }
    };

    goalChips.forEach(chip => {
        chip.addEventListener('click', () => {
            goalChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const goalKey = chip.getAttribute('data-goal') || 'fatloss';
            const data = goalData[goalKey] || goalData.fatloss;

            recTitle.textContent = data.title;
            recDesc.textContent = data.desc;
            if (recBtn) {
                recBtn.href = `https://wa.me/918187808710?text=${encodeURIComponent(data.msg)}`;
            }

            // Highlight corresponding program card in #services
            const targetProg = chip.getAttribute('data-rec-prog');
            if (targetProg) {
                document.querySelectorAll('#services .service-card').forEach(card => {
                    const h3 = card.querySelector('h3');
                    if (h3 && h3.textContent.trim().toLowerCase().includes(targetProg.toLowerCase().slice(0, 15))) {
                        card.style.transition = 'transform 0.4s ease, border-color 0.4s ease';
                        card.style.borderColor = 'var(--primary)';
                        card.style.transform = 'translateY(-6px)';
                        setTimeout(() => {
                            card.style.transform = '';
                        }, 1200);
                    }
                });
            }
        });
    });
}

// --------------------------------------------------------------------------
// Animated Number Counters on Scroll
// --------------------------------------------------------------------------
function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('.stat-number[data-count]');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                if (isNaN(target)) return;

                let start = 0;
                const duration = 1400;
                const startTime = performance.now();

                function updateNumber(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out quart
                    const ease = 1 - Math.pow(1 - progress, 4);
                    const current = Math.round(start + (target - start) * ease);
                    el.textContent = `${current}%`;

                    if (progress < 1) {
                        requestAnimationFrame(updateNumber);
                    } else {
                        el.textContent = `${target}%`;
                    }
                }

                requestAnimationFrame(updateNumber);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.35 });

    counterElements.forEach(el => observer.observe(el));
}

// --------------------------------------------------------------------------
// Scroll Reveal Animations
// --------------------------------------------------------------------------
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-init');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
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

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('firebase-messaging-sw.js')
                .then(reg => console.log('[Client PWA] Service Worker registered with scope:', reg.scope))
                .catch(err => console.warn('[Client PWA] Service Worker registration failed:', err));
        });
    }

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
    initDynamicProducts();
    initThemeToggle();
    initAuth();
    initBMICalculator();
    initTestimonialsCarousel();
    initFAQAccordion();
    initWhatsAppBooking();
    initContactForm();
    initGoalSelector();
    initAnimatedCounters();
    initScrollReveal();
});
