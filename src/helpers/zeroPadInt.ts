/**
 * Zero-pad a number so it is at leas the specified length.
 *
 * @param value
 *   the number to output
 * @param length
 *   the desired length
 */
export function zeroPadInt(value: number, length: number) {
	const s = String(value);
	if(s.length < length) {
		return '0'.repeat(length - s.length) + s;
	} else {
		return s;
	}
}
