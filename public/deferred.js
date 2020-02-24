/**
 * Returns a Deferred struct, which holds a pending promise and its associated
 * resolve and reject functions.
 *
 * This is preferred instead of creating a Promise instance to extract the
 * resolve/reject functions yourself:
 *
 * ```
 * // Avoid doing
 * let resolve;
 * const promise = new Promise(res => {
 *   resolve = res;
 * });
 *
 * // Good
 * const deferred = new Deferred();
 * const { promise, resolve } = deferred;
 * ```
 *
 * @template T
 */
export class Deferred {
  /**
   * Creates an instance of Deferred.
   */
  constructor() {
    let resolve, reject;

    /**
     * @const {!Promise<T>}
     */
    this.promise = new /*OK*/ Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    /**
     * @const {function(T=)}
     */
    this.resolve = resolve;

    /**
     * @const {function(*=)}
     */
    this.reject = reject;
  }
}
