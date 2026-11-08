import { DayOfWeek } from '../src/DayOfWeek.js';

describe('DayOfWeek', () => {
	it('uses ISO 8601 numbers from Monday as 1 to Sunday as 7', () => {
		expect(DayOfWeek.MONDAY).toEqual(1);
		expect(DayOfWeek.TUESDAY).toEqual(2);
		expect(DayOfWeek.WEDNESDAY).toEqual(3);
		expect(DayOfWeek.THURSDAY).toEqual(4);
		expect(DayOfWeek.FRIDAY).toEqual(5);
		expect(DayOfWeek.SATURDAY).toEqual(6);
		expect(DayOfWeek.SUNDAY).toEqual(7);
	});

	it('can not be changed', () => {
		expect(Object.isFrozen(DayOfWeek)).toBe(true);
	});

	it('is a type for the numbers 1 to 7', () => {
		const day: DayOfWeek = 7;
		// @ts-expect-error 0 is not a day of the week
		const notDay: DayOfWeek = 0;
		expect([ day, notDay ]).toEqual([ 7, 0 ]);
	});
});
