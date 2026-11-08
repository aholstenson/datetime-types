/**
 * Throw the error that `valueOf` gives for a value type. Operators such as
 * `<` and `+` call `valueOf`. Without this error they would compare or join
 * the strings from `toString`, which gives the wrong order for some values.
 * `Temporal` types do the same.
 *
 * @param typeName
 *   the name of the type, used in the error message
 */
export function noValueOf(typeName: string): never {
	throw new TypeError(
		'Can not convert ' + typeName + ' to a primitive value. Use compare() or '
		+ 'equals() to compare values, and toString() to get a string.'
	);
}
