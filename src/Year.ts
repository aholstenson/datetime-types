import type { WithYear, YearInput } from './types/index.js';
import { formatYear } from './helpers/formatYear.js';
import { assertInt } from './helpers/assertInt.js';
import { compareInt } from './helpers/compareInt.js';
import { noValueOf } from './helpers/noValueOf.js';
import { parseYear } from './helpers/parse.js';
import { assertIsoCalendar } from './helpers/assertFields.js';
import { daysInYear, isLeapYear } from './helpers/calendar.js';

/**
 * Representation of a single year.
 */
export class Year implements WithYear {
	/**
	 * The year represented.
	 */
	public readonly year: number;

	private constructor(year: number) {
		this.year = year;
	}

	/**
	 * The number of days in this year, 365 or 366.
	 */
	get daysInYear() {
		return daysInYear(this.year);
	}

	/**
	 * If this year is a leap year.
	 */
	get inLeapYear() {
		return isLeapYear(this.year);
	}

	/**
	 * Get if this year equals another value. The other value can be anything
	 * that `from()` accepts. `null` and `undefined` give `false`.
	 *
	 * @param other
	 */
	public equals(other: string | YearInput | null | undefined): boolean {
		if(other === null || other === undefined) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this year with another value. The other value can be anything
	 * that `from()` accepts. Returns `-1` if this year comes first, `0` if
	 * they are equal and `1` if this year comes last.
	 *
	 * @param other
	 */
	public compare(other: string | YearInput): -1 | 0 | 1 {
		const o = Year.from(other);
		return compareInt(this.year, o.year);
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
		return noValueOf('Year');
	}

	/**
	 * Turn this year into an ISO 8601 string. A year from 0 to 9999 has four
	 * digits, such as `0005`. A year outside that range has six digits and a
	 * sign, such as `+020240` or `-000005`.
	 */
	public toString() {
		return formatYear(this.year);
	}

	/**
	 * Create an object for the specified year.
	 *
	 * @param year
	 */
	public static of(year: number) {
		year = assertInt(year, 'year');

		return new Year(year);
	}

	/**
	 * Create a year from an ISO 8601 string or from an object.
	 *
	 * The string can be in the form that `toString()` gives, such as `2024`
	 * or `+020240`.
	 *
	 * The object must have a numeric `year` property. This includes a
	 * `LocalDate` and a `Temporal.PlainYearMonth`. An object with a calendar
	 * other than `iso8601` gives an error.
	 *
	 * @param value
	 *   the string or the object
	 */
	public static from(value: string | YearInput): Year {
		if(typeof value === 'string') {
			return Year.of(parseYear(value));
		}

		if(value instanceof Year) {
			return value;
		}

		assertIsoCalendar(value);
		return Year.of(value.year);
	}

	/**
	 * Compare two years. Returns `-1` if `a` is before `b`, `0` if they are
	 * equal and `1` if `a` is after `b`. Use it to sort years, such as
	 * `years.sort(Year.compare)`.
	 *
	 * @param a
	 *   a year, or a value that `from()` accepts
	 * @param b
	 *   a year, or a value that `from()` accepts
	 */
	public static compare(
		a: string | YearInput,
		b: string | YearInput
	): -1 | 0 | 1 {
		return Year.from(a).compare(Year.from(b));
	}

	/**
	 * Get the current year in the local timezone of the system.
	 */
	public static now(): Year {
		return Year.fromDate(new Date());
	}

	/**
	 * Create a year from the given date.
	 *
	 * @param date
	 */
	public static fromDate(date: Date) {
		return Year.of(date.getFullYear());
	}
}
