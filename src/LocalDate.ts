import { Month } from './Month';
import { WithYear } from './WithYear';
import { WithMonth } from './WithMonth';
import { WithDayOfMonth } from './WithDayOfMonth';

/**
 * Local date that represents just a date.
 */
export class LocalDate implements WithYear, WithMonth, WithDayOfMonth {
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
		year: WithYear | number,
		month: WithMonth | Month | number,
		dayOfMonth: WithDayOfMonth | number
	): LocalDate {
		if(typeof year !== 'number') {
			year = year.year;
		}

		if(typeof month !== 'number') {
			month = month.month;
		}

		if(typeof dayOfMonth !== 'number') {
			dayOfMonth = dayOfMonth.dayOfMonth;
		}

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
	 * Turn this object into a Date-object.
	 */
	public toDate() {
		return new Date(this.year, this.month - 1, this.dayOfMonth);
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
