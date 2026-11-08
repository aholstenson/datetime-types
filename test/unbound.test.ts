/*
 * Static methods must work when they are called without their class, such as
 * when they are given to `Array.map` or `Array.sort`.
 */
import { LocalDate } from '../src/LocalDate.js';
import { LocalDateTime } from '../src/LocalDateTime.js';
import { LocalTime } from '../src/LocalTime.js';
import { Month } from '../src/Month.js';
import { Year } from '../src/Year.js';

const date = new Date(2024, 2, 1, 8, 30, 15, 250);

describe('Static methods without their class', () => {
	it('Month.of', () => {
		expect([ 1, 12 ].map(Month.of)).toEqual([ Month.JANUARY, Month.DECEMBER ]);
	});

	it('fromDate', () => {
		expect([ date ].map(LocalDate.fromDate).map(String)).toEqual([ '2024-03-01' ]);
		expect([ date ].map(LocalTime.fromDate).map(String)).toEqual([ '08:30:15.25' ]);
		expect([ date ].map(LocalDateTime.fromDate).map(String))
			.toEqual([ '2024-03-01T08:30:15.25' ]);
		expect([ date ].map(Year.fromDate).map(String)).toEqual([ '2024' ]);
	});

	it('LocalTime.now', () => {
		const now = LocalTime.now;
		expect(now()).toBeInstanceOf(LocalTime);
	});

	it('from and compare', () => {
		expect([ '2024-03-02', '2024-03-01' ].map(LocalDate.from).sort(LocalDate.compare).map(String))
			.toEqual([ '2024-03-01', '2024-03-02' ]);
		expect([ '--03' ].map(Month.from)).toEqual([ Month.MARCH ]);
		expect([ '2024' ].map(Year.from).map(String)).toEqual([ '2024' ]);
		expect([ '08:30' ].map(LocalTime.from).map(String)).toEqual([ '08:30:00' ]);
		expect([ '2024-03-01T08:30' ].map(LocalDateTime.from).map(String))
			.toEqual([ '2024-03-01T08:30:00' ]);
	});
});
