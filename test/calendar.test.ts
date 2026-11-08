import { DayOfWeek } from '../src/DayOfWeek.js';
import { LocalDate } from '../src/LocalDate.js';
import { LocalDateTime } from '../src/LocalDateTime.js';
import { LocalTime } from '../src/LocalTime.js';
import { Year } from '../src/Year.js';

describe('LocalDate calendar fields', () => {
	it.each([
		[ '1970-01-01', DayOfWeek.THURSDAY ],
		[ '2024-03-01', DayOfWeek.FRIDAY ],
		[ '2024-03-03', DayOfWeek.SUNDAY ],
		[ '2024-03-04', DayOfWeek.MONDAY ],
		[ '2000-02-29', DayOfWeek.TUESDAY ],
		[ '1969-12-31', DayOfWeek.WEDNESDAY ],
		[ '0000-01-01', DayOfWeek.SATURDAY ],
		[ '-000001-12-31', DayOfWeek.FRIDAY ]
	])('dayOfWeek of %s', (text, expected) => {
		expect(LocalDate.from(text).dayOfWeek).toEqual(expected);
	});

	it.each([
		[ '2024-01-01', 1 ],
		[ '2024-02-29', 60 ],
		[ '2024-03-01', 61 ],
		[ '2023-03-01', 60 ],
		[ '2024-12-31', 366 ],
		[ '2023-12-31', 365 ]
	])('dayOfYear of %s', (text, expected) => {
		expect(LocalDate.from(text).dayOfYear).toEqual(expected);
	});

	it.each([
		[ '2024-02-10', 29 ],
		[ '2023-02-10', 28 ],
		[ '1900-02-10', 28 ],
		[ '2000-02-10', 29 ],
		[ '2024-04-10', 30 ],
		[ '2024-12-10', 31 ]
	])('daysInMonth of %s', (text, expected) => {
		expect(LocalDate.from(text).daysInMonth).toEqual(expected);
	});

	it('daysInYear and inLeapYear', () => {
		expect(LocalDate.of(2024, 1, 1).daysInYear).toEqual(366);
		expect(LocalDate.of(2024, 1, 1).inLeapYear).toBe(true);
		expect(LocalDate.of(2023, 1, 1).daysInYear).toEqual(365);
		expect(LocalDate.of(2023, 1, 1).inLeapYear).toBe(false);
		expect(LocalDate.of(-4, 1, 1).inLeapYear).toBe(true);
		expect(LocalDate.of(-100, 1, 1).inLeapYear).toBe(false);
	});
});

describe('LocalDate.toLocalDateTime', () => {
	it('is at midnight without a time', () => {
		expect(LocalDate.of(2024, 3, 1).toLocalDateTime().toString()).toEqual('2024-03-01T00:00:00');
	});

	it('uses the given time', () => {
		expect(LocalDate.of(2024, 3, 1).toLocalDateTime(LocalTime.of(8, 30)).toString())
			.toEqual('2024-03-01T08:30:00');
		expect(LocalDate.of(2024, 3, 1).toLocalDateTime('08:30').toString())
			.toEqual('2024-03-01T08:30:00');
		expect(LocalDate.of(2024, 3, 1).toLocalDateTime({ hour: 8 }).toString())
			.toEqual('2024-03-01T08:00:00');
	});
});

describe('LocalDateTime parts', () => {
	const value = LocalDateTime.of(2024, 3, 3, 8, 30);

	it('toLocalDate and toLocalTime', () => {
		expect(value.toLocalDate().equals(LocalDate.of(2024, 3, 3))).toBe(true);
		expect(value.toLocalTime().equals(LocalTime.of(8, 30))).toBe(true);
	});

	it('calendar fields come from the date', () => {
		expect(value.dayOfWeek).toEqual(DayOfWeek.SUNDAY);
		expect(value.dayOfYear).toEqual(63);
		expect(value.daysInMonth).toEqual(31);
		expect(value.daysInYear).toEqual(366);
		expect(value.inLeapYear).toBe(true);
	});

	it('fromDateAndTime accepts strings', () => {
		expect(LocalDateTime.fromDateAndTime('2024-03-01', '08:30').toString()).toEqual('2024-03-01T08:30:00');
	});
});

describe('Year calendar fields', () => {
	it('daysInYear and inLeapYear', () => {
		expect(Year.of(2000).inLeapYear).toBe(true);
		expect(Year.of(2000).daysInYear).toEqual(366);
		expect(Year.of(1900).inLeapYear).toBe(false);
		expect(Year.of(1900).daysInYear).toEqual(365);
	});
});
