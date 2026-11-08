import type {
	DifferenceOptions,
	DurationInput,
	OverflowOptions,
	TemporalNamespace,
	TemporalPlainYearMonth,
	WithMonth,
	WithYear,
	YearMonthInput,
	YearMonthUnit
} from './types/index.js';

import { temporalOf } from './helpers/temporal.js';
import { assertInt, assertIntInRange } from './helpers/assertInt.js';
import { assertIsoCalendar } from './helpers/assertFields.js';
import { compareInt } from './helpers/compareInt.js';
import { formatYear } from './helpers/formatYear.js';
import { noValueOf } from './helpers/noValueOf.js';
import { parseYearMonth } from './helpers/parse.js';
import { zeroPadInt } from './helpers/zeroPadInt.js';
import { daysInMonth, daysInYear, isLeapYear } from './helpers/calendar.js';
import {
	assertHasSomeField,
	balanceYearMonth,
	dateUntil,
	largestUnitOf,
	overflowOf,
	regulateDate
} from './helpers/arithmetic.js';

import { Duration } from './Duration.js';
import { LocalDate } from './LocalDate.js';
import { Month } from './Month.js';

const UNITS: readonly YearMonthUnit[] = [ 'years', 'months' ];

/**
 * A month in a specific year, such as March 2024. Use it for values such as
 * a billing period or a month in a report. It is the same as
 * `Temporal.PlainYearMonth`.
 */
export class YearMonth implements WithYear, WithMonth {
	/**
	 * The year.
	 */
	public readonly year: number;

	/**
	 * The month, from 1 to 12.
	 */
	public readonly month: number;

	private constructor(year: number, month: number) {
		this.year = year;
		this.month = month;
	}

	/**
	 * The number of days in this month, from 28 to 31.
	 */
	get daysInMonth() {
		return daysInMonth(this.year, this.month);
	}

	/**
	 * The number of days in the year, 365 or 366.
	 */
	get daysInYear() {
		return daysInYear(this.year);
	}

	/**
	 * If the year is a leap year.
	 */
	get inLeapYear() {
		return isLeapYear(this.year);
	}

	/**
	 * Get a date in this month.
	 *
	 * @param day
	 *   the day of the month. A day after the last day of the month becomes
	 *   the last day, unless `overflow` is `reject`.
	 * @param options
	 */
	public toLocalDate(day: number, options?: OverflowOptions): LocalDate {
		const date = regulateDate({ year: this.year, month: this.month, day }, overflowOf(options));
		return LocalDate.of(date.year, date.month, date.day);
	}

	/**
	 * Get a copy of this value with the year or the month changed. A month
	 * after 12 becomes 12, unless `overflow` is `reject`.
	 *
	 * @param fields
	 *   the fields to change. At least one is necessary.
	 * @param options
	 */
	public with(fields: Partial<WithYear & WithMonth>, options?: OverflowOptions): YearMonth {
		assertHasSomeField(fields, [ 'year', 'month' ]);
		const date = regulateDate({
			year: fields.year ?? this.year,
			month: fields.month ?? this.month,
			day: 1
		}, overflowOf(options));
		return YearMonth.of(date.year, date.month);
	}

	/**
	 * Add years and months, such as `value.add({ months: 3 })`. A duration
	 * with weeks, days or smaller units throws a `RangeError`, as in
	 * `Temporal`.
	 *
	 * @param duration
	 *   the duration, or a value that `Duration.from()` accepts
	 */
	public add(duration: string | DurationInput): YearMonth {
		const d = Duration.from(duration);
		if(d.with({ years: 0, months: 0 }).sign !== 0) {
			throw new RangeError('A YearMonth can only add years and months');
		}

		const result = balanceYearMonth(this.year + d.years, this.month + d.months);
		return YearMonth.of(result.year, result.month);
	}

	/**
	 * Subtract years and months. This is the same as adding the negated
	 * duration.
	 *
	 * @param duration
	 *   the duration, or a value that `Duration.from()` accepts
	 */
	public subtract(duration: string | DurationInput): YearMonth {
		return this.add(Duration.from(duration).negated());
	}

	/**
	 * Get the duration from this month until another month. The result has
	 * years and months, or only months with `largestUnit: 'months'`.
	 *
	 * @param other
	 *   the other month, or a value that `from()` accepts
	 * @param options
	 */
	public until(other: string | YearMonthInput, options?: DifferenceOptions<YearMonthUnit>): Duration {
		const unit = largestUnitOf(options, UNITS, 'years');
		const o = YearMonth.from(other);
		const result = dateUntil(
			{ year: this.year, month: this.month, day: 1 },
			{ year: o.year, month: o.month, day: 1 },
			unit
		);
		return Duration.from({ years: result.years, months: result.months });
	}

	/**
	 * Get the duration from another month until this month. See `until()`
	 * for the options.
	 *
	 * @param other
	 *   the other month, or a value that `from()` accepts
	 * @param options
	 */
	public since(other: string | YearMonthInput, options?: DifferenceOptions<YearMonthUnit>): Duration {
		return this.until(other, options).negated();
	}

	/**
	 * Get if this value equals another value. The other value can be anything
	 * that `from()` accepts. `null` and `undefined` give `false`.
	 *
	 * @param other
	 */
	public equals(other: string | YearMonthInput | null | undefined): boolean {
		if(other === null || other === undefined) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this value with another value. The other value can be anything
	 * that `from()` accepts. Returns `-1` if this value comes first, `0` if
	 * they are equal and `1` if this value comes last.
	 *
	 * @param other
	 */
	public compare(other: string | YearMonthInput): -1 | 0 | 1 {
		const o = YearMonth.from(other);
		return compareInt(this.year, o.year) || compareInt(this.month, o.month);
	}

	/**
	 * Convert this value into a `Temporal.PlainYearMonth`.
	 *
	 * Without an argument this uses the global `Temporal`. Give the `Temporal`
	 * object of a polyfill where there is no global `Temporal`, such as in
	 * older browsers. Throws a `TypeError` if `Temporal` is not available.
	 *
	 * @param temporal
	 *   the `Temporal` object to use, such as the export of a polyfill
	 */
	public toTemporal(): TemporalPlainYearMonth;
	public toTemporal<T extends TemporalNamespace<'PlainYearMonth'>>(temporal: T): T['PlainYearMonth']['prototype'];
	public toTemporal(temporal?: TemporalNamespace<'PlainYearMonth'>): unknown {
		return temporalOf(temporal).PlainYearMonth.from({ year: this.year, month: this.month });
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
		return noValueOf('YearMonth');
	}

	/**
	 * Turn this value into an ISO 8601 string, such as `2024-03`. A year
	 * outside 0 to 9999 has six digits and a sign, such as `+020240-03`.
	 */
	public toString() {
		return formatYear(this.year) + '-' + zeroPadInt(this.month, 2);
	}

	/**
	 * Create a year and month. Will throw an error if the month is not from
	 * 1 to 12.
	 *
	 * @param year
	 *   the year
	 * @param month
	 *   the month, from 1 to 12, or a `Month`
	 */
	public static of(year: number, month: Month | number): YearMonth {
		return new YearMonth(
			assertInt(year, 'year'),
			assertIntInRange(month instanceof Month ? month.month : month, 'month', 1, 12)
		);
	}

	/**
	 * Create a year and month from an ISO 8601 string or from an object.
	 *
	 * The string can be in the form that `toString()` gives, such as
	 * `2024-03` or `+020240-03`.
	 *
	 * The object must have numeric `year` and `month` properties. This
	 * includes a `LocalDate`, a `LocalDateTime` and a
	 * `Temporal.PlainYearMonth`. An object with a calendar other than
	 * `iso8601` gives an error.
	 *
	 * @param value
	 *   the string or the object
	 */
	public static from(value: string | YearMonthInput): YearMonth {
		if(typeof value === 'string') {
			const parts = parseYearMonth(value);
			return YearMonth.of(parts.year, parts.month);
		}

		if(value instanceof YearMonth) {
			return value;
		}

		assertIsoCalendar(value);
		return YearMonth.of(value.year, value.month);
	}

	/**
	 * Compare two values. Returns `-1` if `a` is before `b`, `0` if they are
	 * equal and `1` if `a` is after `b`. Use it to sort values, such as
	 * `values.sort(YearMonth.compare)`.
	 *
	 * @param a
	 *   a value, or a value that `from()` accepts
	 * @param b
	 *   a value, or a value that `from()` accepts
	 */
	public static compare(a: string | YearMonthInput, b: string | YearMonthInput): -1 | 0 | 1 {
		return YearMonth.from(a).compare(b);
	}

	/**
	 * Get the current year and month in the local timezone of the system.
	 */
	public static now(): YearMonth {
		return YearMonth.fromDate(new Date());
	}

	/**
	 * Create a year and month from a `Date`, in the local timezone of the
	 * system.
	 *
	 * @param date
	 */
	public static fromDate(date: Date): YearMonth {
		return YearMonth.of(date.getFullYear(), date.getMonth() + 1);
	}
}
