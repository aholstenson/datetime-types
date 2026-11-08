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
		const interval = DateInterval.until(feb1);
		expect(interval.start).toBeNull();
		expect(interval.end).toBe(feb1);
	});

	it('from(start)', () => {
		const interval = DateInterval.from(jan1);
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
		expect(DateInterval.from(jan1).compare(DateInterval.between(jan1, mar1))).toEqual(1);
		expect(DateInterval.between(jan1, mar1).compare(DateInterval.from(jan1))).toEqual(-1);
	});

	it('compare puts an open start before a bounded start', () => {
		expect(DateInterval.until(mar1).compare(DateInterval.between(jan1, mar1))).toEqual(-1);
		expect(DateInterval.between(jan1, mar1).compare(DateInterval.until(mar1))).toEqual(1);
	});

	it('compare sorts open and bounded intervals', () => {
		const sorted = [
			DateInterval.from(jan1),
			DateInterval.between(feb1, mar1),
			DateInterval.until(feb1),
			DateInterval.between(jan1, feb1)
		].sort((a, b) => a.compare(b));

		expect(sorted).toEqual([
			DateInterval.until(feb1),
			DateInterval.between(jan1, feb1),
			DateInterval.from(jan1),
			DateInterval.between(feb1, mar1)
		]);
	});

	it('equals', () => {
		expect(DateInterval.between(jan1, feb1).equals(DateInterval.between(LocalDate.of(2024, 1, 1), feb1))).toBe(true);
		expect(DateInterval.from(jan1).equals(DateInterval.from(jan1))).toBe(true);
		expect(DateInterval.until(jan1).equals(DateInterval.until(jan1))).toBe(true);
		expect(DateInterval.between(jan1, feb1).equals(DateInterval.between(jan1, mar1))).toBe(false);
		expect(DateInterval.between(jan1, feb1).equals(null)).toBe(false);
	});
});
