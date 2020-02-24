import { streamDocument } from './stream-document.js';
import { StreamHandler } from './stream-handler.js';
import { DetachedDomWriter } from './detached-dom-writer.js';
import { createIframe } from './iframe.js';

const config = {};
const configDisplay = document.querySelector('.config');
const frameContainer = document.querySelector('.frame');

function loadPromiseWithDelay(iframe, opt_delay) {
  return new Promise(resolve => {
    iframe.onload = () => {
      setTimeout(resolve, opt_delay);
    };
  });
}

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
  let url = '/stream';
  if (chunkSpeed) {
    url += `?chunkSpeed=${chunkSpeed}`;
  }
  fakeAmpCode(url, targetDelay);
}

function fakeAmpCode(url, targetDelay) {
  const handler = new StreamHandler();
  const stream = new DetachedDomWriter(
    window, // win
    handler.onChunk.bind(handler),
    handler.onEnd.bind(handler)
  );

  streamDocument(url, stream);

  // Ads code will create fie.
  frameContainer.innerHTML = '';
  const iframe = createIframe();
  frameContainer.appendChild(iframe);
  const iframeLoadPromise = loadPromiseWithDelay(iframe, targetDelay);

  const headPromise = handler.waitForHead();
  Promise.all([iframeLoadPromise, headPromise]).then(([_, head]) => {
    // Client side validation
    // sanitize(head)
    // write sanitized head elements to target
    // sanitizedHead.forEach(el => targetHead.appendChild(el))
    handler.transferBody(iframe.contentDocument.body);
  });
}

initListeners();
renderConfig();
