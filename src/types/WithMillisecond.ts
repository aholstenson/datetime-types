/**
 * Interface used to mark objects that contain a millisecond.
 */
export interface WithMillisecond {
	/**
	 * The millisecond of the second, from 0 to 999.
	 */
	readonly millisecond: number;
}
