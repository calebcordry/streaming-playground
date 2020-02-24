import { streamDocument } from './stream-document.js';
import { StreamHandler } from './stream-handler.js';
import { DetachedDomWriter } from './detached-dom-writer.js';
import { createIframe } from './iframe.js';

const config = {};
const configDisplay = document.querySelector('.config');
const frameContainer = document.querySelector('.frame');

function renderConfig() {
  configDisplay.textContent = JSON.stringify(config, null, 2);
}

function handleTargetDelayChange(e) {
  config.targetDelay = e.target.value;
  renderConfig();
}

function handleChunkSpeedChange(e) {
  config.chunkSpeed = e.target.value;
  renderConfig();
}

function initListeners() {
  const targetDelayInput = document.querySelector('#target-creation-delay');
  const chunkSpeedInput = document.querySelector('#chunk');
  const startBtn = document.querySelector('button');

  targetDelayInput.addEventListener('change', handleTargetDelayChange);
  chunkSpeedInput.addEventListener('change', handleChunkSpeedChange);
  startBtn.addEventListener('click', start);
}

function start() {
  const { chunkSpeed, targetDelay } = config;
  // setTimeout(createTarget, targetDelay); TODO

  let url = '/stream';
  if (chunkSpeed) {
    url += `?chunkSpeed=${chunkSpeed}`;
  }
  foo(url);
}

function foo(url) {
  const handler = new StreamHandler();
  const stream = new DetachedDomWriter(
    window,
    handler.onChunk.bind(handler),
    handler.onEnd.bind(handler)
  );

  streamDocument(url, stream);

  frameContainer.innerHTML = '';
  const iframe = createIframe();
  frameContainer.appendChild(iframe);

  handler.waitForHead().then(head => {
    // Client side validation
    // sanitize(head)
    handler.transferBody(iframe.contentDocument.body);
  });
}

initListeners();
renderConfig();
