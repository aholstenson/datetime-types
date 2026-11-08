import { DateInterval } from '../src/DateInterval.js';
import { Interval } from '../src/Interval.js';
import { LocalDate } from '../src/LocalDate.js';
import { LocalTime } from '../src/LocalTime.js';

const t = (hour: number) => LocalTime.of(hour);
const between = (a: number, b: number) => Interval.between(t(a), t(b));

describe('Interval operations', () => {
	it('encloses', () => {
		expect(between(8, 17).encloses(between(9, 12))).toBe(true);
		expect(between(8, 17).encloses(between(8, 17))).toBe(true);
		expect(between(8, 17).encloses(between(7, 12))).toBe(false);
		expect(between(8, 17).encloses(Interval.startingAt(t(9)))).toBe(false);
		expect(Interval.startingAt(t(8)).encloses(Interval.startingAt(t(9)))).toBe(true);
		expect(Interval.between<LocalTime>(null, null).encloses(between(8, 9))).toBe(true);
	});

	it('abuts', () => {
		expect(between(8, 12).abuts(between(12, 17))).toBe(true);
		expect(between(12, 17).abuts(between(8, 12))).toBe(true);
		expect(between(8, 12).abuts(between(13, 17))).toBe(false);
		expect(between(8, 13).abuts(between(12, 17))).toBe(false);
		expect(Interval.endingAt(t(12)).abuts(Interval.startingAt(t(12)))).toBe(true);
		expect(Interval.startingAt(t(12)).abuts(Interval.startingAt(t(12)))).toBe(false);
	});

	it('isBefore and isAfter with a value', () => {
		expect(between(8, 12).isBefore(t(12))).toBe(true);
		expect(between(8, 12).isBefore(t(11))).toBe(false);
		expect(Interval.startingAt(t(8)).isBefore(t(23))).toBe(false);
		expect(between(8, 12).isAfter(t(7))).toBe(true);
		expect(between(8, 12).isAfter(t(8))).toBe(false);
		expect(Interval.endingAt(t(8)).isAfter(t(0))).toBe(false);
	});

	it('isBefore and isAfter with an interval', () => {
		expect(between(8, 12).isBefore(between(12, 17))).toBe(true);
		expect(between(8, 13).isBefore(between(12, 17))).toBe(false);
		expect(between(8, 12).isBefore(Interval.endingAt(t(17)))).toBe(false);
		expect(between(12, 17).isAfter(between(8, 12))).toBe(true);
		expect(between(11, 17).isAfter(between(8, 12))).toBe(false);
		expect(between(12, 17).isAfter(Interval.startingAt(t(8)))).toBe(false);
	});

	it('intersection', () => {
		expect(between(8, 12).intersection(between(10, 17))?.toString()).toEqual('10:00:00/12:00:00');
		expect(between(8, 17).intersection(between(10, 12))?.toString()).toEqual('10:00:00/12:00:00');
		expect(between(8, 12).intersection(between(12, 17))).toBeNull();
		expect(Interval.endingAt(t(12)).intersection(Interval.startingAt(t(8)))?.toString())
			.toEqual('08:00:00/12:00:00');
		expect(between(8, 8).intersection(between(0, 23))).toBeNull();
	});

	it('span', () => {
		expect(between(8, 10).span(between(12, 17)).toString()).toEqual('08:00:00/17:00:00');
		expect(between(12, 17).span(between(8, 10)).toString()).toEqual('08:00:00/17:00:00');
		expect(between(8, 10).span(Interval.startingAt(t(12))).toString()).toEqual('08:00:00/..');
		expect(Interval.endingAt(t(8)).span(between(12, 17)).toString()).toEqual('../17:00:00');
	});
});

describe('DateInterval operations', () => {
	const march = DateInterval.from('2024-03-01/2024-03-31');
	const april = DateInterval.from('2024-04-01/2024-04-30');

	it('encloses', () => {
		expect(march.encloses('2024-03-10/2024-03-31')).toBe(true);
		expect(march.encloses('2024-03-10/2024-04-01')).toBe(false);
		expect(DateInterval.from('../..').encloses(march)).toBe(true);
		expect(march.encloses('2024-03-10/..')).toBe(false);
	});

	it('abuts when one interval ends the day before the other starts', () => {
		expect(march.abuts(april)).toBe(true);
		expect(april.abuts(march)).toBe(true);
		expect(march.abuts('2024-04-02/2024-04-30')).toBe(false);
		expect(march.abuts('2024-03-31/2024-04-30')).toBe(false);
		expect(DateInterval.from('../2024-02-29').abuts(march)).toBe(true);
		expect(DateInterval.from('2024-03-01/..').abuts(march)).toBe(false);
	});

	it('isBefore and isAfter', () => {
		expect(march.isBefore('2024-04-01')).toBe(true);
		expect(march.isBefore('2024-03-31')).toBe(false);
		expect(march.isBefore(april)).toBe(true);
		expect(march.isBefore(DateInterval.from('../2024-04-30'))).toBe(false);
		expect(DateInterval.from('2024-03-01/..').isBefore('3000-01-01')).toBe(false);
		expect(april.isAfter(march)).toBe(true);
		expect(april.isAfter('2024-04-01')).toBe(false);
		expect(april.isAfter({ year: 2024, month: 3, day: 31 })).toBe(true);
		expect(april.isAfter(DateInterval.from('2024-03-01/..'))).toBe(false);
		expect(DateInterval.from('../2024-04-30').isAfter('2000-01-01')).toBe(false);
	});

	it('intersection and span', () => {
		expect(march.intersection('2024-03-31/2024-04-30')?.toString()).toEqual('2024-03-31/2024-03-31');
		expect(march.intersection(april)).toBeNull();
		expect(march.span(april).toString()).toEqual('2024-03-01/2024-04-30');
		expect(march.span('2024-05-01/..').toString()).toEqual('2024-03-01/..');
	});

	it('overlaps, equals and compare accept strings', () => {
		expect(march.overlaps('2024-03-31/..')).toBe(true);
		expect(march.equals('2024-03-01/2024-03-31')).toBe(true);
		expect(march.compare('2024-04-01/2024-04-30')).toEqual(-1);
		expect([ '2024-04-01/..', '2024-03-01/..' ].sort(DateInterval.compare))
			.toEqual([ '2024-03-01/..', '2024-04-01/..' ]);
	});

	it('countDays includes both dates', () => {
		expect(march.countDays()).toEqual(31);
		expect(DateInterval.from('2024-03-01/2024-03-01').countDays()).toEqual(1);
		expect(DateInterval.from('2023-01-01/2024-12-31').countDays()).toEqual(731);
		expect(DateInterval.from('2024-03-01/..').countDays()).toEqual(Infinity);
	});

	it('goes through each date', () => {
		const dates = [ ...DateInterval.from('2024-02-27/2024-03-02').days() ].map(String);
		expect(dates).toEqual([ '2024-02-27', '2024-02-28', '2024-02-29', '2024-03-01', '2024-03-02' ]);
		expect([ ...march.days() ][30]).toBeInstanceOf(LocalDate);
		expect(() => DateInterval.from('2024-03-01/..').days()).toThrow(RangeError);
		expect(() => DateInterval.from('../2024-03-01').days()).toThrow(RangeError);
	});
});
