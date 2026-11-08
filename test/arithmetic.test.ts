import { Duration } from '../src/Duration.js';
import { LocalDate } from '../src/LocalDate.js';
import { LocalDateTime } from '../src/LocalDateTime.js';
import { LocalTime } from '../src/LocalTime.js';

const Temporal = (globalThis as any).Temporal;

describe('LocalDate arithmetic', () => {
	const jan31 = LocalDate.of(2024, 1, 31);

	describe('with', () => {
		it('changes fields', () => {
			expect(jan31.with({ day: 1 }).toString()).toEqual('2024-01-01');
			expect(jan31.with({ year: 2023, month: 6 }).toString()).toEqual('2023-06-30');
		});

		it('constrains by default and rejects with overflow reject', () => {
			expect(jan31.with({ month: 2 }).toString()).toEqual('2024-02-29');
			expect(jan31.with({ month: 13 }).toString()).toEqual('2024-12-31');
			expect(() => jan31.with({ month: 2 }, { overflow: 'reject' })).toThrow(RangeError);
		});

		it('throws for a month or day below 1', () => {
			expect(() => jan31.with({ month: 0 })).toThrow(RangeError);
			expect(() => jan31.with({ day: 0 })).toThrow(RangeError);
		});

		it('throws TypeError without fields', () => {
			expect(() => jan31.with({})).toThrow(TypeError);
			expect(() => jan31.with(null as any)).toThrow(TypeError);
		});

		it('throws RangeError for a bad overflow option', () => {
			expect(() => jan31.with({ day: 1 }, { overflow: 'wrap' as any })).toThrow(RangeError);
		});
	});

	describe('add and subtract', () => {
		it('adds months and constrains the day', () => {
			expect(jan31.add({ months: 1 }).toString()).toEqual('2024-02-29');
			expect(() => jan31.add({ months: 1 }, { overflow: 'reject' })).toThrow(RangeError);
		});

		it('adds weeks and days', () => {
			expect(jan31.add({ weeks: 1, days: 1 }).toString()).toEqual('2024-02-08');
			expect(jan31.add('P1Y').toString()).toEqual('2025-01-31');
		});

		it('adds hours as whole days', () => {
			expect(jan31.add({ hours: 25 }).toString()).toEqual('2024-02-01');
			expect(jan31.add({ hours: -25 }).toString()).toEqual('2024-01-30');
		});

		it('subtracts', () => {
			expect(LocalDate.of(2024, 3, 31).subtract({ months: 1 }).toString()).toEqual('2024-02-29');
			expect(LocalDate.of(2024, 1, 1).subtract({ days: 1 }).toString()).toEqual('2023-12-31');
		});
	});

	describe('until and since', () => {
		const mar1 = LocalDate.of(2024, 3, 1);

		it('gives days by default', () => {
			expect(jan31.until(mar1).toString()).toEqual('P30D');
			expect(mar1.until(jan31).toString()).toEqual('-P30D');
			expect(mar1.since(jan31).toString()).toEqual('P30D');
		});

		it('uses largestUnit', () => {
			expect(jan31.until(mar1, { largestUnit: 'months' }).toString()).toEqual('P1M1D');
			expect(jan31.until('2025-03-01', { largestUnit: 'year' }).toString()).toEqual('P1Y1M1D');
			expect(jan31.until(mar1, { largestUnit: 'weeks' }).toString()).toEqual('P4W2D');
			expect(jan31.until(mar1, { largestUnit: 'auto' }).toString()).toEqual('P30D');
		});

		it('gives zero for the same date', () => {
			expect(jan31.until(jan31, { largestUnit: 'years' }).blank).toBe(true);
		});

		it('throws RangeError for a time unit', () => {
			expect(() => jan31.until(mar1, { largestUnit: 'hours' as any })).toThrow(RangeError);
		});
	});
});

describe('LocalTime arithmetic', () => {
	const time = LocalTime.of(8, 30);

	it('with changes fields and constrains', () => {
		expect(time.with({ minute: 0 }).toString()).toEqual('08:00:00');
		expect(time.with({ hour: 25 }).toString()).toEqual('23:30:00');
		expect(time.with({ hour: -1 }).toString()).toEqual('00:30:00');
		expect(() => time.with({ hour: 25 }, { overflow: 'reject' })).toThrow(RangeError);
		expect(() => time.with({})).toThrow(TypeError);
	});

	it('add goes around midnight and ignores days', () => {
		expect(time.add({ hours: 20 }).toString()).toEqual('04:30:00');
		expect(time.add({ days: 3, hours: 1 }).toString()).toEqual('09:30:00');
		expect(time.subtract({ hours: 9 }).toString()).toEqual('23:30:00');
		expect(time.add('PT0.5S').toString()).toEqual('08:30:00.5');
	});

	it('until and since', () => {
		expect(time.until('10:00').toString()).toEqual('PT1H30M');
		expect(time.until('10:00', { largestUnit: 'minutes' }).toString()).toEqual('PT90M');
		expect(time.until('07:00').toString()).toEqual('-PT1H30M');
		expect(time.since('07:00').toString()).toEqual('PT1H30M');
		expect(time.until('08:30:00.25', { largestUnit: 'millisecond' }).toString()).toEqual('PT0.25S');
		expect(() => time.until('07:00', { largestUnit: 'days' as any })).toThrow(RangeError);
	});
});

describe('Arithmetic with the largest duration', () => {
	const max = Number.MAX_SAFE_INTEGER;
	const dayMs = 86_400_000n;
	const days = Number(BigInt(max) / dayMs);
	const rest = Number(BigInt(max) % dayMs);

	it('gives an exact LocalTime', () => {
		expect(LocalTime.of(0).add({ milliseconds: max }).toString())
			.toEqual(LocalTime.of(0).add({ milliseconds: rest }).toString());
		expect(LocalTime.of(23, 59, 59, 999).subtract({ milliseconds: max }).toString())
			.toEqual(LocalTime.of(23, 59, 59, 999).subtract({ milliseconds: rest }).toString());
	});

	it('gives an exact LocalDate', () => {
		const date = LocalDate.of(-200000, 1, 1);
		expect(date.add({ milliseconds: max }).toString())
			.toEqual(date.add({ days }).toString());
		expect(date.add({ milliseconds: max }).subtract({ milliseconds: max }).toString())
			.toEqual(date.toString());
	});

	it('gives an exact LocalDateTime', () => {
		const value = LocalDateTime.of(-200000, 1, 1, 23, 59, 59, 999);
		expect(value.add({ milliseconds: max }).toString())
			.toEqual(value.add({ days }).add({ milliseconds: rest }).toString());
	});

	it('throws RangeError when until() gives a duration above the limit', () => {
		const first = LocalDateTime.of(-271821, 1, 1);
		const last = LocalDateTime.of(275760, 1, 1);
		expect(() => first.until(last, { largestUnit: 'hours' })).toThrow(RangeError);
		expect(() => last.since(first, { largestUnit: 'milliseconds' })).toThrow(RangeError);
		expect(first.until(last).days).toEqual(199_999_853);
	});
});

describe('LocalDateTime arithmetic', () => {
	const value = LocalDateTime.of(2024, 1, 31, 8);

	it('with changes date and time fields', () => {
		expect(value.with({ month: 2, hour: 30 }).toString()).toEqual('2024-02-29T23:00:00');
		expect(() => value.with({ month: 2 }, { overflow: 'reject' })).toThrow(RangeError);
		expect(() => value.with({})).toThrow(TypeError);
	});

	it('add moves the date when the time goes past midnight', () => {
		expect(value.add({ hours: 16 }).toString()).toEqual('2024-02-01T00:00:00');
		expect(value.add({ hours: -9 }).toString()).toEqual('2024-01-30T23:00:00');
		expect(value.add({ months: 1, hours: 1 }).toString()).toEqual('2024-02-29T09:00:00');
		expect(value.subtract('P1D').toString()).toEqual('2024-01-30T08:00:00');
	});

	it('until borrows a day when the time goes the other way', () => {
		const a = LocalDateTime.from('2024-03-01T10:00');
		expect(a.until('2024-03-02T08:00').toString()).toEqual('PT22H');
		expect(a.until('2024-03-02T08:00', { largestUnit: 'minutes' }).toString()).toEqual('PT1320M');
		expect(a.until('2024-03-03T12:00').toString()).toEqual('P2DT2H');
		expect(a.until('2024-03-03T12:00', { largestUnit: 'hours' }).toString()).toEqual('PT50H');
		expect(a.since('2024-02-29T12:00').toString()).toEqual('PT22H');
	});
});

describe.skipIf(! Temporal)('Arithmetic and Temporal', () => {
	const dates = [
		'2024-01-31', '2024-02-29', '2023-02-28', '2024-03-01', '2024-12-31',
		'2000-02-29', '1999-12-31', '1970-01-01', '0000-03-01', '-000400-02-29', '2100-02-28'
	];
	const durations = [
		'P1M', '-P1M', 'P1Y', '-P1Y', 'P13M', 'P1Y1M1D', '-P2Y11M30D', 'P5W', 'P400D', '-P1000D',
		'PT25H', '-PT25H', 'PT0.5S', 'P1MT23H59M59.999S', '-P1DT1H'
	];
	const times = [ '00:00', '08:30', '12:00:00.5', '23:59:59.999' ];

	it('LocalDate.add and subtract', () => {
		for(const date of dates) {
			for(const duration of durations) {
				for(const overflow of [ 'constrain', 'reject' ] as const) {
					const plain = Temporal.PlainDate.from(date);
					expect(outcome(() => LocalDate.from(date).add(duration, { overflow }).toString()))
						.toEqual(outcome(() => plain.add(duration, { overflow }).toString()));
					expect(outcome(() => LocalDate.from(date).subtract(duration, { overflow }).toString()))
						.toEqual(outcome(() => plain.subtract(duration, { overflow }).toString()));
				}
			}
		}
	});

	it('LocalDate.until and since', () => {
		for(const a of dates) {
			for(const b of dates) {
				for(const largestUnit of [ 'years', 'months', 'weeks', 'days' ]) {
					const plain = Temporal.PlainDate.from(a);
					expect(LocalDate.from(a).until(b, { largestUnit } as any).toString())
						.toEqual(plain.until(b, { largestUnit }).toString());
					expect(LocalDate.from(a).since(b, { largestUnit } as any).toString())
						.toEqual(plain.since(b, { largestUnit }).toString());
				}
			}
		}
	});

	it('LocalDate.with', () => {
		const changes = [ { day: 31 }, { month: 2 }, { month: 13 }, { year: 2023, month: 2, day: 30 }, { day: 40 } ];
		for(const date of dates) {
			for(const change of changes) {
				for(const overflow of [ 'constrain', 'reject' ] as const) {
					expect(outcome(() => LocalDate.from(date).with(change, { overflow }).toString()))
						.toEqual(outcome(() => Temporal.PlainDate.from(date).with(change, { overflow }).toString()));
				}
			}
		}
	});

	it('LocalTime.add, until and since', () => {
		for(const a of times) {
			for(const duration of durations) {
				expect(LocalTime.from(a).add(duration).toString())
					.toEqual(Temporal.PlainTime.from(a).add(duration).toString());
				expect(LocalTime.from(a).subtract(duration).toString())
					.toEqual(Temporal.PlainTime.from(a).subtract(duration).toString());
			}

			for(const b of times) {
				for(const largestUnit of [ 'hours', 'minutes', 'seconds', 'milliseconds' ]) {
					expect(LocalTime.from(a).until(b, { largestUnit } as any).toString())
						.toEqual(Temporal.PlainTime.from(a).until(b, { largestUnit }).toString());
					expect(LocalTime.from(a).since(b, { largestUnit } as any).toString())
						.toEqual(Temporal.PlainTime.from(a).since(b, { largestUnit }).toString());
				}
			}
		}
	});

	it('LocalDateTime.add, until and since', () => {
		const values = dates.flatMap(date => times.map(time => date + 'T' + time));
		for(const a of values) {
			const plain = Temporal.PlainDateTime.from(a);
			for(const duration of durations) {
				expect(outcome(() => LocalDateTime.from(a).add(duration).toString()))
					.toEqual(outcome(() => plain.add(duration).toString()));
				expect(outcome(() => LocalDateTime.from(a).subtract(duration).toString()))
					.toEqual(outcome(() => plain.subtract(duration).toString()));
			}
		}

		const units = [ 'years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds' ];
		const some = values.filter((_, index) => index % 3 === 0);
		for(const a of some) {
			const plain = Temporal.PlainDateTime.from(a);
			for(const b of some) {
				for(const largestUnit of units) {
					expect(LocalDateTime.from(a).until(b, { largestUnit } as any).toString())
						.toEqual(plain.until(b, { largestUnit }).toString());
					expect(LocalDateTime.from(a).since(b, { largestUnit } as any).toString())
						.toEqual(plain.since(b, { largestUnit }).toString());
				}
			}
		}
	});

	it('Duration values from until work with Temporal', () => {
		const duration: Duration = LocalDate.of(2024, 1, 31).until('2025-03-01', { largestUnit: 'years' });
		expect(Temporal.PlainDate.from('2024-01-31').add(duration).toString()).toEqual('2025-03-01');
	});
});

/**
 * Get the result of a function, or the name of the error it throws.
 */
function outcome(fn: () => string) {
	try {
		return fn();
	} catch(error) {
		return (error as Error).constructor.name;
	}
}
