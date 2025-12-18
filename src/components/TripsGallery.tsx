import { forwardRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';
import gallery7 from '@/assets/gallery-7.jpg';
import gallery8 from '@/assets/gallery-8.jpg';
import gallery9 from '@/assets/gallery-9.jpg';
import gallery10 from '@/assets/gallery-10.jpg';
import gallery11 from '@/assets/gallery-11.jpg';
import gallery12 from '@/assets/gallery-12.jpg';
import gallery13 from '@/assets/gallery-13.jpg';
import gallery14 from '@/assets/gallery-14.jpg';

interface TripsGalleryProps {
  images?: {
    left: string[];
    center: string[];
    right: string[];
  };
}

const TripsGallery = forwardRef<HTMLElement, TripsGalleryProps>(({ images }, ref) => {
  const isMobile = useIsMobile();
  // Gallery images from hiking trips - 14 unique images
  const defaultImages = {
    left: [
      gallery1,
      gallery2,
      gallery3,
      gallery4,
      gallery5,
    ],
    center: [
      gallery6,
      gallery8,
      gallery9,
      gallery14,
    ],
    right: [
      gallery7,
      gallery10,
      gallery11,
      gallery12,
      gallery13,
    ],
  };

  const galleryImages = images || defaultImages;

  return (
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
            <div className='md:sticky md:top-0 md:h-screen w-full md:col-span-4 gap-2 md:gap-4 grid grid-rows-1 md:grid-rows-4'>
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
  );
});

TripsGallery.displayName = 'TripsGallery';

export default TripsGallery;
