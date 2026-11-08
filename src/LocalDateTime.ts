import type {
	DurationInput,
	LocalDateInput,
	LocalDateLike,
	LocalDateTimeInput,
	LocalTimeInput,
	LocalTimeLike,
	TemporalNamespace,
	TemporalPlainDateTime
} from './types/index.js';

import { temporalOf } from './helpers/temporal.js';
import type { DayOfWeek } from './DayOfWeek.js';
import type { Month } from './Month.js';
import { LocalTime } from './LocalTime.js';
import { LocalDate } from './LocalDate.js';
import type { YearMonth } from './YearMonth.js';
import { noValueOf } from './helpers/noValueOf.js';
import { compareInt } from './helpers/compareInt.js';
import {
	dayOfWeek,
	dayOfYear,
	daysInMonth,
	daysInYear,
	isLeapYear
} from './helpers/calendar.js';
import { parseDateTime } from './helpers/parse.js';
import { assertIsoCalendar, assertMillisecondPrecision } from './helpers/assertFields.js';

import { Duration } from './Duration.js';
import {
	addToDate,
	assertHasSomeField,
	balanceTime,
	compareDates,
	DATE_UNITS,
	dateUntil,
	durationTimeToMilliseconds,
	floorDiv,
	isDateUnit,
	assertSafeMilliseconds,
	largestUnitOf,
	MILLISECONDS_PER_DAY,
	overflowOf,
	regulateDate,
	regulateTime,
	TIME_UNITS,
	timeFromMilliseconds,
	timeToMilliseconds,
	truncDiv
} from './helpers/arithmetic.js';
import type { DateUnit, DifferenceOptions, OverflowOptions, TimeUnit } from './types/index.js';

/**
 * Representation of a date and time without a timezone.
 */
export class LocalDateTime implements LocalDateLike, LocalTimeLike {
	// The fields are own properties, and not a hidden `LocalDate` and
	// `LocalTime`, so that a debugger or `console.log` shows all of them
	// directly.

	/**
	 * The year.
	 */
	public readonly year: number;

	/**
	 * The month, from 1 to 12.
	 */
	public readonly month: number;

	/**
	 * The day of the month, from 1.
	 */
	public readonly day: number;

	/**
	 * The hour, from 0 to 23.
	 */
	public readonly hour: number;

	/**
	 * The minute, from 0 to 59.
	 */
	public readonly minute: number;

	/**
	 * The second, from 0 to 59.
	 */
	public readonly second: number;

	/**
	 * The millisecond, from 0 to 999.
	 */
	public readonly millisecond: number;

	private constructor(date: LocalDate, time: LocalTime) {
		this.year = date.year;
		this.month = date.month;
		this.day = date.day;
		this.hour = time.hour;
		this.minute = time.minute;
		this.second = time.second;
		this.millisecond = time.millisecond;
	}

	/**
	 * The day of the week, from `DayOfWeek.MONDAY` (1) to `DayOfWeek.SUNDAY`
	 * (7).
	 */
	get dayOfWeek(): DayOfWeek {
		return dayOfWeek(this.year, this.month, this.day);
	}

	/**
	 * The day of the year, from 1 for 1 January.
	 */
	get dayOfYear() {
		return dayOfYear(this.year, this.month, this.day);
	}

	/**
	 * The number of days in the month of this date, from 28 to 31.
	 */
	get daysInMonth() {
		return daysInMonth(this.year, this.month);
	}

	/**
	 * The number of days in the year of this date, 365 or 366.
	 */
	get daysInYear() {
		return daysInYear(this.year);
	}

	/**
	 * If the year of this date is a leap year.
	 */
	get inLeapYear() {
		return isLeapYear(this.year);
	}

	/**
	 * Get the date part of this date and time.
	 */
	public toLocalDate(): LocalDate {
		return LocalDate.of(this.year, this.month, this.day);
	}

	/**
	 * Get the year and month of this date and time.
	 */
	public toYearMonth(): YearMonth {
		return this.toLocalDate().toYearMonth();
	}

	/**
	 * Get the time part of this date and time.
	 */
	public toLocalTime(): LocalTime {
		return LocalTime.of(this.hour, this.minute, this.second, this.millisecond);
	}

	/**
	 * Get if this date and time equals another value. The other value can be anything
	 * that `from()` accepts. `null` and `undefined` give `false`.
	 *
	 * @param other
	 */
	public equals(other: string | LocalDateTimeInput | null | undefined): boolean {
		if(other === null || other === undefined) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this date and time with another value. The other value can be anything
	 * that `from()` accepts. Returns `-1` if this date and time comes first, `0` if
	 * they are equal and `1` if this date and time comes last.
	 * The date is compared first and then the time.
	 *
	 * @param other
	 */
	public compare(other: string | LocalDateTimeInput): -1 | 0 | 1 {
		const o = LocalDateTime.from(other);
		return compareInt(this.year, o.year)
			|| compareInt(this.month, o.month)
			|| compareInt(this.day, o.day)
			|| compareInt(this.hour, o.hour)
			|| compareInt(this.minute, o.minute)
			|| compareInt(this.second, o.second)
			|| compareInt(this.millisecond, o.millisecond);
	}

	/**
	 * Turn this date and time into a `Date` in the local timezone of the
	 * system.
	 */
	public toDate(): Date {
		const date = this.toLocalDate().toDateAtMidnight();
		date.setHours(this.hour, this.minute, this.second, this.millisecond);
		return date;
	}

	/**
	 * Get a copy of this date and time with some fields changed, such as
	 * `value.with({ hour: 0, minute: 0 })`. See `with()` on `LocalDate` and
	 * `LocalTime` for how values out of range are changed.
	 *
	 * @param fields
	 *   the fields to change. At least one is necessary.
	 * @param options
	 */
	public with(
		fields: Partial<LocalDateLike & LocalTimeLike>,
		options?: OverflowOptions
	): LocalDateTime {
		assertHasSomeField(fields, [ 'year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond' ]);
		const overflow = overflowOf(options);
		const date = regulateDate({
			year: fields.year ?? this.year,
			month: fields.month ?? this.month,
			day: fields.day ?? this.day
		}, overflow);
		const time = regulateTime({
			hour: fields.hour ?? this.hour,
			minute: fields.minute ?? this.minute,
			second: fields.second ?? this.second,
			millisecond: fields.millisecond ?? this.millisecond
		}, overflow);
		return LocalDateTime.of(
			date.year, date.month, date.day,
			time.hour, time.minute, time.second, time.millisecond
		);
	}

	/**
	 * Add a duration to this date and time, such as
	 * `value.add({ hours: 36 })`.
	 *
	 * The time units are added first, and a result past midnight moves the
	 * date. Then the date units are added as `LocalDate.add()` does.
	 *
	 * @param duration
	 *   the duration, or a value that `Duration.from()` accepts
	 * @param options
	 */
	public add(duration: string | DurationInput, options?: OverflowOptions): LocalDateTime {
		const d = Duration.from(duration);
		const overflow = overflowOf(options);
		// Split the time of the duration into whole days and the rest, so that
		// the sum with the time of this value stays small and exact.
		const durationMilliseconds = durationTimeToMilliseconds(d);
		const durationDays = truncDiv(durationMilliseconds, MILLISECONDS_PER_DAY);
		const milliseconds = timeToMilliseconds(this)
			+ durationMilliseconds - durationDays * MILLISECONDS_PER_DAY;
		const extraDays = floorDiv(milliseconds, MILLISECONDS_PER_DAY);
		const time = timeFromMilliseconds(milliseconds - extraDays * MILLISECONDS_PER_DAY);
		const date = addToDate(this, {
			years: d.years,
			months: d.months,
			weeks: d.weeks,
			days: d.days + durationDays + extraDays
		}, overflow);
		return LocalDateTime.of(
			date.year, date.month, date.day,
			time.hour, time.minute, time.second, time.millisecond
		);
	}

	/**
	 * Subtract a duration from this date and time. This is the same as adding
	 * the negated duration.
	 *
	 * @param duration
	 *   the duration, or a value that `Duration.from()` accepts
	 * @param options
	 */
	public subtract(duration: string | DurationInput, options?: OverflowOptions): LocalDateTime {
		return this.add(Duration.from(duration).negated(), options);
	}

	/**
	 * Get the duration from this date and time until another date and time.
	 * The result is negative if the other value is before this value.
	 *
	 * The result has days and no larger units. Use `largestUnit` to get a
	 * larger unit, such as `months`, or a smaller unit, such as `hours`.
	 *
	 * @param other
	 *   the other value, or a value that `from()` accepts
	 * @param options
	 */
	public until(
		other: string | LocalDateTimeInput,
		options?: DifferenceOptions<DateUnit | TimeUnit>
	): Duration {
		const unit = largestUnitOf<DateUnit | TimeUnit>(options, [ ...DATE_UNITS, ...TIME_UNITS ], 'days');
		const o = LocalDateTime.from(other);

		// If the time goes the other way from the date, use one day less and
		// add that day to the time.
		let milliseconds = timeToMilliseconds(o) - timeToMilliseconds(this);
		const timeSign = Math.sign(milliseconds);
		let endDate: LocalDateLike = o;
		if(timeSign !== 0 && timeSign === compareDates(this, o)) {
			endDate = addToDate(o, { years: 0, months: 0, weeks: 0, days: timeSign }, 'constrain');
			milliseconds -= timeSign * MILLISECONDS_PER_DAY;
		}

		const date = dateUntil(this, endDate, isDateUnit(unit) ? unit : 'days');
		if(isDateUnit(unit)) {
			return Duration.from({ ...date, ...balanceTime(milliseconds, 'hours') });
		}

		milliseconds += date.days * MILLISECONDS_PER_DAY;
		assertSafeMilliseconds(milliseconds);
		return Duration.from(balanceTime(milliseconds, unit));
	}

	/**
	 * Get the duration from another date and time until this date and time.
	 * See `until()` for the options.
	 *
	 * @param other
	 *   the other value, or a value that `from()` accepts
	 * @param options
	 */
	public since(
		other: string | LocalDateTimeInput,
		options?: DifferenceOptions<DateUnit | TimeUnit>
	): Duration {
		return this.until(other, options).negated();
	}

	/**
	 * Convert this value into a `Temporal.PlainDateTime`.
	 *
	 * Without an argument this uses the global `Temporal`. Give the `Temporal`
	 * object of a polyfill where there is no global `Temporal`, such as in
	 * older browsers. Throws a `TypeError` if `Temporal` is not available.
	 *
	 * @param temporal
	 *   the `Temporal` object to use, such as the export of a polyfill
	 */
	public toTemporal(): TemporalPlainDateTime;
	public toTemporal<T extends TemporalNamespace<'PlainDateTime'>>(temporal: T): T['PlainDateTime']['prototype'];
	public toTemporal(temporal?: TemporalNamespace<'PlainDateTime'>): unknown {
		return temporalOf(temporal).PlainDateTime.from({
			year: this.year,
			month: this.month,
			day: this.day,
			hour: this.hour,
			minute: this.minute,
			second: this.second,
			millisecond: this.millisecond
		});
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
		return noValueOf('LocalDateTime');
	}

	/**
	 * Turn this date and time into an ISO 8601 string, such as
	 * `2024-03-01T08:30:00`.
	 */
	public toString() {
		return this.toLocalDate().toString() + 'T' + this.toLocalTime().toString();
	}

	/**
	 * Create a local date and time. Will throw an error if a value is out of
	 * range.
	 *
	 * @param year
	 *   the year
	 * @param month
	 *   the month, from 1 to 12, or a `Month`
	 * @param day
	 *   the day of the month, from 1
	 * @param hour
	 *   the hour, from 0 to 23
	 * @param minute
	 *   the minute, from 0 to 59
	 * @param second
	 *   the second, from 0 to 59
	 * @param millisecond
	 *   the millisecond, from 0 to 999
	 */
	public static of(
		year: number,
		month: Month | number,
		day: number,
		hour: number = 0,
		minute: number = 0,
		second: number = 0,
		millisecond: number = 0
	): LocalDateTime {
		return new LocalDateTime(
			LocalDate.of(year, month, day),
			LocalTime.of(hour, minute, second, millisecond)
		);
	}

	/**
	 * Create a local date and time from an ISO 8601 string or from an
	 * object.
	 *
	 * The string can be in the form that `toString()` gives, such as
	 * `2024-03-01T08:30:00`. The seconds and the fraction are optional.
	 *
	 * The object must have numeric `year`, `month` and `day` properties, and
	 * can have numeric `hour`, `minute`, `second` and `millisecond`
	 * properties. A missing time property is zero. This includes a
	 * `LocalDateTime` and a `Temporal.PlainDateTime`.
	 *
	 * An object with a calendar other than `iso8601` gives an error. A time
	 * that is more precise than a millisecond gives an error.
	 *
	 * @param value
	 *   the string or the object
	 */
	public static from(value: string | LocalDateTimeInput): LocalDateTime {
		if(typeof value === 'string') {
			const parts = parseDateTime(value);
			return LocalDateTime.of(
				parts.year,
				parts.month,
				parts.day,
				parts.hour,
				parts.minute,
				parts.second,
				parts.millisecond
			);
		}

		if(value instanceof LocalDateTime) {
			return value;
		}

		assertIsoCalendar(value);
		assertMillisecondPrecision(value);
		return LocalDateTime.of(
			value.year,
			value.month,
			value.day,
			value.hour ?? 0,
			value.minute ?? 0,
			value.second ?? 0,
			value.millisecond ?? 0
		);
	}

	/**
	 * Compare two dates and times. Returns `-1` if `a` is before `b`, `0` if
	 * they are equal and `1` if `a` is after `b`. Use it to sort values, such
	 * as `values.sort(LocalDateTime.compare)`.
	 *
	 * @param a
	 *   a date and time, or a value that `from()` accepts
	 * @param b
	 *   a date and time, or a value that `from()` accepts
	 */
	public static compare(
		a: string | LocalDateTimeInput,
		b: string | LocalDateTimeInput
	): -1 | 0 | 1 {
		return LocalDateTime.from(a).compare(LocalDateTime.from(b));
	}

	/**
	 * Create a local date and time from a date and a time.
	 *
	 * @param date
	 *   the date, or a value that `LocalDate.from()` accepts
	 * @param time
	 *   the time, or a value that `LocalTime.from()` accepts
	 */
	public static fromDateAndTime(
		date: string | LocalDateInput,
		time: string | LocalTimeInput
	): LocalDateTime {
		return new LocalDateTime(LocalDate.from(date), LocalTime.from(time));
	}

	/**
	 * Get the current date and time in the local timezone of the system.
	 */
	public static now(): LocalDateTime {
		return LocalDateTime.fromDate(new Date());
	}

	/**
	 * Create a new local date time from the specified Date object.
	 *
	 * @param date
	 */
	public static fromDate(date: Date) {
		return LocalDateTime.fromDateAndTime(
			LocalDate.fromDate(date),
			LocalTime.fromDate(date)
		);
	}
}
