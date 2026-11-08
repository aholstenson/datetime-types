import { Month } from '../src/Month.js';

describe('Month', () => {
	it('of(1) returns January', () => {
		expect(Month.of(1)).toBe(Month.January);
		expect(Month.January.month).toEqual(1);
	});

	it('of(12) returns December', () => {
		expect(Month.of(12)).toBe(Month.December);
		expect(Month.December.month).toEqual(12);
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
		expect(Month.March.compare(Month.April)).toEqual(-1);
		expect(Month.April.compare({ month: 4 })).toEqual(0);
		expect(Month.May.compare(Month.April)).toEqual(1);
	});

	it('equals', () => {
		expect(Month.March.equals(Month.of(3))).toBe(true);
		expect(Month.March.equals({ month: 3 })).toBe(true);
		expect(Month.March.equals(Month.April)).toBe(false);
		expect(Month.March.equals(null)).toBe(false);
	});
});
