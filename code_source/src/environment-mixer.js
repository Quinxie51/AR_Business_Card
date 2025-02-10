import * as THREE from 'three';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { onRendererInitialized } from './renderer-provider';

onRendererInitialized(initializeLightingEnvironment);

// If you need to render HDR lighting environment. Here we chose one of the blender default environments as an example.
export function initializeLightingEnvironment(renderer) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const scene = document.querySelector('a-scene').object3D;
  const hdriLoader = new RGBELoader();
  hdriLoader.load(
    '/custom_card_assets/NarrowPath_Blur.hdr',
    function (texture) {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      texture.dispose();
      scene.environment = envMap;
    }
  );
}
