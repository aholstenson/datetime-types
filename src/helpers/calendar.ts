/**
 * Calendar calculations for the ISO 8601 calendar. This is the proleptic
 * Gregorian calendar: the Gregorian rules apply to every year, also to years
 * before 1582 and to year 0 and earlier.
 */

import type { DayOfWeek } from '../DayOfWeek.js';

const DAYS_BEFORE_MONTH = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];

/**
 * Get if a year is a leap year.
 *
 * @param year
 */
export function isLeapYear(year: number) {
	if(year % 4 !== 0) {
		return false;
	}

	return year % 100 !== 0 || year % 400 === 0;
}

/**
 * Get the number of days in a year, 365 or 366.
 *
 * @param year
 */
export function daysInYear(year: number) {
	return isLeapYear(year) ? 366 : 365;
}

/**
 * Get the number of days in a month of a year.
 *
 * @param year
 * @param month
 *   the month, from 1 to 12
 */
export function daysInMonth(year: number, month: number) {
	switch(month) {
		case 2:
			return isLeapYear(year) ? 29 : 28;
		case 4:
		case 6:
		case 9:
		case 11:
			return 30;
		default:
			return 31;
	}
}

/**
 * Get the day of the year, from 1 for 1 January.
 *
 * @param year
 * @param month
 *   the month, from 1 to 12
 * @param day
 *   the day of the month, from 1
 */
export function dayOfYear(year: number, month: number, day: number) {
	const leapDay = month > 2 && isLeapYear(year) ? 1 : 0;
	return DAYS_BEFORE_MONTH[month - 1] + leapDay + day;
}

/**
 * Get the day of the week, from 1 for Monday to 7 for Sunday.
 *
 * @param year
 * @param month
 *   the month, from 1 to 12
 * @param day
 *   the day of the month, from 1
 */
export function dayOfWeek(year: number, month: number, day: number): DayOfWeek {
	// 1970-01-01 was a Thursday, which is day 4.
	return floorMod(daysFromEpoch(year, month, day) + 3, 7) + 1 as DayOfWeek;
}

/**
 * Get the number of days from 1970-01-01 to a date. The result is negative
 * for a date before 1970-01-01.
 *
 * This is the `days_from_civil` algorithm by Howard Hinnant. It counts in
 * eras of 400 years, because the Gregorian calendar repeats every 400 years.
 * Each year starts on 1 March, so the leap day is the last day of the year.
 *
 * @param year
 * @param month
 *   the month, from 1 to 12
 * @param day
 *   the day of the month, from 1
 */
export function daysFromEpoch(year: number, month: number, day: number) {
	const y = month <= 2 ? year - 1 : year;
	const era = Math.floor(y / 400);
	const yearOfEra = y - era * 400;
	const shiftedMonth = (month + 9) % 12;
	const dayOfShiftedYear = Math.floor((153 * shiftedMonth + 2) / 5) + day - 1;
	const dayOfEra = yearOfEra * 365
		+ Math.floor(yearOfEra / 4)
		- Math.floor(yearOfEra / 100)
		+ dayOfShiftedYear;

	return era * 146097 + dayOfEra - 719468;
}

function floorMod(value: number, divisor: number) {
	return ((value % divisor) + divisor) % divisor;
}
