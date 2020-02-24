import { Deferred } from './deferred.js';

export class StreamHandler {
  /**
   *
   */
  constructor() {
    const { promise, resolve } = new Deferred();
    this.headPromise_ = promise;
    this.headResolver_ = resolve;

    this.detachedBody_ = null;

    this.shouldTransfer_ = false;
    this.mergeScheduled_ = false;

    /** @const @private */
    // Fake vsync for demo.
    this.vsync_ = { mutate: cb => Promise.resolve(cb()) };
  }

  /**
   * @param {!Document} detachedDoc
   */
  onChunk(detachedDoc) {
    // <body> is newly formed.
    if (!this.detachedBody_ && detachedDoc.body) {
      this.detachedBody_ = detachedDoc.body;
      this.headResolver_(detachedDoc.head);
    }

    if (this.shouldTransfer_ && !this.mergeScheduled_) {
      this.transferBody_(detachedDoc);
    }
  }

  /**
   * @param {!Document} completedDoc
   */
  onEnd(completedDoc) {
    console.log('stream done.');
  }

  /**
   * @return {!Promise<!Element>}
   */
  waitForHead() {
    return this.headPromise_;
  }

  /**
   * @param {!Element} target
   * @return {!Promise} resolves when first chunk has been transfered.
   * More chunks could still be coming later.
   */
  transferBody(target) {
    // After the first call, immediately resolve.
    if (this.shouldTransfer_) {
      return Promise.resolve();
    }
    // TODO: throw on no target.
    this.shouldTransfer_ = true;
    this.target_ = target;

    return this.transferBody_();
  }

  /**
   * @return {!Promise}
   */
  transferBody_() {
    this.mergeScheduled_ = true;

    return this.vsync_.mutate(() => {
      this.mergeScheduled_ = false;
      // TODO: removeNoScriptElements
      while (this.detachedBody_.firstChild) {
        this.target_.appendChild(this.detachedBody_.firstChild);
      }
    });
  }
}
