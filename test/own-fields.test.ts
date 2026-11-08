/*
 * A debugger and `console.log` show the own properties of an object first.
 * Each type keeps its fields as own properties, so that the console shows the
 * value without the need to expand nested objects or call getters.
 */
import { DateInterval } from '../src/DateInterval.js';
import { Duration } from '../src/Duration.js';
import { Interval } from '../src/Interval.js';
import { LocalDate } from '../src/LocalDate.js';
import { LocalDateTime } from '../src/LocalDateTime.js';
import { LocalTime } from '../src/LocalTime.js';
import { Month } from '../src/Month.js';
import { Year } from '../src/Year.js';
import { YearMonth } from '../src/YearMonth.js';

describe('Own properties', () => {
	it.each([
		[ 'LocalDate', LocalDate.of(2024, 3, 1), { year: 2024, month: 3, day: 1 } ],
		[ 'LocalTime', LocalTime.of(8, 30, 15, 250), { hour: 8, minute: 30, second: 15, millisecond: 250 } ],
		[
			'LocalDateTime',
			LocalDateTime.of(2024, 3, 1, 8, 30, 15, 250),
			{ year: 2024, month: 3, day: 1, hour: 8, minute: 30, second: 15, millisecond: 250 }
		],
		[ 'Year', Year.of(2024), { year: 2024 } ],
		[ 'Month', Month.MARCH, { month: 3 } ],
		[ 'YearMonth', YearMonth.of(2024, 3), { year: 2024, month: 3 } ],
		[
			'Duration',
			Duration.from({ days: 1 }),
			{ years: 0, months: 0, weeks: 0, days: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
		]
	])('%s has only its fields as own properties', (_, value, fields) => {
		expect({ ...value }).toEqual(fields);
		expect(Object.getOwnPropertyNames(value).sort()).toEqual(Object.keys(fields).sort());
	});

	it('intervals have the start and the end as own properties', () => {
		const times = Interval.between(LocalTime.of(8), LocalTime.of(17));
		expect(Object.getOwnPropertyNames(times).sort()).toEqual([ 'end', 'start' ]);

		const dates = DateInterval.from('2024-03-01/..');
		expect(Object.getOwnPropertyNames(dates).sort()).toEqual([ 'end', 'start' ]);
	});

	it('LocalDateTime still gives its date and time parts', () => {
		const value = LocalDateTime.of(2024, 3, 1, 8, 30);
		expect(value.toLocalDate().equals('2024-03-01')).toBe(true);
		expect(value.toLocalTime().equals('08:30')).toBe(true);
		expect(value.dayOfWeek).toEqual(5);
	});
});
