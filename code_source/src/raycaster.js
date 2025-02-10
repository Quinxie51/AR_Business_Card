// Raycaster for three js objects. Useful if you want to add click events on your 3D objects.

import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const listenerDict = {};

export function addRaycasterListener(id, callback) {
  listenerDict[id] = callback;
}

export function removeRaycasterListener(id) {
  delete listenerDict[id];
}

function onPointerDown(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  if (Object.keys(listenerDict).length === 0) return;
  window.requestAnimationFrame(raycast);
}

function raycast() {
  // update the picking ray with the camera and pointer position
  let camera;
  for (const child of document.querySelector('a-camera').object3D.children) {
    if (child.isCamera) {
      camera = child;
      camera.isPerspectiveCamera = true;
      break;
    }
  }
  if (!camera) {
    window.requestAnimationFrame(raycast); // retry
    return;
  }
  raycaster.setFromCamera(pointer, camera);

  const scene = document.querySelector('a-scene').object3D;
  // calculate objects intersecting the picking ray
  const intersectObjs = {};
  const intersects = raycaster.intersectObjects(scene.children);
  for (let i = 0; i < intersects.length; i++) {
    const intersectObj = intersects[i].object;
    const el = intersectObj.el;
    if (el) {
      intersectObjs[el.id] = intersectObj; // html id
    }
  }
  for (const id of Object.keys(intersectObjs)) {
    listenerDict[id]?.(intersectObjs[id]);
  }
}

export function initializeRaycaster() {
  window.addEventListener('pointerdown', onPointerDown);
}
