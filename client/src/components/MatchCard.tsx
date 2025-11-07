import { StreamButton } from './StreamButton';
import { Calendar, Clock } from 'lucide-react';

interface Match {
  match_id: string;
  title: string;
  tournament?: string;
  image?: string;
  status?: string;
  date?: string;
  time?: string;
  STREAMING_CDN?: Record<string, string>;
  adfree_stream?: string;
  dai_stream?: string;
}

interface MatchCardProps {
  match: Match;
  delay?: number;
}

function formatStreamName(key: string): string {
  if (key === 'adfree_stream') return 'Ad-Free';
  if (key === 'dai_stream') return 'DAI Stream';
  
  return key
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function MatchCard({ match, delay = 0 }: MatchCardProps) {
  const isLive = match.status?.toUpperCase() === 'LIVE';
  const imgSrc = match.image || 'https://fancode.com/skillup-uploads/cms-media/Cricket_Fallback_Old_match-card.jpg';

  const streams: Record<string, string | undefined> = {
    ...match.STREAMING_CDN,
    adfree_stream: match.adfree_stream,
    dai_stream: match.dai_stream
  };

  const streamButtons = Object.entries(streams)
    .filter(([key, value]) => 
      value && 
      value !== 'Unavailable' && 
      key.toLowerCase() !== 'language' && 
      key !== 'Primary_Playback_URL'
    )
    .map(([key]) => key);

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col border border-border hover-elevate"
      style={{
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(12px)',
        opacity: 0,
        transform: 'translateY(30px)',
        animation: `fadeIn 0.6s ease-out ${delay}ms forwards`
      }}
      data-testid={`card-match-${match.match_id}`}
    >
      <div className="relative">
        <img 
          src={imgSrc} 
          alt={match.title} 
          className="w-full h-48 object-cover object-top"
        />
        {isLive && (
          <span 
            className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md animate-pulse"
            data-testid="badge-live"
          >
            🔴 LIVE
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {match.tournament && (
          <p className="text-amber-400 text-xs font-semibold mb-1 uppercase tracking-wide" data-testid="text-tournament">
            {match.tournament}
          </p>
        )}
        
        <h3 className="text-lg font-bold flex-grow mb-3 line-clamp-2" data-testid="text-title">
          {match.title || 'Match Title'}
        </h3>

        {(match.date || match.time) && (
          <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
            {match.date && (
              <span className="flex items-center gap-1" data-testid="text-date">
                <Calendar className="h-3 w-3" />
                {match.date}
              </span>
            )}
            {match.time && (
              <span className="flex items-center gap-1" data-testid="text-time">
                <Clock className="h-3 w-3" />
                {match.time}
              </span>
            )}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {streamButtons.length > 0 ? (
            streamButtons.map((key) => (
              <StreamButton
                key={key}
                streamKey={key}
                matchId={match.match_id}
                label={formatStreamName(key)}
                size="sm"
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground">Links coming soon...</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
