/**
 * Day of the week. The numbers follow ISO 8601 and `Temporal`: Monday is 1
 * and Sunday is 7. This is not the same as `Date.getDay()`, where Sunday is 0.
 */
export enum DayOfWeek {
	/**
	 * Monday.
	 */
	MONDAY = 1,

	/**
	 * Tuesday.
	 */
	TUESDAY = 2,

	/**
	 * Wednesday.
	 */
	WEDNESDAY = 3,

	/**
	 * Thursday.
	 */
	THURSDAY = 4,

	/**
	 * Friday.
	 */
	FRIDAY = 5,

	/**
	 * Saturday.
	 */
	SATURDAY = 6,

	/**
	 * Sunday.
	 */
	SUNDAY = 7
}
