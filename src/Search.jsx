import React, { useState } from 'react';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await fetch('/v1/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) throw new Error('Erro na requisição');

            const data = await response.json();
            setResults(data); // Ajuste conforme o formato da sua resposta
        } catch (err) {
            console.error(err);
            alert('Erro ao buscar');
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Busca Wikipedia</h1>
            <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Digite a palavra-chave"
                style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
            />
            <button onClick={handleSearch} disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar'}
            </button>

            <div style={{ marginTop: '2rem' }}>
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
