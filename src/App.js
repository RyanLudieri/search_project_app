import React, { useState } from "react";
import "./App.css";

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
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
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

  function highlightMatches(text, query) {
    if (!query) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escapa caracteres especiais
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    return text.replace(regex, "<strong>$1</strong>");
  }

  return (
    <div className="app-container">
      <h1>Search Engine</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Digite sua consulta"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Buscar
        </button>
      </form>

      {loading && <p className="loading">Carregando...</p>}
      {error && <p className="error">Erro: {error}</p>}

      {results && (
        <>
          <p className="pagination-info">
            Página {results.page} de {Math.ceil(results.totalResults / 10) || 1} — Total: {results.totalResults} resultados
          </p>

          <ul className="results-list">
            {results.resultsList.map((item, idx) => (
              <li key={idx} className="result-item">
                <a href={item.url} target="_blank" rel="noreferrer">
                  <h3>{item.title}</h3>
                </a>
                <p dangerouslySetInnerHTML={{ __html: highlightMatches(item.content, query) }} />
              </li>
            ))}
          </ul>

          <div className="pagination">
            {results.page > 1 && (
              <button onClick={() => handlePageChange(results.page - 1)}>
                ◀ Anterior
              </button>
            )}

            {Array.from({ length: Math.ceil(results.totalResults / 10) }, (_, i) => i + 1)
              .filter(p =>
                // mostra sempre 2 antes e 2 depois da página atual
                p === 1 || 
                p === Math.ceil(results.totalResults / 10) || 
                Math.abs(p - results.page) <= 2
              )
              .map((p, index, array) => {
                const prev = array[index - 1];
                const isGap = prev && p - prev > 1;

                return (
                  <React.Fragment key={p}>
                    {isGap && <span className="pagination-gap">...</span>}
                    <button
                      onClick={() => handlePageChange(p)}
                      className={p === results.page ? "active" : ""}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            {results.page * 10 < results.totalResults && (
              <button onClick={() => handlePageChange(results.page + 1)}>
                Próxima ▶
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
