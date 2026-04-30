import { useNavigate } from 'react-router-dom';
import { AnimeSubject } from '../types';

interface AnimeCardProps {
  anime: AnimeSubject;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/anime/${encodeURIComponent(anime.url)}`)}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 hover:border-red-600 transition-all duration-300">
        <img 
          src={anime.image} 
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-bold text-sm line-clamp-2">{anime.title}</p>
          {anime.year && <p className="text-xs text-gray-400">{anime.year}</p>}
        </div>
      </div>
    </div>
  );
          }
