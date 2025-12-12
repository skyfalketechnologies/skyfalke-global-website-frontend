import React from 'react';

const AcademyAbout = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#303661] mb-6">
                About Skyfalke Academy
              </h2>
              <div className="w-20 h-1 bg-[#e0ae00] rounded-full"></div>
            </div>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Skyfalke Academy is dedicated to equipping entrepreneurs, SMEs, and organizations 
                with practical digital knowledge that drives real business results. Our mission is 
                to bridge the gap between theoretical knowledge and practical application.
              </p>
              
              <p>
                We believe in mentorship and trainer-guided online learning that goes beyond 
                traditional education. Our industry experts don't just teach—they mentor, guide, 
                and support your learning journey every step of the way.
              </p>

              <p>
                Whether you're looking to upskill your team, transform your business processes, 
                or advance your personal career, Skyfalke Academy provides the tools, knowledge, 
                and support you need to succeed in the digital age.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#e0ae00] bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#e0ae00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#303661] mb-2">Industry Experts</h3>
                  <p className="text-gray-600 text-sm">Learn from professionals with real-world experience</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#e0ae00] bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#e0ae00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#303661] mb-2">Hands-on Learning</h3>
                  <p className="text-gray-600 text-sm">Practical projects and real-world applications</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#e0ae00] bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#e0ae00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#303661] mb-2">Flexible Schedule</h3>
                  <p className="text-gray-600 text-sm">Learn at your own pace with 24/7 access</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#e0ae00] bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#e0ae00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#303661] mb-2">Certification</h3>
                  <p className="text-gray-600 text-sm">Earn recognized certificates upon completion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-[#303661] to-[#2a2f4e] rounded-2xl p-8 text-white">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#e0ae00] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-[#303661]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
                <p className="text-gray-300">
                  Empowering professionals with practical digital skills for the modern workplace
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#e0ae00] rounded-full"></div>
                  <span className="text-sm">Industry-relevant curriculum</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#e0ae00] rounded-full"></div>
                  <span className="text-sm">Expert mentorship and guidance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#e0ae00] rounded-full"></div>
                  <span className="text-sm">Hands-on project experience</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#e0ae00] rounded-full"></div>
                  <span className="text-sm">Career advancement support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademyAbout;




