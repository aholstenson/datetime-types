import { Year } from '../src/Year.js';

describe('Year', () => {
	it('of(2024)', () => {
		const year = Year.of(2024);
		expect(year).toBeInstanceOf(Year);
		expect(year.year).toEqual(2024);
		expect(year.toString()).toEqual('2024');
	});

	it('of(5) pads to four digits', () => {
		expect(Year.of(5).toString()).toEqual('0005');
	});

	it('of(20240) adds a plus sign', () => {
		expect(Year.of(20240).toString()).toEqual('+20240');
	});

	it('of(2024.5) throws', () => {
		expect(() => Year.of(2024.5)).toThrow();
	});

	it('from({ year })', () => {
		expect(Year.from({ year: 1999 }).year).toEqual(1999);
	});

	it('fromDate(date)', () => {
		expect(Year.fromDate(new Date(2010, 5, 1)).year).toEqual(2010);
	});

	it('compare', () => {
		expect(Year.of(2000).compare(Year.of(2001))).toEqual(-1);
		expect(Year.of(2001).compare(Year.of(2001))).toEqual(0);
		expect(Year.of(2002).compare({ year: 2001 })).toEqual(1);
	});

	it('equals', () => {
		expect(Year.of(2001).equals(Year.of(2001))).toBe(true);
		expect(Year.of(2001).equals({ year: 2002 })).toBe(false);
		expect(Year.of(2001).equals(null)).toBe(false);
		expect(Year.of(2001).equals(undefined)).toBe(false);
	});
});
