import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = async (pageNumber = page) => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
          `http://localhost:8080/v1/search?q=${encodeURIComponent(query)}&p=${pageNumber}`
      );
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchResults();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchResults(newPage);
  };

  return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
        <h1>Busca Elasticsearch</h1>
        <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
          <input
              type="text"
              placeholder="Digite sua consulta"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: "70%", padding: 8, marginRight: 8 }}
          />
          <button type="submit" disabled={loading}>
            Buscar
          </button>
        </form>

        {loading && <p>Carregando...</p>}

        {error && <p style={{ color: "red" }}>Erro: {error}</p>}

        {results && (
            <>
              <p>
                Página {results.page} de{" "}
                {Math.ceil(results.totalResults / 10) || 1} — Total:{" "}
                {results.totalResults} resultados
              </p>

              <ul>
                {results.resultsList.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: 16 }}>
                      <a href={item.url} target="_blank" rel="noreferrer">
                        <h3>{item.title}</h3>
                      </a>
                      <p>{item.content}</p>
                    </li>
                ))}
              </ul>

              <div style={{ marginTop: 20 }}>
                {results.page > 1 && (
                    <button onClick={() => handlePageChange(results.page - 1)}>
                      Anterior
                    </button>
                )}
                {results.page * 10 < results.totalResults && (
                    <button
                        onClick={() => handlePageChange(results.page + 1)}
                        style={{ marginLeft: 8 }}
                    >
                      Próxima
                    </button>
                )}
              </div>
            </>
        )}
      </div>
  );
}

export default App;
