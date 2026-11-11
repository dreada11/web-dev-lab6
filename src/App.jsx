import { useState } from 'react';
import { MovieCard } from './MovieCard';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('idle'); 
  const [error, setError] = useState(null);

  // Тестовый ключ для лабы. Замени на свой с omdbapi.com, если лимит исчерпан
  const API_KEY = 'b9bd48a6'; 

  const fetchMovies = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setStatus('loading');
    setError(null);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&apikey=${API_KEY}`
      );
      
      if (!res.ok) throw new Error('Ошибка сети');

      const data = await res.json();

      if (data.Error) {
        setMovies([]);
        setStatus('error');
        setError('Ничего не найдено');
        return;
      }

      setMovies(data.Search || []);
      setStatus('success');
    } catch (err) {
      setMovies([]);
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <div className="app-container">
      <h1>Поиск фильмов</h1>

      <div className="search-bar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите название фильма..."
        />
        <button
          onClick={() => fetchMovies(query)}
          disabled={status === 'loading'}
        >
          Найти
        </button>
      </div>

      {status === 'idle' && (
        <p className="info-text">Введите название фильма и нажмите «Найти».</p>
      )}

      {status === 'loading' && <p className="info-text">Загрузка...</p>}

      {status === 'error' && (
        <div className="error">
          <p>Ошибка: {error}</p>
        </div>
      )}

      {status === 'success' && movies.length === 0 && (
        <p className="info-text">Ничего не найдено по вашему запросу.</p>
      )}

      {status === 'success' && movies.length > 0 && (
        <div className="movie-list">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;