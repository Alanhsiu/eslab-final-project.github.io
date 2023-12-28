import { useEffect, useState } from "react";
import io from "socket.io-client";

import axios from "axios";
import { data } from "jquery";
export const useGame = (
  isGesture,
  floor,
  setFloor,
  setAcceleration,
  restart,
  bucket,
  setBucket,
  level,
  setLevel
) => {
  const [gameState, setGameState] = useState("ready");
  const [seconds, setSeconds] = useState(360);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
    socket.on("velocity", (data) => {
      console.log(data);
      setAcceleration(data.map((v) => Number(v)));
      setGameState("simulation");
      restart(Math.random());
    });
    socket.on("level", (data) => {
      console.log(data);
      setLevel(data);
    });

    // * send request for first velocity
    axios
      .get("/api/velocity")
      .then(function (response) {
        // //   * from ready -> simulation
        // setGameState("simulation");
        // restart(Math.random());
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  //  * from simulation -> ready
  useEffect(() => {
    if (isGesture && floor && gameState === "simulation") {
      console.log("isGesture", isGesture);
      setGameState("ready");
      setFloor(false);
      setBucket(false);

      restart(Math.random());
      //  * Send http request to backend, asking for ball velocity
      axios.get("/api/velocity").catch(function (error) {
        console.log(error);
      });
    }
  }, [isGesture, floor]);

  useEffect(() => {
    if (bucket) {
      if (bucket && gameState === "simulation") {
        console.log("send request");
        axios
          .get("/api/score")
          .then(function (response) {
            //   * from ready -> simulation
            console.log(response);
            if (level === 0) setScore(score + 2);
            else if (level === 1) setScore(score + 3);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  }, [bucket]);

  useEffect(() => {
    // Exit early if countdown is finished
    if (seconds <= 0) {
      axios
        .get("/api/expire")
        .then(function (response) {
          //   * from ready -> simulation
          console.log("expire");
        })
        .catch(function (error) {
          console.log(error);
        });
      return;
    }

    // Set up the timer
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    // Clean up the timer
    return () => clearInterval(timer);
  }, [seconds]);

  useEffect(() => {
    console.log("gameState", gameState);
  }, [gameState]);

  return [gameState, score, seconds];
};
