import React, { useState, useEffect } from 'react';
import { animeService } from '../services/api';
import { AnimeSubject } from '../types';
import { AnimeCard } from '../components/AnimeCard';
import { Search, Sparkles } from 'lucide-react';

export function AnimePage() {
  const [animes, setAnimes] = useState<AnimeSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Initial fetch with a popular term
    fetchAnimes('Naruto');
  }, []);

  const fetchAnimes = async (query: string) => {
    setLoading(true);
    try {
      const results = await animeService.search(query);
      setAnimes(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error('Anime search error:', err);
      setAnimes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchAnimes(searchQuery);
    }
  };

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
            <Sparkles className="text-yellow-500 w-8 h-8" />
            Anime Hub
          </h1>
          <p className="text-gray-400">Discover and stream the best anime series with VioletFlix</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search anime..."
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-full py-3 px-12 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {animes.map((anime, idx) => (
            <AnimeCard key={idx} anime={anime} />
          ))}
        </div>
      )}

      {!loading && animes.length === 0 && (
        <div className="text-center text-gray-500 py-20 italic">
          No anime found matching your search.
        </div>
      )}
    </div>
  );
}
