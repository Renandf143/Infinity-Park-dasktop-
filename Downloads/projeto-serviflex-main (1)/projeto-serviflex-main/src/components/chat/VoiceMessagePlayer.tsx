import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface VoiceMessagePlayerProps {
  voiceUrl: string;
  duration: number;
  isCurrentUser: boolean;
}

export function VoiceMessagePlayer({ voiceUrl, duration, isCurrentUser }: VoiceMessagePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 min-w-[200px]">
      <audio ref={audioRef} src={voiceUrl} preload="metadata" />
      
      <button
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isCurrentUser
            ? "bg-white/20 hover:bg-white/30"
            : "bg-blue-100 hover:bg-blue-200"
        }`}
      >
        {isPlaying ? (
          <Pause className={`w-5 h-5 ${isCurrentUser ? "text-white" : "text-blue-600"}`} />
        ) : (
          <Play className={`w-5 h-5 ${isCurrentUser ? "text-white" : "text-blue-600"}`} />
        )}
      </button>

      <div className="flex-1">
        <div className={`h-1 rounded-full overflow-hidden ${
          isCurrentUser ? "bg-white/20" : "bg-gray-200"
        }`}>
          <div
            className={`h-full transition-all ${
              isCurrentUser ? "bg-white" : "bg-blue-600"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className={`text-xs mt-1 ${
          isCurrentUser ? "text-white/80" : "text-gray-500"
        }`}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </p>
      </div>
    </div>
  );
}
