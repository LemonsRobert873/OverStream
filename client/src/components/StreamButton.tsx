import { useLocation } from 'wouter';
import { Button } from './ui/button';

interface StreamButtonProps {
  streamKey: string;
  matchId: string;
  label: string;
  size?: 'default' | 'sm';
}

export function StreamButton({ streamKey, matchId, label, size = 'default' }: StreamButtonProps) {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    const params = new URLSearchParams({
      id: matchId,
      cdn: streamKey
    });
    setLocation(`/player?${params.toString()}`);
  };

  return (
    <Button
      onClick={handleClick}
      size={size}
      className="bg-sky-400 hover:bg-sky-500 text-white font-semibold"
      style={{
        boxShadow: '0 0 15px -5px rgba(14, 165, 233, 0.7)'
      }}
      data-testid={`button-stream-${streamKey}`}
    >
      {label}
    </Button>
  );
}
