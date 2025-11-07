import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Hls from 'hls.js';

const DATA_URL = 'https://raw.githubusercontent.com/Jitendra-unatti/fancode/refs/heads/main/data/fancode.json';

interface Match {
  match_id: string;
  title: string;
  STREAMING_CDN?: Record<string, string>;
  adfree_stream?: string;
  dai_stream?: string;
}

// Declare Plyr for TypeScript
declare global {
  interface Window {
    Plyr: any;
  }
}

export default function Player() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [matchTitle, setMatchTitle] = useState('Loading Match...');
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    loadStream();
    
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (streamUrl && videoRef.current && typeof window !== 'undefined') {
      const video = videoRef.current;
      
      // Load Plyr CSS and JS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.plyr.io/3.7.8/plyr.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdn.plyr.io/3.7.8/plyr.js';
      script.onload = () => {
        initializePlayer(video, streamUrl);
      };
      document.body.appendChild(script);
    }
  }, [streamUrl]);

  function initializePlayer(video: HTMLVideoElement, url: string) {
    if (url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;
        
        hls.loadSource(url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // Initialize Plyr after HLS is ready
          if (window.Plyr) {
            playerRef.current = new window.Plyr(video, {
              autoplay: true,
              controls: [
                'play-large',
                'play',
                'progress',
                'current-time',
                'duration',
                'mute',
                'volume',
                'settings',
                'fullscreen'
              ],
              settings: ['quality', 'speed'],
            });
          }
          
          video.play().catch(e => console.warn('Autoplay blocked:', e));
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('HLS error:', data);
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Network error, attempting recovery...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Media error, attempting recovery...');
                hls.recoverMediaError();
                break;
              default:
                console.error('Fatal error, cannot recover');
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = url;
        if (window.Plyr) {
          playerRef.current = new window.Plyr(video, {
            autoplay: true,
          });
        }
        video.play().catch(e => console.warn('Autoplay blocked:', e));
      }
    } else {
      // Regular video file
      video.src = url;
      if (window.Plyr) {
        playerRef.current = new window.Plyr(video, {
          autoplay: true,
        });
      }
      video.play().catch(e => console.warn('Autoplay blocked:', e));
    }
  }

  async function loadStream() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const cdn = params.get('cdn');

    if (!id || !cdn) {
      setError('Missing match ID or CDN information in the URL.');
      return;
    }

    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error('Failed to fetch data');
      
      const data = await res.json();
      const match: Match = data.matches.find((m: Match) => String(m.match_id) === String(id));
      
      if (!match) {
        setError('Match not found.');
        return;
      }

      setMatchTitle(match.title || 'Live Match');

      const streamingCdn = { ...match.STREAMING_CDN };
      delete streamingCdn.Primary_Playback_URL;

      const sources: Record<string, string | undefined> = {
        adfree_stream: match.adfree_stream,
        dai_stream: match.dai_stream,
        ...streamingCdn
      };

      const url = sources[cdn];
      if (url && url !== 'Unavailable') {
        setStreamUrl(url);
      } else {
        setError(`Stream for '${cdn}' is unavailable.`);
      }
    } catch (err) {
      console.error('Error loading stream:', err);
      setError('Sorry, this stream could not be loaded.');
    }
  }

  async function handleShare() {
    const shareData = {
      title: `Watch: ${matchTitle}`,
      text: `Watch "${matchTitle}" live on Overtime!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied!',
          description: 'Stream link copied to clipboard'
        });
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Stream Error</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => setLocation('/')} data-testid="button-back-home">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back Home
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      <style>{`
        :root {
          --plyr-color-main: #0ea5e9;
        }
        .plyr {
          width: 100%;
          height: 100%;
        }
      `}</style>
      
      <header className="flex-shrink-0 p-4 bg-slate-900 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/')}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="flex-1 text-lg font-bold truncate text-center" data-testid="text-match-title">
            {matchTitle}
          </h1>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            data-testid="button-share"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center bg-black min-h-0">
        {streamUrl ? (
          <div className="w-full h-full" data-testid="video-player">
            <video
              ref={videoRef}
              className="plyr-video"
              playsInline
              controls
              crossOrigin="anonymous"
            />
          </div>
        ) : (
          <div className="text-muted-foreground">Loading stream...</div>
        )}
      </main>
    </div>
  );
}
