import React from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Browse Courses',
    description: 'Explore our catalog of courses across Data Science, AI, Digital Transformation, and Cloud Innovation.',
  },
  {
    number: '02',
    title: 'Enroll & Pay',
    description: 'Choose your course and complete the secure payment process. We accept all major payment methods.',
  },
  {
    number: '03',
    title: 'Get Matched',
    description: 'We automatically match you with an expert trainer based on your course selection and learning goals.',
  },
  {
    number: '04',
    title: 'Start Learning Online',
    description: 'Access your course materials, attend live sessions, and interact with your trainer and fellow students.',
  },
];

const FEATURES = [
  {
    title: '24/7 Access',
    description: 'Learn at your own pace with round-the-clock access to course materials and resources.',
  },
  {
    title: 'Expert Mentorship',
    description: 'Get personalized guidance from industry experts who understand your learning needs.',
  },
  {
    title: 'Certification',
    description: 'Earn industry-recognized certificates upon successful completion of your courses.',
  },
];

const AcademyLearning = () => {
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="academy-learning-heading">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="block h-px w-8 bg-[#e0ae00]" />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary-600">
              How It Works
            </span>
          </div>
          <h2
            id="academy-learning-heading"
            className="font-nexa-heavy text-[1.9rem] sm:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-tight text-[#0B1220] mb-4"
          >
            A streamlined path from enrolment to certification
          </h2>
          <p className="text-base text-slate-500 leading-relaxed">
            We&apos;ve made it easy to get started and achieve your learning goals.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 border-t border-l border-slate-200/80 mb-14">
          {STEPS.map(({ number, title, description }) => (
            <div key={number} className="border-b border-r border-slate-200/80 p-8">
              <p className="font-nexa-heavy text-3xl text-slate-200 mb-8">{number}</p>
              <h3 className="font-semibold text-[#0B1220] text-base mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Additional features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map(({ title, description }) => (
            <div key={title} className="flex gap-4 border border-slate-200/80 bg-[#F8FAFC] p-6">
              <span className="mt-2 block h-1 w-6 bg-[#e0ae00] shrink-0" aria-hidden />
              <div>
                <h3 className="font-semibold text-[#0B1220] text-sm mb-1.5">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AcademyLearning;
