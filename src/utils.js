// You might find this util file very useful for your projet.

export function projectedVectorToCanvasCoords(projectedCorner, canvas) {
  return {
    x: ((projectedCorner.x + 1) * canvas.width) / 2,
    y: ((-projectedCorner.y + 1) * canvas.height) / 2,
  };
}

// solve the lazy evaluation problem in chrome browser, log the absolute values of an object when using
// this function. Recursively include objects and their states. (MatrixWorld, Position, Rotation, Scale)
export function logObjectFreeze(object) {
  const clone = JSON.parse(JSON.stringify(object));
  console.log(clone);
  return clone;
}

export function getVectorsFromMatrix(matrixWorld) {
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const rotation = new THREE.Euler();
  matrixWorld.decompose(position, quaternion, scale);
  rotation.setFromQuaternion(quaternion);
  console.log(position, rotation, scale);
  return { position, quaternion, scale, rotation };
}

// Play animations on the given element,
// if animationName is provided, only play that animation
export function playAnimations(
  htmlElement,
  animationName,
  loop = false,
  onLoopFinished,
  onFinished
) {
  const model = htmlElement.getObject3D('mesh');
  if (model) {
    const mixer = new THREE.AnimationMixer(model);
    setUpAnimation(
      model,
      mixer,
      animationName,
      loop,
      onLoopFinished,
      onFinished
    );
  } else {
    htmlElement.addEventListener('model-loaded', (event) => {
      const loadedModel = event.detail.model;
      const mixer = new THREE.AnimationMixer(loadedModel);
      setUpAnimation(
        loadedModel,
        mixer,
        animationName,
        loop,
        onLoopFinished,
        onFinished
      );
    });
  }
}

function setUpAnimation(
  model,
  mixer,
  animationName,
  loop,
  onLoopFinished,
  onFinished
) {
  // Ensure the mixer is updated in the render loop
  let lastFrameTime = Date.now();
  function animate() {
    const deltaTime = (Date.now() - lastFrameTime) / 1000;
    mixer.update(deltaTime);
    lastFrameTime = Date.now();
    requestAnimationFrame(animate);
  }
  animate();
  for (const animationClip of model.animations) {
    if (animationName && animationClip.name !== animationName) {
      continue;
    }
    const action = mixer.clipAction(animationClip); // Cannot read properties of undefined (reading 'uuid')
    action.enabled = true;
    action.clampWhenFinished = true;
    action.loop = loop ? THREE.LoopRepeat : THREE.LoopOnce;
    action.setDuration(animationClip.duration);
    action.play();
  }
  if (onLoopFinished) {
    mixer.addEventListener('loop', (event) => {
      onLoopFinished(event);
    });
  }
  if (onFinished) {
    const onAnimationFinished = (event) => {
      onFinished(event);
      mixer.removeEventListener('finished', onAnimationFinished);
    };
    mixer.addEventListener('finished', onAnimationFinished);
  }
}
