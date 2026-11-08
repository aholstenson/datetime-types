import type { LocalDateLike } from './types/index.js';

import { assertInt } from './helpers/assertInt.js';

import { Month } from './Month.js';
import { zeroPadInt } from './helpers/zeroPadInt.js';
import { formatYear } from './helpers/formatYear.js';
import { compareInt } from './helpers/compareInt.js';
import { noValueOf } from './helpers/noValueOf.js';

/**
 * Local date that represents just a date.
 */
export class LocalDate implements LocalDateLike {
	/**
	 * The year of the date.
	 */
	public readonly year: number;

	/**
	 * The month of the date.
	 */
	public readonly month: number;

	/**
	 * The day of the month.
	 */
	public readonly day: number;

	private constructor(year: number, month: number, day: number) {
		this.year = year;
		this.month = month;
		this.day = day;
	}

	/**
	 * Get if this local date equals another local date like object.
	 *
	 * @param other
	 */
	public equals(other: LocalDateLike | null | undefined) {
		if(! other) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this local date with another local date like object.
	 *
	 * @param other
	 */
	public compare(other: LocalDateLike) {
		const y = compareInt(this.year, other.year);
		if(y !== 0) return y;

		const m = compareInt(this.month, other.month);
		if(m !== 0) return m;

		return compareInt(this.day, other.day);
	}

	/**
	 * Turn this object into a Date-object.
	 */
	public toDateAtMidnight() {
		const date = new Date(2000, 0, 1, 0, 0, 0, 0);
		// The Date constructor reads years 0 to 99 as 1900 to 1999, so set the
		// full year separately.
		date.setFullYear(this.year, this.month - 1, this.day);
		return date;
	}

	/**
	 * Get the string for this value in JSON. This is the same as
	 * `toString()`.
	 */
	public toJSON() {
		return this.toString();
	}

	/**
	 * Throw a `TypeError`. Use `compare()` or `equals()` to compare values.
	 */
	public valueOf(): never {
		return noValueOf('LocalDate');
	}

	/**
	 * Turn this date into an ISO 8601 string, such as `2024-03-01`. A year
	 * outside 0 to 9999 has six digits and a sign, such as `+020240-03-01`.
	 */
	public toString() {
		let result = formatYear(this.year);
		result += '-' + zeroPadInt(this.month, 2);
		result += '-' + zeroPadInt(this.day, 2);
		return result;
	}


	/**
	 * Create a local date using the given year, month and day. Will throw an
	 * error if the date is invalid.
	 *
	 * @param year
	 *   the year of the date
	 * @param month
	 *   the month of the date
	 * @param day
	 *   the day of the month
	 */
	public static of(
		year: number,
		month: Month | number,
		day: number
	): LocalDate {
		year = assertInt(year);

		if(month instanceof Month) {
			month = month.month;
		}
		month = assertInt(month);

		day = assertInt(day);

		if(month < 1 || month > 12) {
			throw new Error('month must be between 1 and 12');
		}

		let daysInMonth = 31;
		switch(month) {
			case 2:
				daysInMonth = isLeapYear(year) ? 29 : 28;
				break;
			case 4:
			case 6:
			case 9:
			case 11:
				daysInMonth = 30;
				break;
		}

		if(day < 1 || day > daysInMonth) {
			throw new Error('day must be between 1 and ' + daysInMonth);
		}

		return new LocalDate(year, month, day);
	}

	/**
	 * Create a local date from the given `Date` instance.
	 *
	 * @param date
	 */
	public static fromDate(date: Date): LocalDate {
		return this.of(
			date.getFullYear(),
			date.getMonth() + 1,
			date.getDate()
		);
	}

	/**
	 * Create a local time from an object containing numeric `year`, `month`
	 * and `day` properties.
	 *
	 * @param object
	 */
	public static from(object: LocalDateLike) {
		return this.of(
			object.year,
			object.month,
			object.day
		);
	}
}

/**
 * Check if a year is a leap year. Follows the rules outlined in ISO 8601.
 *
 * @param year
 */
function isLeapYear(year: number) {
	if((year & 3) !== 0) {
		return false;
	}

	return (year % 100) !== 0 || (year % 400) === 0;
}
