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
    console.log('Target Found:', target);
    // Debug model visibility
    const model = cardTarget.querySelector('a-gltf-model');
    if (model) {
      console.log('Model element found:', model.id);
      console.log('Model source:', model.getAttribute('src'));
      console.log('Model visibility:', model.getAttribute('visible'));
    } else {
      console.log('No model element found in target');
    }
    onImageTargetPresent(target, handlerComponentName);
  });

  cardTarget.addEventListener('targetLost', (event) => {
    console.log('Target Lost:', target);
    onImageTargetLost(target, handlerComponentName);
  });
}

function onImageTargetPresent(bindedTargetDOMID, handlerComponentName) {
  const DOMElement = document.getElementById(bindedTargetDOMID);
  console.log('Setting target present for:', bindedTargetDOMID);
  DOMElement.setAttribute(handlerComponentName, {
    imageTargetFound: true,
    imageTargetPresent: true,
  });
  
  // Ensure model is visible
  const model = DOMElement.querySelector('a-gltf-model');
  if (model) {
    model.setAttribute('visible', true);
    console.log('Made model visible');
  }
}

function onImageTargetLost(bindedTargetDOMID, handlerComponentName) {
  const DOMElement = document.getElementById(bindedTargetDOMID);
  console.log('Setting target lost for:', bindedTargetDOMID);
  DOMElement.setAttribute(handlerComponentName, {
    imageTargetPresent: false,
  });
}
