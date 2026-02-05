import { Guideline, MealItem, Recipe } from './types';

export const GUIDELINES: Guideline[] = [
  {
    category: 'Dietary Strategy',
    rule: 'Eat 6 to 8 small meals per day',
    reasoning: 'Prevents stomach distention.',
    isCritical: true,
  },
  {
    category: 'Dietary Strategy',
    rule: 'Chew food to applesauce consistency',
    reasoning: 'Reduces workload on the stomach.',
    isCritical: true,
  },
  {
    category: 'Infection Safety',
    rule: 'NO Raw Vegetables or Fruit Skins',
    reasoning: 'Transplant protocol: Must be cooked soft or canned/pasteurized to prevent infection.',
    isCritical: true,
  },
  {
    category: 'Fiber Restriction',
    rule: 'Avoid Corn, Popcorn, Nuts, Seeds',
    reasoning: 'Skins and fibers cause bezoars (blockages).',
  },
  {
    category: 'Lifestyle',
    rule: 'Do NOT lie down for 1-2 hours after eating',
    reasoning: 'Gravity helps the stomach empty.',
    isCritical: true,
  },
  {
    category: 'Lifestyle',
    rule: 'Take a gentle walk after eating',
    reasoning: 'Stimulates gastric motility.',
  },
  {
    category: 'Medical',
    rule: 'Check blood sugar frequently',
    reasoning: 'High glucose (hyperglycemia) paralyzes the stomach.',
  }
];

export const MEAL_PLAN: MealItem[] = [
  {
    time: '8:00 AM',
    title: 'Breakfast',
    items: ['Cream of Rice (Water/Skim Milk)', 'Scrambled Egg Whites'],
    notes: 'Avoid oatmeal (fiber). Use smooth apple jelly.',
    icon: 'Sun',
    flareFriendly: false, // Solid food not for flares
  },
  {
    time: '8:00 AM',
    title: 'Flare Breakfast',
    items: ['Protein Shake (Whey Isolate)', 'Cream of Rice (Extra watery)'],
    notes: 'Liquid calories only.',
    icon: 'Sun',
    flareFriendly: true,
  },
  {
    time: '10:30 AM',
    title: 'Morning Snack',
    items: ['Low-fat Greek Yogurt', 'Canned Peaches (Mashed)'],
    notes: 'Must be canned/cooked.',
    icon: 'Coffee',
    flareFriendly: true,
  },
  {
    time: '1:00 PM',
    title: 'Lunch',
    items: ['Blended Ginger Carrot Soup', 'Saltine Crackers'],
    notes: 'Chew crackers until dissolved.',
    icon: 'Soup',
    flareFriendly: true,
  },
  {
    time: '3:30 PM',
    title: 'Afternoon Snack',
    items: ['Liquid Nutrition (Ensure/Boost)'],
    notes: 'Sip slowly over 30 minutes.',
    icon: 'Milk',
    flareFriendly: true,
  },
  {
    time: '6:00 PM',
    title: 'Dinner',
    items: ['Lean Ground Turkey (In Broth)', 'Mashed Potatoes'],
    notes: 'No skins. No frying.',
    icon: 'Utensils',
    flareFriendly: false,
  },
  {
    time: '6:00 PM',
    title: 'Flare Dinner',
    items: ['Bone Broth', 'Blended Potato Soup'],
    notes: 'Liquids only to rest stomach.',
    icon: 'Utensils',
    flareFriendly: true,
  },
  {
    time: '8:30 PM',
    title: 'Evening Snack',
    items: ['Unsweetened Applesauce', 'Rice Pudding'],
    notes: 'Made with low-fat milk.',
    icon: 'Moon',
    flareFriendly: true,
  },
];

export const RECIPES: Recipe[] = [
  {
    name: 'Ginger & Carrot "Digestion" Soup',
    description: 'Fully cooked, low fat, and ginger helps settle nausea.',
    ingredients: [
      '4 large carrots (Peeled, chopped)',
      '1 tsp ground ginger (Powdered)',
      '4 cups Chicken Broth',
      'Salt to taste'
    ],
    instructions: [
      'Boil carrots in broth until falling apart (25 mins).',
      'Blend until perfectly smooth.',
      'Stir in powdered ginger and salt.'
    ],
    isLiquid: true,
    texture: 'Pureed'
  },
  {
    name: 'Soft Turkey & Sweet Potato Mash',
    description: 'Easier to process than whole meat.',
    ingredients: [
      '1/2 cup lean ground turkey',
      '1/2 cup chicken broth',
      '1 medium sweet potato (Peeled completely)'
    ],
    instructions: [
      'Boil/bake sweet potato until soft. Mash strictly.',
      'Brown turkey in water (no oil).',
      'Add broth to turkey and simmer 10 mins.',
      'Mix turkey and potato together.'
    ],
    isLiquid: false,
    texture: 'Soft Solid'
  },
  {
    name: 'Emergency Electrolyte Popsicles',
    description: 'For severe nausea/vomiting days.',
    ingredients: [
      '2 cups Coconut water or Pedialyte',
      '1/2 cup Apple Juice (No pulp)',
      '1 tbsp Honey'
    ],
    instructions: [
      'Mix liquids together.',
      'Pour into popsicle molds.',
      'Freeze. Sucking on ice helps nausea.'
    ],
    isLiquid: true,
    texture: 'Liquid'
  }
];

export const SYMPTOM_OPTIONS = [
  'Nausea', 'Vomiting', 'Bloating', 'Abdominal Pain', 'Fullness', 'Acid Reflux', 'Regurgitation'
];

export const QUICK_ADD_FOODS = [
  { name: 'Cream of Rice', portion: '1/2 cup', cal: 150, p: 2, c: 33, f: 0, fiber: 0, texture: 'Pureed' },
  { name: 'Egg Whites', portion: '2 large', cal: 34, p: 7, c: 0, f: 0, fiber: 0, texture: 'Soft Solid' },
  { name: 'Ensure/Boost', portion: '1 bottle', cal: 220, p: 9, c: 33, f: 6, fiber: 0, texture: 'Liquid' },
  { name: 'Saltines', portion: '5 crackers', cal: 60, p: 1, c: 11, f: 1, fiber: 0, texture: 'Solid' },
  { name: 'Applesauce', portion: '1/2 cup', cal: 50, p: 0, c: 13, f: 0, fiber: 1, texture: 'Pureed' },
];