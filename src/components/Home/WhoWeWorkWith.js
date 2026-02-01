import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaBuilding,
  FaLightbulb,
  FaHandsHelping,
  FaBriefcase,
  FaCheckCircle
} from 'react-icons/fa';

const WhoWeWorkWith = () => {
  const clients = [
    {
      icon: FaBuilding,
      text: "SMEs & growing businesses",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: FaLightbulb,
      text: "Startups & founders",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: FaHandsHelping,
      text: "NGOs & development organizations",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: FaBriefcase,
      text: "Consulting & professional services firms",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#303661] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#e0ae00] rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-[#303661]/10 text-[#303661] uppercase text-xs sm:text-sm font-bold mb-4 sm:mb-6 rounded-sm border border-[#303661]/20">
            Who This Is For
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#303661] mb-6 sm:mb-8 px-4 max-w-4xl mx-auto leading-tight">
            Who We Work With
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            We partner with forward-thinking organizations ready to transform their digital operations
          </p>
        </motion.div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {clients.map((client, index) => {
            const IconComponent = client.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#303661]/30 text-center overflow-hidden"
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#303661]/0 to-[#303661]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 ${client.bgColor} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md group-hover:shadow-lg`}>
                    <IconComponent className={`text-2xl sm:text-3xl ${client.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <p className="text-base sm:text-lg text-gray-800 font-semibold leading-relaxed group-hover:text-[#303661] transition-colors duration-300">
                    {client.text}
                  </p>
                </div>

                {/* Bottom Accent Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${client.bgColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-[#303661] to-[#1e2440] rounded-2xl p-6 sm:p-8 lg:p-10 text-white shadow-xl max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-gray-100">
              If your organization relies on digital tools, data, or manual processes-<span className="text-white font-semibold">we can help.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhoWeWorkWith;

