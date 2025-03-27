import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Input, Button } from '@mantine/core';

export const LeftSidebar = ({ onAddMedia, selectedMedia, updateMedia }) => {
  const fileInputRef = useRef(null);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'media',
    item: { type: 'media' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const type = file.type.startsWith('video') ? 'video' : 'image';
    onAddMedia(type, URL.createObjectURL(file));
  };

  const handleDimensionChange = (prop, value) => {
    const numericValue = Math.max(1, Number(value)) || 100;
    updateMedia(selectedMedia.id, { [prop]: numericValue });
  };

  return (
    <div className="w-64 h-full bg-gray-800 p-4 space-y-4 border-r border-gray-700">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />

      <Button
        ref={drag}
        className="w-full text-3xl text-amber-300"
        style={{ opacity: isDragging ? 0.5 : 1 }}
        onClick={() => fileInputRef.current.click()}
        variant="light"
        color="white"
      >
        Upload Media
      </Button>

      {selectedMedia && (
        <div className="space-y-4 text-gray-100">
          <Input.Wrapper label="Width (px)">
            <Input
              value={selectedMedia.width}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              type="number"
              min={1}
            />
          </Input.Wrapper>

          <Input.Wrapper label="Height (px)">
            <Input
              value={selectedMedia.height}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              type="number"
              min={1}
            />
          </Input.Wrapper>

          <Input.Wrapper label="Start Time (s)">
            <Input
              value={selectedMedia.start}
              onChange={(e) => 
                updateMedia(selectedMedia.id, { 
                  start: Math.max(0, Number(e.target.value)) 
                })
              }
              type="number"
              min={0}
            />
          </Input.Wrapper>

          <Input.Wrapper label="End Time (s)">
            <Input
              value={selectedMedia.end}
              onChange={(e) => 
                updateMedia(selectedMedia.id, { 
                  end: Math.max(0, Number(e.target.value)) 
                })
              }
              type="number"
              min={0}
            />
          </Input.Wrapper>
        </div>
      )}
    </div>
  );
};
