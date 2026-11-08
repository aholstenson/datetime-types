import { LocalDate } from '../src/LocalDate.js';
import { LocalDateTime } from '../src/LocalDateTime.js';
import { LocalTime } from '../src/LocalTime.js';

describe('LocalDateTime', () => {
	it('from(object)', () => {
		const value = LocalDateTime.from({
			year: 2024,
			month: 2,
			dayOfMonth: 29,
			hour: 13,
			minute: 5,
			second: 7,
			milliOfSecond: 42
		});

		expect(value.year).toEqual(2024);
		expect(value.month).toEqual(2);
		expect(value.dayOfMonth).toEqual(29);
		expect(value.hour).toEqual(13);
		expect(value.minute).toEqual(5);
		expect(value.second).toEqual(7);
		expect(value.milliOfSecond).toEqual(42);

		expect(value.toString()).toEqual('2024-02-29T13:05:07.042');
	});

	it('fromDateAndTime(date, time)', () => {
		const value = LocalDateTime.fromDateAndTime(
			LocalDate.of(2004, 8, 4),
			LocalTime.of(2, 14)
		);

		expect(value.toString()).toEqual('2004-08-04T02:14');
	});

	it('fromDateAndTime with an invalid date throws', () => {
		expect(() => LocalDateTime.fromDateAndTime(
			{ year: 2023, month: 2, dayOfMonth: 29 },
			LocalTime.Midnight
		)).toThrow();
	});

	it('fromDate(date)', () => {
		const value = LocalDateTime.fromDate(new Date(2010, 11, 31, 23, 59, 58, 7));
		expect(value.toString()).toEqual('2010-12-31T23:59:58.007');
	});
});
