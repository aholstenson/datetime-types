/**
 * Interface for values that have an order. `compare` returns `-1` when this
 * value comes before `other`, `0` when they are equal and `1` when this value
 * comes after `other`.
 */
export interface Comparable<T> {
	compare(other: T): -1 | 0 | 1;
}
