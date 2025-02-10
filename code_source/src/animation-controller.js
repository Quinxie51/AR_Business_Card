const animationCalls = {};

export function addAnimation(
  name,
  animationDrawFunction, // Something that gets called every frame to draw and determine if the animation is done
  afterAnimationDrawFunction // Something that gets called every frame if the animation is done, if you want to have a multi-step animation
) {
  animationCalls[name] = () => {
    if (animationDrawFunction()) {
      animationCalls[name] = afterAnimationDrawFunction;
    }
  };
}

// Refer to here to learn more about AFRAME component
// https://aframe.io/docs/1.2.0/introduction/writing-a-component.html
export const animationControllerComponent = {
  schema: {
    imageTargetFound: { default: false, type: 'boolean' },
    imageTargetPresent: { default: false, type: 'boolean' },
    component: { type: 'string' }, // hard-coded in html
  },
  init() {
    this.animationFrameId = null;
    const sceneEl = this.el.sceneEl;
    sceneEl.addEventListener(
      'arReady',
      () => {
        const animate = () => {
          if (Object.keys(animationCalls).length === 0) {
            this.animationFrameId = requestAnimationFrame(animate);
            return;
          }
          const arCanvas = document.getElementById('ar-effect-canvas');
          const context = arCanvas.getContext('2d');
          context.clearRect(0, 0, arCanvas.width, arCanvas.height);

          // HardCode animation call sequence

          animationCalls['cardFrontEffect']?.();
          animationCalls['cardBackEffect']?.();

          this.animationFrameId = requestAnimationFrame(animate);
        };
        this.animationFrameId = requestAnimationFrame(animate);
      },
      { once: true }
    );
  },
  remove() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  },
  update(prevData) {
    if (!prevData) return;
    const diff = AFRAME.utils.diff(this.data, prevData);
    const aSceneElement = document.querySelector('a-scene');
    if ('imageTargetFound' in diff) {
      if (this.data.imageTargetFound) {
        if (this.data.component === 'card-front') {
          addAnimation('cardFrontEffect', () => {
            // Consistent animation on the card front
          });
        }
        if (this.data.component === 'card-back') {
          aSceneElement.setAttribute('ui-controller', {
            cardBackDetected: true,
          });
          addAnimation(
            'cardBackEffect',
            () => {
              // Animation on the card back
            },
            () => {
              // Consistent effect after card back animation is done
            }
          );
        }
      }
    }
    if ('imageTargetPresent' in diff) {
      // this.el.object3D.visible = this.data.imageTargetPresent;
      if (this.data.imageTargetPresent) {
        if (this.data.component === 'card-front') {
          // Do something when the card front becomes present
        }
        if (this.data.component === 'card-back') {
          // Do something when the card back becomes present
        }
      } else {
        if (this.data.component === 'card-front') {
          // Do something when the card front disappears
        }
        if (this.data.component === 'card-back') {
          // Do something when the card back disappears
        }
      }
    }
  },
};
