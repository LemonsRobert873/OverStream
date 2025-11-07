import { StreamButton } from './StreamButton';

interface Match {
  match_id: string;
  title: string;
  tournament?: string;
  language?: string;
  image?: string;
  STREAMING_CDN?: Record<string, string>;
  adfree_stream?: string;
  dai_stream?: string;
}

interface MatchSpotlightProps {
  match: Match;
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

export function MatchSpotlight({ match }: MatchSpotlightProps) {
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
      className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center gap-8 p-6 md:p-8 border border-border"
      style={{
        background: 'linear-gradient(45deg, rgba(15, 23, 42, 0.5), rgba(30, 41, 59, 0.3))',
        backdropFilter: 'blur(20px)'
      }}
      data-testid="spotlight-card"
    >
      <div className="relative rounded-lg overflow-hidden aspect-video">
        <img 
          src={imgSrc} 
          alt={match.title} 
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div 
          className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-lg"
          style={{
            background: 'linear-gradient(90deg, #dc2626, #ef4444)',
            animation: 'pulse-live 2s infinite ease-in-out'
          }}
          data-testid="badge-live"
        >
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-ping absolute" />
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-2" />
          LIVE NOW
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-amber-400 font-semibold text-sm mb-1" data-testid="text-tournament">
          {match.tournament || ''}
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mb-3" data-testid="text-title">
          {match.title || 'Live Match'}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          {match.language || ''}
        </p>
        <div className="flex flex-wrap gap-3">
          {streamButtons.map((key) => (
            <StreamButton
              key={key}
              streamKey={key}
              matchId={match.match_id}
              label={formatStreamName(key)}
              size="default"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Add keyframe animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-live {
    0%, 100% { transform: scale(1); box-shadow: 0 0 15px #ef4444; }
    50% { transform: scale(1.05); box-shadow: 0 0 25px #ef4444; }
  }
`;
document.head.appendChild(style);
