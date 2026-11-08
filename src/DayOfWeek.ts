/**
 * Day of the week. The numbers follow ISO 8601 and `Temporal`: Monday is 1
 * and Sunday is 7. This is not the same as `Date.getDay()`, where Sunday is 0.
 *
 * `DayOfWeek` is a frozen object and not a TypeScript `enum`, so it works
 * with `erasableSyntaxOnly` and with tools that only remove types. The type
 * `DayOfWeek` is the union of the numbers, from 1 to 7.
 */
export const DayOfWeek = Object.freeze({
	/**
	 * Monday.
	 */
	MONDAY: 1,

	/**
	 * Tuesday.
	 */
	TUESDAY: 2,

	/**
	 * Wednesday.
	 */
	WEDNESDAY: 3,

	/**
	 * Thursday.
	 */
	THURSDAY: 4,

	/**
	 * Friday.
	 */
	FRIDAY: 5,

	/**
	 * Saturday.
	 */
	SATURDAY: 6,

	/**
	 * Sunday.
	 */
	SUNDAY: 7
} as const);

/**
 * Number of a day of the week, from `DayOfWeek.MONDAY` (1) to
 * `DayOfWeek.SUNDAY` (7).
 */
export type DayOfWeek = typeof DayOfWeek[keyof typeof DayOfWeek];
