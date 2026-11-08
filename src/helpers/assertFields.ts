/**
 * Throw an error if an object has a calendar other than ISO 8601. `Temporal`
 * values have a `calendarId`, and their year, month and day are in that
 * calendar. This library only uses the ISO 8601 calendar.
 *
 * @param object
 *   the object to check
 */
export function assertIsoCalendar(object: { readonly calendarId?: string }) {
	const calendarId = object.calendarId;
	if(calendarId !== undefined && calendarId !== 'iso8601') {
		throw new RangeError(
			'Invalid calendar ' + JSON.stringify(calendarId) + ', only iso8601 is '
			+ 'supported'
		);
	}
}

/**
 * Throw an error if an object has a time that is more precise than a
 * millisecond. `Temporal` values have `microsecond` and `nanosecond`, but
 * this library stores time to the millisecond.
 *
 * @param object
 *   the object to check
 */
export function assertMillisecondPrecision(object: {
	readonly microsecond?: number,
	readonly nanosecond?: number
}) {
	if((object.microsecond ?? 0) !== 0 || (object.nanosecond ?? 0) !== 0) {
		throw new RangeError('Invalid time, the time can not be more precise than a millisecond');
	}
}
