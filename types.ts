export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number; // Critical for GP
}

export type MealTexture = 'Liquid' | 'Pureed' | 'Soft Solid' | 'Solid';
export type BristolScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;

export interface LogEntry {
  id: string;
  date: string; // ISO string
  food: string;
  portionSize: string;
  bloodSugarBefore: number | string;
  bloodSugarAfter: number | string;
  symptoms: string[];
  severity: number; // 1-10
  activity: 'Walked' | 'Sat Upright' | 'Lay Down';
  notes: string;
  nutrition?: NutritionalInfo;
  texture?: MealTexture; // New: Texture tracking
  medicationTaken?: boolean; // New: Did they take prokinetic?
  bristolScore?: BristolScale; // New: Bowel movement tracking
}

export interface HydrationEntry {
  id: string;
  date: string;
  amountMl: number;
}

export interface HydrationSettings {
  dailyGoalMl: number;
  reminderIntervalMinutes: number; 
  reminderTimes: string[]; 
  enabled: boolean;
}

export interface MealItem {
  time: string;
  title: string;
  items: string[];
  notes: string;
  icon: string;
  flareFriendly: boolean; // New: Visible during flare-up mode
}

export interface Guideline {
  category: string;
  rule: string;
  reasoning: string;
  isCritical?: boolean;
}

export interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  isLiquid: boolean; // Keep for backward compatibility or ease
  texture: MealTexture; // New: For filtering
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // HH:mm 24-hour format
  enabled: boolean;
}

export enum Tab {
  DASHBOARD = 'Dashboard',
  MEAL_PLAN = 'Meal Plan',
  GUIDELINES = 'Guidelines',
  TRACKER = 'Tracker',
  ASSISTANT = 'AI Assistant',
  CLINIC = 'Clinic Info',
  MEDS = 'Medications'
}