import { useEffect, useState } from "react";
import io from "socket.io-client";

import axios from "axios";
export const useGame = (
  externalStates,
  isGesture,
  floor,
  setFloor,
  setVelocity,
  restart
) => {
  const [gameState, setGameState] = useState("init");

  useEffect(() => {
    const socket = io("http://192.168.0.14:5328");
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
    socket.on("velocity", (data) => {
      console.log(data);
      setVelocity(data);
      setGameState("simulation");
      restart(Math.random());
    });
  }, []);
  useEffect(() => {
    if (
      gameState === "loading" &&
      externalStates.every((state) => state === "ready")
    ) {
      setGameState("ready");
      axios
        .get("/api/velocity")
        .then(function (response) {
          //   * from ready -> simulation
          setVelocity(response.data);
          setGameState("simulation");
          restart(Math.random());
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (gameState === "init") {
      setGameState("loading");
    }
  }, [externalStates]);

  //  * from simulation -> ready
  useEffect(() => {
    if (gameState === "simulation" && isGesture && floor) {
      setGameState("ready");
      setFloor(false);
      restart(Math.random());
      //  * Send http request to backend, asking for ball velocity
      axios.get("/api/velocity").catch(function (error) {
        console.log(error);
      });
    }
  }, [isGesture, floor]);

  useEffect(() => {
    console.log("gameState", gameState);
  }, [gameState]);

  return gameState;
};
