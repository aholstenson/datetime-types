import { WithYear } from './types';
import { zeroPadInt } from './helpers/zeroPadInt';
import { assertInt } from './helpers/assertInt';
import { compareInt } from './helpers/compareInt';

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
	 * Turn this year into a string.
	 */
	public toString() {
		if(this.year > 9999) {
			return '+' + this.year;
		} else {
			return zeroPadInt(this.year, 4);
		}
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
