import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [celebrity1Input, setCelebrity1Input] = useState("");
  const [celebrity2Input, setCelebrity2Input] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ celebrity1: celebrity1Input,  celebrity2: celebrity2Input}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setCelebrity1Input("");
      setCelebrity2Input("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>ChatGPT Celebrity Couple Portmanteau</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/cclogo.png" className={styles.icon} />
        <h3>Celebrity Couple Portmanteau!</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="celebrity1"
            placeholder="Enter celebrity 1 first name"
            value={celebrity1Input}
            onChange={(e) => setCelebrity1Input(e.target.value)}
          />
          <input
            type="text"
            name="celebrity2"
            placeholder="Enter celebrity 2 first name"
            value={celebrity2Input}
            onChange={(e) => setCelebrity2Input(e.target.value)}
          />
          <input type="submit" value="Generate Portmanteau" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
