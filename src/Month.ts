import type { WithMonth } from './types/index.js';
import { compareInt } from './helpers/compareInt.js';
import { zeroPadInt } from './helpers/zeroPadInt.js';
import { noValueOf } from './helpers/noValueOf.js';

/**
 * Representation of a month.
 */
export class Month implements WithMonth {
	public readonly month: number;

	private constructor(month: number) {
		this.month = month;
	}

	/**
	 * Get if this month equals another month like object.
	 *
	 * @param other
	 */
	public equals(other: WithMonth | null | undefined) {
		if(! other) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this month with another month like object.
	 *
	 * @param other
	 */
	public compare(other: WithMonth) {
		return compareInt(this.month, other.month);
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
		return noValueOf('Month');
	}

	/**
	 * Turn this month into a string in the form `--MM`, such as `--03` for
	 * March. This is the month format of ISO 8601:2000 and XML Schema
	 * `gMonth`.
	 */
	public toString() {
		return '--' + zeroPadInt(this.month, 2);
	}

	public static of(month: number) {
		switch(month) {
			case 1:
				return this.January;
			case 2:
				return this.February;
			case 3:
				return this.March;
			case 4:
				return this.April;
			case 5:
				return this.May;
			case 6:
				return this.June;
			case 7:
				return this.July;
			case 8:
				return this.August;
			case 9:
				return this.September;
			case 10:
				return this.October;
			case 11:
				return this.November;
			case 12:
				return this.December;
		}

		throw new Error('month must be between 1 and 12');
	}

	/**
	 * January.
	 */
	public static readonly January = new Month(1);

	/**
	 * February.
	 */
	public static readonly February = new Month(2);

	/**
	 * March.
	 */
	public static readonly March = new Month(3);

	/**
	 * April.
	 */
	public static readonly April = new Month(4);

	/**
	 * May.
	 */
	public static readonly May = new Month(5);

	/**
	 * June.
	 */
	public static readonly June = new Month(6);

	/**
	 * July.
	 */
	public static readonly July = new Month(7);

	/**
	 * August.
	 */
	public static readonly August = new Month(8);

	/**
	 * September.
	 */
	public static readonly September = new Month(9);

	/**
	 * October.
	 */
	public static readonly October = new Month(10);

	/**
	 * November.
	 */
	public static readonly November = new Month(11);

	/**
	 * December.
	 */
	public static readonly December = new Month(12);
}
