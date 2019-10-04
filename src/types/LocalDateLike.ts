import { WithYear } from './WithYear';
import { WithMonth } from './WithMonth';
import { WithDayOfMonth } from './WithDayOfMonth';

export type LocalDateLike = WithYear & WithMonth & WithDayOfMonth;
