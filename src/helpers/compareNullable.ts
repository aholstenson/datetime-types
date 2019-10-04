/**
 * Compare two objects that may be null. Objects must have a `compare` method.
 *
 * @param a
 * @param b
 */
export function compareNullable<T extends { compare(v: T): -1 | 0 | 1 }>(a: T | null, b: T | null) {
	if(a === b) return 0;
	if(a === null) return 1;
	if(b === null) return -1;

	return a.compare(b);
}
