import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Play, Trophy, Newspaper, Clock, ExternalLink } from 'lucide-react';
import { sportsService } from '../services/api';
import { cn } from '@/lib/utils';

export function Sports() {
  const [activeTab, setActiveTab] = useState<'matches' | 'news' | 'highlights'>('matches');
  const [matches, setMatches] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSportsData();
  }, []);

  const fetchSportsData = async () => {
    setLoading(true);
    setError('');
    try {
      const [scoresData, trendData] = await Promise.all([
        sportsService.getScores(10),
        sportsService.getSportTrend(1, 8)
      ]);
      setMatches(Array.isArray(scoresData) ? scoresData : []);
      setNews(Array.isArray(trendData) ? trendData : []);
    } catch (err) {
      console.error(err);
      setError('Unable to load live sports data right now.');
    } finally {
      setLoading(false);
    }
  };

  // This is the main function you asked for - uses only match.id
  const handleWatchLive = async (match: any) => {
    const home = match.homeTeam || match.team1 || match.home || 'Home';
    const away = match.awayTeam || match.team2 || match.away || 'Away';

    if (!match.id) {
      alert(`No match ID found for ${home} vs ${away}`);
      return;
    }

    try {
      // Call match-detail API using only the ID
      const detail = await sportsService.getMatchDetail(match.id);

      if (!detail) {
        throw new Error("No data from match detail API");
      }

      // Try every possible stream field name from your API
      const streamUrl = 
        detail.streamUrl || 
        detail.playUrl || 
        detail.hlsUrl || 
        detail.liveUrl || 
        detail.url || 
        detail.videoUrl || 
        detail.embedUrl || 
        detail.streamLink ||
        detail.playPath;

      if (streamUrl && typeof streamUrl === 'string' && streamUrl.startsWith('http')) {
        window.open(streamUrl, '_blank');   // Open the real live stream
        return;
      }

      // If no direct stream link found
      alert(`No direct stream link found for ${home} vs ${away}.\n\nTrying Google search...`);
      const searchQuery = `${home} vs ${away} live stream`;
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');

    } catch (err) {
      console.error('Live stream error:', err);
      alert(`Could not open live stream for ${home} vs ${away}.\n\nError: ${err.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="pt-24 flex justify-center"><div className="animate-spin h-12 w-12 border-b-2 border-red-600" /></div>;
  }

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen bg-[#141414] pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Trophy className="w-10 h-10 text-red-600" />
          <h1 className="text-4xl font-black tracking-tighter">Sports Hub</h1>
        </div>

        <div className="flex border-b border-white/10 mb-10 overflow-x-auto">
          {[
            { key: 'matches', label: 'LIVE MATCHES', icon: Play },
            { key: 'news', label: 'SPORT NEWS', icon: Newspaper },
            { key: 'highlights', label: 'HIGHLIGHTS', icon: Trophy }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                "px-8 py-5 font-bold flex items-center gap-3 border-b-4 transition-all whitespace-nowrap",
                activeTab === tab.key ? "border-red-600 text-white" : "border-transparent text-gray-400 hover:text-white"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 mb-8 text-center bg-red-950/50 p-4 rounded-xl">{error}</p>}

        {activeTab === 'matches' && (
          <div className="space-y-6">
            {matches.length > 0 ? matches.map((match, i) => {
              const home = match.homeTeam || match.team1 || 'Home';
              const away = match.awayTeam || match.team2 || 'Away';
              const isLive = match.status?.isLive || match.isLive || false;

              return (
                <Card key={i} className="bg-[#1a1a1a] border-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{match.competition?.name || match.league || 'Match'}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {match.startTime || match.time || 'Now'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between py-6 text-lg font-medium">
                      <div className="flex-1 text-right">{home}</div>
                      <div className="mx-8 text-4xl font-black text-red-600">
                        {(match.score?.home ?? match.score1) || 0} - {(match.score?.away ?? match.score2) || 0}
                      </div>
                      <div className="flex-1">{away}</div>
                    </div>

                    <Button 
                      onClick={() => handleWatchLive(match)}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 py-7 text-lg font-bold flex items-center justify-center gap-3"
                    >
                      <Play className="w-6 h-6" fill="currentColor" />
                      {isLive ? 'WATCH LIVE NOW' : 'OPEN MATCH DETAIL'}
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              );
            }) : (
              <p className="text-center text-gray-500 py-20">No matches available at the moment.</p>
            )}
          </div>
        )}

        {/* News and Highlights tabs remain the same */}
        {activeTab === 'news' && (
          <div className="space-y-8">
            {news.length > 0 ? news.map((item, i) => (
              <Card key={i} className="bg-[#1a1a1a] border-white/10 overflow-hidden">
                {item.cover?.url && <img src={item.cover.url} className="w-full h-52 object-cover" />}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400">{item.summary || item.description}</p>
                  <Button variant="link" className="text-red-600 px-0 mt-4">Read Full Story →</Button>
                </CardContent>
              </Card>
            )) : <p className="text-center text-gray-500 py-20">No trending news right now.</p>}
          </div>
        )}

        {activeTab === 'highlights' && (
          <div className="text-center py-20 text-gray-400">
            <Trophy className="mx-auto w-20 h-20 mb-6 opacity-40" />
            <h3 className="text-3xl font-bold mb-3">Match Highlights</h3>
            <p>Full replays coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
  }
