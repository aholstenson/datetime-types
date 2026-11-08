import type { WithYear } from './WithYear.js';
import type { WithMonth } from './WithMonth.js';
import type { WithDayOfMonth } from './WithDayOfMonth.js';

export type LocalDateLike = WithYear & WithMonth & WithDayOfMonth;
