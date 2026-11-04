'use client';

import React, { useEffect, useRef } from 'react';

const CreativeVideoSection = () => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  useEffect(() => {
    // Suppress hydration warnings for video elements
    // Browser extensions can modify video elements causing hydration mismatches
    if (video1Ref.current) {
      video1Ref.current.setAttribute('suppressHydrationWarning', 'true');
    }
    if (video2Ref.current) {
      video2Ref.current.setAttribute('suppressHydrationWarning', 'true');
    }
  }, []);

  return (
    <section className="relative section-padding bg-primary-800 overflow-hidden">
      <div className="container-custom relative z-10">

        {/* Creative Layout with Large and Small Videos */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* Main Large Video - Creative Storytelling */}
          <div className="relative max-w-3xl lg:max-w-3xl mx-auto lg:mx-0">
            {/* Text above video */}
            <div className="mb-6 text-center lg:text-left">
              <h3 className="text-xl lg:text-2xl font-bold text-white">
                Creative <span className='text-[#E0AE00]'>storytelling</span> and branding
              </h3>
            </div>
            
            <div className="relative bg-primary-700">
              <div className="relative aspect-video bg-primary-900 overflow-hidden">
                <video
                  ref={video1Ref}
                  className="w-full h-full object-cover"
                  autoPlay={true}
                  muted={true}
                  loop={true}
                  playsInline={true}
                  poster="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  suppressHydrationWarning
                >
                  <source src="https://ik.imagekit.io/g3nahgeeu/videos/White%20App%20Promo.mp4?updatedAt=1756191697589" type="video/mp4" />
                  <source src="https://ik.imagekit.io/g3nahgeeu/videos/White%20App%20Promo.mp4?updatedAt=1756191697589" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          {/* Small Video - Digital Marketing (Positioned on Top Right) */}
          <div className="relative mt-8 lg:absolute lg:-top-8 lg:-right-8 lg:mt-0 w-full lg:w-96 h-48 lg:h-72 z-20">
            <div className="relative bg-primary-700">
              <div className="relative w-full h-full bg-primary-900 overflow-hidden">
                <video
                  ref={video2Ref}
                  className="w-full h-full object-cover"
                  autoPlay={true}
                  muted={true}
                  loop={true}
                  playsInline={true}
                  poster="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
                  suppressHydrationWarning
                >
                  <source src="https://ik.imagekit.io/g3nahgeeu/videos/Video-Advertising.mp4" type="video/mp4" />
                  <source src="https://ik.imagekit.io/g3nahgeeu/videos/Video-Advertising.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            
            {/* Text below video */}
            <div className="mt-4 text-center lg:text-left">
              <h3 className="text-base lg:text-lg font-bold text-white">
                Flawless <span className='text-[#E0AE00]'>digital marketing</span> execution.
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreativeVideoSection;
