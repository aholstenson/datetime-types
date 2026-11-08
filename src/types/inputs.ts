import type { DurationLike } from './DurationLike.js';
import type { LocalDateLike } from './LocalDateLike.js';
import type { LocalTimeLike } from './LocalTimeLike.js';
import type { WithMonth } from './WithMonth.js';
import type { WithYear } from './WithYear.js';

/**
 * Optional calendar of an object. `Temporal` values have this property.
 * `from()` throws an error for every calendar except `iso8601`.
 */
export interface CalendarFields {
	readonly calendarId?: string;
}

/**
 * Optional parts of a time that are more precise than a millisecond.
 * `Temporal` values have these properties. `from()` throws an error if one of
 * them is not zero.
 */
export interface SubMillisecondFields {
	readonly microsecond?: number;
	readonly nanosecond?: number;
}

/**
 * Object that `LocalDate.from()` accepts, such as `{ year, month, day }` or a
 * `Temporal.PlainDate`.
 */
export type LocalDateInput = LocalDateLike & CalendarFields;

/**
 * Object that `LocalTime.from()` accepts, such as `{ hour, minute }` or a
 * `Temporal.PlainTime`. A missing field is zero.
 */
export type LocalTimeInput = Partial<LocalTimeLike> & SubMillisecondFields;

/**
 * Object that `LocalDateTime.from()` accepts, such as
 * `{ year, month, day, hour }` or a `Temporal.PlainDateTime`. A missing time
 * field is zero.
 */
export type LocalDateTimeInput = LocalDateLike
	& Partial<LocalTimeLike>
	& CalendarFields
	& SubMillisecondFields;

/**
 * Object that `Year.from()` accepts, such as `{ year }`, a `LocalDate` or a
 * `Temporal.PlainYearMonth`.
 */
export type YearInput = WithYear & CalendarFields;

/**
 * Object that `Month.from()` accepts, such as `{ month }`, a `LocalDate` or a
 * `Temporal.PlainDate`.
 */
export type MonthInput = WithMonth & CalendarFields;

/**
 * Object that `Duration.from()` accepts, such as `{ days: 3 }` or a
 * `Temporal.Duration`. It must have at least one field. A missing field is
 * zero.
 */
export type DurationInput = Partial<DurationLike> & {
	readonly microseconds?: number;
	readonly nanoseconds?: number;
};
