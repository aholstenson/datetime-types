/*
 * Compare this library with the built-in `Temporal`. Node 26 and later have
 * `Temporal`. On older versions of Node these tests are skipped.
 */
import { LocalDate } from '../src/LocalDate.js';
import { LocalDateTime } from '../src/LocalDateTime.js';
import { LocalTime } from '../src/LocalTime.js';
import { Year } from '../src/Year.js';

const Temporal = (globalThis as any).Temporal;

const YEARS = [
	-271820, -2000, -401, -400, -100, -5, -4, -1, 0, 1, 4, 99, 100, 400, 1582,
	1900, 1969, 1970, 1999, 2000, 2023, 2024, 9999, 10000, 20240, 275759
];

function sampleDates() {
	const result: LocalDate[] = [];
	for(const year of YEARS) {
		for(let month = 1; month <= 12; month++) {
			const last = LocalDate.of(year, month, 1).daysInMonth;
			for(const day of new Set([ 1, 2, 15, 28, last ])) {
				result.push(LocalDate.of(year, month, day));
			}
		}
	}
	return result;
}

function sampleTimes() {
	const result: LocalTime[] = [];
	for(const hour of [ 0, 1, 12, 23 ]) {
		for(const minute of [ 0, 5, 59 ]) {
			for(const second of [ 0, 9, 59 ]) {
				for(const millisecond of [ 0, 1, 10, 100, 120, 500, 999 ]) {
					result.push(LocalTime.of(hour, minute, second, millisecond));
				}
			}
		}
	}
	return result;
}

describe.skipIf(! Temporal)('Temporal compatibility', () => {
	const dates = sampleDates();
	const times = sampleTimes();

	it('LocalDate has the same fields and string as Temporal.PlainDate', () => {
		for(const date of dates) {
			const plain = Temporal.PlainDate.from(date);

			expect(date.toString()).toEqual(plain.toString());
			expect(JSON.stringify(date)).toEqual(JSON.stringify(plain));
			expect(date.dayOfWeek).toEqual(plain.dayOfWeek);
			expect(date.dayOfYear).toEqual(plain.dayOfYear);
			expect(date.daysInMonth).toEqual(plain.daysInMonth);
			expect(date.daysInYear).toEqual(plain.daysInYear);
			expect(date.inLeapYear).toEqual(plain.inLeapYear);
		}
	});

	it('LocalDate and Temporal.PlainDate convert in both directions', () => {
		for(const date of dates) {
			const plain = Temporal.PlainDate.from(date.toString());

			expect(LocalDate.from(plain).equals(date)).toBe(true);
			expect(LocalDate.from(plain.toString()).equals(date)).toBe(true);
			expect(Temporal.PlainDate.from(date).equals(plain)).toBe(true);
		}
	});

	it('LocalDate.compare gives the same order as Temporal.PlainDate.compare', () => {
		for(let i = 1; i < dates.length; i++) {
			const a = dates[i - 1];
			const b = dates[i];
			const expected = Temporal.PlainDate.compare(a, b);

			expect(LocalDate.compare(a, b)).toEqual(expected);
			expect(LocalDate.compare(b, a)).toEqual(-expected);
		}
	});

	it('LocalTime has the same string as Temporal.PlainTime', () => {
		for(const time of times) {
			const plain = Temporal.PlainTime.from(time);

			expect(time.toString()).toEqual(plain.toString());
			expect(JSON.stringify(time)).toEqual(JSON.stringify(plain));
			expect(LocalTime.from(plain).equals(time)).toBe(true);
			expect(LocalTime.from(plain.toString()).equals(time)).toBe(true);
		}
	});

	it('LocalTime.from rejects a Temporal.PlainTime with microseconds or nanoseconds', () => {
		expect(() => LocalTime.from(Temporal.PlainTime.from('08:30:00.000001'))).toThrow();
		expect(() => LocalTime.from(Temporal.PlainTime.from('08:30:00.000000001'))).toThrow();
		expect(() => LocalTime.from(Temporal.PlainTime.from('08:30:00.123456'))).toThrow();
	});

	it('LocalDateTime has the same string as Temporal.PlainDateTime', () => {
		const date = LocalDate.of(2024, 3, 1);
		for(const time of times) {
			const value = LocalDateTime.fromDateAndTime(date, time);
			const plain = Temporal.PlainDateTime.from(value);

			expect(value.toString()).toEqual(plain.toString());
			expect(LocalDateTime.from(plain).equals(value)).toBe(true);
			expect(LocalDateTime.from(plain.toString()).equals(value)).toBe(true);
		}

		for(const other of dates) {
			const value = other.toLocalDateTime(LocalTime.of(12, 30, 15, 250));
			expect(value.toString()).toEqual(Temporal.PlainDateTime.from(value).toString());
		}
	});

	it('LocalDate.from rejects a Temporal.PlainDate in another calendar', () => {
		const hebrew = Temporal.PlainDate.from('2024-03-01').withCalendar('hebrew');
		expect(() => LocalDate.from(hebrew)).toThrow();
	});

	it('Year has the same year string and leap years as Temporal.PlainYearMonth', () => {
		for(const value of YEARS) {
			const year = Year.of(value);
			const plain = Temporal.PlainYearMonth.from({ year: value, month: 6 });

			expect(year.toString()).toEqual(plain.toString().slice(0, -3));
			expect(year.inLeapYear).toEqual(plain.inLeapYear);
			expect(year.daysInYear).toEqual(plain.daysInYear);
			expect(Year.from(plain).equals(year)).toBe(true);
		}
	});
});
