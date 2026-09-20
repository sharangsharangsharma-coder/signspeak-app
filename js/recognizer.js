// ISL → English recognition hook. NOT CONNECTED YET.
//
// The Scan sign screen already opens the camera and calls this interface, so
// wiring in the model later means filling in start()/stop() here and nothing else.
//
// Contract:
//   ready                  → true once a model is loaded
//   start(video, onResult) → begin reading frames from the <video> element and call
//                            onResult({ text, confidence, alternatives }) as signs
//                            are recognised (alternatives: [{ text, confidence }])
//   stop()                 → stop reading frames and release resources
//
// Suggested path: MediaPipe Holistic in the browser (landmarks) → your
// classifier exported for the web (e.g. TensorFlow.js) → onResult().

export function createRecognizer() {
  return {
    ready: false,
    async start(_video, _onResult) { /* connect landmark extraction + classifier here */ },
    stop() {},
  };
}
