import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import useSetting from "/lib/hooks/store/setting";
import styles from "../styles/Home.module.css";
import { useExternalLink, useExternalScript } from "/lib/hooks/useScript";
import { useEffect, useState } from "react";

export default function Home() {
  const { handedness, mode } = useSetting((state) => ({
    handedness: state.handedness,
    mode: state.mode,
  }));
  const script1_state = useExternalScript(
    "https://www.glowscript.org/lib/jquery/2.1/jquery.min.js"
  );
  const link1_state = useExternalLink("https://www.glowscript.org/css/ide.css");
  const script3_state = useExternalScript(
    "https://www.glowscript.org/package/glow.3.2.min.js"
  );
  const script2_state = useExternalScript(
    "https://www.glowscript.org/lib/jquery/2.1/jquery-ui.custom.min.js"
  );
  const link2_state = useExternalLink(
    "https://www.glowscript.org/css/redmond/2.1/jquery-ui.custom.css"
  );
  const [ready, setReady] = useState(false);
  const setHandedness = useSetting((state) => state.setHandedness);
  const setMode = useSetting((state) => state.setMode);
  useEffect(() => {
    if (
      link1_state &&
      link2_state &&
      script1_state &&
      script2_state &&
      script3_state
    ) {
      setReady(true);
    }
  }, [link1_state, link2_state, script1_state, script2_state, script3_state]);

  return (
    <div className="flex flex-col justify-center min-h-screen ">
      <Head>
        <title>mbed-final</title>
        <meta name="description" content="mbed-final" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center min-h-full gap-4">
        <h1 className="text-4xl ">Welcome to Mbed Final - Air Basketball!</h1>
        {/* <FpsCounter /> */}

        <div className="flex flex-col items-center">
          <p>Pick handedness</p>
          <div className="flex flex-row gap-3">
            <div
              className={`hover:bg-slate-400 p-4 rounded-md ${
                handedness === "right" ? "bg-slate-200" : "bg-inherit"
              }`}
              onClick={() => {
                setHandedness("right");
              }}
            >
              {" "}
              Left
            </div>
            <div
              className={`hover:bg-slate-400 p-4 rounded-md ${
                handedness === "left" ? "bg-slate-200" : "bg-inherit"
              }`}
              onClick={() => {
                setHandedness("left");
              }}
            >
              {" "}
              Right
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p>Pick Difficulty</p>
          <div className="flex flex-row gap-3">
            <div
              className={`hover:bg-slate-400 p-4 rounded-md ${
                mode === "easy" ? "bg-slate-200" : "bg-inherit"
              }`}
              onClick={() => {
                setMode("easy");
              }}
            >
              {" "}
              Easy
            </div>
            <div
              className={`hover:bg-slate-400 p-4 rounded-md ${
                mode === "medium" ? "bg-slate-200" : "bg-inherit"
              }`}
              onClick={() => {
                setMode("medium");
              }}
            >
              {" "}
              Medium
            </div>
            <div
              className={`hover:bg-slate-400 p-4 rounded-md ${
                mode === "hard" ? "bg-slate-200" : "bg-inherit"
              }`}
              onClick={() => {
                setMode("hard");
              }}
            >
              {" "}
              Hard
            </div>
          </div>
        </div>

        <div
          className={` hover:bg-slate-400 p-4 rounded-md ${
            ready ? "" : "disabled:opacity-50"
          }`}
        >
          <Link href="/hand-pose-detection">
            <h2> Start game &rarr;</h2>
            <p>Fulfill your basketball dream anywhere, anytime! 👋</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
