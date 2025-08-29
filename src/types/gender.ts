export type UserGender = 'male' | 'female' | 'unknown';
export const GENDER_OPTIONS: { value: UserGender; label: string }[] = [
  { value: 'unknown', label: 'نامشخص' },
  { value: 'male', label: 'آقا' },
  { value: 'female', label: 'خانم' },
];
