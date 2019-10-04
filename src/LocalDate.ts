import { LocalDateLike } from './types';

import { assertInt } from './helpers/assertInt';

import { Month } from './Month';
import { zeroPadInt } from './helpers/zeroPadInt';

/**
 * Local date that represents just a date.
 */
export class LocalDate implements LocalDateLike {
	/**
	 * The year of the date.
	 */
	public readonly year: number;

	/**
	 * The month of the date.
	 */
	public readonly month: Month;

	/**
	 * The day of the month.
	 */
	public readonly dayOfMonth: number;

	private constructor(year: number, month: number, dayOfMonth: number) {
		this.year = year;
		this.month = month;
		this.dayOfMonth = dayOfMonth;
	}

	/**
	 * Turn this object into a Date-object.
	 */
	public toDateAtMidnight() {
		return new Date(this.year, this.month - 1, this.dayOfMonth, 0, 0, 0, 0);
	}

	/**
	 * Turn this date into a standard string representation.
	 */
	public toString() {
		let result = '';
		if(this.year < 0) {
			result += '-' + zeroPadInt(Math.abs(this.year), 4);
		} else if(this.year > 9999) {
			result += '+' + zeroPadInt(this.year, 4);
		} else {
			result += zeroPadInt(this.year, 4);
		}

		result += '-' + zeroPadInt(this.month, 2);
		result += '-' + zeroPadInt(this.dayOfMonth, 2);
		return result;
	}


	/**
	 * Create a local date using the given year, month and day. Will throw an
	 * error if the date is invalid.
	 *
	 * @param year
	 *   the year of the date
	 * @param month
	 *   the month of the date
	 * @param dayOfMonth
	 *   the day of the month
	 */
	public static of(
		year: number,
		month: Month | number,
		dayOfMonth: number
	): LocalDate {
		year = assertInt(year);
		month = assertInt(month);
		dayOfMonth = assertInt(dayOfMonth);

		if(month < 1 || month > 12) {
			throw new Error('month must be between 1 and 12');
		}

		let daysInMonth = 31;
		switch(month) {
			case 2:
				daysInMonth = isLeapYear(year) ? 29 : 28;
				break;
			case 4:
			case 6:
			case 9:
			case 11:
				daysInMonth = 30;
				break;
		}

		if(dayOfMonth < 1 || dayOfMonth > daysInMonth) {
			throw new Error('dayOfMonth must be between 1 and ' + daysInMonth);
		}

		return new LocalDate(year, month, dayOfMonth);
	}

	/**
	 * Create a local date from the given `Date` instance.
	 *
	 * @param date
	 */
	public static fromDate(date: Date): LocalDate {
		return this.of(
			date.getFullYear(),
			date.getMonth() + 1,
			date.getDate()
		);
	}

	/**
	 * Create a local time from an object containing numeric `year`, `month`
	 * and `dayOfMonth` properties.
	 *
	 * @param object
	 */
	public static from(object: LocalDateLike) {
		return this.of(
			object.year,
			object.month,
			object.dayOfMonth
		);
	}
}

/**
 * Check if a year is a leap year. Follows the rules outlined in ISO 8601.
 *
 * @param year
 */
function isLeapYear(year: number) {
	if((year & 3) !== 0) {
		return false;
	}

	return (year % 100) !== 0 || (year % 400) === 0;
}
