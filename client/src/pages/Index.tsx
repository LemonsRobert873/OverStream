import { useState, useEffect } from 'react';
import { MatchSpotlight } from '@/components/MatchSpotlight';
import { MatchCard } from '@/components/MatchCard';
import { LoadingCards } from '@/components/LoadingCards';

const DATA_URL = 'https://raw.githubusercontent.com/Jitendra-unatti/fancode/refs/heads/main/data/fancode.json';

interface Match {
  match_id: string;
  title: string;
  tournament?: string;
  language?: string;
  image?: string;
  status?: string;
  STREAMING_CDN?: Record<string, string>;
  adfree_stream?: string;
  dai_stream?: string;
}

interface MatchData {
  matches: Match[];
}

export default function Index() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [spotlightMatch, setSpotlightMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data: MatchData = await res.json();
      let allMatches = Array.isArray(data.matches) ? data.matches : [];

      // Sort: LIVE matches first
      allMatches.sort((a, b) => {
        const aIsLive = a.status?.toUpperCase() === 'LIVE';
        const bIsLive = b.status?.toUpperCase() === 'LIVE';
        return Number(bIsLive) - Number(aIsLive);
      });

      // Extract first live match for spotlight
      const firstLive = allMatches.find(m => m.status?.toUpperCase() === 'LIVE');
      if (firstLive) {
        setSpotlightMatch(firstLive);
        setMatches(allMatches.filter(m => m.match_id !== firstLive.match_id));
      } else {
        setMatches(allMatches);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to load matches:', err);
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.15), transparent 30%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.1), transparent 30%)',
          backgroundAttachment: 'fixed'
        }}
      />

      <header className="relative text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-amber-400">
          OVERTIME
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Where the game never ends
        </p>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 pb-12">
        {loading && <LoadingCards />}

        {!loading && !error && (
          <>
            {spotlightMatch && (
              <div className="mb-16">
                <MatchSpotlight match={spotlightMatch} />
              </div>
            )}

            <div className="mt-16 mb-8 px-2">
              <h2 className="text-2xl font-bold tracking-tight">Live & Upcoming</h2>
              <div className="w-20 h-1 mt-2 bg-gradient-to-r from-sky-500 to-amber-500 rounded-full" />
            </div>

            {matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match, index) => (
                  <MatchCard
                    key={match.match_id}
                    match={match}
                    delay={index * 100}
                  />
                ))}
              </div>
            ) : !spotlightMatch && (
              <p className="text-center text-muted-foreground">No matches available right now.</p>
            )}
          </>
        )}

        {error && (
          <p className="text-center text-destructive">
            Could not load matches. Please check your connection and try again.
          </p>
        )}
      </main>
    </div>
  );
}
