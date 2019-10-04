import { LocalDate } from '../src/LocalDate';

describe('LocalDate', () => {
	it('of(2004, 8, 4)', () => {
		const date = LocalDate.of(2004, 8, 4);
		expect(date).toBeInstanceOf(LocalDate);

		expect(date.year).toEqual(2004);
		expect(date.month).toEqual(8);
		expect(date.dayOfMonth).toEqual(4);

		expect(date.toString()).toEqual('2004-08-04');
	});

	it('of(2004, 2, 28)', () => {
		const date = LocalDate.of(2004, 2, 28);
		expect(date).toBeInstanceOf(LocalDate);

		expect(date.year).toEqual(2004);
		expect(date.month).toEqual(2);
		expect(date.dayOfMonth).toEqual(28);

		expect(date.toString()).toEqual('2004-02-28');
	});

	it('of(2004, 2, 29)', () => {
		const date = LocalDate.of(2004, 2, 29);
		expect(date).toBeInstanceOf(LocalDate);

		expect(date.year).toEqual(2004);
		expect(date.month).toEqual(2);
		expect(date.dayOfMonth).toEqual(29);

		expect(date.toString()).toEqual('2004-02-29');
	});

	it('of(2004, 2, 30)', () => {
		try {
			LocalDate.of(2004, 2, 30);
			fail();
		} catch {}
	});

	it('of(201, 12, 2)', () => {
		const date = LocalDate.of(201, 12, 2);
		expect(date).toBeInstanceOf(LocalDate);

		expect(date.year).toEqual(201);
		expect(date.month).toEqual(12);
		expect(date.dayOfMonth).toEqual(2);

		expect(date.toString()).toEqual('0201-12-02');
	});

	it('of(-201, 12, 2)', () => {
		const date = LocalDate.of(-201, 12, 2);
		expect(date).toBeInstanceOf(LocalDate);

		expect(date.year).toEqual(-201);
		expect(date.month).toEqual(12);
		expect(date.dayOfMonth).toEqual(2);

		expect(date.toString()).toEqual('-0201-12-02');
	});

	it('of(20240, 12, 2)', () => {
		const date = LocalDate.of(20240, 12, 2);
		expect(date).toBeInstanceOf(LocalDate);

		expect(date.year).toEqual(20240);
		expect(date.month).toEqual(12);
		expect(date.dayOfMonth).toEqual(2);

		expect(date.toString()).toEqual('+20240-12-02');
	});
});
