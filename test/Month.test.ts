import { Month } from '../src/Month.js';

describe('Month', () => {
	it('of(1) returns January', () => {
		expect(Month.of(1)).toBe(Month.JANUARY);
		expect(Month.JANUARY.month).toEqual(1);
	});

	it('of(12) returns December', () => {
		expect(Month.of(12)).toBe(Month.DECEMBER);
		expect(Month.DECEMBER.month).toEqual(12);
	});

	it('of(n) returns the month with the same number', () => {
		for(let i = 1; i <= 12; i++) {
			expect(Month.of(i).month).toEqual(i);
		}
	});

	it.each([ 0, 13, -1, 1.5, NaN ])('of(%s) throws', value => {
		expect(() => Month.of(value)).toThrow();
	});

	it('compare', () => {
		expect(Month.MARCH.compare(Month.APRIL)).toEqual(-1);
		expect(Month.APRIL.compare({ month: 4 })).toEqual(0);
		expect(Month.MAY.compare(Month.APRIL)).toEqual(1);
	});

	it('equals', () => {
		expect(Month.MARCH.equals(Month.of(3))).toBe(true);
		expect(Month.MARCH.equals({ month: 3 })).toBe(true);
		expect(Month.MARCH.equals(Month.APRIL)).toBe(false);
		expect(Month.MARCH.equals(null)).toBe(false);
	});

	it('toString', () => {
		expect(Month.JANUARY.toString()).toEqual('--01');
		expect(Month.MARCH.toString()).toEqual('--03');
		expect(Month.DECEMBER.toString()).toEqual('--12');
	});
});
