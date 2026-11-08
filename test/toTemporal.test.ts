import { Duration } from '../src/Duration.js';
import { LocalDate } from '../src/LocalDate.js';
import { LocalDateTime } from '../src/LocalDateTime.js';
import { LocalTime } from '../src/LocalTime.js';
import { YearMonth } from '../src/YearMonth.js';

const Temporal = (globalThis as any).Temporal;

const values = [
	[ LocalDate.of(2024, 3, 1), 'PlainDate' ],
	[ LocalTime.of(8, 30, 15, 250), 'PlainTime' ],
	[ LocalDateTime.of(2024, 3, 1, 8, 30, 15, 250), 'PlainDateTime' ],
	[ YearMonth.of(2024, 3), 'PlainYearMonth' ],
	[ Duration.from('P1Y2M3W4DT5H6M7.008S'), 'Duration' ]
] as const;

describe.skipIf(! Temporal)('toTemporal with the global Temporal', () => {
	it.each(values)('%s becomes Temporal.%s', (value, name) => {
		const result = value.toTemporal();
		expect(result).toBeInstanceOf(Temporal[name]);
		expect(result.toString()).toEqual(value.toString());
	});

	it('gives the same value back with from()', () => {
		const date = LocalDate.of(-5, 12, 31);
		expect(LocalDate.from(date.toTemporal()).equals(date)).toBe(true);
	});
});

describe('toTemporal without a global Temporal', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it.each(values)('%s throws TypeError', value => {
		vi.stubGlobal('Temporal', undefined);
		expect(() => value.toTemporal()).toThrow(TypeError);
	});

	it('uses a Temporal object that is given, such as a polyfill', () => {
		vi.stubGlobal('Temporal', undefined);

		class PlainDate {
			public readonly fields: object;
			constructor(fields: object) {
				this.fields = fields;
			}
			static from(fields: object) {
				return new PlainDate(fields);
			}
		}

		const result = LocalDate.of(2024, 3, 1).toTemporal({ PlainDate });
		expect(result).toBeInstanceOf(PlainDate);
		expect(result.fields).toEqual({ year: 2024, month: 3, day: 1 });
	});
});
