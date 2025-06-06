import { initializeLightingEnvironment } from './environment-mixer';

// This component is used to render the free scene that is not controlled by MindAR (see HTML).
// Notice that this component uses a different renderer than the one used by MindAR.
export const freeSceneRenderComponent = {
  schema: {
    customState: { default: false, type: 'boolean' },
  },
  init() {
    const sceneEl = this.el.sceneEl; // Reference to the <a-scene>
    const renderer = new THREE.WebGLRenderer({
      alpha: true, // Enable transparency
      antialias: true,
      lights: true,
    });
    initializeLightingEnvironment(renderer);
    sceneEl.addEventListener('arReady', () => {
      const camera = sceneEl.camera;
      // camera.near = 0.1; // Adjust the near clipping plane as needed. Notice that this may cause Z-fighting issue.
      camera.updateProjectionMatrix();
    }); // Notice that we don't set {once: true} here, because we want to render the free scene continuously via resize.

    const canvas = document.getElementById('ar-effect-canvas');
    // canvas.style.opacity = 0.75; Adjust the ar effect canvas opacity as needed.
  },
  update(prevData) {
    const { data } = this;
    const changes = AFRAME.utils.diff(data, prevData);
    // Perform your logic based on the state changes. To understand more, look into the animation-controller.js file and
    // https://aframe.io/docs/1.2.0/introduction/writing-a-component.html
  },
};
