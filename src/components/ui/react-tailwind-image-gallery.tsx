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
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-muted/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
            Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our beautiful workspace through these stunning images
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 auto-rows-fr">
          {data.map((img) => {
            const spanClass = img.span || 'col-span-1 sm:col-span-1'
            return (
            <div
              key={img.id}
              className={`group cursor-pointer relative overflow-hidden rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ${spanClass}`}
              style={{ 
                aspectRatio: img.span?.includes('col-span-2') ? '8/3' : '4/3',
                minHeight: '200px'
              }}
              onClick={() => onImageClick(img.src)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 md:p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <p className="text-white text-base md:text-lg font-semibold mb-1">
                    {img.title}
                  </p>
                  <div className="w-12 h-0.5 bg-white/50 group-hover:bg-white transition-colors duration-300"></div>
                </div>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-xl md:rounded-2xl transition-all duration-500"></div>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

export function ImageModal({ src, onClose }: ImageModalProps) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">
        <img
          src={src}
          alt="Enlarged view"
          className="max-w-full max-h-[95vh] rounded-lg shadow-2xl object-contain animate-in zoom-in duration-300"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-light hover:scale-110 transition-all duration-200"
          onClick={onClose}
          aria-label="Close image modal"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

