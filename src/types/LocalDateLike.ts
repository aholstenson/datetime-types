import type { WithYear } from './WithYear.js';
import type { WithMonth } from './WithMonth.js';
import type { WithDay } from './WithDay.js';

export type LocalDateLike = WithYear & WithMonth & WithDay;
