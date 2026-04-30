import { useNavigate } from 'react-router-dom';
import { Subject } from '../types';
import { Play } from 'lucide-react';

interface MovieRowProps {
  title: string;
  movies: Subject[];
}

export function MovieRow({ title, movies }: MovieRowProps) {
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
        {movies.map((movie) => (
          <div
            key={movie.subjectId}
            onClick={() => navigate(`/movie/${movie.subjectId}`)}
            className="group flex-shrink-0 w-44 cursor-pointer snap-start"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-xl transition-all group-hover:scale-105 group-hover:border-red-600">
              <img
                src={movie.cover.url}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all" />
              
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform">
                <p className="font-bold text-sm line-clamp-2 leading-tight text-white drop-shadow-md">
                  {movie.title}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {movie.releaseDate?.split('-')[0] || '2025'}
                </p>
              </div>

              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
                <div className="w-8 h-8 bg-red-600/90 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
                          }
