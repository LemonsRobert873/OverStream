import { MatchSpotlight } from '../MatchSpotlight';

export default function MatchSpotlightExample() {
  const mockMatch = {
    match_id: '1',
    title: 'India vs Australia - 2nd Test Match',
    tournament: 'Border-Gavaskar Trophy 2024',
    language: 'English, Hindi',
    image: 'https://fancode.com/skillup-uploads/cms-media/Cricket_Fallback_Old_match-card.jpg',
    status: 'LIVE',
    STREAMING_CDN: {
      cdn1: 'https://example.com/stream1.m3u8',
      cdn2: 'https://example.com/stream2.m3u8'
    },
    adfree_stream: 'https://example.com/adfree.m3u8',
    dai_stream: 'https://example.com/dai.m3u8'
  };

  return <MatchSpotlight match={mockMatch} />;
}
