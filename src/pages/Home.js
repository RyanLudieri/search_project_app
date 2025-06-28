import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="home-container">
      
      <h1>
        Bem-vindo ao 
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Logo"
          className="logo"
        />
      </h1>
      <p className="home-description">
        Esta é uma ferramenta para buscar informações relacionadas a matemática. Digite sua palavra-chave abaixo para começar sua pesquisa.
      </p>

      <form onSubmit={handleSubmit} className="home-search-form">
        <input
          type="text"
          placeholder="Digite sua busca..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="home-search-input"
        />
        <button type="submit" className="home-search-button">
          Buscar
        </button>
      </form>
    </div>
  );
}

export default Home;
