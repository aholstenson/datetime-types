import { LocalTime } from '../src/LocalTime.js';

describe('LocalTime', () => {
	it('of(2, 14)', () => {
		const time = LocalTime.of(2, 14);
		expect(time).toBeInstanceOf(LocalTime);

		expect(time.hour).toEqual(2);
		expect(time.minute).toEqual(14);
		expect(time.second).toEqual(0);
		expect(time.milliOfSecond).toEqual(0);

		expect(time.toString()).toEqual('02:14');
	});

	it('of(2, 14, 0, 0)', () => {
		const time = LocalTime.of(2, 14);
		expect(time).toBeInstanceOf(LocalTime);

		expect(time.hour).toEqual(2);
		expect(time.minute).toEqual(14);
		expect(time.second).toEqual(0);
		expect(time.milliOfSecond).toEqual(0);

		expect(time.toString()).toEqual('02:14');
	});

	it('of(2, 14, 12)', () => {
		const time = LocalTime.of(2, 14, 12);
		expect(time).toBeInstanceOf(LocalTime);

		expect(time.hour).toEqual(2);
		expect(time.minute).toEqual(14);
		expect(time.second).toEqual(12);
		expect(time.milliOfSecond).toEqual(0);

		expect(time.toString()).toEqual('02:14:12');
	});

	it('of(2, 14, 12, 9)', () => {
		const time = LocalTime.of(2, 14, 12, 9);
		expect(time).toBeInstanceOf(LocalTime);

		expect(time.hour).toEqual(2);
		expect(time.minute).toEqual(14);
		expect(time.second).toEqual(12);
		expect(time.milliOfSecond).toEqual(9);

		expect(time.toString()).toEqual('02:14:12.009');
	});

	it('of(2, 14, 12, 99)', () => {
		const time = LocalTime.of(2, 14, 12, 99);
		expect(time).toBeInstanceOf(LocalTime);

		expect(time.hour).toEqual(2);
		expect(time.minute).toEqual(14);
		expect(time.second).toEqual(12);
		expect(time.milliOfSecond).toEqual(99);

		expect(time.toString()).toEqual('02:14:12.099');
	});

	it('of(2, 14, 12, 299)', () => {
		const time = LocalTime.of(2, 14, 12, 299);
		expect(time).toBeInstanceOf(LocalTime);

		expect(time.hour).toEqual(2);
		expect(time.minute).toEqual(14);
		expect(time.second).toEqual(12);
		expect(time.milliOfSecond).toEqual(299);

		expect(time.toString()).toEqual('02:14:12.299');
	});
});

describe('LocalTime validation', () => {
	it.each([
		[ -1, 0, 0, 0 ],
		[ 24, 0, 0, 0 ],
		[ 0, -1, 0, 0 ],
		[ 0, 60, 0, 0 ],
		[ 0, 0, -1, 0 ],
		[ 0, 0, 60, 0 ],
		[ 0, 0, 0, -1 ],
		[ 0, 0, 0, 1000 ],
		[ 1.5, 0, 0, 0 ]
	])('of(%s, %s, %s, %s) throws', (hour, minute, second, milli) => {
		expect(() => LocalTime.of(hour, minute, second, milli)).toThrow();
	});

	it('of() is midnight', () => {
		expect(LocalTime.of().equals(LocalTime.Midnight)).toBe(true);
	});
});

describe('LocalTime formatting', () => {
	it('of(2, 14, 0, 5) writes the seconds when there are milliseconds', () => {
		expect(LocalTime.of(2, 14, 0, 5).toString()).toEqual('02:14:00.005');
	});

	it('Maximum', () => {
		expect(LocalTime.Maximum.toString()).toEqual('23:59:59.999');
	});
});

describe('LocalTime conversion', () => {
	it('from(object) uses zero for missing fields', () => {
		expect(LocalTime.from({ hour: 12 }).toString()).toEqual('12:00');
		expect(LocalTime.from({ minute: 30 }).toString()).toEqual('00:30');
	});

	it('fromDate(date)', () => {
		expect(LocalTime.fromDate(new Date(2024, 0, 1, 13, 5, 7, 42)).toString()).toEqual('13:05:07.042');
	});
});

describe('LocalTime comparison', () => {
	it('compare', () => {
		const time = LocalTime.of(12, 30, 30, 500);
		expect(time.compare(LocalTime.of(13))).toEqual(-1);
		expect(time.compare(LocalTime.of(12, 31))).toEqual(-1);
		expect(time.compare(LocalTime.of(12, 30, 31))).toEqual(-1);
		expect(time.compare(LocalTime.of(12, 30, 30, 501))).toEqual(-1);
		expect(time.compare(LocalTime.of(12, 30, 30, 500))).toEqual(0);
		expect(time.compare(LocalTime.of(12, 30, 30, 499))).toEqual(1);
		expect(time.compare(LocalTime.of(11, 59))).toEqual(1);
	});

	it('equals', () => {
		expect(LocalTime.of(12).equals(LocalTime.of(12, 0, 0, 0))).toBe(true);
		expect(LocalTime.of(12).equals(LocalTime.of(12, 1))).toBe(false);
		expect(LocalTime.of(12).equals(null)).toBe(false);
	});
});
