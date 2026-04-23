# CalorieCraft

CalorieCraft is an AI-powered meal planning web application that generates a personalized 7 day meal plan based on a user's calorie deficit goal. It helps users simplify meal planning and stay consistent with their fitness or weight-loss goals.

## Live Demo

[View the live site here](https://joanabari.github.io/calorie-craft/)

## Features

- Generate a 7 day meal plan based on a daily calorie goal
- Each day includes breakfast, lunch, and dinner
- Dynamic content updates using JavaScript (DOM manipulation)
- User input form with validation
- Ability to regenerate meal plans
- Responsive design for mobile and desktop
- Navigation between multiple pages (Home, Planner, Results)
- (Optional) Save meal plans using local storage
- (Optional) API integration for real recipe data

## Technologies Used

- HTML (semantic structure)
- CSS (Flexbox, Grid, responsive design)
- JavaScript (DOM manipulation, event handling, fetch API)
- External API 

## AI Tools Used

- GitHub Copilot: Assisted with writing JavaScript functions

## Challenges Faced
Splitting a daily calorie target across 3 meals while picking from a fixed database often missed the goal by 200–400 kcal.
Diet filters (vegan, gluten-free) shrank the meal pool, causing repeats across the week.
No backend meant saved plans and theme had to survive reloads on their own.
Form inputs like negative or huge calorie values broke the generator.
The 7-day grid overflowed on mobile.

## Solutions
Used a 25/35/40% calorie split with weighted randomness to keep totals within ~5% of target.
Pre-filtered meals by diet tag and sampled without replacement so meals don't repeat back-to-back.
Stored current plan, saved plans, and theme in localStorage under namespaced keys.


## Future Improvements
Integrate a real recipe API (Spoonacular/Edamam) for live recipes and photos.
Add user accounts so plans sync across devices.
Let users set macro targets (protein/carbs/fat), not just calories.
Add allergen exclusions and a printable/exportable grocery list.
Drag-and-drop meal swapping with live calorie recalculation.

