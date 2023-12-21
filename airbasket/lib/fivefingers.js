import * as fp from "fingerpose";

const FiveFingerGesture = new fp.GestureDescription("five_finger");

for (let finger of [
  fp.Finger.Index,
  fp.Finger.Thumb,
  fp.Finger.Middle,
  fp.Finger.Ring,
  fp.Finger.Pinky,
]) {
  FiveFingerGesture.addCurl(finger, fp.FingerCurl.NoCurl);
  FiveFingerGesture.addDirection(finger, fp.FingerDirection.VerticalUp, 1.0);
  FiveFingerGesture.addDirection(
    finger,
    fp.FingerDirection.DiagonalUpLeft,
    1.0
  );
  FiveFingerGesture.addDirection(
    finger,
    fp.FingerDirection.DiagonalUpRight,
    1.0
  );
}

const GE = new fp.GestureEstimator([FiveFingerGesture]);
export default GE;
