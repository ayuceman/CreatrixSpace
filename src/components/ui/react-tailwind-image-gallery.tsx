import React from 'react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  span?: string;
}

interface GalleryProps {
  data: GalleryImage[];
  onImageClick: (src: string) => void;
}

interface ImageModalProps {
  src: string | null;
  onClose: () => void;
}

export function Gallery({ data, onImageClick }: GalleryProps) {
  return (
    <section className="pt-40 pb-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Take A Tour
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((img) => (
            <div
              key={img.id}
              className={`group cursor-pointer relative overflow-hidden rounded-lg ${img.span || 'col-span-1'}`}
              onClick={() => onImageClick(img.src)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="gallery-img w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                  {img.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ImageModal({ src, onClose }: ImageModalProps) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 opacity-100"
      onClick={onClose}
    >
      <img
        src={src}
        alt="Enlarged view"
        className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="absolute top-5 right-5 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
        onClick={onClose}
        aria-label="Close image modal"
      >
        &times;
      </button>
    </div>
  );
}

