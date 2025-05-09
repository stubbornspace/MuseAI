import { useState, useRef, useEffect } from 'react';
import { IoMusicalNotes } from 'react-icons/io5';
import { GiWaveSurfer, GiWhaleTail, GiGalaxy } from 'react-icons/gi';
import { IoVolumeHigh } from 'react-icons/io5';
import { Slider } from '@mui/material';
import './MusicPlayer.css';

const TRACKS = [
  { id: 'ocean', name: 'Ocean', file: '/src/assets/ocean.m4a', icon: GiWaveSurfer },
  { id: 'whales', name: 'Whales', file: '/src/assets/whales.m4a', icon: GiWhaleTail },
  { id: 'space', name: 'Space', file: '/src/assets/space.m4a', icon: GiGalaxy }
];

function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<typeof TRACKS[0] | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTrackSelect = (track: typeof TRACKS[0]) => {
    if (currentTrack?.id === track.id) {
      // If clicking the same track, stop playback
      audioRef.current?.pause();
      setCurrentTrack(null);
    } else {
      // If clicking a different track, switch to it
      if (audioRef.current) {
        audioRef.current.src = track.file;
        audioRef.current.play().catch(console.error);
      }
      setCurrentTrack(track);
    }
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  return (
    <div 
      className="music-player-container"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className={`controls ${showControls ? 'visible' : ''}`}>
        <div className="volume-control">
          <IoVolumeHigh size={16} />
          <Slider
            size="small"
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.01}
            sx={{
              width: 80,
              color: 'rgba(255, 255, 255, 0.8)',
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)'
                }
              },
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-rail': {
                opacity: 0.2
              }
            }}
          />
        </div>
        <div className="track-buttons">
          {TRACKS.map((track) => {
            const Icon = track.icon;
            return (
              <button
                key={track.id}
                className={`menu-item ${currentTrack?.id === track.id ? 'active' : ''}`}
                onClick={() => handleTrackSelect(track)}
                title={track.name}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>
      </div>
      <button 
        className="menu-item"
        title={currentTrack ? `Now playing: ${currentTrack.name}` : "Select Track"}
      >
        <IoMusicalNotes size={20} />
      </button>
    </div>
  );
}

export default MusicPlayer; 