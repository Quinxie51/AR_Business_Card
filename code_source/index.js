import { RendererProviderComponent } from './src/renderer-provider.js';
import { animationControllerComponent } from './src/animation-controller.js';
import { freeSceneRenderComponent } from './src/animation-mixer.js';
import { initializeCanvasController } from './src/canvas-controller.js';
import { initializeRaycaster } from './src/raycaster.js';
import { intializeImageTracking } from './src/mindar-image-anchor-control.js';

AFRAME.registerComponent('animation-controller', animationControllerComponent);
AFRAME.registerComponent('renderer-provider', RendererProviderComponent);
AFRAME.registerComponent('free-scene-render', freeSceneRenderComponent);

const sceneEl = document.querySelector('a-scene');

sceneEl.addEventListener(
  'arReady',
  () => {
    console.log('AR Ready');
    initializeCanvasController();
    intializeImageTracking('card-front');
    intializeImageTracking('card-back');
    initializeRaycaster();
  },
  { once: true }
);

// When the window is resized or the orientation is changed, restart MindAR.
window.addEventListener('resize', () => {
  const sceneEl = document.querySelector('a-scene');
  const arSystem = sceneEl.systems['mindar-image-system'];
  arSystem.stop();
  arSystem.start();
});
