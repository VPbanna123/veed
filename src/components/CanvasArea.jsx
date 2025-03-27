import { Rnd } from 'react-rnd';
import { useDrop } from 'react-dnd';

export const CanvasArea = ({ mediaElements, setSelectedMedia, updateMedia, mediaRefs, selectedMedia, currentTime }) => {
  const [, drop] = useDrop(() => ({
    accept: 'media',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = monitor.getBoundingClientRect();
      return {
        x: offset.x - canvasRect.left - 100,
        y: offset.y - canvasRect.top - 100
      };
    }
  }));

  return (
    <div ref={drop} className="flex-1 bg-white relative border-l border-gray-200">
      {mediaElements.map((media) => (
        <Rnd
        
          key={media.id}
          position={{ x: media.x, y: media.y }}
          size={{ width: media.width, height: media.height }}
          bounds="parent"
          lockAspectRatio={media.aspectRatio}
          // lockAspectRatio={media.type === 'video'} 
          onDragStop={(e, d) => updateMedia(media.id, { x: d.x, y: d.y })}
          onResizeStop={(e, dir, ref) => {
            updateMedia(media.id, {
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height)
            });
          }}
          onClick={() => setSelectedMedia(media)}
          style={{
            display: currentTime >= media.start && currentTime <= media.end ? 'block' : 'none',
            zIndex: media.id === (selectedMedia?.id) ? 100 : 1
          }}
        >
          {media.type === 'image' ? (
            <img 
              src={media.url} 
              className="w-full h-full object-contain pointer-events-none"
              alt="media" 
            />
          ) : (
            <video
              ref={el => mediaRefs.current[media.id] = el}
              src={media.url}
              className="w-full h-full pointer-events-none"
              muted
              onLoadedMetadata={() => {
                // Set video duration as default end time
                if (!media.endSet) {
                  updateMedia(media.id, { 
                    end: Math.ceil(mediaRefs.current[media.id].duration),
                    endSet: true
                  });
                }
              }}
            />
          )}
        </Rnd>
      ))}
    </div>
  );
};
