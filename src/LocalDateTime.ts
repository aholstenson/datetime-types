import { LocalDateLike, LocalTimeLike } from './types';

import { LocalTime } from './LocalTime';
import { LocalDate } from './LocalDate';

/**
 * Representation of a date and time without a timezone.
 */
export class LocalDateTime implements LocalDateLike, LocalTimeLike {
	private readonly date: LocalDate;
	private readonly time: LocalTime;

	private constructor(date: LocalDate, time: LocalTime) {
		this.date = date;
		this.time = time;
	}

	get year() {
		return this.date.year;
	}

	get month() {
		return this.date.month;
	}

	get dayOfMonth() {
		return this.date.dayOfMonth;
	}

	get hour() {
		return this.time.hour;
	}

	get minute() {
		return this.time.minute;
	}

	get second() {
		return this.time.second;
	}

	get milliOfSecond() {
		return this.time.milliOfSecond;
	}

	public toString() {
		return this.date.toString() + 'T' + this.time.toString();
	}

	/**
	 * Create a new local date and time from an object containing combined
	 * date and time properties.
	 *
	 * @param value
	 */
	public static from(value: LocalDateLike & LocalTimeLike) {
		return this.fromDateAndTime(value, value);
	}

	/**
	 * Create a new local date time from a date and a time.
	 *
	 * @param date
	 * @param time
	 */
	public static fromDateAndTime(date: LocalDateLike, time: LocalTimeLike) {
		const localDate = date instanceof LocalDate ? date : LocalDate.from(date);
		const localTime = time instanceof LocalTime ? time : LocalTime.from(time);
		return new LocalDateTime(localDate, localTime);
	}

	/**
	 * Create a new local date time from the specified Date object.
	 *
	 * @param date
	 */
	public static fromDate(date: Date) {
		return this.fromDateAndTime(
			LocalDate.fromDate(date),
			LocalTime.fromDate(date)
		);
	}
}
