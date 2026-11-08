import { LocalDate } from '../src/LocalDate.js';
import { LocalDateTime } from '../src/LocalDateTime.js';
import { Month } from '../src/Month.js';
import { YearMonth } from '../src/YearMonth.js';

const Temporal = (globalThis as any).Temporal;

describe('YearMonth', () => {
	const march = YearMonth.of(2024, 3);

	it('of, from and toString', () => {
		expect(march.toString()).toEqual('2024-03');
		expect(YearMonth.of(2024, Month.MARCH).equals(march)).toBe(true);
		expect(YearMonth.from('2024-03').equals(march)).toBe(true);
		expect(YearMonth.from({ year: 2024, month: 3 }).equals(march)).toBe(true);
		expect(YearMonth.from(march)).toBe(march);
		expect(YearMonth.of(20240, 3).toString()).toEqual('+020240-03');
		expect(YearMonth.from('-000005-03').year).toEqual(-5);
		expect(JSON.stringify(march)).toEqual('"2024-03"');
	});

	it('throws for invalid values', () => {
		expect(() => YearMonth.of(2024, 13)).toThrow(RangeError);
		expect(() => YearMonth.from('2024-3')).toThrow(RangeError);
		expect(() => YearMonth.from('2024-03-01')).toThrow(RangeError);
		expect(() => YearMonth.from({ year: 2024, month: 3, calendarId: 'gregory' })).toThrow(RangeError);
		expect(() => +march).toThrow(TypeError);
	});

	it('calendar fields', () => {
		expect(YearMonth.of(2024, 2).daysInMonth).toEqual(29);
		expect(march.daysInYear).toEqual(366);
		expect(march.inLeapYear).toBe(true);
	});

	it('compare, equals and sort', () => {
		expect(march.compare('2024-04')).toEqual(-1);
		expect(march.compare('2023-12')).toEqual(1);
		expect(march.equals(LocalDate.of(2024, 3, 15))).toBe(true);
		expect(march.equals(null)).toBe(false);
		expect([ '2024-03', '2023-12' ].map(YearMonth.from).sort(YearMonth.compare).map(String))
			.toEqual([ '2023-12', '2024-03' ]);
	});

	it('toLocalDate constrains the day', () => {
		expect(march.toLocalDate(15).toString()).toEqual('2024-03-15');
		expect(YearMonth.of(2023, 2).toLocalDate(31).toString()).toEqual('2023-02-28');
		expect(() => YearMonth.of(2023, 2).toLocalDate(31, { overflow: 'reject' })).toThrow(RangeError);
	});

	it('LocalDate and LocalDateTime give their year and month', () => {
		expect(LocalDate.of(2024, 3, 15).toYearMonth().equals(march)).toBe(true);
		expect(LocalDateTime.of(2024, 3, 15, 8).toYearMonth().equals(march)).toBe(true);
	});

	it('with', () => {
		expect(march.with({ month: 12 }).toString()).toEqual('2024-12');
		expect(march.with({ month: 13 }).toString()).toEqual('2024-12');
		expect(() => march.with({ month: 13 }, { overflow: 'reject' })).toThrow(RangeError);
		expect(() => march.with({})).toThrow(TypeError);
	});

	it('add and subtract', () => {
		expect(march.add({ months: 10 }).toString()).toEqual('2025-01');
		expect(march.subtract('P1Y3M').toString()).toEqual('2022-12');
		expect(() => march.add({ days: 1 })).toThrow(RangeError);
		expect(() => march.add({ months: 1, hours: 1 })).toThrow(RangeError);
		expect(march.add({ days: 0 }).equals(march)).toBe(true);
	});

	it('until and since', () => {
		expect(march.until('2025-01').toString()).toEqual('P10M');
		expect(march.until('2026-04').toString()).toEqual('P2Y1M');
		expect(march.until('2026-04', { largestUnit: 'months' }).toString()).toEqual('P25M');
		expect(march.since('2023-04').toString()).toEqual('P11M');
		expect(() => march.until('2025-01', { largestUnit: 'days' as any })).toThrow(RangeError);
	});

	it('now and fromDate use the local timezone', () => {
		expect(YearMonth.fromDate(new Date(2024, 2, 31, 23)).toString()).toEqual('2024-03');
		expect(YearMonth.now()).toBeInstanceOf(YearMonth);
	});
});

describe.skipIf(! Temporal)('YearMonth and Temporal.PlainYearMonth', () => {
	const values = [ '2024-01', '2024-02', '2023-12', '2000-03', '-000001-11', '+010000-01' ];
	const durations = [ 'P1M', '-P1M', 'P11M', 'P1Y11M', '-P2Y1M', 'P25M' ];

	it('has the same strings and arithmetic', () => {
		for(const a of values) {
			const plain = Temporal.PlainYearMonth.from(a);
			expect(YearMonth.from(a).toString()).toEqual(plain.toString());
			expect(YearMonth.from(plain).toString()).toEqual(plain.toString());
			expect(YearMonth.from(a).daysInMonth).toEqual(plain.daysInMonth);

			for(const duration of durations) {
				expect(YearMonth.from(a).add(duration).toString()).toEqual(plain.add(duration).toString());
				expect(YearMonth.from(a).subtract(duration).toString()).toEqual(plain.subtract(duration).toString());
			}

			for(const b of values) {
				for(const largestUnit of [ 'years', 'months' ]) {
					expect(YearMonth.from(a).until(b, { largestUnit } as any).toString())
						.toEqual(plain.until(b, { largestUnit }).toString());
					expect(YearMonth.from(a).since(b, { largestUnit } as any).toString())
						.toEqual(plain.since(b, { largestUnit }).toString());
				}
			}
		}
	});
});
