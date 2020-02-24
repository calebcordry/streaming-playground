/**
 * @param {string} url
 * @param {!WritableStreamDefaultWriter} writer
 * @return {!Promise}
 */
export function streamDocument(url, writer) {
  // Try native first.
  if (window.fetch && window.TextDecoder && window.ReadableStream) {
    return fetch(url).then(response => {
      // This should be a lot simpler with transforming streams and pipes,
      // but, TMK, these are not supported anywhere yet.
      const /** !ReadableStreamDefaultReader */ reader = response.body.getReader();
      const decoder = new TextDecoder();
      function readChunk(chunk) {
        const text = decoder.decode(chunk.value || new Uint8Array(), {
          stream: !chunk.done,
        });
        if (text) {
          writer.write(text);
        }
        if (chunk.done) {
          writer.close();
        } else {
          return reader.read().then(readChunk);
        }
      }
      return reader.read().then(readChunk);
    });
  }
}
