import { useEffect, useState } from "react";

export const useExternalScript = (url) => {
  let [state, setState] = useState(url ? "loading" : "idle");

  useEffect(() => {
    if (!url) {
      setState("idle");
      return;
    }

    let script = document.querySelector(`script[src="${url}"]`);

    const handleScript = (e) => {
      setState(e.type === "load" ? "ready" : "error");
    };

    if (!script) {
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      document.body.appendChild(script);
      script.addEventListener("load", handleScript);
      script.addEventListener("error", handleScript);
    }

    script.addEventListener("load", handleScript);
    script.addEventListener("error", handleScript);

    return () => {
      script.removeEventListener("load", handleScript);
      script.removeEventListener("error", handleScript);
    };
  }, [url]);

  return state;
};

export const useExternalLink = (url) => {
  let [state, setState] = useState(url ? "loading" : "idle");

  useEffect(() => {
    if (!url) {
      setState("idle");
      return;
    }

    let link = document.querySelector(`link[href="${url}"]`);

    const handleScript = (e) => {
      setState(e.type === "load" ? "ready" : "error");
    };

    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.type = "text/css";
      document.body.appendChild(link);
      link.addEventListener("load", handleScript);
      link.addEventListener("error", handleScript);
    }

    link.addEventListener("load", handleScript);
    link.addEventListener("error", handleScript);

    return () => {
      link.removeEventListener("load", handleScript);
      link.removeEventListener("error", handleScript);
    };
  }, [url]);

  return state;
};
