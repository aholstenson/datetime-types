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
				return this.JANUARY;
			case 2:
				return this.FEBRUARY;
			case 3:
				return this.MARCH;
			case 4:
				return this.APRIL;
			case 5:
				return this.MAY;
			case 6:
				return this.JUNE;
			case 7:
				return this.JULY;
			case 8:
				return this.AUGUST;
			case 9:
				return this.SEPTEMBER;
			case 10:
				return this.OCTOBER;
			case 11:
				return this.NOVEMBER;
			case 12:
				return this.DECEMBER;
		}

		throw new Error('month must be between 1 and 12');
	}

	/**
	 * January.
	 */
	public static readonly JANUARY = new Month(1);

	/**
	 * February.
	 */
	public static readonly FEBRUARY = new Month(2);

	/**
	 * March.
	 */
	public static readonly MARCH = new Month(3);

	/**
	 * April.
	 */
	public static readonly APRIL = new Month(4);

	/**
	 * May.
	 */
	public static readonly MAY = new Month(5);

	/**
	 * June.
	 */
	public static readonly JUNE = new Month(6);

	/**
	 * July.
	 */
	public static readonly JULY = new Month(7);

	/**
	 * August.
	 */
	public static readonly AUGUST = new Month(8);

	/**
	 * September.
	 */
	public static readonly SEPTEMBER = new Month(9);

	/**
	 * October.
	 */
	public static readonly OCTOBER = new Month(10);

	/**
	 * November.
	 */
	public static readonly NOVEMBER = new Month(11);

	/**
	 * December.
	 */
	public static readonly DECEMBER = new Month(12);
}
