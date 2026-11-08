import type { DurationLike } from './DurationLike.js';
import type { LocalDateLike } from './LocalDateLike.js';
import type { LocalTimeLike } from './LocalTimeLike.js';
import type { WithMonth } from './WithMonth.js';
import type { WithYear } from './WithYear.js';

/**
 * The type of a `Temporal` class instance, such as `Temporal.PlainDate`, if
 * the project has types for a global `Temporal`. Otherwise it is `Fallback`.
 *
 * TypeScript has types for `Temporal` in newer versions of its `lib`, and
 * polyfills can add them. Without them, `toTemporal()` gives a type with
 * only the fields.
 */
export type TemporalInstance<Name extends string, Fallback> =
	typeof globalThis extends { Temporal: { [K in Name]: { prototype: infer R } } }
		? R
		: Fallback;

/**
 * A `Temporal` namespace, such as the global `Temporal` or the `Temporal`
 * export of a polyfill, that has the class `Name`.
 */
export type TemporalNamespace<Name extends string> = {
	readonly [K in Name]: {
		readonly prototype: unknown;
		from(value: never): unknown;
	};
};

/**
 * The fields that every `Temporal` value has.
 */
interface TemporalValueFields {
	toString(): string;
	toJSON(): string;
}

/**
 * `Temporal.PlainDate`, or its fields if there are no types for `Temporal`.
 */
export type TemporalPlainDate = TemporalInstance<
	'PlainDate',
	LocalDateLike & TemporalValueFields & { readonly calendarId: string }
>;

/**
 * `Temporal.PlainTime`, or its fields if there are no types for `Temporal`.
 */
export type TemporalPlainTime = TemporalInstance<
	'PlainTime',
	LocalTimeLike & TemporalValueFields & { readonly microsecond: number, readonly nanosecond: number }
>;

/**
 * `Temporal.PlainDateTime`, or its fields if there are no types for
 * `Temporal`.
 */
export type TemporalPlainDateTime = TemporalInstance<
	'PlainDateTime',
	LocalDateLike & LocalTimeLike & TemporalValueFields & {
		readonly calendarId: string,
		readonly microsecond: number,
		readonly nanosecond: number
	}
>;

/**
 * `Temporal.PlainYearMonth`, or its fields if there are no types for
 * `Temporal`.
 */
export type TemporalPlainYearMonth = TemporalInstance<
	'PlainYearMonth',
	WithYear & WithMonth & TemporalValueFields & { readonly calendarId: string }
>;

/**
 * `Temporal.Duration`, or its fields if there are no types for `Temporal`.
 */
export type TemporalDuration = TemporalInstance<
	'Duration',
	DurationLike & TemporalValueFields & { readonly microseconds: number, readonly nanoseconds: number }
>;
