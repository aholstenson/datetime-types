import { Interval } from '../src/Interval.js';
import { LocalTime } from '../src/LocalTime.js';

describe('Interval', () => {
	it('between(start, end)', () => {
		const start = LocalTime.of(8);
		const end = LocalTime.of(17);
		const interval = Interval.between(start, end);
		expect(interval.start).toBe(start);
		expect(interval.end).toBe(end);
	});

	it('until(end)', () => {
		const end = LocalTime.of(17);
		const interval = Interval.until(end);
		expect(interval.start).toBeNull();
		expect(interval.end).toBe(end);
	});

	it('from(start)', () => {
		const start = LocalTime.of(8);
		const interval = Interval.from(start);
		expect(interval.start).toBe(start);
		expect(interval.end).toBeNull();
	});
});
