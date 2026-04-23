/* =========================================================
   CalorieCraft — vanilla JS
   - Page routing via hash
   - Theme toggle (localStorage)
   - Form validation
   - Meal plan generation + filtering
   - Saved plans (localStorage)
   ========================================================= */

// ---------- Meal database ----------
const MEALS = [
  // breakfast
  { id:"b1", name:"Greek Yogurt Berry Bowl", category:"breakfast", calories:320, protein:22, carbs:38, fats:8,  tags:["balanced","high-protein","vegetarian"], ingredients:["Greek yogurt","Mixed berries","Honey","Granola"], emoji:"🍓" },
  { id:"b2", name:"Avocado Toast & Egg",    category:"breakfast", calories:410, protein:18, carbs:32, fats:22, tags:["balanced","vegetarian"],                ingredients:["Sourdough","Avocado","Egg","Chili flakes"],   emoji:"🥑" },
  { id:"b3", name:"Overnight Oats",         category:"breakfast", calories:380, protein:14, carbs:56, fats:10, tags:["balanced","vegetarian"],                ingredients:["Rolled oats","Almond milk","Chia seeds","Banana"], emoji:"🥣" },
  { id:"b4", name:"Veggie Omelette",        category:"breakfast", calories:340, protein:24, carbs:8,  fats:24, tags:["high-protein","low-carb","vegetarian"], ingredients:["Eggs","Spinach","Bell pepper","Feta"],        emoji:"🍳" },
  { id:"b5", name:"Protein Smoothie",       category:"breakfast", calories:290, protein:28, carbs:30, fats:6,  tags:["high-protein"],                          ingredients:["Whey protein","Banana","Peanut butter","Oat milk"], emoji:"🥤" },
  { id:"b6", name:"Cottage Cheese & Peach", category:"breakfast", calories:260, protein:24, carbs:22, fats:6,  tags:["high-protein","vegetarian"],            ingredients:["Cottage cheese","Peach","Walnuts","Cinnamon"], emoji:"🍑" },
  { id:"b7", name:"Whole Grain Pancakes",   category:"breakfast", calories:450, protein:16, carbs:62, fats:14, tags:["balanced","vegetarian"],                ingredients:["Oat flour","Egg","Maple syrup","Berries"],     emoji:"🥞" },
  // lunch
  { id:"l1", name:"Grilled Chicken Quinoa Bowl", category:"lunch", calories:520, protein:42, carbs:48, fats:16, tags:["balanced","high-protein"], ingredients:["Chicken breast","Quinoa","Cucumber","Lemon"], emoji:"🍗" },
  { id:"l2", name:"Mediterranean Tuna Salad",    category:"lunch", calories:430, protein:36, carbs:22, fats:22, tags:["high-protein","low-carb"], ingredients:["Tuna","Olives","Tomato","Olive oil"],         emoji:"🥗" },
  { id:"l3", name:"Turkey Avocado Wrap",         category:"lunch", calories:480, protein:32, carbs:42, fats:18, tags:["balanced","high-protein"], ingredients:["Whole wheat wrap","Turkey","Avocado","Lettuce"], emoji:"🌯" },
  { id:"l4", name:"Lentil & Sweet Potato Bowl",  category:"lunch", calories:460, protein:20, carbs:70, fats:10, tags:["vegetarian","balanced"],   ingredients:["Lentils","Sweet potato","Kale","Tahini"],   emoji:"🍠" },
  { id:"l5", name:"Salmon Poke Bowl",            category:"lunch", calories:540, protein:38, carbs:52, fats:18, tags:["high-protein","balanced"], ingredients:["Salmon","Brown rice","Edamame","Seaweed"], emoji:"🍣" },
  { id:"l6", name:"Caprese Chicken Plate",       category:"lunch", calories:410, protein:38, carbs:12, fats:22, tags:["high-protein","low-carb"], ingredients:["Chicken","Mozzarella","Tomato","Basil"],   emoji:"🍅" },
  { id:"l7", name:"Chickpea Buddha Bowl",        category:"lunch", calories:500, protein:22, carbs:64, fats:16, tags:["vegetarian","balanced"],   ingredients:["Chickpeas","Brown rice","Roasted veg","Hummus"], emoji:"🥙" },
  // dinner
  { id:"d1", name:"Baked Salmon & Asparagus",  category:"dinner", calories:540, protein:42, carbs:18, fats:30, tags:["high-protein","low-carb"], ingredients:["Salmon fillet","Asparagus","Lemon","Olive oil"], emoji:"🐟" },
  { id:"d2", name:"Lean Beef Stir Fry",        category:"dinner", calories:580, protein:44, carbs:50, fats:20, tags:["high-protein","balanced"], ingredients:["Lean beef","Broccoli","Bell pepper","Jasmine rice"], emoji:"🥩" },
  { id:"d3", name:"Zucchini Noodle Bolognese", category:"dinner", calories:420, protein:32, carbs:22, fats:22, tags:["low-carb","high-protein"], ingredients:["Zucchini","Lean ground beef","Tomato","Parmesan"], emoji:"🍝" },
  { id:"d4", name:"Herb Roasted Chicken",      category:"dinner", calories:560, protein:46, carbs:38, fats:22, tags:["high-protein","balanced"], ingredients:["Chicken thigh","Potatoes","Rosemary","Garlic"], emoji:"🍛" },
  { id:"d5", name:"Eggplant Parmesan",         category:"dinner", calories:510, protein:22, carbs:48, fats:26, tags:["vegetarian","balanced"],   ingredients:["Eggplant","Marinara","Mozzarella","Basil"],   emoji:"🍆" },
  { id:"d6", name:"Shrimp Cauliflower Rice",   category:"dinner", calories:380, protein:36, carbs:18, fats:16, tags:["low-carb","high-protein"], ingredients:["Shrimp","Cauliflower rice","Garlic","Lime"], emoji:"🍤" },
  { id:"d7", name:"Tofu Coconut Curry",        category:"dinner", calories:490, protein:24, carbs:52, fats:20, tags:["vegetarian","balanced"],   ingredients:["Tofu","Coconut milk","Curry paste","Basmati rice"], emoji:"🍲" },
];

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// ---------- Storage helpers ----------
const STORAGE = {
  THEME: "caloriecraft.theme",
  CURRENT: "caloriecraft.currentPlan",
  SAVED: "caloriecraft.savedPlans",
};

const getCurrent = () => JSON.parse(localStorage.getItem(STORAGE.CURRENT) || "null");
const setCurrent = (p) => localStorage.setItem(STORAGE.CURRENT, JSON.stringify(p));
const getSaved   = () => JSON.parse(localStorage.getItem(STORAGE.SAVED) || "[]");
const setSaved   = (a) => localStorage.setItem(STORAGE.SAVED, JSON.stringify(a));

// ---------- Theme ----------
function initTheme() {
  const saved = localStorage.getItem(STORAGE.THEME);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
  document.getElementById("themeToggle").textContent = theme === "dark" ? "☀️" : "🌙";
}
document.getElementById("themeToggle").addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(STORAGE.THEME, next);
  document.getElementById("themeToggle").textContent = next === "dark" ? "☀️" : "🌙";
});

// ---------- Routing (hash-based) ----------
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === id));
  document.querySelectorAll(".nav-link").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (id === "results") renderResults();
  if (id === "saved")   renderSaved();
}
function handleHash() {
  const id = (location.hash || "#home").slice(1);
  if (document.getElementById(id)) showPage(id);
  else showPage("home");
}
window.addEventListener("hashchange", handleHash);
document.querySelectorAll("[data-nav]").forEach(a => {
  a.addEventListener("click", (e) => {
    // Let hashchange handle activation; smoothing scroll is fine
  });
});

// ---------- Toast ----------
let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2400);
}

// ---------- Planner form ----------
const form = document.getElementById("plannerForm");
const caloriesInput = document.getElementById("calories");
const errorEl = document.getElementById("caloriesError");

function validateCalories(val) {
  if (!String(val).trim()) return "Please enter your calorie goal.";
  const n = Number(val);
  if (!Number.isFinite(n)) return "Calories must be a number.";
  if (n < 1000) return "For safety, we recommend at least 1,000 calories per day.";
  if (n > 5000) return "Please enter a value under 5,000.";
  return null;
}
function showError(msg) {
  if (msg) { errorEl.hidden = false; errorEl.textContent = msg; caloriesInput.setAttribute("aria-invalid","true"); }
  else { errorEl.hidden = true; errorEl.textContent = ""; caloriesInput.removeAttribute("aria-invalid"); }
}
caloriesInput.addEventListener("input", () => {
  if (!errorEl.hidden) showError(validateCalories(caloriesInput.value));
});

// Presets
document.querySelectorAll("[data-preset]").forEach(btn => {
  btn.addEventListener("click", () => {
    caloriesInput.value = btn.dataset.preset;
    showError(null);
  });
});

// Diet selection visual
const dietOptions = document.querySelectorAll(".diet-option");
dietOptions.forEach(opt => {
  opt.addEventListener("click", () => {
    dietOptions.forEach(o => o.classList.remove("selected"));
    opt.classList.add("selected");
    opt.querySelector("input").checked = true;
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const err = validateCalories(caloriesInput.value);
  showError(err);
  if (err) return;
  const diet = form.querySelector('input[name="diet"]:checked').value;
  const btn = document.getElementById("generateBtn");
  btn.disabled = true;
  btn.textContent = "Crafting your plan…";
  setTimeout(() => {
    const plan = generatePlan(Number(caloriesInput.value), diet);
    setCurrent(plan);
    btn.disabled = false;
    btn.innerHTML = "✨ Generate my 7-day plan";
    toast("Your weekly plan is ready!");
    location.hash = "#results";
  }, 600);
});

// ---------- Plan generator ----------
function pickMeal(category, target, diet, exclude) {
  let pool = MEALS.filter(m => m.category === category && (diet === "any" || m.tags.includes(diet)) && !exclude.has(m.id));
  if (!pool.length) pool = MEALS.filter(m => m.category === category);
  const ranked = pool
    .map(m => ({ m, score: Math.abs(m.calories - target) + Math.random() * 80 }))
    .sort((a,b) => a.score - b.score)
    .slice(0, 3);
  return ranked[Math.floor(Math.random() * ranked.length)].m;
}
function generatePlan(goal, diet) {
  const bT = goal * 0.25, lT = goal * 0.35, dT = goal * 0.40;
  const recentB = new Set(), recentL = new Set(), recentD = new Set();
  const days = DAYS.map(day => {
    const breakfast = pickMeal("breakfast", bT, diet, recentB);
    const lunch     = pickMeal("lunch",     lT, diet, recentL);
    const dinner    = pickMeal("dinner",    dT, diet, recentD);
    recentB.clear(); recentB.add(breakfast.id);
    recentL.clear(); recentL.add(lunch.id);
    recentD.clear(); recentD.add(dinner.id);
    return {
      day, breakfast, lunch, dinner,
      totalCalories: breakfast.calories + lunch.calories + dinner.calories,
      totalProtein:  breakfast.protein  + lunch.protein  + dinner.protein,
      totalCarbs:    breakfast.carbs    + lunch.carbs    + dinner.carbs,
      totalFats:     breakfast.fats     + lunch.fats     + dinner.fats,
    };
  });
  return { id: crypto.randomUUID(), createdAt: Date.now(), calorieGoal: goal, diet, days };
}

// ---------- Results rendering ----------
let activeFilter = "all";

function renderResults() {
  const plan = getCurrent();
  document.getElementById("resultsEmpty").hidden = !!plan;
  document.getElementById("resultsContent").hidden = !plan;
  if (!plan) return;
  document.getElementById("planCalories").textContent = plan.calorieGoal.toLocaleString();
  document.getElementById("planDiet").textContent = plan.diet;
  renderDays(plan);
}

function renderDays(plan) {
  const grid = document.getElementById("daysGrid");
  grid.innerHTML = "";
  plan.days.forEach((day, i) => {
    const meals = [day.breakfast, day.lunch, day.dinner].filter(m => activeFilter === "all" || m.category === activeFilter);
    if (!meals.length) return;
    const article = document.createElement("article");
    article.className = "day-card";
    article.style.animationDelay = `${i * 50}ms`;
    article.innerHTML = `
      <header class="day-head">
        <h3>${day.day}</h3>
        <div class="macros">
          <span class="macro-chip">🔥 ${day.totalCalories} <em>kcal</em></span>
          <span class="macro-chip">💪 ${day.totalProtein}g <em>P</em></span>
          <span class="macro-chip">🌾 ${day.totalCarbs}g <em>C</em></span>
          <span class="macro-chip">💧 ${day.totalFats}g <em>F</em></span>
        </div>
      </header>
      <div class="meals-grid">
        ${meals.map(m => `
          <div class="meal">
            <p class="cat">${m.category}</p>
            <div class="meal-title">
              <span class="emoji" aria-hidden="true">${m.emoji}</span>
              <h4>${m.name}</h4>
            </div>
            <div class="tag-row">${m.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
            <p class="ingredients">${m.ingredients.join(" · ")}</p>
            <p class="nutri">${m.calories} kcal · ${m.protein}P / ${m.carbs}C / ${m.fats}F</p>
          </div>
        `).join("")}
      </div>`;
    grid.appendChild(article);
  });
}

// Filter buttons
document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    const plan = getCurrent();
    if (plan) renderDays(plan);
  });
});

// Regenerate
document.getElementById("regenBtn").addEventListener("click", () => {
  const plan = getCurrent();
  if (!plan) return;
  const next = generatePlan(plan.calorieGoal, plan.diet);
  setCurrent(next);
  renderResults();
  toast("Fresh plan generated!");
});

// Save
document.getElementById("saveBtn").addEventListener("click", () => {
  const plan = getCurrent();
  if (!plan) return;
  const all = getSaved();
  if (!all.find(p => p.id === plan.id)) {
    all.unshift(plan);
    setSaved(all.slice(0, 20));
    toast("Plan saved to your library.");
  } else {
    toast("Already in your library.");
  }
});

// Grocery
document.getElementById("groceryBtn").addEventListener("click", () => {
  const panel = document.getElementById("groceryPanel");
  const plan = getCurrent();
  if (!plan) return;
  if (panel.hidden) {
    const map = new Map();
    plan.days.forEach(d => [d.breakfast,d.lunch,d.dinner].forEach(m =>
      m.ingredients.forEach(i => map.set(i, (map.get(i) || 0) + 1))
    ));
    const items = [...map.entries()].sort((a,b) => b[1]-a[1]);
    document.getElementById("groceryList").innerHTML =
      items.map(([item,count]) => `<li><span>${item}</span><span>×${count}</span></li>`).join("");
    panel.hidden = false;
  } else {
    panel.hidden = true;
  }
});

// ---------- Saved page ----------
function renderSaved() {
  const list = document.getElementById("savedList");
  const plans = getSaved();
  if (!plans.length) {
    list.innerHTML = `
      <div class="empty-saved">
        <div style="font-size:2.25rem">🔖</div>
        <h2>Nothing saved yet</h2>
        <p>Generate a plan and tap save to keep it here.</p>
        <a href="#planner" data-nav class="btn btn-primary">Build a plan</a>
      </div>`;
    return;
  }
  list.innerHTML = plans.map(p => `
    <article class="saved-card">
      <div class="saved-head">
        <div>
          <h2>${p.calorieGoal.toLocaleString()} kcal · <span style="text-transform:capitalize">${p.diet}</span></h2>
          <time>Saved ${new Date(p.createdAt).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</time>
        </div>
        <button class="icon-btn-sm" data-delete="${p.id}" aria-label="Delete plan">🗑</button>
      </div>
      <p class="preview">${p.days[0].breakfast.name} · ${p.days[0].lunch.name} · ${p.days[0].dinner.name}…</p>
      <button class="btn btn-dark" data-load="${p.id}">👁 View plan</button>
    </article>
  `).join("");

  list.querySelectorAll("[data-delete]").forEach(b => {
    b.addEventListener("click", () => {
      setSaved(getSaved().filter(p => p.id !== b.dataset.delete));
      renderSaved();
      toast("Plan removed.");
    });
  });
  list.querySelectorAll("[data-load]").forEach(b => {
    b.addEventListener("click", () => {
      const plan = getSaved().find(p => p.id === b.dataset.load);
      if (plan) {
        setCurrent(plan);
        toast("Plan loaded.");
        location.hash = "#results";
      }
    });
  });
}

// ---------- Init ----------
document.getElementById("year").textContent = new Date().getFullYear();
initTheme();
handleHash();
