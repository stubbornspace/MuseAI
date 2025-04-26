import { useState, useRef } from 'react';
import { IoPlayCircleOutline, IoPauseCircleOutline } from 'react-icons/io5';
import './MusicPlayer.css';

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayback = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/src/assets/space.m4a');
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button className="music-player" onClick={togglePlayback}>
      {isPlaying ? <IoPauseCircleOutline size={24} /> : <IoPlayCircleOutline size={24} />}
    </button>
  );
}

export default MusicPlayer; 