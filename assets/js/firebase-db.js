/**
 * FITNESS - HEALTHY LIFESTYLE
 * Centralized Firebase & Firestore Cloud Database Synchronization Engine
 * Exposes window.FitDB for seamless multi-device data sync with LocalStorage offline caching
 */

(function () {
    'use strict';

    // 1. Default Firebase Configuration
    const defaultFirebaseConfig = {
        apiKey: "AIzaSyBp1yyC1IF_rmOWwFdZRcbcsCHNbJ3Sdro",
        authDomain: "mnr-devops-2e97d.firebaseapp.com",
        projectId: "mnr-devops-2e97d",
        storageBucket: "mnr-devops-2e97d.firebasestorage.app",
        messagingSenderId: "464172080556",
        appId: "1:464172080556:web:97cecddd2e236f387aee09",
        measurementId: "G-9SXTYCDF9W"
    };

    // Load active config (supports Admin custom key overrides)
    let firebaseConfig = defaultFirebaseConfig;
    try {
        const customConfig = localStorage.getItem('fit_custom_firebase_config');
        if (customConfig) {
            firebaseConfig = Object.assign({}, defaultFirebaseConfig, JSON.parse(customConfig));
        }
    } catch (e) {
        console.warn('[FitDB] Error reading custom config:', e);
    }

    // 2. Initialize Firebase App, Auth, and Firestore
    let app = null;
    let auth = null;
    let db = null;
    let isCloudReady = false;

    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey) {
        try {
            if (!firebase.apps || !firebase.apps.length) {
                app = firebase.initializeApp(firebaseConfig);
            } else {
                app = firebase.app();
            }

            if (firebase.auth) {
                auth = firebase.auth();
            }

            if (firebase.firestore) {
                db = firebase.firestore();
                isCloudReady = true;
                // Enable offline persistence where supported
                try {
                    db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
                        if (err.code === 'failed-precondition' || err.code === 'unimplemented') {
                            // Persistence not available in multiple tabs or browser unsupported - continue gracefully
                        }
                    });
                } catch (pe) {
                    // Ignore persistence setup errors
                }
            }
        } catch (err) {
            console.warn('[FitDB] Cloud initialization notice:', err);
        }
    }

    // 3. Default Datasets for Automatic Cloud Seeding
    const defaultPrograms = [
        {
            id: 'prog-diet',
            title: 'Customized Diet Plan',
            icon: 'fas fa-utensils',
            desc: 'Science-backed, macro-calculated nutrition tailored to your regional food preferences, budget, and transformation targets.',
            originalPrice: 499,
            price: 199,
            duration: '/ month',
            discount: '60% OFF',
            featured: false,
            features: [
                '100% Customized Macro-Calculated Diet Plan',
                'Veg / Non-Veg / Eggetarian Custom Options',
                'Practical Grocery Checklist & Easy Meal Prep Guide',
                'Evidence-Based Supplement Suggestions & Timing',
                'Bi-Weekly Calorie & Milestone Adjustments'
            ]
        },
        {
            id: 'prog-pt',
            title: 'Personal Training & Transformation',
            icon: 'fas fa-dumbbell',
            desc: 'Complete end-to-end fitness coaching combining customized diet, tailored workout regimes, and continuous daily accountability.',
            originalPrice: 1499,
            price: 849,
            duration: '/ month',
            discount: '43% OFF',
            featured: true,
            features: [
                '100% Customized Diet & Nutrition Plan',
                'Customized Workout Plan (Home or Gym Split)',
                'Daily Progress Tracking & WhatsApp Accountability',
                'Weekly Check-ins & Form Correction Audits',
                'Evidence-Based Supplement Suggestions',
                '24/7 Priority WhatsApp Consultation with Coach Rajashekar'
            ]
        },
        {
            id: 'prog-one-on-one',
            title: 'Elite 1-on-1 VIP Live Training',
            icon: 'fas fa-video',
            desc: 'Dedicated private 1-on-1 coaching with 5 live online classes per week, real-time form correction, and direct VIP mentorship.',
            originalPrice: 6999,
            price: 3999,
            duration: '/ month',
            discount: 'VIP Flagship',
            featured: false,
            features: [
                'Direct 1-on-1 Private Live Training Sessions',
                '5 Live Online Classes per Week (Mon–Fri)',
                'Real-Time Live Technique & Form Correction',
                'Complete Custom Diet & Workout Protocol Included',
                'Daily Live Guidance, Motivation & 24/7 VIP Access',
                'Weekly Body Metrics, Strength & Recomposition Audits'
            ]
        }
    ];

    const defaultTransformations = [
        {
            id: 'tf-11',
            title: '112 Kgs → 80 Kgs (-32kg)',
            category: 'fatloss',
            stats: '-32 kg Fat Lost • Life Makeover',
            quote: 'Lost 32kg sustainably through consistent strength training and macro-focused meal planning.',
            image: 'assets/images/result11.jpg',
            featured: true
        },
        {
            id: 'tf-10',
            title: '115 Kgs → 78 Kgs (-37kg)',
            category: 'fatloss',
            stats: '-37 kg Total Weight Loss',
            quote: 'From 115kg down to 78kg! Coach Rajashekar saved my health, stamina, and lifestyle.',
            image: 'assets/images/result10.jpg',
            featured: true
        },
        {
            id: 'tf-6',
            title: 'Lost 20 Kgs Full Body Shred',
            category: 'fatloss',
            stats: '-20 kg Body Fat • Abdominal Toning',
            quote: 'Customized workouts and daily accountability gave me the discipline to drop 20kg.',
            image: 'assets/images/result6.jpg',
            featured: true
        },
        {
            id: 'tf-1',
            title: '14 Kgs Lost in 100 Days',
            category: 'fatloss',
            stats: '-14 kg Pure Fat Loss • Waist -5 in',
            quote: 'Structured calorie deficit and 1-on-1 WhatsApp tracking made this 14kg drop effortless.',
            image: 'assets/images/result1.jpg',
            featured: true
        },
        {
            id: 'tf-2',
            title: '120 Days Back Recomposition',
            category: 'recomp',
            stats: 'Back Fat Shredded • Lat Width',
            quote: '120 days of progressive pull and row training. Lower back fat vanished and my lats widened.',
            image: 'assets/images/result2.jpg',
            featured: true
        },
        {
            id: 'tf-9',
            title: 'Chest, Posture & Arm Recomp',
            category: 'muscle',
            stats: '+5.5 kg Muscle Mass • Chest Defined',
            quote: 'Progressive overload lifting corrected my rounded shoulders and added noticeable size.',
            image: 'assets/images/result9.jpg',
            featured: true
        },
        {
            id: 'tf-8',
            title: 'Abdominal Profile & Core Shred',
            category: 'fatloss',
            stats: 'Waist Trimmed • Core Tightened',
            quote: 'Lost the protruding belly and built real core tightness with tailored metabolic circuits.',
            image: 'assets/images/result8.jpg',
            featured: false
        },
        {
            id: 'tf-7',
            title: 'Side Profile & Waist Reduction',
            category: 'fatloss',
            stats: '-10 kg Fat • Flanks Flattened',
            quote: 'Lost the side love handles and back rolls through macronutrient cycling.',
            image: 'assets/images/result7.jpg',
            featured: false
        },
        {
            id: 'tf-4',
            title: 'Shoulders & Delts Mass Building',
            category: 'muscle',
            stats: '+6.5 kg Lean Muscle • Biceps',
            quote: 'Replaced random gym workouts with structured Push-Pull-Legs. Gained capped delts.',
            image: 'assets/images/result4.jpg',
            featured: false
        },
        {
            id: 'tf-5',
            title: 'Strength & Athletic Recomposition',
            category: 'muscle',
            stats: '+8 kg Clean Mass • 1RM +35kg',
            quote: '1-on-1 technique corrections on Bench and Deadlifts took my lifting to athlete levels.',
            image: 'assets/images/result5.jpg',
            featured: false
        },
        {
            id: 'tf-3',
            title: 'Abdominal & Chest Fat Shred',
            category: 'fatloss',
            stats: '-12 kg Visceral Fat • Chest Toned',
            quote: 'Struggled with belly fat for years. Rajashekar high-protein Indian diet reshaped my midsection.',
            image: 'assets/images/result3.jpg',
            featured: false
        }
    ];

    const defaultProductsCatalog = [
        {
            id: 'prod-1',
            title: 'Optimum Nutrition (ON) Gold Standard 100% Whey Protein (2 lbs)',
            category: 'supplements',
            price: 3299,
            originalPrice: 4199,
            discount: '21% OFF',
            couponCode: 'COACHRAJ',
            affiliateUrl: 'https://www.amazon.in/dp/B000QSNYGI?tag=fitcoachraj-21',
            image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80',
            rating: 4.9,
            desc: 'World\'s #1 whey protein. 24g pure whey isolate per serving with 5.5g BCAAs and 4g Glutamine.',
            coachTip: 'Gold standard post-workout fuel. Zero bloat, rapid absorption, perfect for muscle repair and fat loss.',
            featured: true
        },
        {
            id: 'prod-2',
            title: 'MuscleBlaze Micronized Creatine Monohydrate (250g, 83 Servings)',
            category: 'supplements',
            price: 849,
            originalPrice: 1199,
            discount: '29% OFF',
            couponCode: 'MBFIT10',
            affiliateUrl: 'https://www.amazon.in/dp/B00LP9V9FE?tag=fitcoachraj-21',
            image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80',
            rating: 4.8,
            desc: 'Ultra-pure 100% Creapure micronized creatine. Boosts cellular ATP energy, power output, and muscle fullness.',
            coachTip: 'Take 3-5g daily with water. You will notice visible strength leaps on Bench and Squats within 2 weeks.',
            featured: true
        },
        {
            id: 'prod-3',
            title: 'Pintola All-Natural Organic Crunchy Peanut Butter (1 Kg)',
            category: 'diet',
            price: 425,
            originalPrice: 549,
            discount: '22% OFF',
            couponCode: 'PINTOLA5',
            affiliateUrl: 'https://www.amazon.in/dp/B010GD3NFK?tag=fitcoachraj-21',
            image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=600&q=80',
            rating: 4.9,
            desc: '100% Roasted Peanuts only. Zero added sugar, zero salt, zero palm oil, and zero trans fats. 30g protein per 100g.',
            coachTip: 'The cleanest calorie and good-fat booster for muscle building smoothies or post-workout whole wheat toast.',
            featured: false
        },
        {
            id: 'prod-4',
            title: 'Boldfit Heavy-Duty Resistance Pull-Up & Loop Bands (Set of 5)',
            category: 'gear',
            price: 699,
            originalPrice: 1299,
            discount: '46% OFF',
            couponCode: 'BOLDFIT15',
            affiliateUrl: 'https://www.amazon.in/dp/B07Y5C2B4R?tag=fitcoachraj-21',
            image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=600&q=80',
            rating: 4.8,
            desc: '100% Natural Latex stackable resistance bands with handles, door anchor, and travel pouch for full-body home workouts.',
            coachTip: 'Essential for home workouts and mobility warmups. Great for rotator cuff strength and assisted pull-ups.',
            featured: false
        },
        {
            id: 'prod-5',
            title: 'ShakeSphere Pro Stainless Steel Protein Shaker Bottle (750ml)',
            category: 'gear',
            price: 999,
            originalPrice: 1499,
            discount: '33% OFF',
            couponCode: 'SHAKE10',
            affiliateUrl: 'https://www.amazon.in/dp/B07N38K7X6?tag=fitcoachraj-21',
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
            rating: 4.9,
            desc: 'Capsule design mixes powders smoothly without mixing balls or mesh. Leak-proof lock lid and odor-resistant stainless steel.',
            coachTip: 'Never smells bad like cheap plastic shakers. Keeps pre-workout ice cold for hours.',
            featured: false
        },
        {
            id: 'prod-6',
            title: 'Kobo Heavy-Duty Padded Weightlifting Wrist Wraps & Straps Combo',
            category: 'equipment',
            price: 549,
            originalPrice: 899,
            discount: '39% OFF',
            couponCode: 'KOBOPRO',
            affiliateUrl: 'https://www.amazon.in/dp/B01LZN3E8O?tag=fitcoachraj-21',
            image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80',
            rating: 4.8,
            desc: 'Neoprene padded cotton lifting straps + elastic wrist support wraps with reinforced thumb loops for heavy deadlifts and presses.',
            coachTip: 'Eliminates grip fatigue so you can lift 20-30% heavier on Deadlifts, Lat Pulldowns, and Barbell Rows.',
            featured: true
        }
    ];

    const defaultRecipes = [
        {
            id: 'veg-1',
            title: 'High-Protein Paneer Bhurji with Multigrain Toast',
            type: 'veg',
            meal: 'breakfast fat-loss',
            prepTime: '5 Mins',
            cookTime: '10 Mins',
            protein: '32g',
            calories: '380 kcal',
            carbs: '28g',
            fats: '14g',
            desc: 'Crumpled low-fat paneer sautéed with turmeric, onions, bell peppers, and fresh coriander served with toasted multigrain bread.',
            ingredients: [
                '150g Low-fat Fresh Paneer (Cottage cheese, crumbled)',
                '2 Slices 100% Whole Wheat / Multigrain Bread',
                '1/2 Medium Onion & 1/2 Green Capsicum (finely chopped)',
                '1 Small Tomato & 1 Green Chili',
                '1/2 tsp Turmeric, 1/2 tsp Cumin seeds, 1/2 tsp Garam masala',
                '1 tsp Cold-pressed Mustard Oil or Ghee',
                'Fresh Coriander leaves & Salt to taste'
            ],
            instructions: [
                'Heat 1 tsp oil in a pan, add cumin seeds, chopped green chili, and sauté onions till golden brown.',
                'Add chopped tomatoes and capsicum, cook for 3 minutes until soft.',
                'Stir in turmeric powder, garam masala, and salt.',
                'Add the crumbled paneer and toss gently on medium flame for 3-4 minutes. Do not overcook to keep paneer soft.',
                'Garnish with fresh coriander leaves.',
                'Toast 2 multigrain bread slices until golden crisp and serve hot with the bhurji.'
            ],
            coachTip: 'Low-fat paneer delivers high biological value casein and whey protein. Perfect for starting the day with sustained satiety without insulin spikes.'
        },
        {
            id: 'nv-1',
            title: 'Grilled Lemon Herb Chicken & Steamed Veggies',
            type: 'nonveg',
            meal: 'lunch-dinner fat-loss',
            prepTime: '10 Mins',
            cookTime: '15 Mins',
            protein: '44g',
            calories: '410 kcal',
            carbs: '12g',
            fats: '9g',
            desc: 'Skinless chicken breast marinated in fresh lemon juice, crushed garlic, rosemary, and black pepper, grilled till juicy and served with broccoli and carrots.',
            ingredients: [
                '200g Skinless Boneless Chicken Breast',
                '1 tbsp Lemon Juice & 1 tsp Lemon zest',
                '3 Garlic cloves (minced) & 1/2 tsp Dried Rosemary/Oregano',
                '1/2 tsp Crushed Black Pepper & Salt to taste',
                '1 tsp Extra Virgin Olive Oil',
                '1 cup Broccoli florets & 1/2 Carrot (steamed)'
            ],
            instructions: [
                'Make light diagonal cuts on the chicken breast for deep marination.',
                'Mix lemon juice, minced garlic, herbs, olive oil, pepper, and salt in a bowl. Coat chicken thoroughly and rest for 15 minutes.',
                'Heat a grill pan on medium-high heat. Sear chicken for 6-7 minutes on each side until fully cooked, succulent, and slightly charred.',
                'Steam broccoli florets and sliced carrots for 4 minutes until vibrant and tender-crisp.',
                'Let the chicken rest for 3 minutes, slice into strips, and serve hot alongside steamed vegetables.'
            ],
            coachTip: 'Chicken breast is the gold standard for lean protein with almost zero fat. Resting the meat after grilling locks in moisture and prevents dryness.'
        },
        {
            id: 'veg-2',
            title: 'Overnight Chocolate Peanut Butter Oats',
            type: 'veg',
            meal: 'breakfast muscle-gain',
            prepTime: '5 Mins',
            cookTime: '0 Mins',
            protein: '35g',
            calories: '490 kcal',
            carbs: '54g',
            fats: '14g',
            desc: 'Rolled oats soaked overnight with whey protein, natural peanut butter, chia seeds, and unsweetened almond milk.',
            ingredients: [
                '50g Rolled Oats (Whole grain)',
                '1 Scoop (30g) Whey Protein Isolate (Chocolate flavor)',
                '1 tbsp (16g) 100% Natural Unsweetened Peanut Butter',
                '1 tsp Chia Seeds',
                '150ml Skimmed Milk or Unsweetened Almond Milk',
                '1/2 Banana (sliced, for topping in the morning)'
            ],
            instructions: [
                'In a mason jar, mix rolled oats, chocolate whey protein, and chia seeds.',
                'Add milk and natural peanut butter. Stir vigorously until thoroughly combined and no dry clumps remain.',
                'Seal the jar and refrigerate overnight (minimum 6 hours).',
                'In the morning, stir well. Top with sliced banana and a pinch of cinnamon if desired. Enjoy chilled!'
            ],
            coachTip: 'Complex carbohydrates combined with whey and slow-digesting fats from chia/peanut butter supply continuous amino acids and energy for grueling workouts.'
        },
        {
            id: 'nv-2',
            title: 'Masala Egg White Scramble with Roti',
            type: 'nonveg',
            meal: 'breakfast lunch-dinner fat-loss',
            prepTime: '5 Mins',
            cookTime: '8 Mins',
            protein: '28g',
            calories: '320 kcal',
            carbs: '26g',
            fats: '7g',
            desc: '5 egg whites and 1 whole egg scrambled with chopped onions, tomatoes, green chilies, and mild Indian spices, paired with a whole wheat roti.',
            ingredients: [
                '5 Egg Whites + 1 Whole Egg',
                '1 Small Onion & 1 Small Tomato (finely diced)',
                '1 Green Chili & 1/4 tsp Turmeric, 1/4 tsp Red chili powder',
                '1 tsp Olive Oil or Ghee',
                '1 Handmade Whole Wheat Roti / Chapati (no extra oil)',
                'Chopped coriander leaves & Salt'
            ],
            instructions: [
                'Whisk the egg whites and whole egg in a bowl with a pinch of salt and turmeric.',
                'Heat oil in a non-stick skillet. Sauté onions and green chilies until translucent.',
                'Add tomatoes and dry spices, cooking until softened.',
                'Pour in the whisked eggs. Stir gently on low-medium flame until fluffy, soft curds form (about 2-3 minutes).',
                'Garnish with coriander leaves and serve immediately with 1 hot chapati.'
            ],
            coachTip: 'Including 1 whole egg with egg whites optimizes the micronutrient profile (Choline, Vitamin D, and healthy fats) while keeping calories strictly controlled.'
        },
        {
            id: 'veg-3',
            title: 'Crispy Air-Fried Peri-Peri Tofu Bowl',
            type: 'veg',
            meal: 'lunch-dinner fat-loss',
            prepTime: '8 Mins',
            cookTime: '12 Mins',
            protein: '26g',
            calories: '340 kcal',
            carbs: '18g',
            fats: '12g',
            desc: 'High-protein organic tofu cubes seasoned with spicy peri-peri rub, air-fried to a golden crunch and served over crunchy cucumber and bell pepper salad.',
            ingredients: [
                '200g Firm Tofu (pressed and cut into 1-inch cubes)',
                '1 tbsp Peri-Peri Spice Seasoning',
                '1/2 tsp Garlic Powder & 1/2 tsp Lemon juice',
                '1 tsp Olive Oil (spray/brush)',
                '1 cup Mixed Salad: Sliced Cucumber, Red Capsicum, Cherry Tomatoes'
            ],
            instructions: [
                'Press tofu with a clean kitchen towel to remove excess water. Cut into equal cubes.',
                'Toss tofu with olive oil, lemon juice, peri-peri spice, and garlic powder.',
                'Preheat air fryer to 190°C. Arrange tofu in a single layer.',
                'Air fry for 12 minutes, shaking the basket at the 6-minute mark, until golden and crispy.',
                'Serve over fresh vegetable salad drizzled with a squeeze of fresh lemon.'
            ],
            coachTip: 'Tofu is an exceptional plant-based complete protein containing all 9 essential amino acids with low saturated fat.'
        },
        {
            id: 'nv-3',
            title: 'Tandoori Spiced Chicken Skewers (Tikka)',
            type: 'nonveg',
            meal: 'lunch-dinner muscle-gain',
            prepTime: '15 Mins',
            cookTime: '12 Mins',
            protein: '42g',
            calories: '390 kcal',
            carbs: '8g',
            fats: '11g',
            desc: 'Tender chicken breast chunks marinated in Greek yogurt, tandoori masala, ginger-garlic paste, and roasted to smoky perfection on skewers.',
            ingredients: [
                '220g Chicken Breast (cubed)',
                '2 tbsp Thick Low-Fat Greek Curd / Yogurt',
                '1 tbsp Ginger-Garlic Paste & 1 tbsp Tandoori Chicken Masala',
                '1/2 tsp Kashmiri Red Chili Powder & 1 tsp Lemon Juice',
                '1/2 tsp Garam Masala & 1/2 tsp Kasuri Methi',
                '1/2 Capsicum & 1/2 Onion (cut into square chunks)',
                'Wooden skewers (soaked in water)'
            ],
            instructions: [
                'Mix curd, ginger-garlic paste, spices, salt, and 1/2 tsp lemon juice in a bowl.',
                'Add chicken breast cubes and marinate for 20 minutes.',
                'Thread alternating pieces of marinated chicken, capsicum, and onion onto soaked skewers.',
                'Cook on a hot grill pan or in an oven at 200°C for 12-14 minutes, turning periodically until slightly charred.',
                'Brush with a touch of ghee, sprinkle chaat masala, and serve hot with green salad.'
            ],
            coachTip: 'Cooking chicken on skewers promotes even heat circulation, preventing the exterior from drying out while keeping the inside tender.'
        }
    ];

    // 4. Local Storage Helpers
    const LocalCache = {
        get(key, fallback = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : fallback;
            } catch (e) {
                return fallback;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {}
        }
    };

    // 5. FitDB Public API
    const FitDB = {
        isCloudConnected: () => isCloudReady && !!db,
        getDb: () => db,
        getAuth: () => auth,

        // --------------------------------------------------------------------
        // A. LEADS CRM (Client Consultations & Inquiries)
        // --------------------------------------------------------------------
        leads: {
            async add(leadData) {
                const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
                const leadId = leadData.id || ('lead-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4));
                const leadRecord = {
                    id: leadId,
                    name: leadData.name || 'Anonymous User',
                    phone: leadData.phone || 'Not provided',
                    email: leadData.email || '',
                    service: leadData.service || 'General Inquiry',
                    message: leadData.message || '',
                    source: leadData.source || 'Website Lead Form',
                    status: leadData.status || 'New',
                    date: leadData.date || now,
                    createdAt: Date.now()
                };

                // 1. Save to local cache first
                const localLeads = LocalCache.get('fit_admin_leads', []);
                const existingIdx = localLeads.findIndex(l => l.id === leadId);
                if (existingIdx >= 0) localLeads[existingIdx] = leadRecord;
                else localLeads.unshift(leadRecord);
                LocalCache.set('fit_admin_leads', localLeads);

                // 2. Save to Firestore if available
                if (db) {
                    try {
                        await db.collection('fit_leads').doc(leadId).set(leadRecord, { merge: true });
                    } catch (e) {
                        console.warn('[FitDB] Cloud write lead error, cached locally:', e);
                    }
                }
                return leadRecord;
            },

            async getAll() {
                if (db) {
                    try {
                        const snap = await db.collection('fit_leads').orderBy('createdAt', 'desc').get();
                        if (!snap.empty) {
                            const cloudList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                            LocalCache.set('fit_admin_leads', cloudList);
                            return cloudList;
                        }
                    } catch (e) {
                        console.warn('[FitDB] Cloud fetch leads fallback to local:', e);
                    }
                }
                return LocalCache.get('fit_admin_leads', []);
            },

            listen(callback) {
                const cached = LocalCache.get('fit_admin_leads', []);
                if (typeof callback === 'function') callback(cached);

                if (db) {
                    try {
                        return db.collection('fit_leads').onSnapshot(snap => {
                            const cloudList = [];
                            snap.forEach(doc => cloudList.push({ id: doc.id, ...doc.data() }));
                            cloudList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0) || (b.date || '').localeCompare(a.date || ''));
                            LocalCache.set('fit_admin_leads', cloudList);
                            if (typeof callback === 'function') callback(cloudList);
                        }, err => {
                            console.warn('[FitDB] Leads listener fallback:', err);
                        });
                    } catch (e) {
                        console.warn('[FitDB] Real-time leads subscribe failed:', e);
                    }
                }
                return () => {};
            },

            async updateStatus(leadId, status) {
                const localLeads = LocalCache.get('fit_admin_leads', []);
                const idx = localLeads.findIndex(l => l.id === leadId);
                if (idx >= 0) {
                    localLeads[idx].status = status;
                    localLeads[idx].updatedAt = Date.now();
                    LocalCache.set('fit_admin_leads', localLeads);
                }

                if (db) {
                    try {
                        await db.collection('fit_leads').doc(leadId).update({
                            status: status,
                            updatedAt: Date.now()
                        });
                    } catch (e) {
                        console.warn('[FitDB] Cloud update status fallback:', e);
                    }
                }
            },

            async delete(leadId) {
                let localLeads = LocalCache.get('fit_admin_leads', []);
                localLeads = localLeads.filter(l => l.id !== leadId);
                LocalCache.set('fit_admin_leads', localLeads);

                if (db) {
                    try {
                        await db.collection('fit_leads').doc(leadId).delete();
                    } catch (e) {
                        console.warn('[FitDB] Cloud delete lead fallback:', e);
                    }
                }
            }
        },

        // --------------------------------------------------------------------
        // B. PROGRAMS & PRICING
        // --------------------------------------------------------------------
        programs: {
            async getAll() {
                if (db) {
                    try {
                        const snap = await db.collection('fit_programs').get();
                        if (!snap.empty) {
                            const cloudPrograms = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                            LocalCache.set('fit_admin_programs', cloudPrograms);
                            return cloudPrograms;
                        } else {
                            await FitDB.programs.seedDefaults();
                        }
                    } catch (e) {
                        console.warn('[FitDB] Cloud fetch programs fallback to local:', e);
                    }
                }
                let local = LocalCache.get('fit_admin_programs');
                if (!local || !Array.isArray(local) || !local.length) {
                    local = defaultPrograms;
                    LocalCache.set('fit_admin_programs', local);
                }
                return local;
            },

            listen(callback) {
                let cached = LocalCache.get('fit_admin_programs', defaultPrograms);
                if (typeof callback === 'function') callback(cached);

                if (db) {
                    try {
                        return db.collection('fit_programs').onSnapshot(async snap => {
                            if (snap.empty) {
                                await FitDB.programs.seedDefaults();
                                return;
                            }
                            const cloudList = [];
                            snap.forEach(doc => cloudList.push({ id: doc.id, ...doc.data() }));
                            LocalCache.set('fit_admin_programs', cloudList);
                            if (typeof callback === 'function') callback(cloudList);
                        }, err => {
                            console.warn('[FitDB] Programs listener fallback:', err);
                        });
                    } catch (e) {
                        console.warn('[FitDB] Programs subscribe failed:', e);
                    }
                }
                return () => {};
            },

            async save(program) {
                const progId = program.id || ('prog-' + Date.now());
                const programRecord = {
                    id: progId,
                    title: program.title || 'Coaching Program',
                    icon: program.icon || 'fas fa-dumbbell',
                    desc: program.desc || '',
                    originalPrice: Number(program.originalPrice) || 0,
                    price: Number(program.price) || 0,
                    duration: program.duration || '/ month',
                    discount: program.discount || '',
                    featured: !!program.featured,
                    features: Array.isArray(program.features) ? program.features : [],
                    updatedAt: Date.now()
                };

                let local = LocalCache.get('fit_admin_programs', defaultPrograms);
                const idx = local.findIndex(p => p.id === progId);
                if (idx >= 0) local[idx] = programRecord;
                else local.push(programRecord);
                LocalCache.set('fit_admin_programs', local);

                if (db) {
                    try {
                        await db.collection('fit_programs').doc(progId).set(programRecord, { merge: true });
                    } catch (e) {
                        console.warn('[FitDB] Cloud save program error:', e);
                    }
                }
                return programRecord;
            },

            async delete(programId) {
                let local = LocalCache.get('fit_admin_programs', defaultPrograms);
                local = local.filter(p => p.id !== programId);
                LocalCache.set('fit_admin_programs', local);

                if (db) {
                    try {
                        await db.collection('fit_programs').doc(programId).delete();
                    } catch (e) {
                        console.warn('[FitDB] Cloud delete program error:', e);
                    }
                }
            },

            async seedDefaults() {
                LocalCache.set('fit_admin_programs', defaultPrograms);
                if (db) {
                    try {
                        const batch = db.batch();
                        defaultPrograms.forEach(p => {
                            const ref = db.collection('fit_programs').doc(p.id);
                            batch.set(ref, { ...p, updatedAt: Date.now() }, { merge: true });
                        });
                        await batch.commit();
                    } catch (e) {
                        console.warn('[FitDB] Seed programs error:', e);
                    }
                }
            }
        },

        // --------------------------------------------------------------------
        // C. DIET RECIPES
        // --------------------------------------------------------------------
        recipes: {
            async getAll() {
                if (db) {
                    try {
                        const snap = await db.collection('fit_recipes').get();
                        if (!snap.empty) {
                            const cloudRecipes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                            LocalCache.set('fit_admin_recipes', cloudRecipes);
                            return cloudRecipes;
                        } else {
                            await FitDB.recipes.seedDefaults();
                        }
                    } catch (e) {
                        console.warn('[FitDB] Cloud fetch recipes fallback to local:', e);
                    }
                }
                let local = LocalCache.get('fit_admin_recipes');
                if (!local || !Array.isArray(local) || !local.length) {
                    local = defaultRecipes;
                    LocalCache.set('fit_admin_recipes', local);
                }
                return local;
            },

            listen(callback) {
                let cached = LocalCache.get('fit_admin_recipes', defaultRecipes);
                if (typeof callback === 'function') callback(cached);

                if (db) {
                    try {
                        return db.collection('fit_recipes').onSnapshot(async snap => {
                            if (snap.empty) {
                                await FitDB.recipes.seedDefaults();
                                return;
                            }
                            const cloudList = [];
                            snap.forEach(doc => cloudList.push({ id: doc.id, ...doc.data() }));
                            LocalCache.set('fit_admin_recipes', cloudList);
                            if (typeof callback === 'function') callback(cloudList);
                        }, err => {
                            console.warn('[FitDB] Recipes listener fallback:', err);
                        });
                    } catch (e) {
                        console.warn('[FitDB] Recipes subscribe failed:', e);
                    }
                }
                return () => {};
            },

            async save(recipe) {
                const recipeId = recipe.id || ('rec-' + Date.now());
                const recipeRecord = {
                    id: recipeId,
                    title: recipe.title || 'Healthy Fitness Recipe',
                    type: recipe.type || 'veg',
                    meal: recipe.meal || 'lunch-dinner fat-loss',
                    prepTime: recipe.prepTime || '10 Mins',
                    cookTime: recipe.cookTime || '10 Mins',
                    protein: recipe.protein || '20g',
                    calories: recipe.calories || '350 kcal',
                    carbs: recipe.carbs || '30g',
                    fats: recipe.fats || '10g',
                    desc: recipe.desc || '',
                    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
                    instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
                    coachTip: recipe.coachTip || '',
                    updatedAt: Date.now()
                };

                let local = LocalCache.get('fit_admin_recipes', defaultRecipes);
                const idx = local.findIndex(r => r.id === recipeId);
                if (idx >= 0) local[idx] = recipeRecord;
                else local.unshift(recipeRecord);
                LocalCache.set('fit_admin_recipes', local);

                if (db) {
                    try {
                        await db.collection('fit_recipes').doc(recipeId).set(recipeRecord, { merge: true });
                    } catch (e) {
                        console.warn('[FitDB] Cloud save recipe error:', e);
                    }
                }
                return recipeRecord;
            },

            async delete(recipeId) {
                let local = LocalCache.get('fit_admin_recipes', defaultRecipes);
                local = local.filter(r => r.id !== recipeId);
                LocalCache.set('fit_admin_recipes', local);

                if (db) {
                    try {
                        await db.collection('fit_recipes').doc(recipeId).delete();
                    } catch (e) {
                        console.warn('[FitDB] Cloud delete recipe error:', e);
                    }
                }
            },

            async seedDefaults() {
                LocalCache.set('fit_admin_recipes', defaultRecipes);
                if (db) {
                    try {
                        const batch = db.batch();
                        defaultRecipes.forEach(r => {
                            const ref = db.collection('fit_recipes').doc(r.id);
                            batch.set(ref, { ...r, updatedAt: Date.now() }, { merge: true });
                        });
                        await batch.commit();
                    } catch (e) {
                        console.warn('[FitDB] Seed recipes error:', e);
                    }
                }
            }
        },

        // --------------------------------------------------------------------
        // D. TRANSFORMATIONS GALLERY
        // --------------------------------------------------------------------
        transformations: {
            async getAll() {
                if (db) {
                    try {
                        const snap = await db.collection('fit_transformations').get();
                        if (!snap.empty) {
                            const cloudTfs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                            LocalCache.set('fit_admin_transformations', cloudTfs);
                            return cloudTfs;
                        } else {
                            await FitDB.transformations.seedDefaults();
                        }
                    } catch (e) {
                        console.warn('[FitDB] Cloud fetch transformations fallback to local:', e);
                    }
                }
                let local = LocalCache.get('fit_admin_transformations');
                if (!local || !Array.isArray(local) || !local.length) {
                    local = defaultTransformations;
                    LocalCache.set('fit_admin_transformations', local);
                }
                return local;
            },

            listen(callback) {
                let cached = LocalCache.get('fit_admin_transformations', defaultTransformations);
                if (typeof callback === 'function') callback(cached);

                if (db) {
                    try {
                        return db.collection('fit_transformations').onSnapshot(async snap => {
                            if (snap.empty) {
                                await FitDB.transformations.seedDefaults();
                                return;
                            }
                            const cloudList = [];
                            snap.forEach(doc => cloudList.push({ id: doc.id, ...doc.data() }));
                            LocalCache.set('fit_admin_transformations', cloudList);
                            if (typeof callback === 'function') callback(cloudList);
                        }, err => {
                            console.warn('[FitDB] Transformations listener fallback:', err);
                        });
                    } catch (e) {
                        console.warn('[FitDB] Transformations subscribe failed:', e);
                    }
                }
                return () => {};
            },

            async save(tf) {
                const tfId = tf.id || ('tf-' + Date.now());
                const tfRecord = {
                    id: tfId,
                    title: tf.title || 'Client Transformation',
                    category: tf.category || 'fatloss',
                    stats: tf.stats || '',
                    quote: tf.quote || '',
                    image: tf.image || 'assets/images/result1.jpg',
                    featured: !!tf.featured,
                    updatedAt: Date.now()
                };

                let local = LocalCache.get('fit_admin_transformations', defaultTransformations);
                const idx = local.findIndex(t => t.id === tfId);
                if (idx >= 0) local[idx] = tfRecord;
                else local.unshift(tfRecord);
                LocalCache.set('fit_admin_transformations', local);

                if (db) {
                    try {
                        await db.collection('fit_transformations').doc(tfId).set(tfRecord, { merge: true });
                    } catch (e) {
                        console.warn('[FitDB] Cloud save transformation error:', e);
                    }
                }
                return tfRecord;
            },

            async delete(tfId) {
                let local = LocalCache.get('fit_admin_transformations', defaultTransformations);
                local = local.filter(t => t.id !== tfId);
                LocalCache.set('fit_admin_transformations', local);

                if (db) {
                    try {
                        await db.collection('fit_transformations').doc(tfId).delete();
                    } catch (e) {
                        console.warn('[FitDB] Cloud delete transformation error:', e);
                    }
                }
            },

            async seedDefaults() {
                LocalCache.set('fit_admin_transformations', defaultTransformations);
                if (db) {
                    try {
                        const batch = db.batch();
                        defaultTransformations.forEach(t => {
                            const ref = db.collection('fit_transformations').doc(t.id);
                            batch.set(ref, { ...t, updatedAt: Date.now() }, { merge: true });
                        });
                        await batch.commit();
                    } catch (e) {
                        console.warn('[FitDB] Seed transformations error:', e);
                    }
                }
            }
        },

        // --------------------------------------------------------------------
        // D. PRODUCTS & AFFILIATE GEAR CATALOG
        // --------------------------------------------------------------------
        products: {
            getAll() {
                return LocalCache.get('fit_admin_products', defaultProductsCatalog);
            },

            listen(callback) {
                if (typeof callback === 'function') {
                    callback(this.getAll());
                }

                if (db) {
                    try {
                        return db.collection('fit_products').onSnapshot(snap => {
                            if (!snap.empty) {
                                const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                                LocalCache.set('fit_admin_products', products);
                                if (typeof callback === 'function') callback(products);
                            } else {
                                this.seedDefaults().then(prods => {
                                    if (typeof callback === 'function') callback(prods);
                                });
                            }
                        }, err => {
                            console.warn('[FitDB] Products listener notice:', err);
                        });
                    } catch (e) {
                        console.warn('[FitDB] Products setup error:', e);
                    }
                }
            },

            async save(product) {
                if (!product) return;
                const prodId = product.id || ('prod-' + Date.now());
                const prodRecord = {
                    id: prodId,
                    title: product.title || 'Recommended Fitness Product',
                    category: product.category || 'supplements',
                    price: Number(product.price) || 0,
                    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
                    discount: product.discount || '',
                    couponCode: product.couponCode || '',
                    affiliateUrl: product.affiliateUrl || 'https://www.amazon.in',
                    image: product.image || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80',
                    rating: Number(product.rating) || 4.9,
                    desc: product.desc || '',
                    coachTip: product.coachTip || '',
                    featured: !!product.featured,
                    updatedAt: Date.now()
                };

                let local = LocalCache.get('fit_admin_products', defaultProductsCatalog);
                const idx = local.findIndex(p => p.id === prodId);
                if (idx >= 0) local[idx] = prodRecord;
                else local.unshift(prodRecord);
                LocalCache.set('fit_admin_products', local);

                if (db) {
                    try {
                        await db.collection('fit_products').doc(prodId).set(prodRecord, { merge: true });
                    } catch (e) {
                        console.warn('[FitDB] Cloud save product error:', e);
                    }
                }
                return prodRecord;
            },

            async delete(prodId) {
                let local = LocalCache.get('fit_admin_products', defaultProductsCatalog);
                local = local.filter(p => p.id !== prodId);
                LocalCache.set('fit_admin_products', local);

                if (db) {
                    try {
                        await db.collection('fit_products').doc(prodId).delete();
                    } catch (e) {
                        console.warn('[FitDB] Cloud delete product error:', e);
                    }
                }
            },

            async seedDefaults() {
                LocalCache.set('fit_admin_products', defaultProductsCatalog);
                if (db) {
                    try {
                        const batch = db.batch();
                        defaultProductsCatalog.forEach(p => {
                            const ref = db.collection('fit_products').doc(p.id);
                            batch.set(ref, { ...p, updatedAt: Date.now() }, { merge: true });
                        });
                        await batch.commit();
                    } catch (e) {
                        console.warn('[FitDB] Seed products error:', e);
                    }
                }
                return defaultProductsCatalog;
            }
        },

        // --------------------------------------------------------------------
        // E. VISITOR ANALYTICS, PROGRAM CLICKS & USER DIRECTORY
        // --------------------------------------------------------------------
        analytics: {
            async recordVisit(pageName = 'Home') {
                const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
                let visitorId = localStorage.getItem('fit_visitor_id');
                let isNewVisitor = false;

                if (!visitorId) {
                    visitorId = 'vis_' + Math.random().toString(36).substr(2, 9);
                    localStorage.setItem('fit_visitor_id', visitorId);
                    isNewVisitor = true;
                }

                const trafficData = LocalCache.get('fit_analytics_traffic', { totalVisits: 0, uniqueVisitors: 0, visitsLog: [] });
                trafficData.totalVisits = (trafficData.totalVisits || 0) + 1;
                if (isNewVisitor) trafficData.uniqueVisitors = (trafficData.uniqueVisitors || 0) + 1;

                const visitEntry = {
                    id: 'v_' + Date.now(),
                    page: pageName,
                    time: now,
                    device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile Device' : 'Desktop / PC',
                    visitorId: visitorId,
                    timestamp: Date.now()
                };

                if (!trafficData.visitsLog) trafficData.visitsLog = [];
                trafficData.visitsLog.unshift(visitEntry);
                if (trafficData.visitsLog.length > 50) trafficData.visitsLog = trafficData.visitsLog.slice(0, 50);
                LocalCache.set('fit_analytics_traffic', trafficData);

                // Sync to Cloud
                if (db) {
                    try {
                        const counterRef = db.collection('fit_analytics').doc('summary');
                        const increment = firebase.firestore.FieldValue.increment;
                        const updatePayload = {
                            totalVisits: increment(1),
                            lastVisitAt: Date.now(),
                            lastPage: pageName
                        };
                        if (isNewVisitor) updatePayload.uniqueVisitors = increment(1);
                        await counterRef.set(updatePayload, { merge: true });

                        await db.collection('fit_analytics_traffic').doc(visitEntry.id).set(visitEntry);
                    } catch (e) {
                        // Silent fallback
                    }
                }
            },

            async recordProgramIntent(programTitle, price = '') {
                const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
                const user = auth ? auth.currentUser : null;
                const intentEntry = {
                    id: 'intent-' + Date.now(),
                    program: programTitle,
                    price: price,
                    userName: user ? (user.displayName || user.email) : 'Website Guest',
                    userEmail: user ? (user.email || 'Email Private') : 'Guest (Not Logged In)',
                    time: now,
                    device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
                    timestamp: Date.now()
                };

                const current = LocalCache.get('fit_analytics_program_intent', []);
                current.unshift(intentEntry);
                if (current.length > 50) current.length = 50;
                LocalCache.set('fit_analytics_program_intent', current);

                if (db) {
                    try {
                        await db.collection('fit_analytics_intent').doc(intentEntry.id).set(intentEntry);
                    } catch (e) {}
                }
            },

            async recordProductClick(productTitle, category = '') {
                const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
                const user = auth ? auth.currentUser : null;
                const clickEntry = {
                    id: 'pclick-' + Date.now(),
                    product: productTitle,
                    category: category,
                    userName: user ? (user.displayName || user.email) : 'Website Guest',
                    time: now,
                    timestamp: Date.now()
                };

                if (db) {
                    try {
                        await db.collection('fit_analytics_products').doc(clickEntry.id).set(clickEntry);
                    } catch (e) {}
                }
            },

            async syncUser(user) {
                if (!user) return;
                const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
                const userRecord = {
                    uid: user.uid,
                    displayName: user.displayName || 'Fitness Member',
                    email: user.email || 'Email Private',
                    photoURL: user.photoURL || '',
                    lastActive: now,
                    lastActiveTimestamp: Date.now()
                };

                // Local Cache
                const usersList = LocalCache.get('fit_analytics_users', []);
                const existingIdx = usersList.findIndex(u => u.uid === user.uid || (u.email && u.email === user.email));
                if (existingIdx >= 0) {
                    usersList[existingIdx].lastActive = now;
                    usersList[existingIdx].displayName = userRecord.displayName;
                    usersList[existingIdx].photoURL = userRecord.photoURL;
                } else {
                    userRecord.joinedDate = now;
                    usersList.unshift(userRecord);
                }
                LocalCache.set('fit_analytics_users', usersList);

                // Cloud Sync
                if (db) {
                    try {
                        await db.collection('fit_users').doc(user.uid).set(userRecord, { merge: true });
                    } catch (e) {}
                }
            },

            listenTraffic(callback) {
                if (db) {
                    try {
                        return db.collection('fit_analytics_traffic').orderBy('timestamp', 'desc').limit(25).onSnapshot(snap => {
                            const logs = snap.docs.map(d => d.data());
                            if (typeof callback === 'function') callback(logs);
                        }, err => {});
                    } catch (e) {}
                }
            },

            listenIntent(callback) {
                if (db) {
                    try {
                        return db.collection('fit_analytics_intent').orderBy('timestamp', 'desc').limit(30).onSnapshot(snap => {
                            const intents = snap.docs.map(d => d.data());
                            LocalCache.set('fit_analytics_program_intent', intents);
                            if (typeof callback === 'function') callback(intents);
                        }, err => {});
                    } catch (e) {}
                }
            },

            listenUsers(callback) {
                if (db) {
                    try {
                        return db.collection('fit_users').orderBy('lastActiveTimestamp', 'desc').limit(50).onSnapshot(snap => {
                            const users = snap.docs.map(d => d.data());
                            LocalCache.set('fit_analytics_users', users);
                            if (typeof callback === 'function') callback(users);
                        }, err => {});
                    } catch (e) {}
                }
            }
        },

        // Helper to force sync / seed all platform catalogs to cloud
        async syncAllToCloud() {
            if (!db) throw new Error("Firebase Firestore is not initialized");
            await Promise.all([
                FitDB.programs.seedDefaults(),
                FitDB.recipes.seedDefaults(),
                FitDB.transformations.seedDefaults(),
                FitDB.products.seedDefaults()
            ]);
            return true;
        }
    };

    // Auto-record page view on DOM load
    document.addEventListener('DOMContentLoaded', () => {
        const pageTitle = document.title ? document.title.replace('FITNESS | ', '') : 'Fitness Website';
        FitDB.analytics.recordVisit(pageTitle);

        // Listen for user auth to sync profile
        if (auth) {
            auth.onAuthStateChanged(user => {
                if (user) FitDB.analytics.syncUser(user);
            });
        }
    });

    // Expose globally
    window.FitDB = FitDB;
    window.defaultFirebaseConfig = defaultFirebaseConfig;

})();
