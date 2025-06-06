// This file does the forwarding of the video stream (and the AR stream if you want) to a canvas element.

// Handle resize of the video canvas (also other canvases if needed)
const VIDEO_CANVAS_SHORT_SIDE_PIXELS = 2000;

export function initializeCanvasController() {
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  screen.orientation.addEventListener('change', resizeCanvas);
  // Draw Calls to the Display Canvas
  function draw() {
    // UPDATE: This ar-effect-canvas is now used for freely render AR effects and animations. The original canvas is used for MindAR tracking effect.
    // const arCanvas = document.getElementById('ar-effect-canvas');
    const videoCanvas = document.getElementById('video-canvas');
    // This seems to only work for videoCanvas, but not arCanvas on iPhone.
    // Hence I still use the original canvas for AR effect display.
    // This works for both canvases on laptop Chrome. I don't know why.
    if (videoCanvas) {
      forwardVideoToCanvas(videoCanvas);
      // Uncomment this line if you want to forward the AR effect to the canvas.
      // forwardImageTrackingEffectToCanvas(arCanvas);
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

function resizeCanvas() {
  const { clientWidth, clientHeight } = document.body;
  const arCanvas = document.getElementById('ar-effect-canvas');
  const videoCanvas = document.getElementById('video-canvas');
  let canvasPixelWidth, canvasPixelHeight;
  const containerAspectRatio = clientWidth / clientHeight;
  if (containerAspectRatio > 1) {
    canvasPixelHeight = VIDEO_CANVAS_SHORT_SIDE_PIXELS;
    canvasPixelWidth = Math.round(
      containerAspectRatio * VIDEO_CANVAS_SHORT_SIDE_PIXELS
    );
  } else {
    canvasPixelWidth = VIDEO_CANVAS_SHORT_SIDE_PIXELS;
    canvasPixelHeight = Math.round(
      VIDEO_CANVAS_SHORT_SIDE_PIXELS / containerAspectRatio
    );
  }
  if (arCanvas) {
    arCanvas.width = canvasPixelWidth;
    arCanvas.height = canvasPixelHeight;
  }
  if (videoCanvas) {
    videoCanvas.width = canvasPixelWidth;
    videoCanvas.height = canvasPixelHeight;
  }
}

// Forward MindAR image tracking effect to our custom canvas
function forwardImageTrackingEffectToCanvas(arCanvas) {
  const arScene = document.getElementById('ar-scene');
  //   console.log(arScene?.getElementsByClassName('a-canvas').length);
  const aFrameCanvasElement = arScene?.getElementsByClassName('a-canvas')[0];
  if (!arScene || !aFrameCanvasElement) return;

  const context = arCanvas.getContext('2d');
  //   console.log(context);
  context?.clearRect(0, 0, arCanvas.width, arCanvas.height);
  context?.drawImage(
    aFrameCanvasElement,
    0,
    0,
    arCanvas.width,
    arCanvas.height
  );
}

// Forward MindAR video flow to our custom canvas (replacing the "video" element with a more flexible canvas element)
// This method is streaming MindAR's camera "video" feed to a canvas element.
// They are using a hack, so we hack on top of it.
// Their hack is to use a still video element and live copy the camera feed to the video element.
// However, the aspect ratio has some issues as the camera has a fixed aspect ratio,
// hence they did a manual calculation to crop the video feed.
// Our target canvas element also silently do a rescaling to fit the container size.
// We are drawing the ORIGINAL video feed to the ORIGINAL pixels on the canvas.
// Hence, we need to calculate the source and target ranges separately.
function forwardVideoToCanvas(videoCanvas) {
  const arScene = document.getElementById('ar-scene');
  const videoElement = arScene?.getElementsByTagName('video')[0];
  if (!arScene || !videoElement) return;

  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;
  let videoElementWidth, videoElementHeight;
  const videoRatio = videoElement.videoWidth / videoElement.videoHeight;
  const containerRatio = containerWidth / containerHeight;
  if (videoRatio > containerRatio) {
    videoElementHeight = containerHeight;
    videoElementWidth = videoElementHeight * videoRatio;
  } else {
    videoElementWidth = containerWidth;
    videoElementHeight = videoElementWidth / videoRatio;
  }
  const cameraSourceWidth = videoElement.videoWidth;
  const cameraSourceHeight = videoElement.videoHeight;
  const videoElementXStart =
    Math.round(
      ((videoElementWidth - containerWidth) / 2 / videoElementWidth) *
        cameraSourceWidth *
        1000
    ) / 1000;
  const videoElementYStart =
    Math.round(
      ((videoElementHeight - containerHeight) / 2 / videoElementHeight) *
        cameraSourceHeight *
        1000
    ) / 1000;
  const videoElementXSpan =
    Math.round(
      (containerWidth / videoElementWidth) * cameraSourceWidth * 1000
    ) / 1000;
  const videoElementYSpan =
    Math.round(
      (containerHeight / videoElementHeight) * cameraSourceHeight * 1000
    ) / 1000;
  const [targetWidth, targetHeight] = [videoCanvas.width, videoCanvas.height];
  const ctx = videoCanvas.getContext('2d', { willReadFrequently: true });
  ctx?.drawImage(
    videoElement,
    videoElementXStart,
    videoElementYStart,
    videoElementXSpan,
    videoElementYSpan,
    0,
    0,
    targetWidth,
    targetHeight
  );
}
