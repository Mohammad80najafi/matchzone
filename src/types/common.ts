export type AgeRange = '12-18' | '18-26' | '26-35' | '35+';

export type UserGender = 'male' | 'female' | 'unknown';

// محدودیت لابی: همه/فقط آقایان/فقط خانم‌ها
export type LobbyGenderConstraint = 'any' | 'male' | 'female';

export type AllowedGender = LobbyGenderConstraint;
