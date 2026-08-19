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
        console.warn("Firebase initialization note:", e);
    }
}

const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;

function recordTrafficAndVisit(pageName = 'Fitness Calculator Tools') {
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

// --------------------------------------------------------------------------
// Member Auth & Scientific Tools Gating
// --------------------------------------------------------------------------
function initToolsAuth() {
    const signInBtn = document.getElementById('signInButton');
    const signOutBtn = document.getElementById('signOutButton');
    const userInfo = document.getElementById('userInfo');
    const userAvatarImg = document.getElementById('userAvatarImg');
    const userAvatarInitials = document.getElementById('userAvatarInitials');

    signOutBtn?.addEventListener('click', async () => {
        if (auth) {
            try {
                await auth.signOut();
                window.location.replace('login.html?redirect=tools.html');
            } catch (err) {
                console.error('Sign Out error:', err);
            }
        }
    });

    if (auth) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is Authenticated: Display member profile & keep tools unlocked
                if (signInBtn) signInBtn.style.display = 'none';
                if (userInfo) userInfo.style.display = 'flex';

                if (userAvatarImg) {
                    if (user.photoURL) {
                        userAvatarImg.onload = () => {
                            userAvatarImg.style.display = 'block';
                            if (userAvatarInitials) userAvatarInitials.style.display = 'none';
                        };
                        userAvatarImg.onerror = () => {
                            userAvatarImg.style.display = 'none';
                            if (userAvatarInitials) userAvatarInitials.style.display = 'flex';
                        };
                        userAvatarImg.src = user.photoURL;
                    } else {
                        userAvatarImg.style.display = 'none';
                        if (userAvatarInitials) {
                            userAvatarInitials.textContent = (user.displayName || 'M').charAt(0).toUpperCase();
                            userAvatarInitials.style.display = 'flex';
                        }
                    }
                }

                // Update Admin CRM Directory
                recordSignedInUser(user);
            } else {
                // Not Logged In: Trigger redirect to dedicated login page!
                window.location.replace('login.html?redirect=tools.html');
            }
        });
    } else {
        window.location.replace('login.html?redirect=tools.html');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Record pageview traffic
    recordTrafficAndVisit('Scientific Fitness Tools');

    // Initialize Member Auth & Gating
    initToolsAuth();

    // Hide Page Loader
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loaded');
        }, 350);
    }

    // Theme Toggle Handler
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

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu?.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Header scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) header?.classList.add('scrolled');
        else header?.classList.remove('scrolled');
    });

    // Initialize Tool Tabs
    initToolTabs();

    // Initialize All Calculators
    initTDEEMacroCalc();
    initBodyFatCalc();
    initOneRepMaxCalc();
    initHydrationCalc();
    initHeartRateCalc();
});

// --------------------------------------------------------------------------
// Tool Tab Navigation
// --------------------------------------------------------------------------
function initToolTabs() {
    const tabBtns = document.querySelectorAll('.tool-tab-item');
    const panels = document.querySelectorAll('.tool-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tool');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// --------------------------------------------------------------------------
// 1. TDEE & Macronutrient Target Calculator
// --------------------------------------------------------------------------
function initTDEEMacroCalc() {
    const form = document.getElementById('tdeeMacroForm');
    if (!form) return;

    form.addEventListener('input', calculateTDEEMacros);
    form.addEventListener('submit', (e) => { e.preventDefault(); calculateTDEEMacros(); });

    function calculateTDEEMacros() {
        const gender = form.querySelector('input[name="tdeeGender"]:checked')?.value || 'male';
        const age = parseFloat(document.getElementById('tdeeAge')?.value) || 25;
        const weight = parseFloat(document.getElementById('tdeeWeight')?.value) || 75;
        const height = parseFloat(document.getElementById('tdeeHeight')?.value) || 175;
        const activity = parseFloat(document.getElementById('tdeeActivity')?.value) || 1.375;
        const goal = document.getElementById('tdeeGoal')?.value || 'cut';

        // Mifflin-St Jeor BMR
        let bmr = 0;
        if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        const tdee = Math.round(bmr * activity);
        let targetCalories = tdee;
        let goalText = 'Weight Maintenance';

        if (goal === 'aggressive_cut') {
            targetCalories = Math.round(tdee * 0.75); // -25%
            goalText = 'Aggressive Fat Loss';
        } else if (goal === 'cut') {
            targetCalories = Math.round(tdee * 0.82); // -18%
            goalText = 'Sustainable Fat Loss';
        } else if (goal === 'lean_bulk') {
            targetCalories = Math.round(tdee * 1.10); // +10%
            goalText = 'Lean Muscle Hypertrophy';
        } else if (goal === 'bulk') {
            targetCalories = Math.round(tdee * 1.18); // +18%
            goalText = 'Maximum Strength & Mass Gain';
        }

        // Macro calculation
        // Protein: 2.2g/kg for cut, 2.0g/kg for bulk/maintenance
        let proteinMultiplier = (goal.includes('cut')) ? 2.2 : 2.0;
        let proteinGrams = Math.round(weight * proteinMultiplier);
        let proteinCalories = proteinGrams * 4;

        // Fats: 25% of total calories
        let fatCalories = Math.round(targetCalories * 0.25);
        let fatGrams = Math.round(fatCalories / 9);

        // Carbs: Remaining calories
        let carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
        let carbGrams = Math.round(carbCalories / 4);

        // Update UI
        document.getElementById('tdeeBmrVal').textContent = `${Math.round(bmr)} kcal`;
        document.getElementById('tdeeMaintVal').textContent = `${tdee} kcal`;
        document.getElementById('tdeeTargetCalories').textContent = `${targetCalories}`;
        document.getElementById('tdeeGoalBadge').textContent = goalText;

        document.getElementById('macroProteinGrams').textContent = `${proteinGrams}g`;
        document.getElementById('macroProteinCal').textContent = `${proteinCalories} kcal`;

        document.getElementById('macroCarbsGrams').textContent = `${carbGrams}g`;
        document.getElementById('macroCarbsCal').textContent = `${carbCalories} kcal`;

        document.getElementById('macroFatsGrams').textContent = `${fatGrams}g`;
        document.getElementById('macroFatsCal').textContent = `${fatCalories} kcal`;

        // Progress bar percentages
        const proteinPct = Math.round((proteinCalories / targetCalories) * 100);
        const carbsPct = Math.round((carbCalories / targetCalories) * 100);
        const fatsPct = 100 - proteinPct - carbsPct;

        document.getElementById('macroBarProtein').style.width = `${proteinPct}%`;
        document.getElementById('macroBarCarbs').style.width = `${carbsPct}%`;
        document.getElementById('macroBarFats').style.width = `${fatsPct}%`;

        // Update WhatsApp Share Link
        const shareBtn = document.getElementById('shareTdeeWhatsApp');
        if (shareBtn) {
            const msg = `Hi Coach Rajashekar! 💪\n\nHere are my calculated TDEE & Macro stats:\n• Target Daily Calories: ${targetCalories} kcal (${goalText})\n• Protein: ${proteinGrams}g (${proteinPct}%)\n• Carbs: ${carbGrams}g (${carbsPct}%)\n• Fats: ${fatGrams}g (${fatsPct}%)\n\nCan you tailor a customized diet meal plan for me?`;
            shareBtn.href = `https://wa.me/918187808710?text=${encodeURIComponent(msg)}`;
        }
    }
    calculateTDEEMacros();
}

// --------------------------------------------------------------------------
// 2. US Navy Body Fat % Estimator
// --------------------------------------------------------------------------
function initBodyFatCalc() {
    const form = document.getElementById('bodyFatForm');
    const femaleHipGroup = document.getElementById('femaleHipGroup');
    if (!form) return;

    // Toggle hip measurement based on gender
    form.querySelectorAll('input[name="bfGender"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'female') {
                femaleHipGroup.style.display = 'block';
            } else {
                femaleHipGroup.style.display = 'none';
            }
            calculateBodyFat();
        });
    });

    form.addEventListener('input', calculateBodyFat);
    form.addEventListener('submit', (e) => { e.preventDefault(); calculateBodyFat(); });

    function calculateBodyFat() {
        const gender = form.querySelector('input[name="bfGender"]:checked')?.value || 'male';
        const height = parseFloat(document.getElementById('bfHeight')?.value) || 175;
        const weight = parseFloat(document.getElementById('bfWeight')?.value) || 75;
        const neck = parseFloat(document.getElementById('bfNeck')?.value) || 38;
        const waist = parseFloat(document.getElementById('bfWaist')?.value) || 84;
        const hip = parseFloat(document.getElementById('bfHip')?.value) || 95;

        if (waist <= neck || height <= 0) return;

        let bfPercent = 0;

        if (gender === 'male') {
            // US Navy Formula Men (Metric)
            // %BF = 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
            const logWaistNeck = Math.log10(waist - neck);
            const logHeight = Math.log10(height);
            const denominator = 1.0324 - (0.19077 * logWaistNeck) + (0.15456 * logHeight);
            bfPercent = (495 / denominator) - 450;
        } else {
            // US Navy Formula Women (Metric)
            // %BF = 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
            const logWaistHipNeck = Math.log10(waist + hip - neck);
            const logHeight = Math.log10(height);
            const denominator = 1.29579 - (0.35004 * logWaistHipNeck) + (0.22100 * logHeight);
            bfPercent = (495 / denominator) - 450;
        }

        bfPercent = Math.max(3, Math.min(55, bfPercent));
        const bfRounded = bfPercent.toFixed(1);

        const fatMass = ((bfPercent / 100) * weight).toFixed(1);
        const leanMass = (weight - fatMass).toFixed(1);

        let category = '';
        let color = '';

        if (gender === 'male') {
            if (bfPercent < 6) { category = 'Essential Fat (Extremely Low)'; color = '#F43F5E'; }
            else if (bfPercent < 14) { category = 'Athletes (Lean & Defined)'; color = '#10B981'; }
            else if (bfPercent < 18) { category = 'Fitness (Healthy & Toned)'; color = '#00F0FF'; }
            else if (bfPercent < 25) { category = 'Average Range'; color = '#F5C45E'; }
            else { category = 'High Body Fat'; color = '#F43F5E'; }
        } else {
            if (bfPercent < 14) { category = 'Essential Fat (Extremely Low)'; color = '#F43F5E'; }
            else if (bfPercent < 21) { category = 'Athletes (Lean & Defined)'; color = '#10B981'; }
            else if (bfPercent < 25) { category = 'Fitness (Healthy & Toned)'; color = '#00F0FF'; }
            else if (bfPercent < 32) { category = 'Average Range'; color = '#F5C45E'; }
            else { category = 'High Body Fat'; color = '#F43F5E'; }
        }

        document.getElementById('bfResultVal').textContent = `${bfRounded}%`;
        const badge = document.getElementById('bfCategoryBadge');
        badge.textContent = category;
        badge.style.color = color;
        badge.style.borderColor = color;

        document.getElementById('bfFatMassVal').textContent = `${fatMass} kg`;
        document.getElementById('bfLeanMassVal').textContent = `${leanMass} kg`;

        const shareBtn = document.getElementById('shareBfWhatsApp');
        if (shareBtn) {
            const msg = `Hi Coach Rajashekar! 💪\n\nI calculated my US Navy Body Fat estimate:\n• Body Fat: ${bfRounded}%\n• Category: ${category}\n• Lean Muscle Mass: ${leanMass} kg\n• Fat Mass: ${fatMass} kg\n\nI'd like your coaching to reach my ideal body composition!`;
            shareBtn.href = `https://wa.me/918187808710?text=${encodeURIComponent(msg)}`;
        }
    }
    calculateBodyFat();
}

// --------------------------------------------------------------------------
// 3. 1-Rep Max (1RM) Strength Calculator
// --------------------------------------------------------------------------
function initOneRepMaxCalc() {
    const form = document.getElementById('ormForm');
    if (!form) return;

    form.addEventListener('input', calculateORM);
    form.addEventListener('submit', (e) => { e.preventDefault(); calculateORM(); });

    function calculateORM() {
        const weight = parseFloat(document.getElementById('ormWeight')?.value) || 80;
        const reps = parseInt(document.getElementById('ormReps')?.value) || 5;

        if (weight <= 0 || reps <= 0) return;

        // Epley Formula: 1RM = Weight * (1 + Reps / 30)
        const oneRepMax = reps === 1 ? weight : Math.round(weight * (1 + reps / 30));

        document.getElementById('ormResultVal').textContent = `${oneRepMax} kg`;

        // Percentage breakdown
        const percentages = [
            { pct: 95, reps: '1-2 Reps', focus: 'Maximal Strength' },
            { pct: 90, reps: '3-4 Reps', focus: 'Heavy Strength' },
            { pct: 85, reps: '5-6 Reps', focus: 'Strength & Power' },
            { pct: 80, reps: '7-8 Reps', focus: 'Hypertrophy / Muscle Growth' },
            { pct: 75, reps: '9-10 Reps', focus: 'Hypertrophy Range' },
            { pct: 70, reps: '11-12 Reps', focus: 'Muscular Endurance' },
            { pct: 65, reps: '13-15 Reps', focus: 'Toning & Stamina' }
        ];

        const tbody = document.getElementById('ormTableBody');
        if (tbody) {
            tbody.innerHTML = '';
            percentages.forEach(row => {
                const liftedWeight = Math.round(oneRepMax * (row.pct / 100));
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${row.pct}%</strong></td>
                    <td style="color: var(--primary); font-weight: 700;">${liftedWeight} kg</td>
                    <td>${row.reps}</td>
                    <td style="color: var(--text-muted);">${row.focus}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        const shareBtn = document.getElementById('shareOrmWhatsApp');
        if (shareBtn) {
            const msg = `Hi Coach Rajashekar! 💪\n\nMy estimated 1-Rep Max (1RM) is: ${oneRepMax} kg (based on ${weight} kg for ${reps} reps).\n\nCan you guide me on progressive overload programming?`;
            shareBtn.href = `https://wa.me/918187808710?text=${encodeURIComponent(msg)}`;
        }
    }
    calculateORM();
}

// --------------------------------------------------------------------------
// 4. Daily Hydration & Electrolyte Intake
// --------------------------------------------------------------------------
function initHydrationCalc() {
    const form = document.getElementById('hydrationForm');
    if (!form) return;

    form.addEventListener('input', calculateHydration);
    form.addEventListener('submit', (e) => { e.preventDefault(); calculateHydration(); });

    function calculateHydration() {
        const weight = parseFloat(document.getElementById('hydroWeight')?.value) || 70;
        const duration = parseFloat(document.getElementById('hydroDuration')?.value) || 45;
        const climate = document.getElementById('hydroClimate')?.value || 'hot';

        // Base: 35ml per kg bodyweight
        let baseWater = (weight * 0.035);

        // Exercise addition: 350ml per 30 min of exercise
        let workoutAddition = (duration / 30) * 0.35;

        // Climate factor
        let climateAddition = (climate === 'hot') ? 0.6 : (climate === 'humid' ? 0.4 : 0);

        const totalLiters = (baseWater + workoutAddition + climateAddition).toFixed(1);
        const totalGlasses = Math.round((totalLiters * 1000) / 250); // 250ml per glass

        document.getElementById('hydroResultLiters').textContent = `${totalLiters} L`;
        document.getElementById('hydroResultGlasses').textContent = `approx. ${totalGlasses} Glasses / day`;

        // Protocol Breakdown
        document.getElementById('hydroPreWorkout').textContent = '500 ml (2 hours before workout)';
        document.getElementById('hydroIntraWorkout').textContent = `${Math.round(duration * 6.5)} ml (Sip every 15-20 mins)`;
        document.getElementById('hydroPostWorkout').textContent = '500-750 ml with electrolytes / pinch of salt';

        const shareBtn = document.getElementById('shareHydroWhatsApp');
        if (shareBtn) {
            const msg = `Hi Coach Rajashekar! 💧\n\nMy daily hydration target is ${totalLiters} Liters (${totalGlasses} glasses) based on my ${duration}-minute workout sessions.`;
            shareBtn.href = `https://wa.me/918187808710?text=${encodeURIComponent(msg)}`;
        }
    }
    calculateHydration();
}

// --------------------------------------------------------------------------
// 5. Target Heart Rate & Fat Burn Zones
// --------------------------------------------------------------------------
function initHeartRateCalc() {
    const form = document.getElementById('heartRateForm');
    if (!form) return;

    form.addEventListener('input', calculateHeartRate);
    form.addEventListener('submit', (e) => { e.preventDefault(); calculateHeartRate(); });

    function calculateHeartRate() {
        const age = parseInt(document.getElementById('hrAge')?.value) || 26;
        const restingHr = parseInt(document.getElementById('hrResting')?.value) || 68;

        if (age <= 10 || age > 100) return;

        // Tanaka Formula: Max HR = 208 - (0.7 * Age)
        const maxHr = Math.round(208 - (0.7 * age));

        document.getElementById('hrMaxVal').textContent = `${maxHr} BPM`;

        // Karvonen Heart Rate Reserve (HRR) or Percentage of Max HR
        const z1Low = Math.round(maxHr * 0.50);
        const z1High = Math.round(maxHr * 0.60);

        const z2Low = Math.round(maxHr * 0.60);
        const z2High = Math.round(maxHr * 0.70);

        const z3Low = Math.round(maxHr * 0.70);
        const z3High = Math.round(maxHr * 0.80);

        const z4Low = Math.round(maxHr * 0.80);
        const z4High = Math.round(maxHr * 0.90);

        const z5Low = Math.round(maxHr * 0.90);
        const z5High = maxHr;

        document.getElementById('hrZone1').textContent = `${z1Low} - ${z1High} BPM`;
        document.getElementById('hrZone2').textContent = `${z2Low} - ${z2High} BPM`;
        document.getElementById('hrZone3').textContent = `${z3Low} - ${z3High} BPM`;
        document.getElementById('hrZone4').textContent = `${z4Low} - ${z4High} BPM`;
        document.getElementById('hrZone5').textContent = `${z5Low} - ${z5High} BPM`;

        const shareBtn = document.getElementById('shareHrWhatsApp');
        if (shareBtn) {
            const msg = `Hi Coach Rajashekar! ❤️\n\nMy Max Heart Rate is ${maxHr} BPM.\nMy Zone 2 Fat-Burning cardio range is ${z2Low} - ${z2High} BPM.\nCan you incorporate this into my cardio regimen?`;
            shareBtn.href = `https://wa.me/918187808710?text=${encodeURIComponent(msg)}`;
        }
    }
    calculateHeartRate();
}
