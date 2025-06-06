import { animationControllerComponent } from './src/animation-controller.js';
import { freeSceneRenderComponent } from './src/animation-mixer.js';
import { initializeCanvasController } from './src/canvas-controller.js';
import { initializeRaycaster } from './src/raycaster.js';
import { intializeImageTracking } from './src/mindar-image-anchor-control.js';
import { rendererProviderComponent } from './src/renderer-provider.js';

AFRAME.registerComponent('animation-controller', animationControllerComponent);
AFRAME.registerComponent('renderer-provider', rendererProviderComponent);
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
let resizeTimeout;
window.addEventListener('resize', () => {
  // Clear any existing timeout to prevent multiple restarts
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  
  // Add a small delay to prevent rapid restarts
  resizeTimeout = setTimeout(() => {
    const sceneEl = document.querySelector('a-scene');
    const arSystem = sceneEl.systems['mindar-image-system'];
    
    // Only restart if the system exists and is running
    if (arSystem && arSystem.el.sceneEl.isPlaying) {
      arSystem.stop(); // Stop the system
      setTimeout(() => {
        arSystem.start(); // Start after a brief delay
      }, 100);
    }
  }, 500);
});
