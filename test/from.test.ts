import { DateInterval } from '../src/DateInterval.js';
import { Interval } from '../src/Interval.js';
import { LocalDate } from '../src/LocalDate.js';
import { LocalDateTime } from '../src/LocalDateTime.js';
import { LocalTime } from '../src/LocalTime.js';
import { Month } from '../src/Month.js';
import { Year } from '../src/Year.js';

describe('LocalDate.from', () => {
	it.each([
		[ '2024-03-01', '2024-03-01' ],
		[ '0005-01-02', '0005-01-02' ],
		[ '+020240-12-02', '+020240-12-02' ],
		[ '-000201-12-02', '-000201-12-02' ],
		[ '+002024-03-01', '2024-03-01' ]
	])('reads %s', (text, expected) => {
		expect(LocalDate.from(text).toString()).toEqual(expected);
	});

	it.each([
		'2024-3-1',
		'20240301',
		'2024-03-01T00:00',
		'+20240-12-02',
		'-0201-12-02',
		'-000000-01-01',
		' 2024-03-01',
		'2024-02-30',
		'2024-13-01',
		''
	])('rejects %j', text => {
		expect(() => LocalDate.from(text)).toThrow();
	});

	it('returns the same LocalDate', () => {
		const date = LocalDate.of(2024, 3, 1);
		expect(LocalDate.from(date)).toBe(date);
	});

	it('reads an object with the iso8601 calendar', () => {
		expect(LocalDate.from({ year: 2024, month: 3, day: 1, calendarId: 'iso8601' }).toString())
			.toEqual('2024-03-01');
	});

	it('rejects an object with another calendar', () => {
		expect(() => LocalDate.from({ year: 5784, month: 6, day: 1, calendarId: 'hebrew' })).toThrow();
	});

	it('reads the date of a LocalDateTime', () => {
		expect(LocalDate.from(LocalDateTime.of(2024, 3, 1, 8)).toString()).toEqual('2024-03-01');
	});
});

describe('LocalTime.from', () => {
	it.each([
		[ '08:30', '08:30:00' ],
		[ '08:30:15', '08:30:15' ],
		[ '08:30:15.5', '08:30:15.5' ],
		[ '08:30:15,5', '08:30:15.5' ],
		[ '08:30:15.123', '08:30:15.123' ],
		[ '08:30:15.123000000', '08:30:15.123' ],
		[ '23:59:59.999', '23:59:59.999' ]
	])('reads %s', (text, expected) => {
		expect(LocalTime.from(text).toString()).toEqual(expected);
	});

	it.each([
		'8:30',
		'0830',
		'08:30:15.',
		'08:30:15.1234',
		'08:30:15.123000001',
		'24:00',
		'08:60',
		'T08:30',
		''
	])('rejects %j', text => {
		expect(() => LocalTime.from(text)).toThrow();
	});

	it('returns the same LocalTime', () => {
		const time = LocalTime.of(8);
		expect(LocalTime.from(time)).toBe(time);
	});

	it('accepts zero microseconds and nanoseconds', () => {
		expect(LocalTime.from({ hour: 8, microsecond: 0, nanosecond: 0 }).toString()).toEqual('08:00:00');
	});

	it('rejects microseconds', () => {
		expect(() => LocalTime.from({ hour: 8, microsecond: 1 })).toThrow();
	});

	it('rejects nanoseconds', () => {
		expect(() => LocalTime.from({ hour: 8, nanosecond: 1 })).toThrow();
	});

	it('reads the time of a LocalDateTime', () => {
		expect(LocalTime.from(LocalDateTime.of(2024, 3, 1, 8, 30)).toString()).toEqual('08:30:00');
	});
});

describe('LocalDateTime', () => {
	it('of(year, month, day) is at midnight', () => {
		expect(LocalDateTime.of(2024, 3, 1).toString()).toEqual('2024-03-01T00:00:00');
	});

	it('of(year, month, day, hour, minute, second, millisecond)', () => {
		expect(LocalDateTime.of(2024, 3, 1, 8, 30, 15, 250).toString()).toEqual('2024-03-01T08:30:15.25');
	});

	it.each([
		[ '2024-03-01T08:30', '2024-03-01T08:30:00' ],
		[ '2024-03-01t08:30:15.5', '2024-03-01T08:30:15.5' ],
		[ '+020240-03-01T08:30:00', '+020240-03-01T08:30:00' ]
	])('from(%s)', (text, expected) => {
		expect(LocalDateTime.from(text).toString()).toEqual(expected);
	});

	it.each([
		'2024-03-01',
		'2024-03-01 08:30',
		'2024-03-01T08:30:00Z',
		'2024-03-01T08:30:00.0001'
	])('from(%j) throws', text => {
		expect(() => LocalDateTime.from(text)).toThrow();
	});

	it('from(object) uses zero for missing time fields', () => {
		expect(LocalDateTime.from({ year: 2024, month: 3, day: 1, hour: 8 }).toString())
			.toEqual('2024-03-01T08:00:00');
	});

	it('from(object) rejects another calendar', () => {
		expect(() => LocalDateTime.from({ year: 2024, month: 3, day: 1, calendarId: 'gregory' })).toThrow();
	});

	it('from(object) rejects nanoseconds', () => {
		expect(() => LocalDateTime.from({ year: 2024, month: 3, day: 1, nanosecond: 5 })).toThrow();
	});

	it('from(LocalDateTime) returns the same value', () => {
		const value = LocalDateTime.of(2024, 3, 1);
		expect(LocalDateTime.from(value)).toBe(value);
	});
});

describe('Year.from', () => {
	it.each([
		[ '2024', 2024 ],
		[ '0005', 5 ],
		[ '+020240', 20240 ],
		[ '-000005', -5 ]
	])('reads %s', (text, expected) => {
		expect(Year.from(text).year).toEqual(expected);
	});

	it.each([ '24', '+2024', '-000000', '2024-01' ])('rejects %j', text => {
		expect(() => Year.from(text)).toThrow();
	});

	it('reads the year of a LocalDate', () => {
		expect(Year.from(LocalDate.of(2024, 3, 1)).year).toEqual(2024);
	});

	it('returns the same Year', () => {
		const year = Year.of(2024);
		expect(Year.from(year)).toBe(year);
	});

	it('rejects another calendar', () => {
		expect(() => Year.from({ year: 5784, calendarId: 'hebrew' })).toThrow();
	});
});

describe('Month.from', () => {
	it('reads --03', () => {
		expect(Month.from('--03')).toBe(Month.MARCH);
	});

	it.each([ '03', '--3', '--13', '--00', '2024-03' ])('rejects %j', text => {
		expect(() => Month.from(text)).toThrow();
	});

	it('reads the month of a LocalDate', () => {
		expect(Month.from(LocalDate.of(2024, 3, 1))).toBe(Month.MARCH);
	});

	it('returns the same Month', () => {
		expect(Month.from(Month.MAY)).toBe(Month.MAY);
	});

	it('rejects another calendar', () => {
		expect(() => Month.from({ month: 3, calendarId: 'hebrew' })).toThrow();
	});
});

describe('static compare', () => {
	it('LocalDate.compare sorts dates and strings', () => {
		const sorted = [ '2024-03-02', LocalDate.of(2023, 1, 1), '2024-03-01' ].sort(LocalDate.compare);
		expect(sorted.map(v => String(v))).toEqual([ '2023-01-01', '2024-03-01', '2024-03-02' ]);
	});

	it('LocalTime.compare', () => {
		expect([ '12:00', '08:00', '08:00:00.5' ].sort(LocalTime.compare)).toEqual([ '08:00', '08:00:00.5', '12:00' ]);
	});

	it('LocalDateTime.compare', () => {
		expect(LocalDateTime.compare('2024-03-01T08:00', '2024-03-01T07:59')).toEqual(1);
		expect(LocalDateTime.compare('2024-03-01T08:00', { year: 2024, month: 3, day: 1, hour: 8 })).toEqual(0);
	});

	it('Year.compare', () => {
		expect([ Year.of(2024), Year.of(-5), Year.of(20240) ].sort(Year.compare).map(String))
			.toEqual([ '-000005', '2024', '+020240' ]);
	});

	it('Month.compare', () => {
		expect([ Month.MAY, Month.JANUARY, Month.MARCH ].sort(Month.compare)).toEqual([ Month.JANUARY, Month.MARCH, Month.MAY ]);
	});

	it('Interval.compare', () => {
		const a = Interval.between(LocalTime.of(8), LocalTime.of(12));
		const b = Interval.until(LocalTime.of(10));
		expect([ a, b ].sort(Interval.compare)).toEqual([ b, a ]);
	});

	it('DateInterval.compare', () => {
		const a = DateInterval.parse('2024-03-01/2024-03-31');
		const b = DateInterval.parse('../2024-01-01');
		expect([ a, b ].sort(DateInterval.compare)).toEqual([ b, a ]);
	});
});

describe('interval parse', () => {
	it.each([
		'2024-03-01/2024-03-31',
		'2024-03-01/..',
		'../2024-03-31',
		'../..'
	])('DateInterval.parse(%s) gives the same string back', text => {
		expect(DateInterval.parse(text).toString()).toEqual(text);
	});

	it.each([
		'2024-03-01',
		'2024-03-01/2024-03-31/2024-04-01',
		'2024-03-31/2024-03-01',
		'2024-03-01/P1M',
		'2024-03-01/'
	])('DateInterval.parse(%j) throws', text => {
		expect(() => DateInterval.parse(text)).toThrow();
	});

	it('Interval.parse reads each side with the given function', () => {
		const interval = Interval.parse('08:00/17:00', LocalTime.from);
		expect(interval.equals(Interval.between(LocalTime.of(8), LocalTime.of(17)))).toBe(true);
		expect(interval.toString()).toEqual('08:00:00/17:00:00');
	});

	it('Interval.parse reads open sides', () => {
		expect(Interval.parse('2024/..', Year.from).equals(Interval.from(Year.of(2024)))).toBe(true);
	});

	it('Interval.parse throws when the start is after the end', () => {
		expect(() => Interval.parse('17:00/08:00', LocalTime.from)).toThrow();
	});
});
