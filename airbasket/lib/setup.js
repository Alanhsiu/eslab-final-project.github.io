import { fitToContainer } from "./utils";
import {
  createDetector,
  SupportedModels,
} from "@tensorflow-models/hand-pose-detection";

export async function setupVideo() {
  const video = document.getElementById("video");
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  video.srcObject = stream;
  await new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve();
    };
  });
  video.play();

  video.width = video.videoWidth;
  video.height = video.videoHeight;

  return video;
}

export async function setupDetector() {
  const model = SupportedModels.MediaPipeHands;
  const detector = await createDetector(model, {
    runtime: "mediapipe",
    maxHands: 2,
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
  });

  return detector;
}

export async function setupCanvas(video) {
  const handpose_canvas = document.getElementById("gesture");
  fitToContainer(handpose_canvas);

  const ctx = handpose_canvas.getContext("2d");

  handpose_canvas.width = video.width;
  handpose_canvas.height = video.height;

  return ctx;
}
