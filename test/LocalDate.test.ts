import { LocalDate } from '../src/LocalDate';

describe('LocalDate', () => {
	it('of(2004, 8, 4)', () => {
		const date = LocalDate.of(2004, 8, 4);
		expect(date).toBeInstanceOf(LocalDate);
		expect(date.year).toEqual(2004);
		expect(date.month).toEqual(8);
		expect(date.dayOfMonth).toEqual(4);
	});

	it('of(2004, 2, 28)', () => {
		const date = LocalDate.of(2004, 2, 28);
		expect(date).toBeInstanceOf(LocalDate);
		expect(date.year).toEqual(2004);
		expect(date.month).toEqual(2);
		expect(date.dayOfMonth).toEqual(28);
	});

	it('of(2004, 2, 29)', () => {
		const date = LocalDate.of(2004, 2, 29);
		expect(date).toBeInstanceOf(LocalDate);
		expect(date.year).toEqual(2004);
		expect(date.month).toEqual(2);
		expect(date.dayOfMonth).toEqual(29);
	});
});
