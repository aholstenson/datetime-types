import { LocalDate } from '../src/LocalDate.js';
import { Month } from '../src/Month.js';

describe('LocalDate', () => {
	it('of(2004, 8, 4)', () => {
		const date = LocalDate.of(2004, 8, 4);
		expect(date).toBeInstanceOf(LocalDate);

		expect(date.year).toEqual(2004);
		expect(date.month).toEqual(8);
		expect(date.dayOfMonth).toEqual(4);

		expect(date.toString()).toEqual('2004-08-04');
	});

	it('of(2004, 2, 28)', () => {
		const date = LocalDate.of(2004, 2, 28);
		expect(date).toBeInstanceOf(LocalDate);

		expect(date.year).toEqual(2004);
		expect(date.month).toEqual(2);
		expect(date.dayOfMonth).toEqual(28);

		expect(date.toString()).toEqual('2004-02-28');
	});

	it('of(2004, 2, 29)', () => {
		const date = LocalDate.of(2004, 2, 29);
		expect(date).toBeInstanceOf(LocalDate);

		expect(date.year).toEqual(2004);
		expect(date.month).toEqual(2);
		expect(date.dayOfMonth).toEqual(29);

		expect(date.toString()).toEqual('2004-02-29');
	});

	it('of(2004, 2, 30)', () => {
		expect(() => LocalDate.of(2004, 2, 30)).toThrow();
	});

	it('of(201, 12, 2)', () => {
		const date = LocalDate.of(201, 12, 2);
		expect(date).toBeInstanceOf(LocalDate);

		expect(date.year).toEqual(201);
		expect(date.month).toEqual(12);
		expect(date.dayOfMonth).toEqual(2);

		expect(date.toString()).toEqual('0201-12-02');
	});

	it('of(-201, 12, 2)', () => {
		const date = LocalDate.of(-201, 12, 2);
		expect(date).toBeInstanceOf(LocalDate);

		expect(date.year).toEqual(-201);
		expect(date.month).toEqual(12);
		expect(date.dayOfMonth).toEqual(2);

		expect(date.toString()).toEqual('-0201-12-02');
	});

	it('of(20240, 12, 2)', () => {
		const date = LocalDate.of(20240, 12, 2);
		expect(date).toBeInstanceOf(LocalDate);

		expect(date.year).toEqual(20240);
		expect(date.month).toEqual(12);
		expect(date.dayOfMonth).toEqual(2);

		expect(date.toString()).toEqual('+20240-12-02');
	});
});

describe('LocalDate validation', () => {
	it.each([
		[ 2023, 2, 29 ],
		[ 1900, 2, 29 ],
		[ 2024, 4, 31 ],
		[ 2024, 0, 1 ],
		[ 2024, 13, 1 ],
		[ 2024, 1, 0 ],
		[ 2024, 1, 32 ],
		[ 2024.5, 1, 1 ]
	])('of(%s, %s, %s) throws', (year, month, day) => {
		expect(() => LocalDate.of(year, month, day)).toThrow();
	});

	it('of(2000, 2, 29) accepts a leap day in a year divisible by 400', () => {
		expect(LocalDate.of(2000, 2, 29).toString()).toEqual('2000-02-29');
	});

	it('of(-4, 2, 29) accepts a leap day in a negative year', () => {
		expect(LocalDate.of(-4, 2, 29).toString()).toEqual('-0004-02-29');
	});

	it('of(year, Month, day) accepts a Month', () => {
		expect(LocalDate.of(2024, Month.March, 1).month).toEqual(3);
	});
});

describe('LocalDate conversion', () => {
	it('from(object)', () => {
		expect(LocalDate.from({ year: 2024, month: 3, dayOfMonth: 1 }).toString()).toEqual('2024-03-01');
	});

	it('fromDate(date)', () => {
		expect(LocalDate.fromDate(new Date(2024, 2, 1, 23, 59)).toString()).toEqual('2024-03-01');
	});

	it('toDateAtMidnight()', () => {
		const date = LocalDate.of(2024, 3, 1).toDateAtMidnight();
		expect(date.getFullYear()).toEqual(2024);
		expect(date.getMonth()).toEqual(2);
		expect(date.getDate()).toEqual(1);
		expect(date.getHours()).toEqual(0);
		expect(date.getMinutes()).toEqual(0);
	});

	it.each([ 0, 50, 99, -10 ])('toDateAtMidnight() keeps the year %s', year => {
		const date = LocalDate.of(year, 3, 1).toDateAtMidnight();
		expect(date.getFullYear()).toEqual(year);
		expect(date.getMonth()).toEqual(2);
		expect(date.getDate()).toEqual(1);
		expect(LocalDate.fromDate(date).equals(LocalDate.of(year, 3, 1))).toBe(true);
	});
});

describe('LocalDate comparison', () => {
	it('compare', () => {
		const date = LocalDate.of(2024, 3, 15);
		expect(date.compare(LocalDate.of(2025, 1, 1))).toEqual(-1);
		expect(date.compare(LocalDate.of(2024, 4, 1))).toEqual(-1);
		expect(date.compare(LocalDate.of(2024, 3, 16))).toEqual(-1);
		expect(date.compare({ year: 2024, month: 3, dayOfMonth: 15 })).toEqual(0);
		expect(date.compare(LocalDate.of(2024, 3, 14))).toEqual(1);
		expect(date.compare(LocalDate.of(2024, 2, 28))).toEqual(1);
		expect(date.compare(LocalDate.of(2023, 12, 31))).toEqual(1);
	});

	it('equals', () => {
		const date = LocalDate.of(2024, 3, 15);
		expect(date.equals(LocalDate.of(2024, 3, 15))).toBe(true);
		expect(date.equals(LocalDate.of(2024, 3, 16))).toBe(false);
		expect(date.equals(null)).toBe(false);
		expect(date.equals(undefined)).toBe(false);
	});
});
