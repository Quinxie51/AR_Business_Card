export let globalRenderer;

const rendererListenerDict = [];

export const rendererProviderComponent = {
  init() {
    this.el.sceneEl.addEventListener(
      'arReady',
      () => {
        globalRenderer = this.el.renderer;
        for (const listener of rendererListenerDict) {
          listener(globalRenderer);
        }
      },
      { once: true }
    );
  },
};

export function onRendererInitialized(callback) {
  console.log('RendererInitialized');
  if (globalRenderer) {
    callback(globalRenderer);
  } else {
    rendererListenerDict.push(callback);
  }
}
