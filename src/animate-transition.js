// Code in this file acheives the logical and visual effects of moving the 3D object that were attached to the card images
// to the center of the screen. This code worked after hundreds of trials and errors over 3 weeks.
// Some parts of the code doesn't make sense, but it works as I tweaked the effects to counter balance some side effects caused by MindAR.

import { getVectorsFromMatrix } from './utils';

export function animateTransitionOfMoveableRoot() {
  const cardFrontMoveableRootHTML = document.getElementById(
    'card-front-moveable-root'
  );
  const cardFrontMovableRoot = cardFrontMoveableRootHTML.object3D;
  const freeRootHTML = document.getElementById('free-scene');
  const freeRoot = freeRootHTML?.object3D;
  const targetPosition = new THREE.Vector3(0, 0, -6);
  const targetRotation = new THREE.Euler(0, 0, 0);
  const targetScale = new THREE.Vector3(1, 1, 1);
  const matrixWorld = cardFrontMovableRoot.matrixWorld.clone();
  const {
    position: startPosition,
    quaternion,
    scale: startScale,
    rotation: startRotation,
  } = getVectorsFromMatrix(matrixWorld);
  // normalize the result to have z = -6, resulting in x-y plane movement to the center of the scene.
  const ratio = startPosition.z / -6;
  startPosition.x /= ratio;
  startPosition.y /= ratio;
  startPosition.z = -6;
  startScale.x /= ratio;
  startScale.y /= ratio;
  startScale.z /= ratio;
  freeRootHTML.appendChild(cardFrontMoveableRootHTML.cloneNode(true));
  setTimeout(() => {
    cardFrontMoveableRootHTML.parentElement.object3D.remove(
      cardFrontMovableRoot
    );
    cardFrontMoveableRootHTML.remove();
  }, 0);

  // Move the card elements to the free scene in the center of the screen.
  const newRootHTML = freeRootHTML.querySelector('#card-front-moveable-root');
  addAnimationToCardFrontRoot(
    newRootHTML,
    startPosition,
    startRotation,
    startScale,
    targetPosition,
    targetRotation,
    targetScale
  );
}

// We use the A-Frame based animation system to animate the card elements.
function addAnimationToCardFrontRoot(
  cardFrontRoot,
  startPosition,
  startRotation,
  startScale,
  targetPosition,
  targetRotation,
  targetScale,
  duration = 2500,
  easing = 'easeInOutQuad'
) {
  cardFrontRoot
    .querySelector('#mind-ar-model')
    .setAttribute('animation__rotation', {
      property: 'rotation',
      from: '90 0 0',
      to: '0 0 0',
      dur: duration,
      easing: easing,
    });
  cardFrontRoot.setAttribute('animation__position', {
    property: 'position',
    from: `${startPosition.x} ${startPosition.y} ${startPosition.z}`,
    to: `${targetPosition.x} ${targetPosition.y} ${targetPosition.z}`,
    dur: duration,
    easing: easing,
  });
  cardFrontRoot.setAttribute('animation__rotation', {
    property: 'rotation',
    from: `${(startRotation.x / Math.PI) * 180} ${
      (startRotation.y / Math.PI) * 180
    } ${(startRotation.z / Math.PI) * 180}`,
    to: `${(targetRotation.x / Math.PI) * 180} ${
      (targetRotation.y / Math.PI) * 180
    } ${(targetRotation.z / Math.PI) * 180}`,
    dur: duration,
    easing: easing,
  });
  cardFrontRoot.setAttribute('animation__scale', {
    property: 'scale',
    from: `${startScale.x} ${startScale.y} ${startScale.z}`,
    to: `${targetScale.x} ${targetScale.y} ${targetScale.z}`,
    dur: duration,
    easing: easing,
  });
  cardFrontRoot.flushToDOM();
}
