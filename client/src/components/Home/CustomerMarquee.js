'use client';

import React from 'react';

const CustomerMarquee = () => {
  const customers = [
    {
      id: 1,
      name: "Talmar Computers",
      logo: "https://ik.imagekit.io/g3nahgeeu/customers/tc.webp?updatedAt=1756382770678",
      alt: "Talmar Computers"
    },
    {
      id: 2,
      name: "MKA Advocates",
      logo: "https://ik.imagekit.io/g3nahgeeu/customers/mka.webp?updatedAt=1756382770134",
      alt: "MKA Advocates"
    },
    {
      id: 3,
      name: "CFAO Motors",
      logo: "https://ik.imagekit.io/g3nahgeeu/customers/cfao.png?updatedAt=1756382770791",
      alt: "CFAO Motors"
    },
    {
      id: 4,
      name: "Quickmart",
      logo: "https://ik.imagekit.io/g3nahgeeu/customers/qm.png?updatedAt=1756382770707",
      alt: "Quickmart"
    },
    {
      id: 5,
      name: "Total Energies",
      logo: "https://ik.imagekit.io/g3nahgeeu/customers/te.png?updatedAt=1756382770395",
      alt: "Total Energies"
    },
    {
      id: 6,
      name: "Automobile Warehouse",
      logo: "https://ik.imagekit.io/g3nahgeeu/customers/awl.png?updatedAt=1756382770475",
      alt: "Automobile Warehouse"
    }
  ];

  // Duplicate the array multiple times to create seamless infinite loop
  const duplicatedCustomers = [...customers, ...customers, ...customers];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            You are in the right hands
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted by leading businesses and brands from all industries.
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient Overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling Marquee */}
          <div className="flex overflow-hidden">
            <div className="flex items-center space-x-12 md:space-x-16 marquee-slide">
              {duplicatedCustomers.map((customer, index) => (
                <div
                  key={`${customer.id}-${index}`}
                  className="flex-shrink-0 w-32 md:w-40 h-16 md:h-20 flex items-center justify-center"
                >
                  {/* Customer Logo */}
                  <div className="w-full h-full bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-4 hover:shadow-md hover:border-gray-300 transition-all duration-300 group">
                    <img
                      src={customer.logo}
                      alt={customer.alt}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback for broken images
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback text for broken images */}
                    <div className="hidden items-center justify-center w-full h-full text-gray-400 font-semibold text-xs text-center">
                      {customer.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerMarquee;
