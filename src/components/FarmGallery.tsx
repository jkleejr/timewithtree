import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  src: string;
  alt: string;
};

export const FarmGallery = ({ images }: { images: GalleryImage[] }) => {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const go = (next: number) => {
    const total = images.length;
    setIndex(((next % total) + total) % total);
  };

  const current = images[index];

  return (
    <div className="w-full">
      <div className="relative group overflow-hidden bg-secondary">
        <img
          key={current.src}
          src={current.src}
          alt={current.alt}
          loading="lazy"
          className="w-full h-auto object-cover animate-in fade-in duration-300"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-background/80 hover:bg-background text-foreground backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-background/80 hover:bg-background text-foreground backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 w-6 transition-colors",
                    i === index ? "bg-foreground" : "bg-foreground/30 hover:bg-foreground/60"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                "aspect-square overflow-hidden border-2 transition-colors",
                i === index ? "border-accent" : "border-transparent hover:border-border"
              )}
            >
              <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
