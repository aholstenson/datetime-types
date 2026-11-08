/**
 * Get the `Temporal` namespace to convert a value with. This is the given
 * namespace, or else the global `Temporal`.
 *
 * Browsers and Node versions without `Temporal` have no global `Temporal`.
 * Then the caller must give the namespace of a polyfill, else this throws a
 * `TypeError`.
 *
 * @param temporal
 *   the namespace that the caller gave, or `undefined`
 */
export function temporalOf(temporal: unknown): any {
	const result = temporal ?? (globalThis as any).Temporal;
	if(result === undefined || result === null) {
		throw new TypeError(
			'Temporal is not available. Give the Temporal object of a polyfill, '
			+ 'such as value.toTemporal(Temporal).'
		);
	}

	return result;
}
