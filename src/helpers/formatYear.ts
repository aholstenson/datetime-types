import { zeroPadInt } from './zeroPadInt.js';

/**
 * Format a year as in ISO 8601. The year has at least four digits. A year
 * before year 0 starts with `-` and a year after 9999 starts with `+`.
 *
 * @param year
 *   the year to format
 */
export function formatYear(year: number) {
	if(year < 0) {
		return '-' + zeroPadInt(Math.abs(year), 4);
	} else if(year > 9999) {
		return '+' + zeroPadInt(year, 4);
	} else {
		return zeroPadInt(year, 4);
	}
}
