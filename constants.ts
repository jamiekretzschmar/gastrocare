import { MealItem, MealTexture } from './types';

export const MEAL_PLAN: MealItem[] = [
  { id: '1', time: '08:00', suggestion: 'High-protein oatmeal (well-cooked)', texture: 'Standard', completed: false },
  { id: '2', time: '12:00', suggestion: 'Pureed vegetable soup', texture: 'Puree', completed: false },
  { id: '3', time: '18:00', suggestion: 'White fish with mashed carrots', texture: 'Soft', completed: false }
];

export const GUIDELINES = [
  { title: 'Infection Control', detail: 'Ensure all food is well-cooked; avoid fresh plants/flowers in prep areas.' },
  { title: 'Hydration', detail: 'Sip water every 15-30 minutes; track total intake.' },
  { title: 'Texture Safety', detail: 'Adhere to Liquid/Puree during flare-ups.' }
];

export const RECIPES = [
  { name: 'Safe Protein Shake', texture: 'Liquid' as MealTexture, ingredients: ['Whey isolate', 'Water', 'Smooth nut butter'] },
  { name: 'Gastro Puree', texture: 'Puree' as MealTexture, ingredients: ['Cooked squash', 'Chicken broth'] }
];
