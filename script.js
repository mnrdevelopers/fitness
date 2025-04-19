// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD71QYDbPEETn-24nT45h4AdD_W6_inyWU",
  authDomain: "fitness-healthylifestyle.firebaseapp.com",
  projectId: "fitness-healthylifestyle",
  storageBucket: "fitness-healthylifestyle.firebasestorage.app",
  messagingSenderId: "762783082047",
  appId: "1:762783082047:web:04f79dfe0ee4b7ae6c7a8a",
  measurementId: "G-DYVL7D64Q8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Toast notification function
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'user-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-dumbbell"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

// Progress tracking function
function updateProgressCircle(percent) {
    const circle = document.querySelector('.progress-fill');
    const text = document.querySelector('.progress-text span');
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percent / 100) * circumference;
    
    circle.style.strokeDashoffset = offset;
    text.textContent = `${percent}%`;
}

// Authentication functions
function initAuth() {
    const signInButton = document.getElementById('signInButton');
    const signOutButton = document.getElementById('signOutButton');
    const userInfo = document.getElementById('userInfo');
    const userAvatar = document.querySelector('.user-avatar');

    // Sign in with Google
    signInButton.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => {
                console.log('User signed in:', result.user);
            })
            .catch((error) => {
                console.error('Sign in error:', error);
            });
    });

    // Sign out
    signOutButton.addEventListener('click', () => {
        auth.signOut()
            .then(() => {
                console.log('User signed out');
            })
            .catch((error) => {
                console.error('Sign out error:', error);
            });
    });

   // Auth state listener with popup integration
auth.onAuthStateChanged((user) => {
    const dashboardSection = document.querySelector('.dashboard');
    const navMenu = document.querySelector('.nav-menu');

    if (user) {
        // User is signed in
        showPopup(`Welcome back, ${user.displayName || 'Fitness Enthusiast'}!`, 'success');
        signInButton.style.display = 'none';
        userInfo.style.display = 'flex';
        userAvatar.src = user.photoURL;

        // Add dashboard link if not exists
        if (!document.querySelector('.nav-item a[href="#dashboard"]')) {
            const dashboardLink = document.createElement('li');
            dashboardLink.className = 'nav-item';
            dashboardLink.innerHTML = '<a href="#dashboard" class="nav-link">Dashboard</a>';
            navMenu.insertBefore(dashboardLink, navMenu.children[navMenu.children.length - 1]);
        }

        // Show dashboard section
        if (dashboardSection) dashboardSection.style.display = 'block';

    } else {
        // User is signed out
        signInButton.style.display = 'flex';
        userInfo.style.display = 'none';

        // Remove dashboard link if exists
        const dashboardLink = document.querySelector('.nav-item a[href="#dashboard"]')?.parentElement;
        if (dashboardLink) dashboardLink.remove();

        // Hide dashboard section
        if (dashboardSection) dashboardSection.style.display = 'none';
    }
});

// Popup message function (replace showToast with this)
function showPopup(message, type = 'info') {
    const popup = document.createElement('div');
    popup.className = `user-popup ${type}`;
    popup.innerHTML = `
        <i class="fas ${getIconForType(type)}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(popup);
    
    // Remove popup after 3 seconds
    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}

function getIconForType(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Enhanced checkAuthAndRedirect function
function checkAuthAndRedirect(event) {
    // Allow sign in/out buttons to work normally
    if (event.currentTarget.id === 'signInButton' || event.currentTarget.id === 'signOutButton') {
        return true;
    }
    
    event.preventDefault();
    const user = auth.currentUser;
    
    if (!user) {
        showPopup('Please sign in to access this feature', 'warning');
        
        // Redirect to login after showing popup
        setTimeout(() => {
            document.getElementById('signInButton').click();
        }, 1000);
        return false;
    }
    
    // If user is logged in, proceed with original action
    const href = event.currentTarget.getAttribute('href');
    if (href && href !== '#') {
        window.location.href = href;
    }
    return true;
}

// Initialize event listeners
function initAuthListeners() {
    // Add click handlers to all interactive elements
    const protectedElements = document.querySelectorAll(`
        .btn:not(#signInButton):not(#signOutButton),
        .nav-link:not([href="#"]),
        .plan-card,
        .service-card,
        .transformation-card
    `);
    
    protectedElements.forEach(element => {
        element.addEventListener('click', checkAuthAndRedirect);
    });
    
    // Sign in button
    signInButton.addEventListener('click', (e) => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .catch(error => showPopup(`Sign in failed: ${error.message}`, 'error'));
    });
    
    // Sign out button
    signOutButton.addEventListener('click', (e) => {
        auth.signOut()
            .then(() => showPopup('Signed out successfully', 'info'))
            .catch(error => showPopup(`Sign out failed: ${error.message}`, 'error'));
    });
}

// Call this when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuthListeners);
    // Initialize authentication
    initAuth();

    // DOM Elements
    const loader = document.querySelector('.loader');
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const installBtn = document.getElementById('installBtn');
    let deferredPrompt;

    // Loader
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('loaded');
        }, 1000);
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // PWA Installation
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'flex';
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        installBtn.style.display = 'none';
    });

    window.addEventListener('appinstalled', () => {
        installBtn.style.display = 'none';
        deferredPrompt = null;
        console.log('PWA was installed');
    });

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }

    // Smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Testimonials Slider
    function initTestimonialsSlider() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        const dotsContainer = document.querySelector('.testimonial-dots');
        let currentTestimonial = 0;

        // Create dots
        testimonials.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('testimonial-dot');
            if (index === currentTestimonial) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentTestimonial = index;
                showTestimonial(currentTestimonial);
            });
            dotsContainer.appendChild(dot);
        });

        // Show testimonial
        function showTestimonial(index) {
            testimonials.forEach(testimonial => testimonial.classList.remove('active'));
            testimonials[index].classList.add('active');
            
            // Update dots
            const dots = document.querySelectorAll('.testimonial-dot');
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        }

        // Navigation
        document.querySelector('.testimonial-next').addEventListener('click', () => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        });

        document.querySelector('.testimonial-prev').addEventListener('click', () => {
            currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentTestimonial);
        });

        // Auto slide
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }

    // Contact Form Submission
    function handleContactForm() {
        const form = document.getElementById('contactForm');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const service = document.getElementById('service').value;
                const message = document.getElementById('message').value;
                
                alert(`Thank you, ${name}! Your message about ${service} has been received. We'll contact you at ${email} soon.`);
                
                form.reset();
            });
        }
    }

    // Initialize components
    initTestimonialsSlider();
    handleContactForm();
    
    // Add floating labels functionality
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        if (input.placeholder === '') {
            input.placeholder = ' ';
        }
    });

    // Progress tracking functionality
    const updateProgressBtn = document.getElementById('updateProgress');
    const progressCircle = document.querySelector('.progress-circle');
    
    if (updateProgressBtn && progressCircle) {
        // Load saved progress from localStorage
        const savedProgress = localStorage.getItem('fitnessProgress') || 0;
        updateProgressCircle(savedProgress);
        
        updateProgressBtn.addEventListener('click', function() {
            const newProgress = prompt('Enter your progress percentage (0-100):', savedProgress);
            if (newProgress !== null && !isNaN(newProgress)) {
                const progress = Math.min(100, Math.max(0, parseInt(newProgress)));
                localStorage.setItem('fitnessProgress', progress);
                updateProgressCircle(progress);
            }
        });
    }
}
