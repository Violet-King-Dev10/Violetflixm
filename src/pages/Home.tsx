import { useState, useEffect } from 'react';
import { movieService } from '../services/api';
import { Subject } from '../types';
import { MovieRow } from '../components/MovieRow';
import { cn } from '../lib/utils';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function Home() {
  const [trending, setTrending] = useState<Subject[]>([]);
  const [hot, setHot] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, hotData] = await Promise.all([
          movieService.getTrending(0, 20),
          movieService.getHot()
        ]);
        setTrending(Array.isArray(trendingData) ? trendingData : []);
        setHot(Array.isArray(hotData) ? hotData : []);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto carousel
  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % trending.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [trending]);

  const currentHero = trending.length > 0 ? trending[currentHeroIndex] : null;
  const goToHero = (index: number) => setCurrentHeroIndex(index);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141414]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#141414] pb-20">
      {/* Fixed Top Navigation - Logo on top, links below */}
      <div className="fixed top-0 left-0 right-0 bg-[#141414]/95 backdrop-blur-md z-50 border-b border-white/10">
        <div className="px-4 md:px-12 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Logo />
          </div>

          {/* Navigation Links - Below Logo */}
          <div className="flex items-center justify-center gap-6 md:gap-8 text-sm font-medium text-gray-300">
            <span 
              className="hover:text-white cursor-pointer transition-colors" 
              onClick={() => navigate('/')}
            >
              HOME
            </span>
            <span 
              className="hover:text-white cursor-pointer transition-colors" 
              onClick={() => navigate('/movies')}
            >
              MOVIES
            </span>
            <span 
              className="hover:text-white cursor-pointer transition-colors" 
              onClick={() => navigate('/series')}
            >
              SERIES
            </span>
            <span 
              className="hover:text-white cursor-pointer transition-colors" 
              onClick={() => navigate('/sports')}
            >
              SPORTS
            </span>
          </div>
        </div>
      </div>

      {/* Hero Carousel - Axis TV Style */}
      {currentHero && (
        <div className="relative h-[58vh] md:h-[52vh] overflow-hidden pt-24">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ 
              backgroundImage: `url(${currentHero.cover.url})`,
              filter: 'brightness(0.75)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          
          <div className="absolute bottom-12 left-6 md:left-12 max-w-lg space-y-6 z-10">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white drop-shadow-2xl">
              {currentHero.title}
            </h1>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate(`/watch/${currentHero.subjectId}`)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-6 text-lg flex items-center gap-3"
              >
                <Play className="w-6 h-6 fill-current" /> Play Now
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate(`/movie/${currentHero.subjectId}`)}
                className="border-white/70 text-white hover:bg-white/10 px-8 py-6 text-lg flex items-center gap-3"
              >
                <Info className="w-6 h-6" /> More Info
              </Button>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {trending.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToHero(idx)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  idx === currentHeroIndex ? "bg-red-600 scale-125" : "bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 md:px-12 relative z-10 -mt-8 space-y-12">
        {trending.length > 0 && <MovieRow title="Trending Now" movies={trending} />}

        {trending.length > 4 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Top 10 movies in VioletFlix</h2>
              <span className="text-red-600 text-sm font-medium cursor-pointer hover:underline">See All</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trending.slice(4, 16).map((movie) => (
                <div 
                  key={movie.subjectId} 
                  className="group cursor-pointer"
                  onClick={() => navigate(`/movie/${movie.subjectId}`)}
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10">
                    <img 
                      src={movie.cover.url} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <p className="font-bold text-sm line-clamp-2">{movie.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hot.length > 0 && <MovieRow title="Hot & New" movies={hot} />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/10 z-50">
        <div className="flex items-center justify-around py-3 max-w-md mx-auto">
          <div className="flex flex-col items-center text-red-600 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-6 h-6">🏠</div>
            <span className="text-[10px] mt-1">Home</span>
          </div>
          <div className="flex flex-col items-center text-gray-400 hover:text-white cursor-pointer" onClick={() => navigate('/movies')}>
            <div className="w-6 h-6">🎬</div>
            <span className="text-[10px] mt-1">Browse</span>
          </div>
          <div className="flex flex-col items-center text-gray-400 hover:text-white cursor-pointer" onClick={() => navigate('/search')}>
            <div className="w-6 h-6">🔍</div>
            <span className="text-[10px] mt-1">Search</span>
          </div>
          <div className="flex flex-col items-center text-gray-400 hover:text-white cursor-pointer" onClick={() => navigate('/sports')}>
            <div className="w-6 h-6">⚽</div>
            <span className="text-[10px] mt-1">Sports</span>
          </div>
          <div className="flex flex-col items-center text-gray-400 hover:text-white cursor-pointer" onClick={() => navigate('/profile')}>
            <div className="w-6 h-6">👤</div>
            <span className="text-[10px] mt-1">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
               }
