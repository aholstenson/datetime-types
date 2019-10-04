import { LocalTime } from '../src/LocalTime';

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
