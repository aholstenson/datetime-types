import type { CalendarFields, WithMonth } from './types/index.js';
import { compareInt } from './helpers/compareInt.js';
import { zeroPadInt } from './helpers/zeroPadInt.js';
import { noValueOf } from './helpers/noValueOf.js';
import { parseMonth } from './helpers/parse.js';
import { assertIsoCalendar } from './helpers/assertFields.js';

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

	/**
	 * Get the month with the given number, from 1 for January to 12 for
	 * December. Will throw an error for every other value.
	 *
	 * @param month
	 *   the number of the month
	 */
	public static of(month: number) {
		switch(month) {
			case 1:
				return Month.JANUARY;
			case 2:
				return Month.FEBRUARY;
			case 3:
				return Month.MARCH;
			case 4:
				return Month.APRIL;
			case 5:
				return Month.MAY;
			case 6:
				return Month.JUNE;
			case 7:
				return Month.JULY;
			case 8:
				return Month.AUGUST;
			case 9:
				return Month.SEPTEMBER;
			case 10:
				return Month.OCTOBER;
			case 11:
				return Month.NOVEMBER;
			case 12:
				return Month.DECEMBER;
		}

		throw new Error('month must be between 1 and 12');
	}

	/**
	 * Get a month from an ISO 8601 string or from an object.
	 *
	 * The string can be in the form that `toString()` gives, such as `--03`.
	 *
	 * The object must have a numeric `month` property. This includes a
	 * `LocalDate` and a `Temporal.PlainDate`. An object with a calendar other
	 * than `iso8601` gives an error.
	 *
	 * @param value
	 *   the string or the object
	 */
	public static from(value: string | (WithMonth & CalendarFields)): Month {
		if(typeof value === 'string') {
			return Month.of(parseMonth(value));
		}

		if(value instanceof Month) {
			return value;
		}

		assertIsoCalendar(value);
		return Month.of(value.month);
	}

	/**
	 * Compare two months. Returns `-1` if `a` is before `b`, `0` if they are
	 * equal and `1` if `a` is after `b`. Use it to sort months, such as
	 * `months.sort(Month.compare)`.
	 *
	 * @param a
	 *   a month, or a value that `from()` accepts
	 * @param b
	 *   a month, or a value that `from()` accepts
	 */
	public static compare(
		a: string | (WithMonth & CalendarFields),
		b: string | (WithMonth & CalendarFields)
	): -1 | 0 | 1 {
		return Month.from(a).compare(Month.from(b));
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
