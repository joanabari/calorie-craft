/* ============================================================
   CalorieCraft — main.js
   Handles: navigation, plan generation, macros, grocery list,
   filtering, theme toggle, localStorage, form validation.
   ============================================================ */

// ---------- MEAL DATABASE ----------
// Curated meals with macros (per serving). cal ≈ p*4 + c*4 + f*9.
const MEALS = [
  // Breakfasts
  { id:"b1", name:"Greek Yogurt Berry Bowl", category:"breakfast", calories:320, protein:22, carbs:38, fat:8,
    ingredients:["Greek yogurt 200g","Mixed berries 100g","Granola 30g","Honey 1 tsp"] },
  { id:"b2", name:"Avocado Toast & Egg", category:"breakfast", calories:410, protein:18, carbs:36, fat:22,
    ingredients:["Whole grain bread 2 slices","Avocado 1/2","Egg 1","Olive oil 1 tsp","Lemon juice"] },
  { id:"b3", name:"Oatmeal with Banana & Almonds", category:"breakfast", calories:380, protein:12, carbs:60, fat:10,
    ingredients:["Rolled oats 60g","Banana 1","Almond milk 250ml","Almonds 15g","Cinnamon"] },
  { id:"b4", name:"Spinach Mushroom Omelette", category:"breakfast", calories:290, protein:22, carbs:6, fat:20,
    ingredients:["Eggs 3","Spinach 50g","Mushrooms 60g","Feta 20g","Olive oil 1 tsp"] },
  { id:"b5", name:"Protein Smoothie", category:"breakfast", calories:340, protein:30, carbs:38, fat:6,
    ingredients:["Whey protein 30g","Banana 1","Oats 30g","Milk 250ml","Peanut butter 1 tsp"] },
  { id:"b6", name:"Cottage Cheese & Fruit", category:"breakfast", calories:270, protein:26, carbs:24, fat:6,
    ingredients:["Cottage cheese 200g","Pineapple 100g","Walnuts 10g"] },

  // Lunches
  { id:"l1", name:"Grilled Chicken Quinoa Bowl", category:"lunch", calories:520, protein:42, carbs:52, fat:14,
    ingredients:["Chicken breast 150g","Quinoa 80g dry","Cherry tomatoes 100g","Cucumber 1/2","Olive oil 1 tbsp","Lemon"] },
  { id:"l2", name:"Tuna Mediterranean Salad", category:"lunch", calories:430, protein:35, carbs:22, fat:22,
    ingredients:["Canned tuna 150g","Mixed greens 100g","Olives 30g","Feta 30g","Olive oil 1 tbsp","Red onion"] },
  { id:"l3", name:"Turkey Avocado Wrap", category:"lunch", calories:480, protein:32, carbs:42, fat:18,
    ingredients:["Whole wheat tortilla 1","Turkey breast 120g","Avocado 1/2","Lettuce","Tomato","Mustard"] },
  { id:"l4", name:"Lentil & Vegetable Soup", category:"lunch", calories:360, protein:20, carbs:52, fat:6,
    ingredients:["Red lentils 100g","Carrot 1","Onion 1","Celery 2 stalks","Vegetable broth 500ml","Cumin"] },
  { id:"l5", name:"Chicken Caesar (Light)", category:"lunch", calories:460, protein:38, carbs:18, fat:24,
    ingredients:["Chicken breast 130g","Romaine 150g","Parmesan 20g","Greek yogurt dressing 3 tbsp","Croutons 20g"] },
  { id:"l6", name:"Salmon Poke Bowl", category:"lunch", calories:540, protein:36, carbs:56, fat:18,
    ingredients:["Salmon 130g","Brown rice 80g dry","Edamame 60g","Cucumber","Avocado 1/4","Soy sauce","Sesame"] },
  { id:"l7", name:"Chickpea Buddha Bowl", category:"lunch", calories:500, protein:22, carbs:64, fat:18,
    ingredients:["Chickpeas 200g","Sweet potato 150g","Kale 80g","Tahini 1 tbsp","Quinoa 60g dry","Lemon"] },

  // Dinners
  { id:"d1", name:"Baked Salmon & Asparagus", category:"dinner", calories:560, protein:42, carbs:28, fat:28,
    ingredients:["Salmon 180g","Asparagus 200g","Sweet potato 200g","Olive oil 1 tbsp","Garlic 2 cloves","Lemon"] },
  { id:"d2", name:"Lean Beef Stir Fry", category:"dinner", calories:600, protein:44, carbs:58, fat:20,
    ingredients:["Lean beef 150g","Bell peppers 200g","Broccoli 150g","Brown rice 80g dry","Soy sauce","Ginger","Sesame oil 1 tsp"] },
  { id:"d3", name:"Chicken Pesto Pasta", category:"dinner", calories:640, protein:40, carbs:70, fat:20,
    ingredients:["Chicken breast 150g","Whole wheat pasta 90g dry","Pesto 2 tbsp","Cherry tomatoes 100g","Spinach 50g","Parmesan 15g"] },
  { id:"d4", name:"Veggie Chili & Rice", category:"dinner", calories:520, protein:24, carbs:86, fat:8,
    ingredients:["Black beans 200g","Kidney beans 150g","Tomato sauce 200g","Onion 1","Bell pepper 1","Brown rice 70g dry","Chili spices"] },
  { id:"d5", name:"Shrimp & Garlic Zoodles", category:"dinner", calories:380, protein:34, carbs:18, fat:18,
    ingredients:["Shrimp 180g","Zucchini 2","Garlic 3 cloves","Olive oil 1 tbsp","Cherry tomatoes 100g","Parsley"] },
  { id:"d6", name:"Turkey Meatballs & Couscous", category:"dinner", calories:580, protein:40, carbs:60, fat:18,
    ingredients:["Ground turkey 150g","Couscous 70g dry","Tomato sauce 150g","Onion 1/2","Egg 1","Herbs"] },
  { id:"d7", name:"Tofu Veggie Curry", category:"dinner", calories:540, protein:26, carbs:62, fat:20,
    ingredients:["Firm tofu 200g","Coconut milk 150ml","Curry paste 2 tbsp","Mixed vegetables 250g","Basmati rice 70g dry"] },
];

const BREAKFASTS = MEALS.filter(m => m.category === "breakfast");
const LUNCHES    = MEALS.filter(m => m.category === "lunch");
const DINNERS    = MEALS.filter(m => m.category === "dinner");
const DAY_NAMES  = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// ---------- STORAGE KEYS ----------
const STORAGE = {
  PLAN:    "caloriecraft.plan",
  CHECKS:  "caloriecraft.grocery.checks",
  THEME:   "caloriecraft.theme",
};

// ---------- UTILITIES ----------
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// ---------- PLAN GENERATION ----------
/** Generate one day close to the calorie target. */
function generateDay(target, dayName) {
  let best = null, bestDiff = Infinity;
  for (let i = 0; i < 80; i++) {
    const b = pick(BREAKFASTS), l = pick(LUNCHES), d = pick(DINNERS);
    const total = b.calories + l.calories + d.calories;
    const diff = Math.abs(total - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = { dayName, breakfast: b, lunch: l, dinner: d, calories: total };
    }
  }
  return best;
}