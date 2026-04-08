import Layout from "../components/Layout";

function About() {
  return (
    <Layout>
      <section className="px-6 md:px-16 py-16 bg-[#0E0E0F] text-[#F2EDE6]">

      {/* TOP HEADING */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-[#C9973A] text-sm tracking-wide mb-3">
          ✦ About StayFinder
        </p>

        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          Redefining the way you <br />
          <span className="text-[#C9973A] italic">discover stays</span>
        </h1>

        <p className="text-[#A09480] text-sm md:text-base">
          StayFinder isn’t just a booking platform — it’s your gateway to
          unforgettable experiences, curated spaces, and meaningful journeys.
        </p>
      </div>

      {/* STORY SECTION */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">

        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Our Story
          </h2>

          <p className="text-[#A09480] leading-relaxed mb-4">
            StayFinder was born from a simple idea — finding a place to stay
            should feel inspiring, not exhausting. We noticed how travelers
            struggled with endless options but very little personalization.
          </p>

          <p className="text-[#A09480] leading-relaxed">
            So we created a platform that doesn’t just list properties, but
            highlights experiences. Every stay you see here is carefully curated
            to bring comfort, beauty, and authenticity together.
          </p>
        </div>

        {/* Visual Card */}
        <div className="bg-[#1E1E21] border border-[rgba(201,151,58,0.2)] rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300">
          <h3 className="text-[#C9973A] text-lg mb-2">✨ Our Mission</h3>
          <p className="text-[#A09480] text-sm leading-relaxed">
            To connect people with spaces that feel like home — no matter where
            they are in the world.
          </p>
        </div>

      </div>

      {/* FEATURES / VALUES */}
      <div className="grid md:grid-cols-3 gap-6">

        {[
          {
            title: "Curated Stays",
            desc: "Every property is handpicked to ensure quality, design, and comfort.",
          },
          {
            title: "Trusted Platform",
            desc: "Secure bookings, verified hosts, and transparent pricing.",
          },
          {
            title: "Seamless Experience",
            desc: "From search to stay, everything is designed for simplicity.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-[#1E1E21] border border-[rgba(201,151,58,0.2)] p-6 rounded-2xl hover:border-[#C9973A] transition-all duration-300"
          >
            <h3 className="text-[#C9973A] text-lg mb-2">
              {item.title}
            </h3>
            <p className="text-[#A09480] text-sm">
              {item.desc}
            </p>
          </div>
        ))}

      </div>

      {/* CTA */}
      <div className="text-center mt-20">
        <h2 className="text-2xl md:text-3xl mb-4">
          Start your journey with us
        </h2>

        <p className="text-[#A09480] mb-6">
          Discover stays that match your vibe, your style, and your story.
        </p>

        <button className="bg-[#C9973A] text-[#0E0E0F] px-6 py-3 rounded-lg hover:bg-[#E8C97A] transition-all">
          Explore Now →
        </button>
      </div>

    </section>
    </Layout>
  );
}

export default About;
