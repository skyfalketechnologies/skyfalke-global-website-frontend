import React from 'react';

const AcademyTestimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Digital Marketing Manager',
      company: 'TechCorp Solutions',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      rating: 5,
      text: 'Skyfalke Academy transformed my understanding of digital marketing. The hands-on approach and expert mentorship helped me implement strategies that increased our company\'s online presence by 300%. The course was practical, engaging, and directly applicable to my work.'
    },
    {
      name: 'Michael Chen',
      role: 'Software Developer',
      company: 'InnovateTech',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      rating: 5,
      text: 'The AI and Machine Learning course at Skyfalke Academy was exceptional. The trainer\'s industry experience and practical examples made complex concepts easy to understand. I was able to apply what I learned immediately in my projects, and it significantly advanced my career.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Business Analyst',
      company: 'DataFlow Inc.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      rating: 5,
      text: 'The Data Analytics course exceeded my expectations. The curriculum was comprehensive, the trainer was knowledgeable and supportive, and the hands-on projects gave me real-world experience. I now lead data-driven initiatives at my company thanks to what I learned at Skyfalke Academy.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#303661] to-[#2a2f4e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our Students Say
          </h2>
          <div className="w-20 h-1 bg-[#e0ae00] rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Hear from professionals who have transformed 
            their careers through our comprehensive learning programs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Rating */}
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-[#e0ae00]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-[#303661]">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-[#e0ae00] font-medium">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#e0ae00] mb-2">98%</div>
            <div className="text-gray-300 text-sm md:text-base">Course Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#e0ae00] mb-2">4.9/5</div>
            <div className="text-gray-300 text-sm md:text-base">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#e0ae00] mb-2">85%</div>
            <div className="text-gray-300 text-sm md:text-base">Career Advancement</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#e0ae00] mb-2">24/7</div>
            <div className="text-gray-300 text-sm md:text-base">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademyTestimonials;
