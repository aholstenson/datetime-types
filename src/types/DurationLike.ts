/**
 * Object with all the fields of a duration.
 */
export interface DurationLike {
	readonly years: number;
	readonly months: number;
	readonly weeks: number;
	readonly days: number;
	readonly hours: number;
	readonly minutes: number;
	readonly seconds: number;
	readonly milliseconds: number;
}
