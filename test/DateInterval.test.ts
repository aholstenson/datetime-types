import { DateInterval } from '../src/DateInterval.js';
import { LocalDate } from '../src/LocalDate.js';

const jan1 = LocalDate.of(2024, 1, 1);
const feb1 = LocalDate.of(2024, 2, 1);
const mar1 = LocalDate.of(2024, 3, 1);

describe('DateInterval', () => {
	it('between(start, end)', () => {
		const interval = DateInterval.between(jan1, feb1);
		expect(interval.start).toBe(jan1);
		expect(interval.end).toBe(feb1);
	});

	it('until(end)', () => {
		const interval = DateInterval.endingAt(feb1);
		expect(interval.start).toBeNull();
		expect(interval.end).toBe(feb1);
	});

	it('from(start)', () => {
		const interval = DateInterval.startingAt(jan1);
		expect(interval.start).toBe(jan1);
		expect(interval.end).toBeNull();
	});

	it('compare uses the start first', () => {
		expect(DateInterval.between(jan1, mar1).compare(DateInterval.between(feb1, mar1))).toEqual(-1);
		expect(DateInterval.between(feb1, mar1).compare(DateInterval.between(jan1, mar1))).toEqual(1);
	});

	it('compare uses the end when the start is the same', () => {
		expect(DateInterval.between(jan1, feb1).compare(DateInterval.between(jan1, mar1))).toEqual(-1);
		expect(DateInterval.between(jan1, mar1).compare(DateInterval.between(jan1, feb1))).toEqual(1);
	});

	it('compare puts an open end after a bounded end', () => {
		expect(DateInterval.startingAt(jan1).compare(DateInterval.between(jan1, mar1))).toEqual(1);
		expect(DateInterval.between(jan1, mar1).compare(DateInterval.startingAt(jan1))).toEqual(-1);
	});

	it('compare puts an open start before a bounded start', () => {
		expect(DateInterval.endingAt(mar1).compare(DateInterval.between(jan1, mar1))).toEqual(-1);
		expect(DateInterval.between(jan1, mar1).compare(DateInterval.endingAt(mar1))).toEqual(1);
	});

	it('compare sorts open and bounded intervals', () => {
		const sorted = [
			DateInterval.startingAt(jan1),
			DateInterval.between(feb1, mar1),
			DateInterval.endingAt(feb1),
			DateInterval.between(jan1, feb1)
		].sort((a, b) => a.compare(b));

		expect(sorted).toEqual([
			DateInterval.endingAt(feb1),
			DateInterval.between(jan1, feb1),
			DateInterval.startingAt(jan1),
			DateInterval.between(feb1, mar1)
		]);
	});

	it('equals', () => {
		expect(DateInterval.between(jan1, feb1).equals(DateInterval.between(LocalDate.of(2024, 1, 1), feb1))).toBe(true);
		expect(DateInterval.startingAt(jan1).equals(DateInterval.startingAt(jan1))).toBe(true);
		expect(DateInterval.endingAt(jan1).equals(DateInterval.endingAt(jan1))).toBe(true);
		expect(DateInterval.between(jan1, feb1).equals(DateInterval.between(jan1, mar1))).toBe(false);
		expect(DateInterval.between(jan1, feb1).equals(null)).toBe(false);
	});

	it('between(start, end) throws when the start is after the end', () => {
		expect(() => DateInterval.between(feb1, jan1)).toThrow();
	});

	it('between(date, date) is one day', () => {
		const interval = DateInterval.between(jan1, LocalDate.of(2024, 1, 1));
		expect(interval.contains(jan1)).toBe(true);
		expect(interval.contains(LocalDate.of(2024, 1, 2))).toBe(false);
	});

	describe('contains', () => {
		const interval = DateInterval.between(jan1, feb1);

		it('includes the start and the end', () => {
			expect(interval.contains(jan1)).toBe(true);
			expect(interval.contains(LocalDate.of(2024, 2, 1))).toBe(true);
		});

		it('includes a date inside', () => {
			expect(interval.contains(LocalDate.of(2024, 1, 15))).toBe(true);
		});

		it('accepts an object with date properties', () => {
			expect(interval.contains({ year: 2024, month: 1, day: 15 })).toBe(true);
		});

		it('excludes dates outside', () => {
			expect(interval.contains(LocalDate.of(2023, 12, 31))).toBe(false);
			expect(interval.contains(LocalDate.of(2024, 2, 2))).toBe(false);
		});

		it('follows open sides', () => {
			expect(DateInterval.endingAt(feb1).contains(LocalDate.of(1900, 1, 1))).toBe(true);
			expect(DateInterval.endingAt(feb1).contains(feb1)).toBe(true);
			expect(DateInterval.endingAt(feb1).contains(LocalDate.of(2024, 2, 2))).toBe(false);
			expect(DateInterval.startingAt(feb1).contains(LocalDate.of(3000, 1, 1))).toBe(true);
			expect(DateInterval.startingAt(feb1).contains(jan1)).toBe(false);
		});
	});

	describe('overlaps', () => {
		it('is true for intervals that share dates', () => {
			expect(DateInterval.between(jan1, feb1).overlaps(DateInterval.between(LocalDate.of(2024, 1, 15), mar1))).toBe(true);
		});

		it('is true for intervals that share only one date', () => {
			expect(DateInterval.between(jan1, feb1).overlaps(DateInterval.between(feb1, mar1))).toBe(true);
			expect(DateInterval.between(feb1, mar1).overlaps(DateInterval.between(jan1, feb1))).toBe(true);
		});

		it('is false for intervals next to each other', () => {
			expect(DateInterval.between(jan1, LocalDate.of(2024, 1, 31)).overlaps(DateInterval.between(feb1, mar1))).toBe(false);
		});

		it('follows open sides', () => {
			expect(DateInterval.endingAt(feb1).overlaps(DateInterval.startingAt(feb1))).toBe(true);
			expect(DateInterval.endingAt(jan1).overlaps(DateInterval.startingAt(feb1))).toBe(false);
			expect(DateInterval.between(null, null).overlaps(DateInterval.between(jan1, feb1))).toBe(true);
		});
	});

	describe('toString', () => {
		it('writes the start and the end', () => {
			expect(DateInterval.between(jan1, mar1).toString()).toEqual('2024-01-01/2024-03-01');
		});

		it('writes open sides as ..', () => {
			expect(DateInterval.startingAt(jan1).toString()).toEqual('2024-01-01/..');
			expect(DateInterval.endingAt(mar1).toString()).toEqual('../2024-03-01');
			expect(DateInterval.between(null, null).toString()).toEqual('../..');
		});
	});

	describe('inputs', () => {
		it('between, startingAt and endingAt accept strings and objects', () => {
			expect(DateInterval.between('2024-03-01', { year: 2024, month: 3, day: 31 }).toString())
				.toEqual('2024-03-01/2024-03-31');
			expect(DateInterval.between(null, '2024-03-31').toString()).toEqual('../2024-03-31');
			expect(DateInterval.startingAt('2024-03-01').toString()).toEqual('2024-03-01/..');
			expect(DateInterval.endingAt('2024-03-31').toString()).toEqual('../2024-03-31');
		});

		it('contains accepts a string', () => {
			expect(DateInterval.from('2024-03-01/2024-03-31').contains('2024-03-31')).toBe(true);
		});

		it('between throws for a string that is not a date', () => {
			expect(() => DateInterval.between('2024-02-30', null)).toThrow(RangeError);
		});
	});
});
