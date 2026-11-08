import type { WithHour } from './WithHour.js';
import type { WithMinute } from './WithMinute.js';
import type { WithSecond } from './WithSecond.js';
import type { WithMilliOfSecond } from './WithMilliOfSecond.js';

export type LocalTimeLike = WithHour & WithMinute & WithSecond & WithMilliOfSecond;
