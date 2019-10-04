/**
 * Compare two integers.
 *
 * @param a
 * @param b
 */
export function compareInt(a: number, b: number): -1 | 0 | 1 {
	return a < b ? -1 : (a === b ? 0 : 1);
}
