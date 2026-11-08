import { DayOfWeek } from '../src/DayOfWeek.js';

describe('DayOfWeek', () => {
	it('uses the same numbers as Date.getDay()', () => {
		// 2024-01-07 is a Sunday.
		for(let i = 0; i < 7; i++) {
			const date = new Date(2024, 0, 7 + i);
			expect(date.getDay()).toEqual(i);
		}

		expect(DayOfWeek.Sunday).toEqual(0);
		expect(DayOfWeek.Monday).toEqual(1);
		expect(DayOfWeek.Tuesday).toEqual(2);
		expect(DayOfWeek.Wednesday).toEqual(3);
		expect(DayOfWeek.Thursday).toEqual(4);
		expect(DayOfWeek.Friday).toEqual(5);
		expect(DayOfWeek.Saturday).toEqual(6);
	});
});
