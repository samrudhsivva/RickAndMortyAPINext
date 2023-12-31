import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";

const defaultEndPoint = `https://rickandmortyapi.com/api/character/`;
export async function getServerSideProps() {
  const res = await fetch(defaultEndPoint);
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  console.log("data", data);

  const { info, results: defaultResults } = data;
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndPoint,
  });

  const { current } = page;

  useEffect(() => {
    if (current === defaultEndPoint) return;

    async function request() {
      const res = await fetch(current);
      const nextData = await res.json();
      updatePage({
        current,
        ...nextData.info,
      });

      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }

      updateResults((prev) => {
        return [...prev, ...nextData.results];
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage((prev) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  }

  function searchHandler(e) {
    console.log("e is ", e);
    e.preventDefault();
    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find((field) => field.name === "query");
    const value = fieldQuery.value || "";
    const endPoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      current: endPoint,
    });
  }

  function genderFilterHandler(e) {
    e.preventDefault();
    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find((field) => field.name === "genderQuery");
    const value = fieldQuery.value || "";
    const endPoint = `https://rickandmortyapi.com/api/character/?gender=${value}`;

    updatePage({
      current: endPoint,
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>My NextJS app</h1>

        <p className={styles.description}>Ricky AND Morty Wiki using API</p>

        <form className="search" onSubmit={searchHandler}>
          <input data-testid="searchId" name="query" type="search" />
          <button data-testid="searchButton" name="search">
            search
          </button>
        </form>

        <form onSubmit={genderFilterHandler}>
          <input data-testid="genderId" name="genderQuery" type="text" />
          <button>gender</button>
        </form>
        <ul className={styles.grid}>
          {results.map((result) => {
            const { id, name, image } = result;
            return (
              <li key={id} className={styles.card}>
                <Link
                  data-testid={`imageData-${String(id)}`}
                  href="/character/[id]"
                  as={`/character/${id}`}
                >
                  <img src={image} alt={name} />
                  <h2>{name}</h2>
                </Link>
              </li>
            );
          })}
        </ul>

        <button onClick={handleLoadMore}>Load More</button>
      </main>
    </div>
  );
}
