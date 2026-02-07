export enum Tab {
  DASHBOARD = 'Dashboard',
  MEAL_PLAN = 'Meal Plan',
  MEDS = 'Medications',
  TRACKER = 'Tracker',
  GUIDELINES = 'Guidelines',
  ASSISTANT = 'AI Assistant',
  CLINIC = 'Clinic Guide'
}

export type MealTexture = 'Standard' | 'Soft' | 'Puree' | 'Liquid';
export type BristolScale = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface LogEntry {
  timestamp: string;
  mealName: string;
  texture: MealTexture;
  calories: number;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  stoolBristol?: BristolScale;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  enabled: boolean;
}

export interface HydrationEntry {
  timestamp: string;
  amountMl: number;
}

export interface HydrationSettings {
  dailyGoalMl: number;
  reminderIntervalMinutes: number;
  reminderTimes: string[];
  enabled: boolean;
}

export interface MealItem {
  id: string;
  time: string;
  suggestion: string;
  texture: MealTexture;
  completed: boolean;
}
