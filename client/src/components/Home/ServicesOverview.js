import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight,
  FaRocket
} from 'react-icons/fa';

const ServicesOverview = () => {
  const services = [
    {
      id: 1,
      title: "Business Tools",
      subtitle: "Optimize & Automate",
      description: "Streamline operations and boost productivity with our comprehensive business optimization tools.",
      link: "/services#business-tools",
      bgImage: "https://ik.imagekit.io/g3nahgeeu/social-media-and-marketing-virtual-icons-screen-ta-2024-12-19-16-42-30-utc-min.jpg",
    },
    {
      id: 2,
      title: "Cloud Solutions",
      subtitle: "Scalable & Secure",
      description: "Enterprise-grade cloud infrastructure for scalable, secure, and reliable business operations.",
      link: "https://skyfalke.co.ke",
      external: true,
      bgImage: "https://ik.imagekit.io/g3nahgeeu/bdr.webp?updatedAt=1755866661657",
    },
    {
      id: 3,
      title: "Creative Services",
      subtitle: "Design & Innovate",
      description: "Elevate your brand with creative design solutions and engaging digital experiences.",
      link: "/services#creative",
      bgImage: "https://ik.imagekit.io/g3nahgeeu/creative-services.webp",
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 text-[#303661] uppercase text-sm sm:text-lg font-bold mb-4 sm:mb-6">
            Where we shine
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#303661] mb-2 px-4">
           A Result Oriented 
            <span className="text-[#e0ae00]">
              &nbsp;Digital Agency
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            We have one <span className='text-[#e0ae00]'>mission</span> - to empower businesses to compete globally, 
            achieving online growth, through technology, creativity and data-drive decisions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative"
            >
              <div 
                className="h-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 relative"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${service.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Service Content */}
                <div className="p-6 sm:p-8 text-white relative z-10">
                  {/* Service Content */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-base sm:text-lg font-semibold text-[#e0ae00] mb-3 sm:mb-4">{service.subtitle}</p>
                    <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-4 sm:mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={service.link}
                    target={service.external ? "_blank" : "_self"}
                    rel={service.external ? "noopener noreferrer" : ""}
                    className="inline-flex items-center justify-center w-full py-3 sm:py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 group-hover:scale-105 shadow-lg text-sm sm:text-base"
                  >
                    <span>Discover More</span>
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center">
          <div className="bg-[#303661] rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 px-4">
              Have something in mind?
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Let's discuss how our solutions can help you achieve your business goals and drive online growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#e0ae00] text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <span>Get Free Consultation</span>
                <FaArrowRight className="ml-2" />
              </Link>
              <Link
                to="/case-studies"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 text-sm sm:text-base"
              >
                <span>View Case Studies</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
