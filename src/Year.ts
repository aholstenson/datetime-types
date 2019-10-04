import { WithYear } from './types';
import { assertInt } from './helpers/assertInt';
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
