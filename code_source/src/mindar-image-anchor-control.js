// This file is used to track the image targets and trigger the animation-controller component via MindAR events.

const SUPPORTED_TARGETS = ['card-front', 'card-back'];
export function intializeImageTracking(
  target, // hard-coded in html
  handlerComponentName = 'animation-controller'
) {
  if (!SUPPORTED_TARGETS.includes(target)) {
    throw new Error(`Unsupported image target: ${target}`);
  }
  const cardTarget = document.getElementById(target);
  cardTarget.addEventListener('targetFound', (event) => {
    console.log('targetFound', event);
    onImageTargetPresent(target, handlerComponentName);
  });

  cardTarget.addEventListener('targetLost', (event) => {
    console.log('targetLost', event);
    onImageTargetLost(target, handlerComponentName);
  });
}

function onImageTargetPresent(bindedTargetDOMID, handlerComponentName) {
  const DOMElement = document.getElementById(bindedTargetDOMID);
  DOMElement.setAttribute(handlerComponentName, {
    imageTargetFound: true,
    imageTargetPresent: true,
  });
}

function onImageTargetLost(bindedTargetDOMID, handlerComponentName) {
  const DOMElement = document.getElementById(bindedTargetDOMID);
  DOMElement.setAttribute(handlerComponentName, {
    imageTargetPresent: false,
  });
}
