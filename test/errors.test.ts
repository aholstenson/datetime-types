/*
 * The errors are the same kind that `Temporal` throws: a `TypeError` for a
 * value of the wrong type and a `RangeError` for a value out of range or a
 * string that can not be read.
 */
import { DateInterval } from '../src/DateInterval.js';
import { Interval } from '../src/Interval.js';
import { LocalDate } from '../src/LocalDate.js';
import { LocalDateTime } from '../src/LocalDateTime.js';
import { LocalTime } from '../src/LocalTime.js';
import { Month } from '../src/Month.js';
import { Year } from '../src/Year.js';

describe('Errors', () => {
	it('throw TypeError for a value that is not a number', () => {
		expect(() => LocalDate.of('2024' as any, 1, 1)).toThrow(TypeError);
		expect(() => LocalDate.of(2024, 1, null as any)).toThrow(TypeError);
		expect(() => LocalTime.of(undefined, '5' as any)).toThrow(TypeError);
		expect(() => Month.of('3' as any)).toThrow(TypeError);
		expect(() => Year.of(undefined as any)).toThrow(TypeError);
		expect(() => LocalDate.from({ year: 2024, month: 1 } as any)).toThrow(TypeError);
	});

	it('throw RangeError for a number out of range', () => {
		expect(() => LocalDate.of(2024, 13, 1)).toThrow(RangeError);
		expect(() => LocalDate.of(2023, 2, 29)).toThrow(RangeError);
		expect(() => LocalDate.of(2024, 1, 1.5)).toThrow(RangeError);
		expect(() => LocalTime.of(24)).toThrow(RangeError);
		expect(() => LocalDateTime.of(2024, 1, 1, 0, 0, 0, 1000)).toThrow(RangeError);
		expect(() => Month.of(0)).toThrow(RangeError);
		expect(() => Year.of(Infinity)).toThrow(RangeError);
	});

	it('throw RangeError for a string that can not be read', () => {
		expect(() => LocalDate.from('2024-3-1')).toThrow(RangeError);
		expect(() => LocalTime.from('08:30:00.0000001')).toThrow(RangeError);
		expect(() => DateInterval.from('2024-03-01')).toThrow(RangeError);
	});

	it('throw RangeError for a calendar other than iso8601', () => {
		expect(() => LocalDate.from({ year: 2024, month: 1, day: 1, calendarId: 'gregory' }))
			.toThrow(RangeError);
	});

	it('throw RangeError when the start of an interval is after the end', () => {
		expect(() => Interval.between(LocalTime.of(9), LocalTime.of(8))).toThrow(RangeError);
	});

	it('name the field and the value in the message', () => {
		expect(() => LocalDate.of(2023, 2, 29)).toThrow('day must be between 1 and 28, got 29');
		expect(() => LocalTime.of(8, 1.5)).toThrow('minute must be an integer, got 1.5');
		expect(() => LocalTime.of(8, '5' as any)).toThrow('minute must be a number, got "5"');
		expect(() => Year.of(null as any)).toThrow('year must be a number, got null');
		expect(() => Month.of({} as any)).toThrow('month must be a number, got object');
	});
});
