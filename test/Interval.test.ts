import { Interval } from '../src/Interval.js';
import { LocalDate } from '../src/LocalDate.js';
import { LocalTime } from '../src/LocalTime.js';
import { Month } from '../src/Month.js';
import { Year } from '../src/Year.js';

const t8 = LocalTime.of(8);
const t12 = LocalTime.of(12);
const t17 = LocalTime.of(17);
const t20 = LocalTime.of(20);

describe('Interval', () => {
	describe('creation', () => {
		it('between(start, end)', () => {
			const interval = Interval.between(t8, t17);
			expect(interval.start).toBe(t8);
			expect(interval.end).toBe(t17);
		});

		it('until(end)', () => {
			const interval = Interval.until(t17);
			expect(interval.start).toBeNull();
			expect(interval.end).toBe(t17);
		});

		it('from(start)', () => {
			const interval = Interval.from(t8);
			expect(interval.start).toBe(t8);
			expect(interval.end).toBeNull();
		});

		it('between(null, null) has no limits', () => {
			const interval = Interval.between<LocalTime>(null, null);
			expect(interval.contains(t8)).toBe(true);
			expect(interval.toString()).toEqual('../..');
		});

		it('between(start, end) throws when the start is after the end', () => {
			expect(() => Interval.between(t17, t8)).toThrow();
		});

		it('between(start, start) is allowed and empty', () => {
			expect(Interval.between(t8, LocalTime.of(8)).isEmpty()).toBe(true);
		});

		it('accepts every comparable type', () => {
			expect(Interval.between(LocalDate.of(2024, 1, 1), LocalDate.of(2024, 2, 1)).toString())
				.toEqual('2024-01-01/2024-02-01');
			expect(Interval.between(Year.of(2000), Year.of(2010)).toString()).toEqual('2000/2010');
			expect(Interval.between(Month.March, Month.June).contains(Month.April)).toBe(true);
		});

		it('rejects types that are not comparable', () => {
			// @ts-expect-error A string has no compare method.
			expect(() => Interval.between('a', 'b')).toThrow();
		});
	});

	describe('isEmpty', () => {
		it('is false for a bounded interval', () => {
			expect(Interval.between(t8, t17).isEmpty()).toBe(false);
		});

		it('is false for open intervals', () => {
			expect(Interval.from(t8).isEmpty()).toBe(false);
			expect(Interval.until(t8).isEmpty()).toBe(false);
		});
	});

	describe('contains', () => {
		const interval = Interval.between(t8, t17);

		it('includes the start', () => {
			expect(interval.contains(LocalTime.of(8))).toBe(true);
		});

		it('includes a value inside', () => {
			expect(interval.contains(t12)).toBe(true);
		});

		it('excludes the end', () => {
			expect(interval.contains(LocalTime.of(17))).toBe(false);
			expect(interval.contains(LocalTime.of(16, 59, 59, 999))).toBe(true);
		});

		it('excludes values outside', () => {
			expect(interval.contains(LocalTime.of(7, 59))).toBe(false);
			expect(interval.contains(t20)).toBe(false);
		});

		it('follows open sides', () => {
			expect(Interval.until(t17).contains(LocalTime.Minimum)).toBe(true);
			expect(Interval.until(t17).contains(t17)).toBe(false);
			expect(Interval.from(t8).contains(LocalTime.Maximum)).toBe(true);
			expect(Interval.from(t8).contains(LocalTime.of(7))).toBe(false);
		});

		it('is false for every value in an empty interval', () => {
			expect(Interval.between(t8, t8).contains(t8)).toBe(false);
		});
	});

	describe('overlaps', () => {
		it('is true for intervals that share values', () => {
			expect(Interval.between(t8, t17).overlaps(Interval.between(t12, t20))).toBe(true);
			expect(Interval.between(t12, t20).overlaps(Interval.between(t8, t17))).toBe(true);
		});

		it('is true when one interval is inside the other', () => {
			expect(Interval.between(t8, t20).overlaps(Interval.between(t12, t17))).toBe(true);
		});

		it('is false for intervals that only touch', () => {
			expect(Interval.between(t8, t12).overlaps(Interval.between(t12, t17))).toBe(false);
			expect(Interval.between(t12, t17).overlaps(Interval.between(t8, t12))).toBe(false);
		});

		it('is false for intervals apart from each other', () => {
			expect(Interval.between(t8, t12).overlaps(Interval.between(t17, t20))).toBe(false);
		});

		it('follows open sides', () => {
			expect(Interval.until(t12).overlaps(Interval.from(t8))).toBe(true);
			expect(Interval.until(t8).overlaps(Interval.from(t8))).toBe(false);
			expect(Interval.until(t8).overlaps(Interval.until(t17))).toBe(true);
			expect(Interval.between<LocalTime>(null, null).overlaps(Interval.between(t8, t12))).toBe(true);
		});

		it('is false for an empty interval', () => {
			expect(Interval.between(t12, t12).overlaps(Interval.between(t8, t17))).toBe(false);
			expect(Interval.between(t8, t17).overlaps(Interval.between(t12, t12))).toBe(false);
			expect(Interval.between(t12, t12).overlaps(Interval.between(t12, t12))).toBe(false);
		});
	});

	describe('compare and equals', () => {
		it('compare uses the start first', () => {
			expect(Interval.between(t8, t20).compare(Interval.between(t12, t17))).toEqual(-1);
			expect(Interval.between(t12, t17).compare(Interval.between(t8, t20))).toEqual(1);
		});

		it('compare uses the end when the start is the same', () => {
			expect(Interval.between(t8, t12).compare(Interval.between(t8, t17))).toEqual(-1);
			expect(Interval.between(t8, t17).compare(Interval.between(t8, t12))).toEqual(1);
		});

		it('compare puts an open start first and an open end last', () => {
			expect(Interval.until(t17).compare(Interval.between(t8, t17))).toEqual(-1);
			expect(Interval.from(t8).compare(Interval.between(t8, t17))).toEqual(1);
		});

		it('equals', () => {
			expect(Interval.between(t8, t17).equals(Interval.between(LocalTime.of(8), LocalTime.of(17)))).toBe(true);
			expect(Interval.from(t8).equals(Interval.from(t8))).toBe(true);
			expect(Interval.between(t8, t17).equals(Interval.between(t8, t12))).toBe(false);
			expect(Interval.between(t8, t17).equals(null)).toBe(false);
			expect(Interval.between(t8, t17).equals(undefined)).toBe(false);
		});
	});

	describe('toString', () => {
		it('writes the start and the end', () => {
			expect(Interval.between(t8, LocalTime.of(17, 30)).toString()).toEqual('08:00/17:30');
		});

		it('writes open sides as ..', () => {
			expect(Interval.from(t8).toString()).toEqual('08:00/..');
			expect(Interval.until(t17).toString()).toEqual('../17:00');
		});
	});
});
