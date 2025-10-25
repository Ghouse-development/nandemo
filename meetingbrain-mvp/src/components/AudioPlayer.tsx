import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { formatDuration } from '../lib/utils';

interface AudioPlayerProps {
  src?: string;
  className?: string;
}

/**
 * Audio player component with playback controls
 */
export const AudioPlayer = ({ src = '/sample.mp3', className = '' }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className={`bg-gray-50 rounded-xl p-4 ${className}`}>
      <audio ref={audioRef} src={src} />
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => skip(-10)}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          title="10秒戻る"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={togglePlayPause}
          className="p-3 bg-accent-600 text-white rounded-full hover:bg-accent-700 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <button
          onClick={() => skip(10)}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          title="10秒進む"
        >
          <SkipForward className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>{formatDuration(Math.floor(duration))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};