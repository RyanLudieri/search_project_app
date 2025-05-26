import React, { useState } from "react";
import styles from "./Search.module.css";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch("/v1/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error("Erro na requisição");

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar");
    }
    setLoading(false);
  };

  return (
    <div className={styles.searchContainer}>
      <h1>Busca Wikipedia</h1>
      <div className={styles.searchBar}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite a palavra-chave"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      <div className={styles.results}>
        <h2>Resultados</h2>
        <ul>
          {results.map((item, index) => (
            <li key={index}>
              <strong>{item.title}</strong>: {item.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Search;
