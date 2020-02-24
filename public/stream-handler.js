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

    // Fake vsync for glitch demo.
    // TODO: switch to real vsync service.
    /** @const @private */
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
   * @param {!Document} unusedCompleteDoc
   */
  onEnd(unusedCompleteDoc) {
    console.log('stream done.');
  }

  /**
   * @return {!Promise<!Element>}
   */
  waitForHead() {
    return this.headPromise_;
  }

  /**
   * Start the body transfer process. Should only be called once.
   * Returns a promise indicating that the first body chunk has been transfered.
   * @param {!Element} target DOM element to be appended to.
   * @return {!Promise} resolves when first chunk has been transfered.
   */
  transferBody(target) {
    if (!target) {
      // Throw on no target given.
    }

    if (this.shouldTransfer_) {
      // Maybe throw on subsequent calls?
      return Promise.resolve();
    }

    this.shouldTransfer_ = true;
    this.target_ = target;

    return this.headPromise_.then(() => this.transferBody_());
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
