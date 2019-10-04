import { LocalDate } from './LocalDate';
import { compareNullable } from './helpers/compareNullable';

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
	 * Get if this interval equals another interval.
	 *
	 * @param other
	 */
	public equals(other: DateInterval | null | undefined) {
		if(! other) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this interval with another interval;
	 *
	 * @param other
	 */
	public compare(other: DateInterval) {
		const s = compareNullable(this.start, other.start);
		if(s !== 0) return s;

		return compareNullable(this.end, other.end);
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
