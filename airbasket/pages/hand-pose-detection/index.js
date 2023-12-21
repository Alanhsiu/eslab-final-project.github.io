import useSetting from "/lib/hooks/store/setting";
import Simulation from "../../components/simulation";
import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";
import { drawHands, transformLandmarks } from "../../lib/utils";
import { setupCanvas, setupDetector, setupVideo } from "../../lib/setup";
import Link from "next/link";
import { useAnimationFrame } from "../../lib/hooks/useAnimationFrame";
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";
import GE from "/lib/fivefingers";
import axios from "axios";
import { useGame } from "../../lib/hooks/useGame";
tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`
);

// Format the remaining time (e.g., “00:05:10” for 5 minutes and 10 seconds)
const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function HandPoseDetection() {
  const detectorRef = useRef();
  const videoRef = useRef();
  const [ctx, setCtx] = useState();
  const [acceleration, setAcceleration] = useState([0, 0, 0]);
  const [fingerDetection, setFingerDetection] = useState(false);
  const [bucket, setBucket] = useState(false); // * State for ball in the bucket
  const [floor, setFloor] = useState(false); // * State for ball touching the floor
  const [seed, setSeed] = useState(Math.random());
  const { handedness, mode } = useSetting((state) => ({
    handedness: state.handedness,
    mode: state.mode,
  }));

  const [gameState, score, seconds] = useGame(
    fingerDetection,
    floor,
    setFloor,
    setAcceleration,
    setSeed,
    bucket,
    setBucket
  );

  useEffect(() => {
    async function initialize() {
      videoRef.current = await setupVideo();
      const ctx = await setupCanvas(videoRef.current);
      detectorRef.current = await setupDetector();

      setCtx(ctx);
    }

    initialize();
  }, []);

  useEffect(() => {
    console.log(handedness, mode);
  }, [handedness, mode]);

  useAnimationFrame(async (delta) => {
    let hands = await detectorRef.current.estimateHands(video, {
      flipHorizontal: false,
    });
    hands = hands.filter(
      (hand) => hand.handedness.toLowerCase() === handedness
    );
    if (hands.length > 0) {
      // TODO: add right/left hand
      const estimatedGestures = GE.estimate(
        transformLandmarks(hands[0].keypoints3D),
        9.5
      );
      if (
        estimatedGestures.gestures.length > 0 &&
        estimatedGestures.gestures[0].score >= 9
      ) {
        setFingerDetection(true);
        console.log("gesture detected");
      } else {
        // * If wrong gesture, set fingerDetection to false
        setFingerDetection(false);
      }
    } else {
      // * If no hands, set fingerDetection to false
      setFingerDetection(false);
    }

    ctx.clearRect(
      0,
      0,
      videoRef.current.videoWidth,
      videoRef.current.videoHeight
    );
    ctx.drawImage(
      videoRef.current,
      0,
      0,
      videoRef.current.videoWidth,
      videoRef.current.videoHeight
    );
    drawHands(hands, ctx);
  }, !!(detectorRef.current && videoRef.current && ctx));

  return (
    <div className="flex h-screen bg-white">
      <div className="flex flex-col w-3/4 p-4 border-r border-blue-500">
        <div className="flex flex-col items-center justify-center flex-grow border-4 border-blue-500">
          {gameState === "ready" || gameState === "simulation" ? (
            <Simulation
              acceleration={acceleration}
              key={seed}
              isStatic={gameState === "ready"}
              setBucket={setBucket}
              setFloor={setFloor}
              mode={mode}
            />
          ) : (
            <></>
          )}
        </div>
        {/* Enter acceleration */}
        <div className="flex-grow-0 p-4 border-4 border-blue-500">
          <label className="block">
            <span className="text-gray-700">acceleration</span>
            <input
              type="number"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter acceleration"
              value={acceleration[0]}
              onChange={(e) =>
                setAcceleration([
                  Number(e.target.value),
                  acceleration[1],
                  acceleration[2],
                ])
              }
            />

            <input
              type="number"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter acceleration"
              value={acceleration[1]}
              onChange={(e) =>
                setAcceleration([
                  acceleration[0],
                  Number(e.target.value),
                  acceleration[2],
                ])
              }
            />
            <input
              type="number"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter acceleration"
              value={acceleration[2]}
              onChange={(e) =>
                setAcceleration([
                  acceleration[0],
                  acceleration[1],
                  Number(e.target.value),
                ])
              }
            />
          </label>
          {/* a button for set end */}
          <button
            className="p-2 mt-4 text-white bg-blue-500 rounded-lg shadow-lg"
            onClick={() => {
              setSeed(Math.random());
            }}
          >
            retstart
          </button>
        </div>
      </div>
      <div className="flex flex-col w-1/4 p-4 space-y-4">
        <div className="p-4 border-4 border-blue-500">
          <h1 className="inline-block p-2 text-2xl font-bold text-white bg-blue-700 border-2 border-blue-500 rounded-lg shadow-lg">
            Score: {score}
          </h1>
          <div className="inline-block p-2 mt-4 font-mono text-lg text-white bg-blue-700 border-2 border-blue-500 rounded-lg shadow-lg">
            <p>Time Remaining: {formatTime(seconds)}</p>
          </div>
        </div>
        <div className="flex-grow" />
        <div className="p-4 border-4 border-blue-500">
          <h2>Your view:</h2>
          <div className="mt-2 border-4 border-blue-500 ">
            <canvas
              className="transform scaleX(-1) z-10 rounded-lg shadow-md "
              id="gesture"
            ></canvas>
            <video
              className="hidden transform scaleX(-1) "
              id="video"
              playsInline
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
}
