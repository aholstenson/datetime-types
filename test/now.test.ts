import { LocalDate } from '../src/LocalDate.js';
import { LocalDateTime } from '../src/LocalDateTime.js';
import { LocalTime } from '../src/LocalTime.js';
import { Month } from '../src/Month.js';
import { Year } from '../src/Year.js';

describe('now', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(2024, 2, 1, 8, 30, 15, 250));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('gives the current value in the local timezone', () => {
		expect(LocalDate.now().toString()).toEqual('2024-03-01');
		expect(LocalTime.now().toString()).toEqual('08:30:15.25');
		expect(LocalDateTime.now().toString()).toEqual('2024-03-01T08:30:15.25');
		expect(Year.now().toString()).toEqual('2024');
	});
});

describe('LocalDateTime', () => {
	it('toDate() gives a Date in the local timezone', () => {
		const date = LocalDateTime.of(2024, 3, 1, 8, 30, 15, 250).toDate();
		expect(date.getTime()).toEqual(new Date(2024, 2, 1, 8, 30, 15, 250).getTime());
	});

	it('toDate() keeps years 0 to 99', () => {
		expect(LocalDateTime.of(5, 1, 2, 3).toDate().getFullYear()).toEqual(5);
	});

	it('of() accepts a Month', () => {
		expect(LocalDateTime.of(2024, Month.MARCH, 1).toString()).toEqual('2024-03-01T00:00:00');
	});
});
