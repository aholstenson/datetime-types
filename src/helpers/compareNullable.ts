/**
 * Compare two objects that can be null. The objects must have a `compare`
 * method.
 *
 * @param a
 *   the first object
 * @param b
 *   the second object
 * @param nulls
 *   where `null` goes in the order. Use `first` when `null` means "no lower
 *   limit" and `last` when `null` means "no upper limit".
 */
export function compareNullable<T extends { compare(v: T): -1 | 0 | 1 }>(
	a: T | null,
	b: T | null,
	nulls: 'first' | 'last'
): -1 | 0 | 1 {
	if(a === b) return 0;
	if(a === null) return nulls === 'first' ? -1 : 1;
	if(b === null) return nulls === 'first' ? 1 : -1;

	return a.compare(b);
}
