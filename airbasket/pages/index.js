import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import FpsCounter from "../components/FpsCounter";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import io from "socket.io-client";

export default function Home() {
  useEffect(() => {
    const socket = io("http://192.168.0.14:5328");
  });
  return (
    <div className={styles.container}>
      <Head>
        <title>mbed-final</title>
        <meta name="description" content="ml-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} style={{ justifyContent: "center" }}>
        <h1 className={styles.title}>
          Welcome to <Link href="/">ml-app!</Link>
        </h1>
        {/* <FpsCounter /> */}

        <div className={styles.grid}>
          <Link href="/hand-pose-detection" className={styles.card}>
            <h2> Hand Detection &rarr;</h2>
            <p>Hand pose detection by TensorFlow 👋</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
