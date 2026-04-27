import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Play, Trophy, Newspaper, Clock } from 'lucide-react';
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
        sportsService.getSportTrend(1, 6)
      ]);
      setMatches(scoresData);
      setNews(trendData);
    } catch (err) {
      console.error(err);
      setError('Live data temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchLive = async (match: any) => {
    if (!match.id) {
      alert("Live stream coming soon!");
      return;
    }
    try {
      const detail = await sportsService.getMatchDetail(match.id);
      const streamUrl = detail?.streamUrl || detail?.playPath || detail?.url;
      if (streamUrl) window.open(streamUrl, '_blank');
      else alert(`Opening stream for ${match.homeTeam || match.team1} vs ${match.awayTeam || match.team2}`);
    } catch {
      alert(`🎥 Watch Live: ${match.homeTeam || match.team1} vs ${match.awayTeam || match.team2}`);
    }
  };

  if (loading) return <div className="pt-24 flex justify-center"><div className="animate-spin h-12 w-12 border-b-2 border-red-600" /></div>;

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen bg-[#141414] pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Trophy className="w-10 h-10 text-red-600" />
          <h1 className="text-4xl font-black tracking-tighter">Sports Hub</h1>
        </div>

        <div className="flex border-b border-white/10 mb-10 overflow-x-auto">
          {[
            { key: 'matches', label: 'MATCHES', icon: Play },
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

        {error && <p className="text-red-500 mb-6 text-center">{error}</p>}

        {activeTab === 'matches' && (
          <div className="space-y-6">
            {matches.length > 0 ? matches.map((match, i) => (
              <Card key={i} className="bg-[#1a1a1a] border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{match.competition?.name || match.league}</span>
                    <span>{match.startTime} • {match.startDate}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between py-4">
                    <div className="font-semibold">{match.homeTeam || match.team1}</div>
                    <div className="text-3xl font-black text-red-600">
                      {(match.score?.home ?? match.score1) || 0} - {(match.score?.away ?? match.score2) || 0}
                    </div>
                    <div className="font-semibold text-right">{match.awayTeam || match.team2}</div>
                  </div>
                  <Button 
                    onClick={() => handleWatchLive(match)}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 py-7 text-lg font-bold"
                  >
                    <Play className="mr-3" /> 
                    {match.status?.isLive ? 'WATCH LIVE NOW' : 'STREAM HIGHLIGHTS'}
                  </Button>
                </CardContent>
              </Card>
            )) : <p className="text-center text-gray-500 py-12">No matches available right now.</p>}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-8">
            {news.length > 0 ? news.map((item, i) => (
              <Card key={i} className="bg-[#1a1a1a] border-white/10 overflow-hidden">
                {item.cover?.url && <img src={item.cover.url} className="w-full h-52 object-cover" />}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400">{item.summary}</p>
                  <Button variant="link" className="text-red-600 px-0 mt-4">Read Full Story →</Button>
                </CardContent>
              </Card>
            )) : <p className="text-center text-gray-500 py-12">No trending news at the moment.</p>}
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
