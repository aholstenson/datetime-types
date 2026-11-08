import type { WithYear } from './types/index.js';
import { formatYear } from './helpers/formatYear.js';
import { assertInt } from './helpers/assertInt.js';
import { compareInt } from './helpers/compareInt.js';
import { noValueOf } from './helpers/noValueOf.js';

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
	 * Get if this year equals another year like object.
	 *
	 * @param other
	 */
	public equals(other: WithYear | null | undefined) {
		if(! other) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this year with another year like object.
	 *
	 * @param other
	 */
	public compare(other: WithYear) {
		return compareInt(this.year, other.year);
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
		year = assertInt(year);

		return new Year(year);
	}

	/**
	 * Create a year from the given object.
	 *
	 * @param object
	 */
	public static from(object: WithYear) {
		return this.of(object.year);
	}

	/**
	 * Create a year from the given date.
	 *
	 * @param date
	 */
	public static fromDate(date: Date) {
		return this.of(date.getFullYear());
	}
}
