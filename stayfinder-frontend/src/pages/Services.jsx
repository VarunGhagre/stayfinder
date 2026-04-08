import Layout from "../components/Layout";
import { Sparkles, Shield, Wallet, MapPin } from "lucide-react";

function Services() {

    const services = [
    {
      icon: <Sparkles size={28} />,
      title: "Curated Stays",
      desc: "Handpicked properties designed for comfort, aesthetics, and unique experiences.",
    },
    {
      icon: <Shield size={28} />,
      title: "Secure Booking",
      desc: "Verified hosts, safe payments, and full transparency for worry-free travel.",
    },
    {
      icon: <Wallet size={28} />,
      title: "Best Price Guarantee",
      desc: "Get the best deals with no hidden charges or surprise fees.",
    },
    {
      icon: <MapPin size={28} />,
      title: "Smart Search",
      desc: "Find stays faster with intelligent filters and personalized suggestions.",
    },
  ];

  return (
    <Layout>
        <section className="px-6 md:px-16 py-16 bg-[#0E0E0F] text-[#F2EDE6]">

      {/* HEADING */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-[#C9973A] text-sm mb-3">✦ Our Services</p>

        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          Experience stays like <br />
          <span className="text-[#C9973A] italic">never before</span>
        </h1>

        <p className="text-[#A09480]">
          We provide everything you need to make your travel smooth,
          secure, and unforgettable.
        </p>
      </div>

      {/* SERVICES GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {services.map((item, index) => (
          <div
            key={index}
            className="group bg-[#1E1E21] border border-[rgba(201,151,58,0.2)] p-6 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(201,151,58,0.2)] hover:border-[#C9973A]"
          >
            {/* ICON */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[rgba(201,151,58,0.1)] text-[#C9973A] mb-4 group-hover:scale-110 transition-all duration-300">
              {item.icon}
            </div>

            {/* TITLE */}
            <h3 className="text-lg font-semibold mb-2 group-hover:text-[#C9973A] transition-all">
              {item.title}
            </h3>

            {/* DESC */}
            <p className="text-[#A09480] text-sm leading-relaxed">
              {item.desc}
            </p>

            {/* HOVER LINE */}
            <div className="mt-4 h-[2px] w-0 bg-[#C9973A] transition-all duration-300 group-hover:w-full"></div>
          </div>
        ))}

      </div>

      {/* EXTRA SECTION (WHY CHOOSE US) */}
      <div className="mt-24 text-center">

        <h2 className="text-3xl md:text-4xl mb-4">
          Why choose StayFinder?
        </h2>

        <p className="text-[#A09480] max-w-xl mx-auto mb-10">
          Because we don’t just offer stays — we deliver experiences that
          match your lifestyle and expectations.
        </p>

        <div className="flex flex-wrap justify-center gap-6">

          {[
            "Trusted by thousands",
            "24/7 customer support",
            "Premium quality listings",
            "Fast & easy booking",
          ].map((item) => (
            <div
              key={item}
              className="px-5 py-3 border border-[rgba(201,151,58,0.3)] rounded-full text-sm hover:bg-[rgba(201,151,58,0.1)] transition-all"
            >
              {item}
            </div>
          ))}

        </div>

      </div>

    </section>
    </Layout>
  ) 
}

export default Services;