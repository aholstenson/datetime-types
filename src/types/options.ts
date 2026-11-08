/**
 * What to do with a value that is out of range, such as 31 February.
 * `constrain` changes it to the nearest valid value. `reject` throws a
 * `RangeError`.
 */
export type Overflow = 'constrain' | 'reject';

/**
 * Options for `with()`, `add()` and `subtract()`.
 */
export interface OverflowOptions {
	/**
	 * What to do with a value that is out of range, such as 31 February.
	 * `constrain` (the default) changes it to the nearest valid value, such
	 * as 29 February. `reject` throws a `RangeError`.
	 */
	readonly overflow?: Overflow;
}

/**
 * Units of a date, from the largest to the smallest.
 */
export type DateUnit = 'years' | 'months' | 'weeks' | 'days';

/**
 * Units of a year and a month, from the largest to the smallest.
 */
export type YearMonthUnit = 'years' | 'months';

/**
 * Units of a time, from the largest to the smallest.
 */
export type TimeUnit = 'hours' | 'minutes' | 'seconds' | 'milliseconds';

/**
 * A unit, in plural or singular form, such as `days` or `day`.
 */
export type UnitInput<U extends string> = U | (U extends `${infer S}s` ? S : never);

/**
 * Options for `until()` and `since()`.
 */
export interface DifferenceOptions<U extends string> {
	/**
	 * The largest unit of the result. `auto` uses the default unit of the
	 * type.
	 */
	readonly largestUnit?: UnitInput<U> | 'auto';
}
