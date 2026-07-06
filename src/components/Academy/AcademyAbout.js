import React from 'react';

const FEATURES = [
  {
    title: 'Industry Experts',
    description: 'Learn from professionals with real-world delivery experience',
  },
  {
    title: 'Hands-on Learning',
    description: 'Practical projects and real-world applications',
  },
  {
    title: 'Flexible Schedule',
    description: 'Learn at your own pace with 24/7 access',
  },
  {
    title: 'Certification',
    description: 'Earn recognized certificates upon completion',
  },
];

const MISSION_POINTS = [
  'Industry-relevant curriculum',
  'Expert mentorship and guidance',
  'Hands-on project experience',
  'Career advancement support',
];

const AcademyAbout = () => {
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="academy-about-heading">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Content */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="block h-px w-8 bg-[#e0ae00]" />
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary-600">
                About the Academy
              </span>
            </div>
            <h2
              id="academy-about-heading"
              className="font-nexa-heavy text-[1.9rem] sm:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-tight text-[#0B1220] mb-6"
            >
              Bridging the gap between knowledge and application
            </h2>

            <div className="space-y-5 text-base text-slate-600 leading-relaxed mb-10">
              <p>
                Skyfalke Academy equips entrepreneurs, SMEs, and organizations with practical
                digital knowledge that drives real business results — bridging the gap between
                theoretical knowledge and practical application.
              </p>
              <p>
                We believe in mentorship and trainer-guided online learning that goes beyond
                traditional education. Our industry experts don&apos;t just teach — they mentor,
                guide, and support your learning journey every step of the way.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-slate-200/80">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="border-b border-r border-slate-200/80 p-6">
                  <h3 className="font-semibold text-[#0B1220] text-sm mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mission panel */}
          <div className="lg:col-span-5">
            <div className="h-full bg-[#0B1220] p-8 lg:p-10 flex flex-col justify-center">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#e0ae00] mb-4">
                Our Mission
              </p>
              <p className="font-nexa-heavy text-xl sm:text-2xl tracking-tight text-white leading-snug mb-8">
                Empowering professionals with practical digital skills for the modern workplace
              </p>
              <ul className="space-y-3.5">
                {MISSION_POINTS.map((point) => (
                  <li key={point} className="flex items-center gap-3">
                    <span className="block h-1 w-4 bg-[#e0ae00] shrink-0" aria-hidden />
                    <span className="text-sm text-slate-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademyAbout;
