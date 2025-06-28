import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/App.css";

function SearchEngine() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const queryParam = params.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [setPage] = useState(1);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função declarada no escopo do componente
  const fetchResults = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:8080/v1/search?q=${encodeURIComponent(
          query
        )}&p=${pageNumber}`
      );
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      const data = await res.json();
      setResults(data);
      setPage(pageNumber);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  // useEffect chama fetchResults quando query mudar
  useEffect(() => {
    if (query) {
      fetchResults(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]); // remove warning temporariamente

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      // atualiza a URL para manter o histórico e disparar a busca pelo useEffect
      navigate(`/search?q=${encodeURIComponent(query)}`);
      // fetchResults(1);  // não é mais necessário porque o useEffect já dispara ao mudar query
    }
  };

  const handlePageChange = (newPage) => {
    fetchResults(newPage);
  };

  const handleBack = () => {
    navigate("/");
  };

  function highlightMatches(text, query) {
    if (!query) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
        <button
          type="button"
          className="back-button"
          onClick={handleBack}
          style={{ marginLeft: "10px" }}
        >
          Voltar
        </button>
      </form>

      {loading && <p className="loading">Carregando...</p>}
      {error && <p className="error">Erro: {error}</p>}

      {results && (
        <>
          <p className="pagination-info">
            Página {results.page} de{" "}
            {Math.ceil(results.totalResults / 10) || 1} — Total:{" "}
            {results.totalResults} resultados
          </p>

          <ul className="results-list">
            {results.resultsList.map((item, idx) => (
              <li key={idx} className="result-item">
                <a href={item.url} target="_blank" rel="noreferrer">
                  <h3>{item.title}</h3>
                </a>
                <p
                  dangerouslySetInnerHTML={{
                    __html: highlightMatches(item.content, query),
                  }}
                />
              </li>
            ))}
          </ul>

          <div className="pagination">
            {results.page > 1 && (
              <button onClick={() => handlePageChange(results.page - 1)}>
                ◀ Anterior
              </button>
            )}

            {Array.from(
              { length: Math.ceil(results.totalResults / 10) },
              (_, i) => i + 1
            )
              .filter(
                (p) =>
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

export default SearchEngine;
