import { ReactLenis } from 'lenis/react';
import { forwardRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripsGalleryProps {
  images?: {
    left: string[];
    center: string[];
    right: string[];
  };
}

const TripsGallery = forwardRef<HTMLElement, TripsGalleryProps>(({ images }, ref) => {
  const isMobile = useIsMobile();
  // Default hiking images from Unsplash
  const defaultImages = {
    left: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=500&auto=format&fit=crop',
    ],
    center: [
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=500&auto=format&fit=crop',
    ],
    right: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?w=500&auto=format&fit=crop',
    ],
  };

  const galleryImages = images || defaultImages;

  return (
    <ReactLenis root>
      <main className='bg-background' ref={ref}>
        <div className='wrapper'>
          <section className='text-foreground h-[60vh] md:h-[80vh] w-full bg-primary/5 grid place-content-center sticky top-0'>
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

            <h1 className='text-3xl sm:text-4xl md:text-5xl 2xl:text-7xl px-4 sm:px-8 font-semibold text-center tracking-tight leading-[120%] text-primary'>
              Naši Planinski Izleti
              <br />
              Istražite ljepotu Hrvatske <br />
              Skrolajte dolje! 👇
            </h1>
          </section>
        </div>

        <section className='w-full bg-background/95 py-8 px-4'>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4'>
            {/* Left Column - Scrolling */}
            <div className='grid gap-2 md:gap-4 md:col-span-4'>
              {galleryImages.left.map((src, idx) => (
                <figure key={`left-${idx}`} className='w-full h-48 sm:h-56 md:h-96'>
                  <img
                    src={src}
                    alt={`Planinarenje ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className='transition-all duration-300 active:scale-[0.98] w-full h-full align-bottom object-cover rounded-md touch-manipulation'
                  />
                </figure>
              ))}
            </div>

            {/* Center Column - Sticky on desktop only */}
            <div className='md:sticky md:top-0 md:h-screen w-full md:col-span-4 gap-2 md:gap-4 grid grid-rows-1 md:grid-rows-3'>
              {galleryImages.center.map((src, idx) => (
                <figure key={`center-${idx}`} className='w-full h-48 sm:h-56 md:h-full'>
                  <img
                    src={src}
                    alt={`Planinarenje sredina ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className='transition-all duration-300 active:scale-[0.98] h-full w-full align-bottom object-cover rounded-md touch-manipulation'
                  />
                </figure>
              ))}
            </div>

            {/* Right Column - Scrolling */}
            <div className='grid gap-2 md:gap-4 md:col-span-4'>
              {galleryImages.right.map((src, idx) => (
                <figure key={`right-${idx}`} className='w-full h-48 sm:h-56 md:h-96'>
                  <img
                    src={src}
                    alt={`Planinarenje desno ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className='transition-all duration-300 active:scale-[0.98] w-full h-full align-bottom object-cover rounded-md touch-manipulation'
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

      </main>
    </ReactLenis>
  );
});

TripsGallery.displayName = 'TripsGallery';

export default TripsGallery;
