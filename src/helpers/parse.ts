/**
 * Helpers that read ISO 8601 strings into numbers. The value types use these
 * helpers in `from()` and then check the numbers in `of()`.
 *
 * The helpers accept the extended format, with `-` between the parts of a
 * date and `:` between the parts of a time. This is the format that
 * `toString()` writes and that `Temporal` writes.
 */

const YEAR = '([+-]\\d{6}|\\d{4})';
const DATE = YEAR + '-(\\d{2})-(\\d{2})';
const TIME = '(\\d{2}):(\\d{2})(?::(\\d{2})(?:[.,](\\d{1,9}))?)?';

const YEAR_PATTERN = new RegExp('^' + YEAR + '$');
const MONTH_PATTERN = /^--(\d{2})$/;
const DATE_PATTERN = new RegExp('^' + DATE + '$');
const TIME_PATTERN = new RegExp('^' + TIME + '$');
const DATE_TIME_PATTERN = new RegExp('^' + DATE + '[Tt]' + TIME + '$');

/**
 * The numbers of a date.
 */
export interface DateParts {
	year: number;
	month: number;
	day: number;
}

/**
 * The numbers of a time.
 */
export interface TimeParts {
	hour: number;
	minute: number;
	second: number;
	millisecond: number;
}

/**
 * Read a year such as `2024`, `+020240` or `-000005`.
 *
 * @param text
 *   the string to read
 */
export function parseYear(text: string): number {
	const match = YEAR_PATTERN.exec(text);
	if(! match) {
		throw invalid('year', text);
	}

	return yearOf(match[1], text);
}

/**
 * Read a month such as `--03`.
 *
 * @param text
 *   the string to read
 */
export function parseMonth(text: string): number {
	const match = MONTH_PATTERN.exec(text);
	if(! match) {
		throw invalid('month', text);
	}

	return Number(match[1]);
}

/**
 * Read a date such as `2024-03-01`.
 *
 * @param text
 *   the string to read
 */
export function parseDate(text: string): DateParts {
	const match = DATE_PATTERN.exec(text);
	if(! match) {
		throw invalid('date', text);
	}

	return dateOf(match, 1, text);
}

/**
 * Read a time such as `08:30`, `08:30:15` or `08:30:15.25`. A fraction of a
 * second can have up to nine digits, but digits after the third must be zero.
 *
 * @param text
 *   the string to read
 */
export function parseTime(text: string): TimeParts {
	const match = TIME_PATTERN.exec(text);
	if(! match) {
		throw invalid('time', text);
	}

	return timeOf(match, 1, text);
}

/**
 * Read a date and time such as `2024-03-01T08:30:00`.
 *
 * @param text
 *   the string to read
 */
export function parseDateTime(text: string): DateParts & TimeParts {
	const match = DATE_TIME_PATTERN.exec(text);
	if(! match) {
		throw invalid('date and time', text);
	}

	return {
		...dateOf(match, 1, text),
		...timeOf(match, 4, text)
	};
}

/**
 * Read an interval such as `2024-03-01/2024-03-31`. Each side is read with
 * `parseValue`. A side that is `..` is open and becomes `null`.
 *
 * @param text
 *   the string to read
 * @param parseValue
 *   function that reads one side of the interval
 */
export function parseInterval<T>(
	text: string,
	parseValue: (value: string) => T
): [ T | null, T | null ] {
	const parts = text.split('/');
	if(parts.length !== 2) {
		throw invalid('interval', text);
	}

	return [
		parts[0] === '..' ? null : parseValue(parts[0]),
		parts[1] === '..' ? null : parseValue(parts[1])
	];
}

function yearOf(value: string, text: string) {
	// ISO 8601 does not allow a minus sign on year 0.
	if(value === '-000000') {
		throw invalid('year', text);
	}

	return Number(value);
}

function dateOf(match: RegExpExecArray, index: number, text: string): DateParts {
	return {
		year: yearOf(match[index], text),
		month: Number(match[index + 1]),
		day: Number(match[index + 2])
	};
}

function timeOf(match: RegExpExecArray, index: number, text: string): TimeParts {
	const fraction = (match[index + 3] ?? '').padEnd(9, '0');
	if(! /^0*$/.test(fraction.slice(3))) {
		throw new RangeError(
			'Invalid time ' + JSON.stringify(text) + ', the time can not be more '
			+ 'precise than a millisecond'
		);
	}

	return {
		hour: Number(match[index]),
		minute: Number(match[index + 1]),
		second: Number(match[index + 2] ?? '0'),
		millisecond: Number(fraction.slice(0, 3))
	};
}

function invalid(kind: string, text: string) {
	return new RangeError('Invalid ' + kind + ' ' + JSON.stringify(text));
}
