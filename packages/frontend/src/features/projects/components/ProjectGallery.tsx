import { useState } from 'react';
import { Modal } from '@/design-system/components';

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className="aspect-video w-full overflow-hidden rounded-lg bg-bg-tertiary hover:opacity-90 transition-opacity"
          >
            <img
              src={image}
              alt={`${title} screenshot ${index + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <Modal isOpen={selectedImage !== null} onClose={() => setSelectedImage(null)} size="xl">
        {selectedImage !== null && (
          <div className="space-y-4">
            <img
              src={images[selectedImage]}
              alt={`${title} screenshot ${selectedImage + 1}`}
              className="w-full rounded-lg"
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  setSelectedImage((prev) => (prev! > 0 ? prev! - 1 : images.length - 1))
                }
                className="px-4 py-2 rounded-lg bg-bg-hover text-fg hover:bg-bg-tertiary transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-fg-muted">
                {selectedImage + 1} / {images.length}
              </span>
              <button
                onClick={() =>
                  setSelectedImage((prev) => (prev! < images.length - 1 ? prev! + 1 : 0))
                }
                className="px-4 py-2 rounded-lg bg-bg-hover text-fg hover:bg-bg-tertiary transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
