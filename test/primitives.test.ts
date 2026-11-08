import { DateInterval } from '../src/DateInterval.js';
import { Interval } from '../src/Interval.js';
import { LocalDate } from '../src/LocalDate.js';
import { LocalDateTime } from '../src/LocalDateTime.js';
import { LocalTime } from '../src/LocalTime.js';
import { Month } from '../src/Month.js';
import { Year } from '../src/Year.js';

const date = LocalDate.of(2024, 3, 1);
const time = LocalTime.of(8, 30);

const values = [
	[ 'LocalDate', date, '2024-03-01' ],
	[ 'LocalTime', time, '08:30:00' ],
	[ 'LocalDateTime', LocalDateTime.fromDateAndTime(date, time), '2024-03-01T08:30:00' ],
	[ 'Year', Year.of(2024), '2024' ],
	[ 'Month', Month.of(3), '--03' ],
	[ 'Interval', Interval.between(time, LocalTime.of(9)), '08:30:00/09:00:00' ],
	[ 'DateInterval', DateInterval.from(date), '2024-03-01/..' ]
] as const;

describe.each(values)('%s', (_name, value, expected) => {
	it('toJSON() gives the ISO string', () => {
		expect(value.toJSON()).toEqual(expected);
		expect(JSON.stringify({ value })).toEqual('{"value":"' + expected + '"}');
	});

	it('valueOf() throws a TypeError', () => {
		expect(() => value.valueOf()).toThrow(TypeError);
	});

	it('operators that need a primitive value throw', () => {
		const other: unknown = value;
		expect(() => (other as number) < (other as number)).toThrow(TypeError);
		expect(() => (other as number) + 1).toThrow(TypeError);
	});

	it('String() and template strings use toString()', () => {
		expect(String(value)).toEqual(expected);
		expect(`${value}`).toEqual(expected);
	});
});
