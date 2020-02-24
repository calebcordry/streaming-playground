/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class DetachedDomWriter {
  /**
   * @param {!Window} win
   * @param {function():void} onChunk
   * @param {function():void} onEnd
   */
  constructor(win, onChunk, onEnd) {
    /** */
    this.onChunk_ = onChunk;

    /** */
    this.onEnd_ = onEnd;

    /** @const @private {!Document} */
    this.detachedDoc_ = win.document.implementation.createHTMLDocument('');
    this.detachedDoc_.open();

    /** @private {boolean} */
    this.eof_ = false;
  }

  /**
   * @param {string} chunk
   */
  write(chunk) {
    if (this.eof_) {
      throw new Error('Detached doc already closed.');
    }
    if (chunk) {
      this.detachedDoc_.write(chunk);
    }
    this.onChunk_(this.detachedDoc_);
  }

  /**
   *
   */
  close() {
    this.eof_ = true;
    this.detachedDoc_.close();
    this.onEnd_(this.detachedDoc_);
  }
}
