/**
 * Representation of an interval.
 */
export class Interval<T> {
	/**
	 * Start of the interval, inclusive.
	 */
	public readonly start: T | null;

	/**
	 * End of the interval, exclusive.
	 */
	public readonly end: T | null;

	private constructor(start: T | null, end: T | null) {
		this.start = start;
		this.end = end;
	}

	/**
	 * Create a new interval between the two times.
	 *
	 * @param startInclusive
	 * @param endExclusive
	 */
	public static between<T>(startInclusive: T | null, endExclusive: T | null) {
		return new Interval(startInclusive, endExclusive);
	}

	/**
	 * Create an interval from an unbounded start until (exclusive) the
	 * specified time.
	 *
	 * @param endExclusive
	 */
	public static until<T>(endExclusive: T) {
		return new Interval(null, endExclusive);
	}

	/**
	 * Create an interval that starts at the given time but has an unbounded
	 * end.
	 *
	 * @param startInclusive
	 */
	public static from<T>(startInclusive: T) {
		return new Interval(startInclusive, null);
	}
}
