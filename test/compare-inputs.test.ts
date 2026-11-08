/*
 * Instance `compare` and `equals` accept the same values as `from()`, as in
 * `Temporal`.
 */
import { LocalDate } from '../src/LocalDate.js';
import { LocalDateTime } from '../src/LocalDateTime.js';
import { LocalTime } from '../src/LocalTime.js';
import { Month } from '../src/Month.js';
import { Year } from '../src/Year.js';

describe('compare and equals with other inputs', () => {
	it('accept strings', () => {
		expect(LocalDate.of(2024, 3, 1).equals('2024-03-01')).toBe(true);
		expect(LocalDate.of(2024, 3, 1).compare('2024-03-02')).toEqual(-1);
		expect(LocalTime.of(8, 30).equals('08:30')).toBe(true);
		expect(LocalTime.of(8, 30).compare('08:29:59.999')).toEqual(1);
		expect(LocalDateTime.of(2024, 3, 1, 8).equals('2024-03-01T08:00')).toBe(true);
		expect(LocalDateTime.of(2024, 3, 1, 8).compare('2024-03-01T08:00:00.001')).toEqual(-1);
		expect(Year.of(2024).equals('2024')).toBe(true);
		expect(Month.MARCH.compare('--04')).toEqual(-1);
	});

	it('accept objects with fields', () => {
		expect(LocalDate.of(2024, 3, 1).equals({ year: 2024, month: 3, day: 1 })).toBe(true);
		expect(LocalTime.of(8).equals({ hour: 8 })).toBe(true);
		expect(LocalDateTime.of(2024, 3, 1).equals({ year: 2024, month: 3, day: 1 })).toBe(true);
	});

	it('compare only the date of a LocalDateTime with a LocalDate', () => {
		const dateTime = LocalDateTime.of(2024, 3, 1, 8);
		expect(LocalDate.of(2024, 3, 1).equals(dateTime)).toBe(true);
		expect(LocalTime.of(8).equals(dateTime)).toBe(true);
	});

	it('give false for null and undefined', () => {
		expect(LocalDate.of(2024, 3, 1).equals(null)).toBe(false);
		expect(LocalTime.of(8).equals(undefined)).toBe(false);
	});

	it('throw for a value that from() does not accept', () => {
		expect(() => LocalDate.of(2024, 3, 1).equals('2024-02-30')).toThrow(RangeError);
		expect(() => LocalDate.of(2024, 3, 1).compare({ year: 2024, month: 3, day: 1, calendarId: 'gregory' }))
			.toThrow(RangeError);
	});
});
