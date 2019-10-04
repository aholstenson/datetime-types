import { LocalDate } from './LocalDate';

/**
 * Representation of an interval between two dates, where both dates are
 * inclusive.
 */
export class DateInterval {
	/**
	 * Start of the interval, inclusive.
	 */
	public readonly start: LocalDate | null;

	/**
	 * End of the interval, inclusive.
	 */
	public readonly end: LocalDate | null;

	private constructor(start: LocalDate | null, end: LocalDate | null) {
		this.start = start;
		this.end = end;
	}

	/**
	 * Create a new interval between the two dates.
	 *
	 * @param startInclusive
	 * @param endInclusive
	 */
	public static between<T>(startInclusive: LocalDate | null, endInclusive: LocalDate | null) {
		return new DateInterval(startInclusive, endInclusive);
	}

	/**
	 * Create an interval from an unbounded start until (inclusive) the
	 * specified date.
	 *
	 * @param endInclusive
	 */
	public static until<T>(endInclusive: LocalDate) {
		return new DateInterval(null, endInclusive);
	}

	/**
	 * Create an interval that starts at the given date but has an unbounded
	 * end.
	 *
	 * @param startInclusive
	 */
	public static from<T>(startInclusive: LocalDate) {
		return new DateInterval(startInclusive, null);
	}
}
