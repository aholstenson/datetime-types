import type { LocalDateLike } from './LocalDateLike.js';
import type { LocalTimeLike } from './LocalTimeLike.js';

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
