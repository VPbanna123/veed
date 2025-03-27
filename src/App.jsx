import { useState, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CanvasArea } from './components/CanvasArea';
import { LeftSidebar } from './components/LeftSidebar';
import { Button } from '@mantine/core';

export default function App() {
  const [mediaElements, setMediaElements] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef();
  const mediaRefs = useRef({});

  // Add media with initial properties
  const handleAddMedia = (type, url) => {
    const newMedia = {
      id: Date.now(),
      type,
      url,
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      start: 0,
      end: 10,
      aspectRatio: type === 'video' ? 16/9 : 1
    };
    setMediaElements(prev => [...prev, newMedia]);
    setSelectedMedia(newMedia);
  };

  // Update media properties
  const updateMedia = (id, updates) => {
    setMediaElements(prev => prev.map(media => {
      if (media.id === id) {
        // Remove aspect ratio enforcement here
        return { ...media, ...updates };
      }
      return media;
    }));
    setSelectedMedia(prev => prev?.id === id ? { ...prev, ...updates } : prev);
  };
  // Play/pause functionality
  const togglePlay = () => {
    if (!isPlaying) {
      setCurrentTime(0);
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(!isPlaying);
  };

  // Media visibility and playback control
  useEffect(() => {
    mediaElements.forEach(media => {
      const element = mediaRefs.current[media.id];
      if (element) {
        if (currentTime >= media.start && currentTime <= media.end) {
          element.currentTime = currentTime - media.start;
          element.play().catch(console.error);
        } else {
          element.pause();
        }
      }
    });
  }, [currentTime, mediaElements]);

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(intervalRef.current);
    mediaElements.forEach(media => {
      const element = mediaRefs.current[media.id];
      if (element) element.pause();
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-50">
        <LeftSidebar
          onAddMedia={handleAddMedia}
          selectedMedia={selectedMedia}
          updateMedia={updateMedia}
        />

<CanvasArea
  mediaElements={mediaElements.filter(media =>
    currentTime >= media.start && currentTime <= media.end
  )}
  setSelectedMedia={setSelectedMedia}
  updateMedia={updateMedia}
  selectedMedia={selectedMedia} // Add this prop
  mediaRefs={mediaRefs}
  currentTime={currentTime}
/>
        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md flex items-center gap-4">
          <Button 
            onClick={togglePlay} 
            color={isPlaying ? 'red' : 'blue'}
            size="sm"
            radius="md"
          >
            {isPlaying ? 'Stop' : 'Play'}
          </Button>
          <span className="font-medium text-gray-700">Time: {currentTime}s</span>
        </div>
      </div>
    </DndProvider>
  );
}
