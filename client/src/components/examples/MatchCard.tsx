import { MatchCard } from '../MatchCard';

export default function MatchCardExample() {
  const mockMatch = {
    match_id: '2',
    title: 'England vs New Zealand - T20 World Cup Final',
    tournament: 'ICC T20 World Cup 2024',
    image: 'https://fancode.com/skillup-uploads/cms-media/Cricket_Fallback_Old_match-card.jpg',
    status: 'UPCOMING',
    STREAMING_CDN: {
      cdn1: 'https://example.com/stream1.m3u8'
    },
    adfree_stream: 'https://example.com/adfree.m3u8'
  };

  return <MatchCard match={mockMatch} />;
}
