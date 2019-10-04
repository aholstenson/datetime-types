import { WithHour } from './WithHour';
import { WithMinute } from './WithMinute';
import { WithSecond } from './WithSecond';
import { WithMilliOfSecond } from './WithMilliOfSecond';

export type LocalTimeLike = WithHour & WithMinute & WithSecond & WithMilliOfSecond;
