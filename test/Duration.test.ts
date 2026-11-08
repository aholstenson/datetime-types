import { Duration } from '../src/Duration.js';

const Temporal = (globalThis as any).Temporal;

describe('Duration', () => {
	describe('from', () => {
		it('reads an object and sets missing fields to zero', () => {
			const duration = Duration.from({ days: 3, hours: 4 });
			expect(duration.days).toEqual(3);
			expect(duration.hours).toEqual(4);
			expect(duration.years).toEqual(0);
			expect(duration.milliseconds).toEqual(0);
		});

		it('returns a duration as it is', () => {
			const duration = Duration.from({ days: 3 });
			expect(Duration.from(duration)).toBe(duration);
		});

		it.each([
			[ 'P1Y2M3W4DT5H6M7.008S', { years: 1, months: 2, weeks: 3, days: 4, hours: 5, minutes: 6, seconds: 7, milliseconds: 8 } ],
			[ '-P1D', { days: -1 } ],
			[ '+PT0,5S', { milliseconds: 500 } ],
			[ 'pt1m', { minutes: 1 } ],
			[ 'PT1.5H', { hours: 1, minutes: 30 } ],
			[ 'PT1.5M', { minutes: 1, seconds: 30 } ],
			[ 'PT0.001H', { seconds: 3, milliseconds: 600 } ],
			[ 'PT1.000000S', { seconds: 1 } ],
			[ '-PT0S', {} ]
		])('reads %s', (text, fields) => {
			expect({ ...Duration.from(text) }).toEqual({ ...Duration.ZERO, ...fields });
		});

		it.each([
			'P', 'PT', 'P1DT', '1D', 'P1.5D', 'PT1.5H30M', 'PT1.5M1S', 'P-1D', 'PT1.0001S', 'P1D2Y'
		])('throws RangeError for %j', text => {
			expect(() => Duration.from(text)).toThrow(RangeError);
		});

		it('throws TypeError for an object without fields', () => {
			expect(() => Duration.from({})).toThrow(TypeError);
			expect(() => Duration.from(null as any)).toThrow(TypeError);
		});

		it('throws RangeError for fields with different signs', () => {
			expect(() => Duration.from({ days: 1, hours: -1 })).toThrow(RangeError);
		});

		it('throws RangeError for fractions and sub-millisecond values', () => {
			expect(() => Duration.from({ days: 1.5 })).toThrow(RangeError);
			expect(() => Duration.from({ microseconds: 1 })).toThrow(RangeError);
		});

		it('accepts zero microseconds and nanoseconds', () => {
			expect(Duration.from({ nanoseconds: 0 }).blank).toBe(true);
		});
	});

	describe('limit of the time fields', () => {
		const max = Number.MAX_SAFE_INTEGER;

		it('accepts time fields up to the limit', () => {
			expect(Duration.from({ milliseconds: max }).toString()).toEqual('PT9007199254740.991S');
			expect(Duration.from({ milliseconds: -max }).negated().milliseconds).toEqual(max);
			expect(Duration.from({ hours: 2501999792 }).hours).toEqual(2501999792);
		});

		it('reads back the string of the largest duration', () => {
			const duration = Duration.from({ milliseconds: max });
			expect(Duration.from(duration.toString()).toString()).toEqual(duration.toString());
		});

		it('throws RangeError above the limit', () => {
			expect(() => Duration.from({ seconds: max, milliseconds: 999 })).toThrow(RangeError);
			expect(() => Duration.from({ hours: 2501999793 })).toThrow(RangeError);
			expect(() => Duration.from({ hours: -max })).toThrow(RangeError);
			expect(() => Duration.from({ hours: 1 }).with({ milliseconds: max })).toThrow(RangeError);
			expect(() => Duration.from('PT9007199254741S')).toThrow(RangeError);
		});

		it('does not limit the date fields', () => {
			expect(Duration.from({ days: max }).days).toEqual(max);
		});
	});

	describe('toString', () => {
		it.each([
			[ { years: 1, months: 2, weeks: 3, days: 4 }, 'P1Y2M3W4D' ],
			[ { hours: 8, minutes: 30 }, 'PT8H30M' ],
			[ { days: -1 }, '-P1D' ],
			[ { days: 1, seconds: 1 }, 'P1DT1S' ],
			[ { milliseconds: 1500, seconds: 1 }, 'PT2.5S' ],
			[ { milliseconds: -1 }, '-PT0.001S' ],
			[ { minutes: 90 }, 'PT90M' ],
			[ { seconds: 0 }, 'PT0S' ]
		])('%j is %s', (fields, text) => {
			expect(Duration.from(fields).toString()).toEqual(text);
			expect(JSON.stringify(Duration.from(fields))).toEqual(JSON.stringify(text));
		});
	});

	it('sign and blank', () => {
		expect(Duration.from({ days: 1 }).sign).toEqual(1);
		expect(Duration.from({ hours: -1 }).sign).toEqual(-1);
		expect(Duration.ZERO.sign).toEqual(0);
		expect(Duration.ZERO.blank).toBe(true);
		expect(Duration.from({ milliseconds: 1 }).blank).toBe(false);
	});

	it('negated and abs', () => {
		expect(Duration.from('P1DT2H').negated().toString()).toEqual('-P1DT2H');
		expect(Duration.from('-P1DT2H').abs().toString()).toEqual('P1DT2H');
		expect(Duration.ZERO.negated().days).toEqual(0);
		expect(Object.is(Duration.ZERO.negated().days, -0)).toBe(false);
	});

	it('with changes some fields', () => {
		expect(Duration.from('P1D').with({ hours: 2 }).toString()).toEqual('P1DT2H');
		expect(() => Duration.from('P1D').with({ hours: -2 })).toThrow(RangeError);
		expect(() => Duration.from('P1D').with({})).toThrow(TypeError);
	});

	it('throws TypeError for operators', () => {
		expect(() => +Duration.ZERO).toThrow(TypeError);
	});
});

describe.skipIf(! Temporal)('Duration and Temporal.Duration', () => {
	const samples = [
		'P1Y2M3W4DT5H6M7.008S', '-P1D', 'PT0S', 'PT1.5H', 'PT0.001H', 'PT90M',
		'P10Y', '-PT0.5S', 'PT36H', 'P1DT0.1S'
	];

	it.each(samples)('%s gives the same fields and string', text => {
		const duration = Duration.from(text);
		const temporal = Temporal.Duration.from(text);

		expect(duration.toString()).toEqual(temporal.toString());
		expect(duration.sign).toEqual(temporal.sign);
		expect(Duration.from(temporal).toString()).toEqual(temporal.toString());
		expect(Temporal.Duration.from(duration).toString()).toEqual(duration.toString());
	});
});
