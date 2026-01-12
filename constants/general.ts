
import { BudgetOption, Genre, Gender } from '../types';

export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Indonesia",
  "Canada",
  "France",
  "Germany",
  "Australia",
  "Japan",
  "South Korea",
  "Brazil",
  "Nigeria",
  "Spain",
  "Mexico"
];

export const GENRES = Object.values(Genre);
export const GENDERS = Object.values(Gender);

export const AGES = Array.from({ length: 87 }, (_, i) => i + 14);

export const BUDGET_OPTIONS: BudgetOption[] = [
  { label: "Broke (0$)", value: 0 },
  { label: "Hustler (5,000$)", value: 5000 },
  { label: "Savings (50,000$)", value: 50000 },
  { label: "Indie Deal (250,000$)", value: 250000 },
  { label: "Major Advance (1,000,000$)", value: 1000000 },
  { label: "Trust Fund (10,000,000$)", value: 10000000 },
  { label: "Industry Plant (100,000,000$)", value: 100000000 },
  { label: "Oil Tycoon (1,000,000,000$)", value: 1000000000 },
];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
