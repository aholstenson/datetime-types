import { zeroPadInt } from './zeroPadInt.js';

/**
 * Format a year as in ISO 8601 and RFC 9557. A year from 0 to 9999 has four
 * digits. A year outside that range has six digits and starts with `-` or
 * `+`, as `Temporal` and `Date.toISOString()` write it.
 *
 * @param year
 *   the year to format
 */
export function formatYear(year: number) {
	if(year < 0) {
		return '-' + zeroPadInt(Math.abs(year), 6);
	} else if(year > 9999) {
		return '+' + zeroPadInt(year, 6);
	} else {
		return zeroPadInt(year, 4);
	}
}
