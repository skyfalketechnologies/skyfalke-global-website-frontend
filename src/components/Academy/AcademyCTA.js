import React from 'react';
import Link from 'next/link';

const AcademyCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#e0ae00] to-[#8f7622]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <h2 className="text-4xl md:text-5xl font-bold text-[#303661] mb-6">
            Start Your Learning Journey with Skyfalke Academy Today
          </h2>
          
          <p className="text-xl text-[#303661] mb-12 leading-relaxed">
            Join hundreds of professionals who have already transformed their careers. 
            Choose from our comprehensive range of courses and start building the skills 
            you need for tomorrow's digital workplace.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/academy/courses"
              className="inline-flex items-center px-8 py-4 bg-[#303661] hover:bg-[#2a2f4e] text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              <span>Browse All Courses</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link href="/academy/join"
              className="inline-flex items-center px-8 py-4 border-2 border-[#303661] text-[#303661] hover:bg-[#303661] hover:text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <span>Enroll Now</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
              <div className="w-12 h-12 bg-[#303661] rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#303661] mb-3">Expert-Led Courses</h3>
              <p className="text-[#303661] text-sm">
                Learn from industry professionals with years of real-world experience
              </p>
            </div>

            <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
              <div className="w-12 h-12 bg-[#303661] rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#303661] mb-3">Industry Certificates</h3>
              <p className="text-[#303661] text-sm">
                Earn recognized certificates that boost your professional credibility
              </p>
            </div>

            <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
              <div className="w-12 h-12 bg-[#303661] rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#303661] mb-3">Flexible Learning</h3>
              <p className="text-[#303661] text-sm">
                Study at your own pace with 24/7 access to course materials
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white bg-opacity-20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-[#303661] mb-4">
              Need Help Choosing the Right Course?
            </h3>
            <p className="text-[#303661] mb-6">
              Our education consultants are here to help you find the perfect course for your career goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:academy@skyfalke.com"
                className="inline-flex items-center px-6 py-3 bg-[#303661] hover:bg-[#2a2f4e] text-white font-semibold rounded-lg transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                academy@skyfalke.com
              </a>
              
              <a
                href="tel:+254717797238"
                className="inline-flex items-center px-6 py-3 border-2 border-[#303661] text-[#303661] hover:bg-[#303661] hover:text-white font-semibold rounded-lg transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +254 717 797 238
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademyCTA;




