import * as THREE from 'three';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { onRendererInitialized } from './renderer-provider';

onRendererInitialized(initializeLightingEnvironment);

// If you need to render HDR lighting environment. Here we chose one of the blender default environments as an example.
export function initializeLightingEnvironment(renderer) {
  if (!renderer) return;

  // Configure renderer for modern lighting
  renderer.useLegacyLights = false; // Use the new lighting system
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
