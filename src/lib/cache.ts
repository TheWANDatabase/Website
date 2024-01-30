import { fromHumanReadable } from './editor';

/**
 * Helper method to calculate a seconds based TTL using the text timestamp
 * such as `01:00:00` for 1 hour, or much more precise like `05:17`
 * @param {string} time
 * @returns {number}
 */
export function expireIn(time: string): number {
	return fromHumanReadable(time);
}
