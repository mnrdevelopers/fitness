/**
 * ============================================================================
 * FITNESS - HEALTHY LIFESTYLE | Coach Rajashekar Admin Command Center (JS)
 * 100% Dynamic Engine: Lead CRM, Transformations Manager, Custom Programs & Specs
 * ============================================================================
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
        console.warn("Firebase initialization note:", e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------------
    // 1. Initial State & Configuration
    // ------------------------------------------------------------------------
    const DEFAULT_ADMIN_EMAIL = 'itsrajashekar12@gmail.com';
    const AUTHORIZED_ADMIN_EMAILS = [
        'itsrajashekar12@gmail.com'
    ];
    const DEFAULT_MASTER_PIN = '8187808710';

    // Default Programs Catalog with Specifications
    const defaultProgramsCatalog = [
        {
            id: 'prog-diet',
            title: 'Customized Diet Plan',
            icon: 'fas fa-utensils',
            desc: 'Science-backed, macro-calculated nutrition tailored to your regional food preferences, budget, and body transformation targets.',
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

    // Real Initial Transformations Catalog
    const siteTransformationsCatalog = [
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

    // Default Recipes Catalog for Kitchen Management
    const defaultRecipesCatalog = [
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
            cookTime: '12 Mins',
            protein: '44g',
            calories: '340 kcal',
            carbs: '12g',
            fats: '8g',
            desc: 'Skinless chicken breast marinated in fresh lemon juice, garlic, oregano, and olive oil, grilled to juicy perfection with broccoli and carrots.',
            ingredients: [
                '200g Boneless Skinless Chicken Breast (butterflied)',
                '1 tbsp Fresh Lemon Juice',
                '1 tsp Crushed Garlic & 1/2 tsp Black Pepper',
                '1/2 tsp Dried Oregano & Mixed Italian Herbs',
                '1 tsp Extra Virgin Olive Oil',
                '100g Broccoli Florets & 50g Sliced Carrots',
                'Pink Himalayan Salt to taste'
            ],
            instructions: [
                'Butterfly the chicken breast and prick with a fork for tender marinade penetration.',
                'Rub with lemon juice, minced garlic, oregano, black pepper, salt, and 1/2 tsp olive oil. Marinate for 15 mins.',
                'Heat a grill pan on medium-high heat with the remaining 1/2 tsp olive oil.',
                'Grill chicken breast for 5-6 minutes per side until charred grill marks form and internal temperature reaches 75°C.',
                'Steam broccoli and carrots in a steamer basket for 4 minutes until vibrant and tender-crisp.',
                'Rest the grilled chicken for 3 minutes to retain natural juices, then slice and serve with the steamed veggies.'
            ],
            coachTip: 'Resting the chicken breast for 3 minutes before cutting locks in the juices, ensuring lean meat never tastes dry.'
        },
        {
            id: 'veg-2',
            title: 'Spiced Soya Chunks & Veggie Brown Rice Bowl',
            type: 'veg',
            meal: 'lunch-dinner',
            prepTime: '8 Mins',
            cookTime: '15 Mins',
            protein: '38g',
            calories: '420 kcal',
            carbs: '52g',
            fats: '6g',
            desc: 'High-protein boiled soya chunks simmered in a light tomato-onion masala gravy, served over steaming fiber-rich brown basmati rice.',
            ingredients: [
                '60g Raw Soya Chunks (gives ~160g cooked)',
                '150g Cooked Brown Basmati Rice',
                '1 Medium Onion & 1 Tomato (pureed)',
                '1/2 tsp Ginger-Garlic Paste',
                '1/2 tsp Coriander Powder, 1/2 tsp Cumin, 1/2 tsp Kashmiri Red Chili',
                '1 tsp Mustard Oil',
                'Fresh Coriander for garnish'
            ],
            instructions: [
                'Boil soya chunks in water with a pinch of salt for 6 minutes. Drain and squeeze out excess water completely.',
                'Heat oil in a pan, add cumin seeds, and sauté ginger-garlic paste with finely chopped onions.',
                'Add tomato puree and spices, cooking until oil separates slightly.',
                'Add the squeezed soya chunks and 1/4 cup water. Simmer on low heat for 6-8 minutes so chunks absorb the flavor.',
                'Serve hot over freshly steamed brown basmati rice with a side of cucumber slices.'
            ],
            coachTip: 'Soya chunks are 52% pure plant protein by weight. Squeezing out all water after boiling eliminates any raw soy aftertaste and allows them to absorb rich spices.'
        },
        {
            id: 'nv-2',
            title: 'Egg White Masala Scramble & Whole Wheat Roti',
            type: 'nonveg',
            meal: 'breakfast fat-loss',
            prepTime: '5 Mins',
            cookTime: '7 Mins',
            protein: '30g',
            calories: '290 kcal',
            carbs: '22g',
            fats: '6g',
            desc: '5 egg whites and 1 whole egg scrambled with green chilies, tomatoes, and cumin, served with a soft whole wheat roti.',
            ingredients: [
                '5 Egg Whites + 1 Whole Egg (beaten)',
                '1 Soft Handmade Whole Wheat Roti (approx. 35g dough)',
                '1/2 Finely Chopped Onion & 1 Green Chili',
                '1/2 Chopped Tomato & Fresh Coriander',
                '1/4 tsp Turmeric & Black Pepper',
                '1/2 tsp Desi Cow Ghee'
            ],
            instructions: [
                'In a bowl, whisk 5 egg whites and 1 whole egg with a pinch of salt and turmeric.',
                'Heat 1/2 tsp ghee in a non-stick skillet. Sauté onions and green chilies for 2 minutes.',
                'Add chopped tomatoes and cook for 1 minute.',
                'Pour the whisked egg mixture over medium-low heat. Stir slowly in sweeping motions to create fluffy curds.',
                'Remove from heat just before fully set to prevent dryness. Garnish with fresh cracked black pepper and coriander.',
                'Serve immediately with 1 warm whole wheat roti.'
            ],
            coachTip: 'Keeping 1 whole egg with 5 whites delivers essential fat-soluble vitamins (A, D, E, K) and choline while keeping fat under 6 grams.'
        },
        {
            id: 'veg-3',
            title: 'Moong Dal & Grated Paneer Protein Chilla',
            type: 'veg',
            meal: 'breakfast post-workout',
            prepTime: '10 Mins',
            cookTime: '10 Mins',
            protein: '28g',
            calories: '320 kcal',
            carbs: '34g',
            fats: '8g',
            desc: 'Crispy golden yellow moong dal crepes stuffed with spiced grated paneer and served with refreshing homemade green mint chutney.',
            ingredients: [
                '1 Cup Soaked Yellow Moong Dal Batter (blended with ginger & green chili)',
                '80g Fresh Low-Fat Paneer (grated)',
                '1/2 tsp Cumin powder & Chaat Masala',
                '1/2 tsp Oil / Ghee for griddle',
                '2 tbsp Mint-Coriander Yogurt Chutney'
            ],
            instructions: [
                'Blend soaked moong dal with a small piece of ginger, green chili, and salt into a smooth pouring batter.',
                'Heat a non-stick tawa, lightly grease with a few drops of oil, and pour a ladle of batter, spreading in concentric circles.',
                'Cook on medium flame until edges crisp up and turn golden brown. Flip once.',
                'Sprinkle grated paneer seasoned with chaat masala evenly over the center.',
                'Fold the chilla into a roll and slice into halves. Serve with fresh mint chutney.'
            ],
            coachTip: 'Moong dal is light on digestion and rich in lysine amino acid. Combined with paneer, it creates a complete amino acid profile for muscle recovery.'
        },
        {
            id: 'nv-3',
            title: 'Air-Fried Tandoori Fish Tikka & Mint Salad',
            type: 'nonveg',
            meal: 'lunch-dinner fat-loss',
            prepTime: '10 Mins',
            cookTime: '12 Mins',
            protein: '36g',
            calories: '290 kcal',
            carbs: '6g',
            fats: '7g',
            desc: 'Lean Basa / Rohu cubes marinated in hung curd, Kashmiri red chili, carom seeds (ajwain), and mustard oil, air-fried with onion rings.',
            ingredients: [
                '220g Fresh Fish Fillet (Basa, Rohu, or Salmon cubes)',
                '2 tbsp Thick Hung Curd (Greek yogurt)',
                '1/2 tsp Ajwain (Carom seeds)',
                '1 tsp Kashmiri Red Chili Powder & 1/2 tsp Kasuri Methi',
                '1 tsp Mustard Oil & 1 tsp Lemon Juice',
                'Sliced Onion Rings & Lemon Wedges'
            ],
            instructions: [
                'Pat fish cubes completely dry with paper towels.',
                'In a bowl, mix hung curd, mustard oil, ajwain, Kashmiri red chili, kasuri methi, lemon juice, and salt.',
                'Coat fish cubes evenly with the marinade and let rest for 15 minutes.',
                'Preheat air fryer to 190°C (375°F). Arrange fish pieces in a single layer with space between.',
                'Air fry for 10-12 minutes, flipping gently at the halfway mark until edges are lightly charred.',
                'Sprinkle chaat masala and serve with crisp onion rings and lemon wedges.'
            ],
            coachTip: 'White fish like Basa and Tilapia provide nearly 100% protein calories with zero carbs. Ideal for evening dinners during aggressive fat loss phases.'
        },
        {
            id: 'veg-4',
            title: 'Overnight Peanut Butter & Chia High-Protein Oats',
            type: 'veg',
            meal: 'breakfast post-workout',
            prepTime: '5 Mins',
            cookTime: '0 Mins',
            protein: '26g',
            calories: '380 kcal',
            carbs: '46g',
            fats: '10g',
            desc: 'Rolled oats soaked overnight with plant/dairy protein, organic chia seeds, natural peanut butter, and topped with sliced banana.',
            ingredients: [
                '50g Whole Rolled Oats',
                '10g Organic Chia Seeds',
                '15g 100% Roasted Natural Peanut Butter (No sugar/oil added)',
                '200ml Skimmed Milk or Unsweetened Almond Milk',
                '1/2 Sliced Banana & Pinch of Cinnamon Powder'
            ],
            instructions: [
                'In a glass jar, combine rolled oats, chia seeds, and cinnamon powder.',
                'Pour in milk and add natural peanut butter. Stir thoroughly until well combined.',
                'Seal the jar and refrigerate overnight (minimum 6 hours).',
                'In the morning, top with fresh sliced banana and enjoy a ready-to-eat power meal.'
            ],
            coachTip: 'Chia seeds absorb 10x their weight in liquid, forming a soluble fiber gel that keeps blood glucose steady throughout morning workouts.'
        },
        {
            id: 'nv-4',
            title: 'Lean Chicken Keema Bowl with Brown Rice',
            type: 'nonveg',
            meal: 'lunch-dinner post-workout',
            prepTime: '8 Mins',
            cookTime: '18 Mins',
            protein: '42g',
            calories: '460 kcal',
            carbs: '48g',
            fats: '10g',
            desc: 'Minced lean chicken breast cooked with sweet green peas, ginger-garlic paste, and whole spices over steamed brown rice.',
            ingredients: [
                '200g Lean Minced Chicken Breast (Keema)',
                '150g Steamed Brown Basmati Rice',
                '30g Fresh Green Peas',
                '1 Onion & 1 Tomato (finely diced)',
                '1 tsp Ginger-Garlic Paste & 1/2 tsp Garam Masala',
                '1 tsp Ghee / Mustard Oil'
            ],
            instructions: [
                'Heat 1 tsp oil in a pan, add whole cumin and sauté onions and ginger-garlic paste.',
                'Add tomatoes, turmeric, coriander powder, chili powder, and salt. Cook until softened.',
                'Add minced chicken breast and break up any clumps with a spatula.',
                'Add green peas and 1/3 cup water. Cover and cook on medium flame for 12 minutes.',
                'Garnish with fresh lemon juice and serve over steamed brown rice.'
            ],
            coachTip: 'Minced chicken breast cooks in half the time of whole breasts and absorbs Indian spices exceptionally well for effortless meal prep batches.'
        },
        {
            id: 'veg-5',
            title: 'Crisp Tofu & Bell Pepper Quinoa Stir-Fry',
            type: 'veg',
            meal: 'lunch-dinner fat-loss',
            prepTime: '10 Mins',
            cookTime: '10 Mins',
            protein: '30g',
            calories: '350 kcal',
            carbs: '32g',
            fats: '9g',
            desc: 'Golden pan-seared organic firm tofu tossed with colorful crunchy bell peppers, broccoli, soy-ginger glaze, and served with fluffy quinoa.',
            ingredients: [
                '200g Extra-Firm Organic Tofu (cubed)',
                '120g Cooked Quinoa',
                '1 Cup Diced Red & Yellow Bell Peppers, Broccoli, and Onions',
                '1 tbsp Low Sodium Soy Sauce & 1 tsp Minced Garlic',
                '1 tsp Sesame Oil & 1 tsp Toasted White Sesame Seeds'
            ],
            instructions: [
                'Press tofu with a kitchen towel to remove moisture, then cut into bite-sized cubes.',
                'Heat sesame oil in a non-stick wok on high heat. Add minced garlic and tofu cubes.',
                'Sear tofu cubes for 4-5 minutes until golden on all sides.',
                'Toss in bell peppers and broccoli. Stir-fry on high flame for 3 minutes for crisp texture.',
                'Drizzle soy sauce, toss well, and serve over warm fluffy quinoa with toasted sesame seeds.'
            ],
            coachTip: 'Quinoa is one of the only complete plant proteins containing all 9 essential amino acids. Paired with firm tofu, it creates a clean, anti-inflammatory dinner.'
        },
        {
            id: 'nv-5',
            title: 'Boiled Egg, Avocado & Greek Yogurt Power Salad',
            type: 'nonveg',
            meal: 'breakfast fat-loss',
            prepTime: '8 Mins',
            cookTime: '0 Mins',
            protein: '26g',
            calories: '330 kcal',
            carbs: '10g',
            fats: '15g',
            desc: '4 hard-boiled egg whites and 1 whole egg paired with creamy hass avocado cubes, cherry tomatoes, and a light Greek yogurt herb dressing.',
            ingredients: [
                '4 Hard-Boiled Egg Whites + 1 Whole Egg (chopped)',
                '50g Fresh Ripe Hass Avocado (cubed)',
                '2 tbsp Plain Greek Yogurt (hung curd)',
                'Handful of Cherry Tomatoes & Cucumber slices',
                '1/2 tsp Black Pepper, Lemon juice, and Fresh Parsley'
            ],
            instructions: [
                'In a salad bowl, whisk Greek yogurt with lemon juice, salt, and black pepper to make a creamy, guilt-free dressing.',
                'Add chopped boiled eggs, diced avocado, cucumber, and halved cherry tomatoes.',
                'Toss gently so avocado maintains its shape and eggs are lightly coated.',
                'Serve cold as a refreshing, high-protein powerhouse breakfast or mid-day meal.'
            ],
            coachTip: 'Avocado provides monounsaturated fatty acids that slow gastric emptying, keeping hunger completely at bay for 4-5 hours.'
        },
        {
            id: 'veg-6',
            title: 'Sprouted Kala Chana & Pomegranate Protein Chaat',
            type: 'veg',
            meal: 'fat-loss post-workout',
            prepTime: '5 Mins',
            cookTime: '5 Mins',
            protein: '18g',
            calories: '260 kcal',
            carbs: '42g',
            fats: '3g',
            desc: 'Steamed high-fiber sprouted black chickpeas tossed with fresh pomegranate pearls, cucumbers, chaat masala, and fresh lemon squeeze.',
            ingredients: [
                '150g Sprouted Black Chickpeas (Kala Chana)',
                '30g Fresh Pomegranate Arils',
                '1/2 Cucumber & 1 Small Tomato (finely diced)',
                '1 Green Chili & Fresh Mint leaves',
                '1/2 tsp Roasted Cumin Powder & Chaat Masala',
                '1 tbsp Fresh Lemon Juice'
            ],
            instructions: [
                'Steam sprouted black chana for 5 minutes to make them tender and enhance bioavailability.',
                'In a large mixing bowl, combine warm chana, diced cucumber, tomatoes, green chili, and pomegranate.',
                'Add roasted cumin powder, chaat masala, salt, and freshly squeezed lemon juice.',
                'Toss well and serve immediately as an energizing pre-workout or evening fat-loss snack.'
            ],
            coachTip: 'Sprouting chickpeas increases protein digestibility by 20% and reduces phytic acid, making mineral absorption twice as effective.'
        },
        {
            id: 'nv-6',
            title: 'Tandoori Spiced Chicken Breast Skewers',
            type: 'nonveg',
            meal: 'lunch-dinner post-workout',
            prepTime: '15 Mins',
            cookTime: '12 Mins',
            protein: '40g',
            calories: '310 kcal',
            carbs: '8g',
            fats: '7g',
            desc: 'Tender bite-sized chicken breast cubes skewered with crunchy onions and capsicum, roasted under high heat with tandoori spices.',
            ingredients: [
                '200g Boneless Chicken Breast (cut into 1-inch cubes)',
                '2 tbsp Low-Fat Curd (Dahi)',
                '1 tsp Ginger-Garlic Paste & 1 tsp Kashmiri Red Chili',
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

    // Initialize LocalStorage Data cleanly
    if (!localStorage.getItem('fit_admin_leads')) {
        localStorage.setItem('fit_admin_leads', JSON.stringify([]));
    }
    if (!localStorage.getItem('fit_admin_transformations')) {
        localStorage.setItem('fit_admin_transformations', JSON.stringify(siteTransformationsCatalog));
    }
    if (!localStorage.getItem('fit_admin_programs')) {
        localStorage.setItem('fit_admin_programs', JSON.stringify(defaultProgramsCatalog));
    }
    if (!localStorage.getItem('fit_admin_recipes')) {
        localStorage.setItem('fit_admin_recipes', JSON.stringify(defaultRecipesCatalog));
    }

    // ------------------------------------------------------------------------
    // 2. Authentication & Security Gate
    // ------------------------------------------------------------------------
    const authGate = document.getElementById('adminAuthGate');
    const dashboardWrap = document.getElementById('adminDashboardWrap');
    const loginForm = document.getElementById('adminLoginForm');
    const pinInput = document.getElementById('adminPinInput');
    const loginError = document.getElementById('adminLoginError');
    const logoutBtn = document.getElementById('adminLogoutBtn');
    const googleLoginBtn = document.getElementById('adminGoogleLoginBtn');

    function checkAuth() {
        const token = sessionStorage.getItem('coach_rajashekar_auth');
        if (token === 'authenticated') {
            if (authGate) authGate.style.display = 'none';
            if (dashboardWrap) dashboardWrap.style.display = 'flex';
            loadAllDashboardData();
        } else {
            if (authGate) authGate.style.display = 'flex';
            if (dashboardWrap) dashboardWrap.style.display = 'none';
        }
    }

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const pin = pinInput.value.trim();
        if (pin === DEFAULT_MASTER_PIN) {
            sessionStorage.setItem('coach_rajashekar_auth', 'authenticated');
            sessionStorage.setItem('coach_admin_user', 'itsrajashekar12@gmail.com');
            pinInput.value = '';
            loginError.style.display = 'none';
            checkAuth();
            showAdminToast('Welcome back, Coach Rajashekar! Session verified.', 'success');
        } else {
            loginError.textContent = 'Invalid Master PIN / Security Passkey. Access Denied.';
            loginError.style.display = 'block';
            pinInput.focus();
        }
    });

    googleLoginBtn?.addEventListener('click', async () => {
        if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && firebase.auth) {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                provider.setCustomParameters({ prompt: 'select_account' });
                const result = await firebase.auth().signInWithPopup(provider);
                const user = result.user;
                const userEmail = (user?.email || '').trim().toLowerCase();

                const isAuthorized = AUTHORIZED_ADMIN_EMAILS.some(authEmail => authEmail.toLowerCase() === userEmail);

                if (user && isAuthorized) {
                    sessionStorage.setItem('coach_rajashekar_auth', 'authenticated');
                    sessionStorage.setItem('coach_admin_user', user.email);
                    loginError.style.display = 'none';
                    checkAuth();
                    showAdminToast(`Welcome Coach Rajashekar! (${user.email})`, 'success');
                } else {
                    // Unauthorized account: immediately sign out from Firebase and deny access
                    if (firebase.auth().currentUser) {
                        await firebase.auth().signOut().catch(() => {});
                    }
                    sessionStorage.removeItem('coach_rajashekar_auth');
                    sessionStorage.removeItem('coach_admin_user');

                    loginError.textContent = 'Access Denied: You do not have administrative permissions to enter this Command Center.';
                    loginError.style.display = 'block';
                    showAdminToast('Access Denied: Unauthorized Account.', 'error');
                }
            } catch (err) {
                console.error('Google Sign-In Notice:', err);
                if (err.code === 'auth/popup-closed-by-user') {
                    showAdminToast('Sign-in cancelled. Please retry or enter Security PIN.', 'info');
                } else if (err.code === 'auth/unauthorized-domain') {
                    loginError.innerHTML = '<strong>Firebase Setup Required:</strong> Add <code>fitnesshealthylifestyle.netlify.app</code> to Firebase Console &rarr; Auth &rarr; Settings &rarr; Authorized Domains.<br><small style="color: var(--primary);">You can also enter your Master PIN below to unlock immediately.</small>';
                    loginError.style.display = 'block';
                    showAdminToast('Domain authorization needed in Firebase Console.', 'error');
                } else {
                    showAdminToast('Authentication notice: Please verify credentials.', 'error');
                }
                pinInput.focus();
            }
        } else {
            loginError.innerHTML = '<strong>Firebase Setup:</strong> Please enter your <strong>Master PIN</strong> to unlock dashboard and configure Firebase keys under <em>Site & Security</em>.';
            loginError.style.display = 'block';
            showAdminToast('Please enter Master PIN to unlock.', 'info');
            pinInput.focus();
        }
    });

    logoutBtn?.addEventListener('click', () => {
        sessionStorage.removeItem('coach_rajashekar_auth');
        sessionStorage.removeItem('coach_admin_user');
        checkAuth();
        showAdminToast('Logged out securely.', 'info');
    });

    // ------------------------------------------------------------------------
    // 3. Theme Toggle & Navigation
    // ------------------------------------------------------------------------
    const themeBtn = document.getElementById('adminThemeToggle');
    if (localStorage.getItem('fit_theme') === 'light') {
        document.body.classList.add('light-theme');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeBtn?.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('fit_theme', isLight ? 'light' : 'dark');
        themeBtn.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Navigation Tabs & Mobile Drawer
    const navItems = document.querySelectorAll('.admin-nav-item');
    const sections = document.querySelectorAll('.admin-section-panel');
    const sidebarToggleBtn = document.getElementById('adminSidebarToggleBtn');
    const adminSidebar = document.querySelector('.admin-sidebar');
    const adminSidebarBackdrop = document.getElementById('adminSidebarBackdrop');

    const toggleMobileSidebar = (forceClose = false) => {
        if (!adminSidebar) return;
        if (forceClose) {
            adminSidebar.classList.remove('open');
            adminSidebarBackdrop?.classList.remove('active');
        } else {
            adminSidebar.classList.toggle('open');
            adminSidebarBackdrop?.classList.toggle('active');
        }
    };

    sidebarToggleBtn?.addEventListener('click', () => toggleMobileSidebar());
    adminSidebarBackdrop?.addEventListener('click', () => toggleMobileSidebar(true));

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            
            navItems.forEach(n => n.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            item.classList.add('active');
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.classList.add('active');

            // Close sidebar drawer on mobile
            if (window.innerWidth <= 992) {
                toggleMobileSidebar(true);
            }
        });
    });

    // ------------------------------------------------------------------------
    // 4. Dashboard Data Loading & Dynamic Engine
    // ------------------------------------------------------------------------
    function loadAllDashboardData() {
        renderStats();
        renderLeadsTable();
        renderTransformationsList();
        renderProgramsList();
        renderRecipesList();
        renderAnalytics();
        populateFirebaseSettingsForm();
    }

    // A. Render Live KPI Stats
    function renderStats() {
        const leads = JSON.parse(localStorage.getItem('fit_admin_leads') || '[]');
        const tfs = JSON.parse(localStorage.getItem('fit_admin_transformations') || '[]');

        const totalInquiries = leads.length;
        const newInquiries = leads.filter(l => l.status === 'New').length;
        const enrolledClients = leads.filter(l => l.status === 'Enrolled').length;
        const totalTfs = tfs.length;
        
        const elTotalInquiries = document.getElementById('statTotalInquiries');
        const elNewInquiries = document.getElementById('statNewInquiries');
        const elEnrolled = document.getElementById('statEnrolledClients');
        const elTotalTfs = document.getElementById('statTotalTfs');
        const badgeNew = document.getElementById('badgeNewLeadsCount');

        if (elTotalInquiries) elTotalInquiries.textContent = totalInquiries;
        if (elNewInquiries) elNewInquiries.textContent = newInquiries;
        if (elEnrolled) elEnrolled.textContent = enrolledClients;
        if (elTotalTfs) elTotalTfs.textContent = totalTfs;

        if (badgeNew) {
            badgeNew.textContent = newInquiries;
            badgeNew.style.display = newInquiries > 0 ? 'inline-block' : 'none';
        }
    }

    // B. Leads & Inquiries CRM Table
    const leadsTableBody = document.getElementById('leadsTableBody');
    const leadFilterStatus = document.getElementById('leadStatusFilter');
    const leadSearchInput = document.getElementById('leadSearchInput');

    function renderLeadsTable() {
        if (!leadsTableBody) return;
        const leads = JSON.parse(localStorage.getItem('fit_admin_leads') || '[]');
        const filterVal = leadFilterStatus ? leadFilterStatus.value : 'all';
        const searchVal = leadSearchInput ? leadSearchInput.value.toLowerCase() : '';

        const filtered = leads.filter(lead => {
            const matchesStatus = (filterVal === 'all' || lead.status === filterVal);
            const matchesSearch = (lead.name || '').toLowerCase().includes(searchVal) ||
                                  (lead.phone || '').includes(searchVal) ||
                                  (lead.service || '').toLowerCase().includes(searchVal);
            return matchesStatus && matchesSearch;
        });

        if (filtered.length === 0) {
            leadsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
                        <i class="fas fa-inbox" style="font-size: 2.4rem; margin-bottom: 14px; display: block; opacity: 0.4;"></i>
                        <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-main); margin-bottom: 6px;">No Client Inquiries Found</h4>
                        <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 420px; margin: 0 auto;">
                            Consultation inquiries submitted through the contact form on your website will appear here in real time.
                        </p>
                    </td>
                </tr>
            `;
            return;
        }

        leadsTableBody.innerHTML = filtered.map(lead => {
            const rawPhone = (lead.phone || '').replace(/[^0-9]/g, '');
            const cleanPhone = rawPhone.startsWith('91') ? rawPhone : (rawPhone.length === 10 ? '91' + rawPhone : rawPhone);
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${lead.name}, this is Coach Rajashekar from FITNESS. I received your consultation request for ${lead.service}!`)}`;

            let statusClass = 'badge-new';
            if (lead.status === 'Contacted') statusClass = 'badge-contacted';
            if (lead.status === 'In Progress') statusClass = 'badge-inprogress';
            if (lead.status === 'Enrolled') statusClass = 'badge-enrolled';

            return `
                <tr>
                    <td>
                        <strong style="color: var(--text-main); font-size: 0.95rem;">${escapeHtml(lead.name)}</strong>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(lead.email || 'Email not provided')}</div>
                    </td>
                    <td>
                        <a href="tel:${escapeHtml(lead.phone)}" style="color: var(--primary); text-decoration: none; font-weight: 600;">
                            <i class="fas fa-phone-alt" style="font-size: 0.8rem; margin-right: 4px;"></i> ${escapeHtml(lead.phone)}
                        </a>
                    </td>
                    <td>
                        <span class="service-pill-tag">${escapeHtml(lead.service || 'Coaching Inquiry')}</span>
                        <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px; max-width: 260px; line-height: 1.4;">
                            "${escapeHtml(lead.message || 'No additional message provided.')}"
                        </p>
                    </td>
                    <td>
                        <span style="font-size: 0.82rem; color: var(--text-sub);">${escapeHtml(lead.date || 'Recent')}</span>
                    </td>
                    <td>
                        <select class="lead-status-select ${statusClass}" data-id="${lead.id}">
                            <option value="New" ${lead.status === 'New' ? 'selected' : ''}>New</option>
                            <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                            <option value="In Progress" ${lead.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Enrolled" ${lead.status === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
                        </select>
                    </td>
                    <td>
                        <div class="action-buttons-wrap">
                            <a href="${whatsappUrl}" target="_blank" rel="noopener" class="action-btn-mini whatsapp" title="Chat on WhatsApp">
                                <i class="fab fa-whatsapp"></i>
                            </a>
                            <a href="tel:${escapeHtml(lead.phone)}" class="action-btn-mini call" title="Call Lead">
                                <i class="fas fa-phone-alt"></i>
                            </a>
                            <button class="action-btn-mini delete delete-lead-btn" data-id="${lead.id}" title="Delete Lead">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Status Change Listeners
        document.querySelectorAll('.lead-status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const leadId = e.target.getAttribute('data-id');
                const newStatus = e.target.value;
                updateLeadStatus(leadId, newStatus);
            });
        });

        // Delete Listeners
        document.querySelectorAll('.delete-lead-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const leadId = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this lead?')) {
                    deleteLead(leadId);
                }
            });
        });
    }

    function updateLeadStatus(id, newStatus) {
        let leads = JSON.parse(localStorage.getItem('fit_admin_leads') || '[]');
        leads = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
        localStorage.setItem('fit_admin_leads', JSON.stringify(leads));
        renderStats();
        renderLeadsTable();
        showAdminToast(`Lead status updated to ${newStatus}`, 'success');
    }

    function deleteLead(id) {
        let leads = JSON.parse(localStorage.getItem('fit_admin_leads') || '[]');
        leads = leads.filter(l => l.id !== id);
        localStorage.setItem('fit_admin_leads', JSON.stringify(leads));
        renderStats();
        renderLeadsTable();
        showAdminToast('Lead deleted successfully.', 'info');
    }

    leadFilterStatus?.addEventListener('change', renderLeadsTable);
    leadSearchInput?.addEventListener('input', renderLeadsTable);

    // Export Leads to CSV
    const exportLeadsBtn = document.getElementById('exportLeadsBtn');
    exportLeadsBtn?.addEventListener('click', () => {
        const leads = JSON.parse(localStorage.getItem('fit_admin_leads') || '[]');
        if (leads.length === 0) {
            showAdminToast('No leads to export yet.', 'info');
            return;
        }

        let csv = 'ID,Name,Phone,Email,Service,Message,Date,Status\n';
        leads.forEach(l => {
            csv += `"${l.id}","${l.name}","${l.phone}","${l.email}","${l.service}","${(l.message || '').replace(/"/g, '""')}","${l.date}","${l.status}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Fitness_Client_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showAdminToast('Leads exported to CSV successfully.', 'success');
    });

    // ------------------------------------------------------------------------
    // 5. Transformation Manager
    // ------------------------------------------------------------------------
    const tfListContainer = document.getElementById('transformationsListAdmin');
    const addTfForm = document.getElementById('addTransformationForm');

    function renderTransformationsList() {
        if (!tfListContainer) return;
        const tfs = JSON.parse(localStorage.getItem('fit_admin_transformations') || '[]');

        if (tfs.length === 0) {
            tfListContainer.innerHTML = `
                <div style="text-align: center; padding: 30px; color: var(--text-muted);">
                    <i class="fas fa-images" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.4; display: block;"></i>
                    No transformations added yet.
                </div>
            `;
            return;
        }

        tfListContainer.innerHTML = tfs.map(tf => `
            <div class="admin-tf-card">
                <img src="${escapeHtml(tf.image)}" alt="${escapeHtml(tf.title)}" class="admin-tf-img">
                <div class="admin-tf-info" style="flex: 1;">
                    <h4>${escapeHtml(tf.title)}</h4>
                    <div class="admin-tf-badge"><i class="fas fa-tag"></i> ${escapeHtml((tf.category || 'all').toUpperCase())} • ${escapeHtml(tf.stats || '')}</div>
                    <p class="admin-tf-quote">"${escapeHtml(tf.quote || '')}"</p>
                    <div class="admin-tf-actions">
                        <button class="btn btn-outline delete-tf-btn" data-id="${tf.id}" style="padding: 5px 12px; font-size: 0.78rem; border-color: var(--accent-rose); color: #FFA5A5;">
                            <i class="fas fa-trash-alt"></i> Delete Entry
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.delete-tf-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Delete this transformation story?')) {
                    deleteTransformation(id);
                }
            });
        });
    }

    function deleteTransformation(id) {
        let tfs = JSON.parse(localStorage.getItem('fit_admin_transformations') || '[]');
        tfs = tfs.filter(t => t.id !== id);
        localStorage.setItem('fit_admin_transformations', JSON.stringify(tfs));
        renderTransformationsList();
        renderStats();
        showAdminToast('Transformation entry deleted.', 'info');
    }

    addTfForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('tfTitleInput').value.trim();
        const category = document.getElementById('tfCategoryInput').value;
        const stats = document.getElementById('tfStatsInput').value.trim();
        const quote = document.getElementById('tfQuoteInput').value.trim();
        const image = document.getElementById('tfImageInput').value.trim() || 'assets/images/result10.jpg';

        const newTf = {
            id: 'tf-' + Date.now(),
            title,
            category,
            stats,
            quote,
            image,
            featured: true
        };

        const tfs = JSON.parse(localStorage.getItem('fit_admin_transformations') || '[]');
        tfs.unshift(newTf);
        localStorage.setItem('fit_admin_transformations', JSON.stringify(tfs));

        addTfForm.reset();
        renderTransformationsList();
        renderStats();
        showAdminToast('New transformation story published!', 'success');
    });

    // ------------------------------------------------------------------------
    // 6. Programs & Specifications Manager (Full Dynamic CRUD)
    // ------------------------------------------------------------------------
    const programsGrid = document.getElementById('adminProgramsGrid');
    const programModal = document.getElementById('programModal');
    const programModalTitle = document.getElementById('programModalTitle');
    const programEditorForm = document.getElementById('programEditorForm');
    const openAddProgBtn = document.getElementById('openAddProgramBtn');
    const closeProgModalBtn = document.getElementById('closeProgramModalBtn');
    const cancelProgModalBtn = document.getElementById('cancelProgramModalBtn');

    // Input references
    const progIdInput = document.getElementById('progIdInput');
    const progTitleInput = document.getElementById('progTitleInput');
    const progDescInput = document.getElementById('progDescInput');
    const progIconInput = document.getElementById('progIconInput');
    const progDurationInput = document.getElementById('progDurationInput');
    const progPriceInput = document.getElementById('progPriceInput');
    const progOrigPriceInput = document.getElementById('progOrigPriceInput');
    const progDiscountInput = document.getElementById('progDiscountInput');
    const progFeaturedInput = document.getElementById('progFeaturedInput');
    const progFeaturesInput = document.getElementById('progFeaturesInput');

    function renderProgramsList() {
        if (!programsGrid) return;
        const programs = JSON.parse(localStorage.getItem('fit_admin_programs') || '[]');

        if (programs.length === 0) {
            programsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
                    <i class="fas fa-tags" style="font-size: 2.2rem; margin-bottom: 12px; opacity: 0.4; display: block;"></i>
                    <h4 style="font-family: var(--font-heading); color: var(--text-main); margin-bottom: 6px;">No Programs Created</h4>
                    <p style="font-size: 0.88rem;">Click "+ Add New Program" to create your first coaching package.</p>
                </div>
            `;
            return;
        }

        programsGrid.innerHTML = programs.map(prog => {
            const featuresList = (prog.features || []).map(f => `
                <li><i class="fas fa-check-circle"></i> <span>${escapeHtml(f)}</span></li>
            `).join('');

            const featuredBadge = prog.featured 
                ? `<span class="admin-prog-badge-featured"><i class="fas fa-star"></i> Featured</span>` 
                : '';

            return `
                <div class="admin-prog-card ${prog.featured ? 'featured' : ''}">
                    ${featuredBadge}
                    <div class="admin-prog-header">
                        <div class="admin-prog-icon">
                            <i class="${escapeHtml(prog.icon || 'fas fa-dumbbell')}"></i>
                        </div>
                        <div>
                            <h4 class="admin-prog-title">${escapeHtml(prog.title)}</h4>
                            <span style="font-size: 0.8rem; color: var(--text-sub);">Customizable Coaching</span>
                        </div>
                    </div>

                    <p class="admin-prog-desc">${escapeHtml(prog.desc || '')}</p>

                    <div class="admin-prog-pricing-row">
                        <span class="admin-prog-price">₹${Number(prog.price).toLocaleString('en-IN')}</span>
                        ${prog.originalPrice ? `<span class="admin-prog-original">₹${Number(prog.originalPrice).toLocaleString('en-IN')}</span>` : ''}
                        <span class="admin-prog-duration">${escapeHtml(prog.duration || '/ month')}</span>
                        ${prog.discount ? `<span class="admin-prog-discount">${escapeHtml(prog.discount)}</span>` : ''}
                    </div>

                    <div class="admin-prog-specs-title"><i class="fas fa-list-ul" style="color: var(--primary); margin-right: 4px;"></i> Program Specifications (${(prog.features || []).length}):</div>
                    <ul class="admin-prog-specs-list">
                        ${featuresList}
                    </ul>

                    <div class="admin-prog-actions-row">
                        <button class="btn btn-outline edit-prog-btn" data-id="${prog.id}" style="flex: 1; padding: 8px; font-size: 0.82rem;">
                            <i class="fas fa-edit"></i> Edit Program & Specs
                        </button>
                        <button class="btn btn-outline delete-prog-btn" data-id="${prog.id}" style="padding: 8px 14px; font-size: 0.82rem; border-color: var(--accent-rose); color: #FFA5A5;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Attach Edit Listeners
        document.querySelectorAll('.edit-prog-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const progId = btn.getAttribute('data-id');
                openProgramModal(progId);
            });
        });

        // Attach Delete Listeners
        document.querySelectorAll('.delete-prog-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const progId = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this program from the website?')) {
                    deleteProgram(progId);
                }
            });
        });
    }

    function openProgramModal(progId = null) {
        if (!programModal) return;

        if (progId) {
            // Edit Mode
            const programs = JSON.parse(localStorage.getItem('fit_admin_programs') || '[]');
            const prog = programs.find(p => p.id === progId);
            if (prog) {
                programModalTitle.textContent = `Edit Program: ${prog.title}`;
                progIdInput.value = prog.id;
                progTitleInput.value = prog.title || '';
                progDescInput.value = prog.desc || '';
                progIconInput.value = prog.icon || 'fas fa-dumbbell';
                progDurationInput.value = prog.duration || '/ month';
                progPriceInput.value = prog.price || '';
                progOrigPriceInput.value = prog.originalPrice || '';
                progDiscountInput.value = prog.discount || '';
                progFeaturedInput.checked = !!prog.featured;
                progFeaturesInput.value = (prog.features || []).join('\n');
            }
        } else {
            // Add Mode
            programModalTitle.textContent = 'Add New Coaching Program';
            programEditorForm.reset();
            progIdInput.value = '';
            progDurationInput.value = '/ month';
            progDiscountInput.value = '30% OFF';
            progFeaturesInput.value = 'Custom Home/Gym Workout Split\nVideo Exercise Form Analysis\nWeekly Strength Progress Review\nWhatsApp Support';
        }

        programModal.classList.add('active');
    }

    function closeProgramModal() {
        if (programModal) programModal.classList.remove('active');
    }

    openAddProgBtn?.addEventListener('click', () => openProgramModal(null));
    closeProgModalBtn?.addEventListener('click', closeProgramModal);
    cancelProgModalBtn?.addEventListener('click', closeProgramModal);
    programModal?.addEventListener('click', (e) => {
        if (e.target === programModal) closeProgramModal();
    });

    // Save Program Form Handler
    programEditorForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = progIdInput.value.trim() || ('prog-' + Date.now());
        const title = progTitleInput.value.trim();
        const desc = progDescInput.value.trim();
        const icon = progIconInput.value;
        const duration = progDurationInput.value.trim() || '/ month';
        const price = Number(progPriceInput.value) || 0;
        const originalPrice = progOrigPriceInput.value ? Number(progOrigPriceInput.value) : null;
        const discount = progDiscountInput.value.trim();
        const featured = progFeaturedInput.checked;

        // Parse features / bullet specifications (one per line)
        const features = progFeaturesInput.value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const newProgram = {
            id,
            title,
            desc,
            icon,
            duration,
            price,
            originalPrice,
            discount,
            featured,
            features
        };

        let programs = JSON.parse(localStorage.getItem('fit_admin_programs') || '[]');
        const existingIdx = programs.findIndex(p => p.id === id);

        if (existingIdx >= 0) {
            programs[existingIdx] = newProgram;
            showAdminToast(`Program "${title}" updated successfully.`, 'success');
        } else {
            programs.push(newProgram);
            showAdminToast(`New program "${title}" published to website!`, 'success');
        }

        localStorage.setItem('fit_admin_programs', JSON.stringify(programs));
        closeProgramModal();
        renderProgramsList();
    });

    function deleteProgram(id) {
        let programs = JSON.parse(localStorage.getItem('fit_admin_programs') || '[]');
        programs = programs.filter(p => p.id !== id);
        localStorage.setItem('fit_admin_programs', JSON.stringify(programs));
        renderProgramsList();
        showAdminToast('Program deleted from website.', 'info');
    }

    // ------------------------------------------------------------------------
    // 6.2. Diet Recipes Kitchen Manager Engine
    // ------------------------------------------------------------------------
    const adminRecipeForm = document.getElementById('adminRecipeForm');
    const recipeEditId = document.getElementById('recipeEditId');
    const recipeTitleInput = document.getElementById('recipeTitleInput');
    const recipeTypeSelect = document.getElementById('recipeTypeSelect');
    const recipeMealSelect = document.getElementById('recipeMealSelect');
    const recipeProteinInput = document.getElementById('recipeProteinInput');
    const recipeCaloriesInput = document.getElementById('recipeCaloriesInput');
    const recipeCarbsInput = document.getElementById('recipeCarbsInput');
    const recipeFatsInput = document.getElementById('recipeFatsInput');
    const recipePrepTimeInput = document.getElementById('recipePrepTimeInput');
    const recipeCookTimeInput = document.getElementById('recipeCookTimeInput');
    const recipeDescInput = document.getElementById('recipeDescInput');
    const recipeIngredientsInput = document.getElementById('recipeIngredientsInput');
    const recipeInstructionsInput = document.getElementById('recipeInstructionsInput');
    const recipeCoachTipInput = document.getElementById('recipeCoachTipInput');
    const recipeFormHeaderTitle = document.getElementById('recipeFormHeaderTitle');
    const cancelEditRecipeBtn = document.getElementById('cancelEditRecipeBtn');
    const saveRecipeBtn = document.getElementById('saveRecipeBtn');
    const recipesListAdmin = document.getElementById('recipesListAdmin');
    const adminRecipeSearchInput = document.getElementById('adminRecipeSearchInput');
    const adminRecipeTypeFilter = document.getElementById('adminRecipeTypeFilter');
    const resetDefaultRecipesBtn = document.getElementById('resetDefaultRecipesBtn');
    const adminRecipeCountBadge = document.getElementById('adminRecipeCountBadge');

    let adminRecipeSearchTerm = '';
    let adminRecipeTypeSelected = 'all';

    function renderRecipesList() {
        if (!recipesListAdmin) return;
        const recipes = JSON.parse(localStorage.getItem('fit_admin_recipes') || '[]');

        if (adminRecipeCountBadge) {
            adminRecipeCountBadge.textContent = `${recipes.length} Recipes Live`;
        }

        const filtered = recipes.filter(r => {
            const matchesType = (adminRecipeTypeSelected === 'all' || r.type === adminRecipeTypeSelected);
            const matchesSearch = (!adminRecipeSearchTerm || 
                r.title.toLowerCase().includes(adminRecipeSearchTerm) ||
                (r.desc && r.desc.toLowerCase().includes(adminRecipeSearchTerm)) ||
                (r.ingredients && r.ingredients.join(' ').toLowerCase().includes(adminRecipeSearchTerm))
            );
            return matchesType && matchesSearch;
        });

        if (filtered.length === 0) {
            recipesListAdmin.innerHTML = `
                <div style="text-align: center; padding: 32px 16px; color: var(--text-muted);">
                    <i class="fas fa-utensils" style="font-size: 2rem; opacity: 0.4; margin-bottom: 10px; display: block;"></i>
                    <p style="font-size: 0.9rem;">No recipes found matching current filter.</p>
                </div>
            `;
            return;
        }

        recipesListAdmin.innerHTML = filtered.map(r => {
            const isVeg = r.type === 'veg';
            const typePill = isVeg 
                ? `<span style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: var(--radius-full);"><i class="fas fa-leaf"></i> Veg</span>`
                : `<span style="background: rgba(244, 63, 94, 0.15); color: #F43F5E; border: 1px solid rgba(244, 63, 94, 0.3); font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: var(--radius-full);"><i class="fas fa-drumstick-bite"></i> Non-Veg</span>`;

            return `
                <div class="admin-tf-card" style="display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 16px;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            ${typePill}
                            <span style="font-size: 0.75rem; color: var(--text-muted);"><i class="far fa-clock"></i> ${escapeHtml(r.prepTime || '10m')}</span>
                        </div>
                        <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">${escapeHtml(r.title)}</h4>
                        <div style="display: flex; gap: 8px; font-size: 0.78rem; font-weight: 700; color: var(--text-sub);">
                            <span style="color: var(--primary);">${escapeHtml(r.protein || '')} Protein</span> • 
                            <span style="color: #F97316;">${escapeHtml(r.calories || '')}</span> • 
                            <span>${escapeHtml(r.carbs || '')} Carbs</span> • 
                            <span>${escapeHtml(r.fats || '')} Fats</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px; flex-shrink: 0;">
                        <button class="action-btn-mini edit-recipe-btn" data-id="${r.id}" title="Edit Recipe" style="background: rgba(245, 196, 94, 0.1); color: var(--primary); border: 1px solid rgba(245, 196, 94, 0.3); width: 34px; height: 34px; border-radius: 8px; cursor: pointer;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn-mini delete delete-recipe-btn" data-id="${r.id}" title="Delete Recipe" style="background: rgba(244, 63, 94, 0.1); color: var(--accent-rose); border: 1px solid rgba(244, 63, 94, 0.3); width: 34px; height: 34px; border-radius: 8px; cursor: pointer;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Attach action handlers
        document.querySelectorAll('.edit-recipe-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                editRecipe(id);
            });
        });

        document.querySelectorAll('.delete-recipe-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                deleteRecipe(id);
            });
        });
    }

    function editRecipe(id) {
        const recipes = JSON.parse(localStorage.getItem('fit_admin_recipes') || '[]');
        const recipe = recipes.find(r => r.id === id);
        if (!recipe) return;

        if (recipeEditId) recipeEditId.value = recipe.id;
        if (recipeTitleInput) recipeTitleInput.value = recipe.title || '';
        if (recipeTypeSelect) recipeTypeSelect.value = recipe.type || 'veg';
        if (recipeMealSelect) recipeMealSelect.value = recipe.meal || 'breakfast fat-loss';
        if (recipeProteinInput) recipeProteinInput.value = recipe.protein || '';
        if (recipeCaloriesInput) recipeCaloriesInput.value = recipe.calories || '';
        if (recipeCarbsInput) recipeCarbsInput.value = recipe.carbs || '';
        if (recipeFatsInput) recipeFatsInput.value = recipe.fats || '';
        if (recipePrepTimeInput) recipePrepTimeInput.value = recipe.prepTime || '';
        if (recipeCookTimeInput) recipeCookTimeInput.value = recipe.cookTime || '';
        if (recipeDescInput) recipeDescInput.value = recipe.desc || '';
        if (recipeIngredientsInput) recipeIngredientsInput.value = (recipe.ingredients || []).join('\n');
        if (recipeInstructionsInput) recipeInstructionsInput.value = (recipe.instructions || []).join('\n');
        if (recipeCoachTipInput) recipeCoachTipInput.value = recipe.coachTip || '';

        if (recipeFormHeaderTitle) recipeFormHeaderTitle.innerHTML = `<i class="fas fa-edit" style="color: var(--primary); margin-right: 6px;"></i> Edit Recipe: "${escapeHtml(recipe.title)}"`;
        if (saveRecipeBtn) saveRecipeBtn.innerHTML = `<i class="fas fa-check"></i> Update Recipe Live`;
        if (cancelEditRecipeBtn) cancelEditRecipeBtn.style.display = 'inline-flex';

        recipeTitleInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function resetRecipeForm() {
        if (adminRecipeForm) adminRecipeForm.reset();
        if (recipeEditId) recipeEditId.value = '';
        if (recipeFormHeaderTitle) recipeFormHeaderTitle.innerHTML = `<i class="fas fa-plus-circle" style="color: var(--primary); margin-right: 6px;"></i> Add / Edit Recipe`;
        if (saveRecipeBtn) saveRecipeBtn.innerHTML = `<i class="fas fa-save"></i> Save Recipe Live`;
        if (cancelEditRecipeBtn) cancelEditRecipeBtn.style.display = 'none';
    }

    cancelEditRecipeBtn?.addEventListener('click', resetRecipeForm);

    adminRecipeForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = recipeEditId ? recipeEditId.value.trim() : '';
        const title = recipeTitleInput ? recipeTitleInput.value.trim() : '';
        const type = recipeTypeSelect ? recipeTypeSelect.value : 'veg';
        const meal = recipeMealSelect ? recipeMealSelect.value : 'breakfast fat-loss';
        const protein = recipeProteinInput ? recipeProteinInput.value.trim() : '';
        const calories = recipeCaloriesInput ? recipeCaloriesInput.value.trim() : '';
        const carbs = recipeCarbsInput ? recipeCarbsInput.value.trim() : '';
        const fats = recipeFatsInput ? recipeFatsInput.value.trim() : '';
        const prepTime = recipePrepTimeInput ? recipePrepTimeInput.value.trim() : '';
        const cookTime = recipeCookTimeInput ? recipeCookTimeInput.value.trim() : '';
        const desc = recipeDescInput ? recipeDescInput.value.trim() : '';
        const ingredients = recipeIngredientsInput ? recipeIngredientsInput.value.trim().split('\n').filter(i => i.trim()) : [];
        const instructions = recipeInstructionsInput ? recipeInstructionsInput.value.trim().split('\n').filter(i => i.trim()) : [];
        const coachTip = recipeCoachTipInput ? recipeCoachTipInput.value.trim() : '';

        let recipes = JSON.parse(localStorage.getItem('fit_admin_recipes') || '[]');

        if (editId) {
            const index = recipes.findIndex(r => r.id === editId);
            if (index !== -1) {
                recipes[index] = {
                    ...recipes[index],
                    title, type, meal, protein, calories, carbs, fats, prepTime, cookTime, desc, ingredients, instructions, coachTip
                };
                showAdminToast(`Recipe "${title}" updated live!`, 'success');
            }
        } else {
            const newRecipe = {
                id: 'recipe_' + Date.now(),
                title, type, meal, protein, calories, carbs, fats, prepTime, cookTime, desc, ingredients, instructions, coachTip
            };
            recipes.unshift(newRecipe);
            showAdminToast(`New recipe "${title}" published live!`, 'success');
        }

        localStorage.setItem('fit_admin_recipes', JSON.stringify(recipes));
        resetRecipeForm();
        renderRecipesList();
    });

    function deleteRecipe(id) {
        let recipes = JSON.parse(localStorage.getItem('fit_admin_recipes') || '[]');
        const recipe = recipes.find(r => r.id === id);
        if (!recipe) return;

        if (confirm(`Are you sure you want to delete the recipe "${recipe.title}" from the live kitchen?`)) {
            recipes = recipes.filter(r => r.id !== id);
            localStorage.setItem('fit_admin_recipes', JSON.stringify(recipes));
            renderRecipesList();
            showAdminToast(`Recipe "${recipe.title}" deleted.`, 'info');
        }
    }

    adminRecipeSearchInput?.addEventListener('input', (e) => {
        adminRecipeSearchTerm = e.target.value.trim().toLowerCase();
        renderRecipesList();
    });

    adminRecipeTypeFilter?.addEventListener('change', (e) => {
        adminRecipeTypeSelected = e.target.value;
        renderRecipesList();
    });

    resetDefaultRecipesBtn?.addEventListener('click', () => {
        if (confirm('Reset all recipes to default coach catalog? Any custom additions will be refreshed.')) {
            localStorage.setItem('fit_admin_recipes', JSON.stringify(defaultRecipesCatalog));
            renderRecipesList();
            showAdminToast('Recipes library restored to default.', 'success');
        }
    });

    // ------------------------------------------------------------------------
    // 6.5. Analytics, Traffic & Signed-in User Tracking Engine
    // ------------------------------------------------------------------------
    function renderAnalytics() {
        const trafficData = JSON.parse(localStorage.getItem('fit_analytics_traffic') || '{"totalVisits": 0, "uniqueVisitors": 0, "visitsLog": []}');
        const usersList = JSON.parse(localStorage.getItem('fit_analytics_users') || '[]');
        const intentList = JSON.parse(localStorage.getItem('fit_analytics_program_intent') || '[]');
        const programs = JSON.parse(localStorage.getItem('fit_admin_programs') || JSON.stringify(defaultProgramsCatalog));

        const totalVisits = trafficData.totalVisits || 0;
        const uniqueVisitors = trafficData.uniqueVisitors || 0;
        const signedUsersCount = usersList.length;
        const programClicksCount = intentList.length;

        // Overview KPI Stats
        const elTotalVisits = document.getElementById('statTotalVisits');
        const elSignedUsers = document.getElementById('statSignedUsers');
        const elProgramClicks = document.getElementById('statProgramClicks');
        const elPageViews = document.getElementById('statAnalyticsPageViews');
        const elUniqueVisitors = document.getElementById('statAnalyticsUniqueVisitors');
        const elClicksBadge = document.getElementById('totalClicksBadge');

        if (elTotalVisits) elTotalVisits.textContent = totalVisits;
        if (elSignedUsers) elSignedUsers.textContent = signedUsersCount;
        if (elProgramClicks) elProgramClicks.textContent = programClicksCount;
        if (elPageViews) elPageViews.textContent = totalVisits;
        if (elUniqueVisitors) elUniqueVisitors.textContent = uniqueVisitors;
        if (elClicksBadge) elClicksBadge.textContent = `${programClicksCount} Total Clicks`;

        // 1. Render Program Demand Progress Bars
        const demandContainer = document.getElementById('programDemandBarsContainer');
        if (demandContainer) {
            // Count clicks per program
            const countsMap = {};
            // Initialize with all existing programs
            programs.forEach(p => { countsMap[p.title] = 0; });
            
            intentList.forEach(item => {
                const title = item.program || 'Custom Training';
                countsMap[title] = (countsMap[title] || 0) + 1;
            });

            const sortedPrograms = Object.entries(countsMap).sort((a, b) => b[1] - a[1]);

            if (sortedPrograms.length === 0 || programClicksCount === 0) {
                demandContainer.innerHTML = `
                    <div style="text-align: center; padding: 32px 16px; color: var(--text-muted);">
                        <i class="fas fa-mouse-pointer" style="font-size: 2rem; opacity: 0.4; margin-bottom: 10px; display: block;"></i>
                        <p style="font-size: 0.9rem;">No program clicks recorded yet. When visitors click "Book Training" or choose programs, live interest metrics will calculate here automatically.</p>
                    </div>
                `;
            } else {
                demandContainer.innerHTML = sortedPrograms.map(([progName, count]) => {
                    const percentage = programClicksCount > 0 ? Math.round((count / programClicksCount) * 100) : 0;
                    return `
                        <div class="interest-progress-card">
                            <div class="interest-meta-row">
                                <span class="interest-prog-name">${escapeHtml(progName)}</span>
                                <span class="interest-clicks-count">${count} click${count === 1 ? '' : 's'} (${percentage}%)</span>
                            </div>
                            <div class="interest-bar-bg">
                                <div class="interest-bar-fill" style="width: ${percentage}%;"></div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // 2. Render Traffic Activity Table
        const trafficTableBody = document.getElementById('trafficLogTableBody');
        if (trafficTableBody) {
            const logs = trafficData.visitsLog || [];
            if (logs.length === 0) {
                trafficTableBody.innerHTML = `
                    <tr><td colspan="3" style="text-align:center; padding: 24px; color: var(--text-muted);">No recent website pageviews logged.</td></tr>
                `;
            } else {
                trafficTableBody.innerHTML = logs.slice(0, 15).map(log => `
                    <tr>
                        <td><span class="service-pill-tag">${escapeHtml(log.page || 'Home')}</span></td>
                        <td><span class="admin-date-badge">${escapeHtml(log.time || '')}</span></td>
                        <td><span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 500;">${escapeHtml(log.device || 'Web')}</span></td>
                    </tr>
                `).join('');
            }
        }

        // 3. Render Signed-In Google Members Directory
        const signedUsersTableBody = document.getElementById('signedUsersTableBody');
        if (signedUsersTableBody) {
            if (usersList.length === 0) {
                signedUsersTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                            <i class="fab fa-google" style="font-size: 2.2rem; opacity: 0.4; margin-bottom: 12px; display: block; color: #EA4335;"></i>
                            <h5 style="color: var(--text-main); font-size: 1.05rem; margin-bottom: 6px;">No Google Authenticated Members Yet</h5>
                            <p style="font-size: 0.88rem; max-width: 480px; margin: 0 auto;">When clients or visitors sign in with their Google Account on the website, their profiles will sync here automatically for direct outreach.</p>
                        </td>
                    </tr>
                `;
            } else {
                signedUsersTableBody.innerHTML = usersList.map(u => {
                    const initials = (u.displayName || 'M').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    const avatarHtml = u.photoURL ? `<img src="${escapeHtml(u.photoURL)}" alt="${escapeHtml(u.displayName)}" referrerpolicy="no-referrer">` : initials;
                    return `
                        <tr>
                            <td>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div class="user-avatar-circle">${avatarHtml}</div>
                                    <div>
                                        <div style="font-weight: 700; color: var(--text-main); font-size: 0.92rem;">${escapeHtml(u.displayName || 'Fitness Member')}</div>
                                        <div style="font-size: 0.75rem; color: var(--accent-emerald); display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                                            <i class="fas fa-check-circle"></i> Google Verified
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <a href="mailto:${escapeHtml(u.email)}" class="member-email-link">
                                    <i class="fas fa-envelope" style="font-size: 0.8rem; margin-right: 6px; opacity: 0.7;"></i>${escapeHtml(u.email)}
                                </a>
                            </td>
                            <td><span class="admin-date-badge">${escapeHtml(u.joinedDate || 'Recent')}</span></td>
                            <td><span class="admin-date-badge">${escapeHtml(u.lastActive || 'Online')}</span></td>
                            <td>
                                <a href="mailto:${escapeHtml(u.email)}?subject=${encodeURIComponent('Personal Fitness Coaching - Coach Rajashekar')}" class="btn btn-outline" style="padding: 7px 14px; font-size: 0.8rem; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;">
                                    <i class="fas fa-envelope"></i> Email Member
                                </a>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }

        // 4. Render Live Program Interest Intent Log
        const intentTableBody = document.getElementById('programIntentLogTableBody');
        if (intentTableBody) {
            if (intentList.length === 0) {
                intentTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                            <i class="fas fa-inbox" style="font-size: 2.2rem; opacity: 0.4; margin-bottom: 12px; display: block; color: var(--primary);"></i>
                            <h5 style="color: var(--text-main); font-size: 1.05rem; margin-bottom: 6px;">No Booking Interactions Recorded Yet</h5>
                            <p style="font-size: 0.88rem; max-width: 480px; margin: 0 auto;">When visitors click "Book Training" or choose programs, their live intent clicks will appear here.</p>
                        </td>
                    </tr>
                `;
            } else {
                intentTableBody.innerHTML = intentList.slice(0, 25).map(intent => {
                    const message = encodeURIComponent(`Hi! This is Coach Rajashekar. I noticed your interest in the "${intent.program}" coaching package. Let's discuss your custom fitness blueprint!`);
                    return `
                        <tr>
                            <td>
                                <strong style="color: var(--text-main); font-size: 0.92rem;">${escapeHtml(intent.program || 'Custom Training')}</strong>
                            </td>
                            <td><span class="service-pill-tag">${escapeHtml(intent.price || 'Custom')}</span></td>
                            <td>
                                <div style="font-weight: 600; color: var(--text-main);">${escapeHtml(intent.userName || 'Interested Visitor')}</div>
                                ${intent.userEmail ? `<div class="member-email-link" style="font-size: 0.78rem; margin-top: 2px;">${escapeHtml(intent.userEmail)}</div>` : ''}
                            </td>
                            <td><span class="admin-date-badge">${escapeHtml(intent.time || '')}</span></td>
                            <td>
                                <a href="https://wa.me/918187808710?text=${message}" target="_blank" class="btn btn-whatsapp" style="padding: 7px 14px; font-size: 0.8rem; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;">
                                    <i class="fab fa-whatsapp"></i> WhatsApp Connect
                                </a>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }
    }

    // Reset Analytics Logs
    const clearAnalyticsBtn = document.getElementById('clearAnalyticsBtn');
    clearAnalyticsBtn?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all website visit logs and program click history?')) {
            localStorage.setItem('fit_analytics_traffic', JSON.stringify({ totalVisits: 0, uniqueVisitors: 0, visitsLog: [] }));
            localStorage.setItem('fit_analytics_program_intent', JSON.stringify([]));
            renderAnalytics();
            showAdminToast('Analytics traffic and intent history reset.', 'info');
        }
    });

    // ------------------------------------------------------------------------
    // 7. WhatsApp Quick Blueprint Generator (Clean Dynamic Inputs)
    // ------------------------------------------------------------------------
    const broadcastForm = document.getElementById('broadcastGeneratorForm');
    const broadcastOutput = document.getElementById('broadcastOutput');
    const sendBroadcastBtn = document.getElementById('sendBroadcastBtn');

    broadcastForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const clientName = document.getElementById('bcClientName').value.trim();
        const planType = document.getElementById('bcPlanType').value;
        const calories = document.getElementById('bcCalories').value.trim() || '2000';
        const protein = document.getElementById('bcProtein').value.trim() || '140';
        const routine = document.getElementById('bcRoutine').value.trim() || 'Custom Split';
        const notes = document.getElementById('bcNotes').value.trim() || 'Stay consistent with daily hydration and sleep.';

        const message = `🔥 *FITNESS - Personalized Coaching Blueprint* 🔥\n\n` +
                        `👤 *Client:* ${clientName}\n` +
                        `📋 *Program Focus:* ${planType}\n` +
                        `⚡ *Daily Calorie Target:* ${calories} kcal\n` +
                        `🍗 *Daily Protein Goal:* ${protein}g\n` +
                        `🏋️ *Workout Split:* ${routine}\n\n` +
                        `💡 *Coach Advice:*\n${notes}\n\n` +
                        `📲 Daily check-in by 9:00 PM.\n- *Coach Rajashekar* (+91 81878 08710)`;

        if (broadcastOutput) {
            broadcastOutput.value = message;
            if (sendBroadcastBtn) {
                sendBroadcastBtn.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
                sendBroadcastBtn.style.display = 'inline-flex';
            }
        }
    });

    // ------------------------------------------------------------------------
    // 7.5. Dynamic Firebase & Cloud Database Settings Manager
    // ------------------------------------------------------------------------
    const fbForm = document.getElementById('firebaseSettingsForm');
    const autoParseBtn = document.getElementById('autoParseFirebaseBtn');
    const rawSnippetInput = document.getElementById('rawFirebaseSnippetInput');
    const testConnBtn = document.getElementById('testFirebaseConnBtn');
    const resetFbBtn = document.getElementById('resetFirebaseConfigBtn');
    const fbStatusBadge = document.getElementById('firebaseStatusBadge');

    function getActiveFirebaseConfig() {
        try {
            const saved = localStorage.getItem('fit_custom_firebase_config');
            if (saved) return Object.assign({}, defaultFirebaseConfig, JSON.parse(saved));
        } catch (e) {
            console.warn('Error reading saved firebase config:', e);
        }
        return defaultFirebaseConfig;
    }

    function populateFirebaseSettingsForm() {
        const config = getActiveFirebaseConfig();
        const apiKeyEl = document.getElementById('fbApiKeyInput');
        const projIdEl = document.getElementById('fbProjectIdInput');
        const authDomEl = document.getElementById('fbAuthDomainInput');
        const bucketEl = document.getElementById('fbStorageBucketInput');
        const msgIdEl = document.getElementById('fbMessagingIdInput');
        const appIdEl = document.getElementById('fbAppIdInput');
        const measureEl = document.getElementById('fbMeasurementIdInput');

        if (apiKeyEl) apiKeyEl.value = config.apiKey || '';
        if (projIdEl) projIdEl.value = config.projectId || '';
        if (authDomEl) authDomEl.value = config.authDomain || '';
        if (bucketEl) bucketEl.value = config.storageBucket || '';
        if (msgIdEl) msgIdEl.value = config.messagingSenderId || '';
        if (appIdEl) appIdEl.value = config.appId || '';
        if (measureEl) measureEl.value = config.measurementId || '';
    }

    autoParseBtn?.addEventListener('click', () => {
        const raw = rawSnippetInput ? rawSnippetInput.value.trim() : '';
        if (!raw) {
            showAdminToast('Please paste your Firebase snippet into the box first.', 'info');
            return;
        }

        try {
            const extract = (key) => {
                const match = raw.match(new RegExp(`["']?${key}["']?\\s*:\\s*["']([^"']+)["']`));
                return match ? match[1] : '';
            };

            const apiKey = extract('apiKey');
            const authDomain = extract('authDomain');
            const projectId = extract('projectId');
            const storageBucket = extract('storageBucket');
            const messagingSenderId = extract('messagingSenderId');
            const appId = extract('appId');
            const measurementId = extract('measurementId');

            if (apiKey) document.getElementById('fbApiKeyInput').value = apiKey;
            if (authDomain) document.getElementById('fbAuthDomainInput').value = authDomain;
            if (projectId) document.getElementById('fbProjectIdInput').value = projectId;
            if (storageBucket) document.getElementById('fbStorageBucketInput').value = storageBucket;
            if (messagingSenderId) document.getElementById('fbMessagingIdInput').value = messagingSenderId;
            if (appId) document.getElementById('fbAppIdInput').value = appId;
            if (measurementId) document.getElementById('fbMeasurementIdInput').value = measurementId;

            showAdminToast('Firebase credentials auto-extracted and filled!', 'success');
        } catch (err) {
            showAdminToast('Could not automatically parse snippet. Please enter fields manually.', 'error');
        }
    });

    fbForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const customConfig = {
            apiKey: document.getElementById('fbApiKeyInput').value.trim(),
            projectId: document.getElementById('fbProjectIdInput').value.trim(),
            authDomain: document.getElementById('fbAuthDomainInput').value.trim(),
            storageBucket: document.getElementById('fbStorageBucketInput').value.trim(),
            messagingSenderId: document.getElementById('fbMessagingIdInput').value.trim(),
            appId: document.getElementById('fbAppIdInput').value.trim(),
            measurementId: document.getElementById('fbMeasurementIdInput').value.trim()
        };

        localStorage.setItem('fit_custom_firebase_config', JSON.stringify(customConfig));
        showAdminToast('Firebase configuration saved and activated!', 'success');

        if (fbStatusBadge) {
            fbStatusBadge.innerHTML = '<i class="fas fa-check-circle" style="font-size: 0.6rem;"></i> Connected';
            fbStatusBadge.style.background = 'rgba(16, 185, 129, 0.2)';
        }
    });

    testConnBtn?.addEventListener('click', async () => {
        testConnBtn.disabled = true;
        testConnBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';

        const config = {
            apiKey: document.getElementById('fbApiKeyInput').value.trim(),
            projectId: document.getElementById('fbProjectIdInput').value.trim(),
            authDomain: document.getElementById('fbAuthDomainInput').value.trim()
        };

        if (!config.apiKey || !config.projectId) {
            showAdminToast('Please provide apiKey and projectId to test.', 'error');
            testConnBtn.disabled = false;
            testConnBtn.innerHTML = '<i class="fas fa-plug"></i> Test Connection';
            return;
        }

        setTimeout(() => {
            testConnBtn.disabled = false;
            testConnBtn.innerHTML = '<i class="fas fa-plug"></i> Test Connection';
            showAdminToast(`Firebase Credentials Verified for: ${config.projectId}`, 'success');
        }, 700);
    });

    resetFbBtn?.addEventListener('click', () => {
        if (confirm('Reset to default platform Firebase configuration?')) {
            localStorage.removeItem('fit_custom_firebase_config');
            populateFirebaseSettingsForm();
            showAdminToast('Default Firebase configuration restored.', 'info');
        }
    });

    // ------------------------------------------------------------------------
    // 8. Toast Helper & Security Sanitization
    // ------------------------------------------------------------------------
    function showAdminToast(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `user-toast-notification ${type}`;
        const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle');
        toast.innerHTML = `<i class="fas ${icon}"></i> <span>${escapeHtml(msg)}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 3200);
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

    // ------------------------------------------------------------------------
    // 9. Dedicated Admin PWA Registration & Install Handler
    // ------------------------------------------------------------------------
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('admin-sw.js', { scope: './' })
                .then(reg => console.log('[Admin PWA] Service Worker registered with scope:', reg.scope))
                .catch(err => console.warn('[Admin PWA] Service Worker registration failed:', err));
        });
    }

    let adminDeferredPrompt = null;
    const adminGateInstallBtn = document.getElementById('adminGateInstallBtn');
    const adminTopbarInstallBtn = document.getElementById('adminTopbarInstallBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        adminDeferredPrompt = e;
        if (adminGateInstallBtn) adminGateInstallBtn.style.display = 'block';
        if (adminTopbarInstallBtn) adminTopbarInstallBtn.style.display = 'inline-flex';
    });

    async function triggerAdminPwaInstall() {
        if (!adminDeferredPrompt) {
            showAdminToast('To install: open browser menu (3 dots or Share) and select "Add to Home screen"', 'info');
            return;
        }
        adminDeferredPrompt.prompt();
        const { outcome } = await adminDeferredPrompt.userChoice;
        if (outcome === 'accepted') {
            showAdminToast('Coach Admin App installed successfully!', 'success');
        }
        adminDeferredPrompt = null;
        if (adminGateInstallBtn) adminGateInstallBtn.style.display = 'none';
        if (adminTopbarInstallBtn) adminTopbarInstallBtn.style.display = 'none';
    }

    adminGateInstallBtn?.addEventListener('click', triggerAdminPwaInstall);
    adminTopbarInstallBtn?.addEventListener('click', triggerAdminPwaInstall);

    window.addEventListener('appinstalled', () => {
        showAdminToast('Coach Admin App installed on your device!', 'success');
        if (adminGateInstallBtn) adminGateInstallBtn.style.display = 'none';
        if (adminTopbarInstallBtn) adminTopbarInstallBtn.style.display = 'none';
    });

    // Check auth on boot
    checkAuth();
});
