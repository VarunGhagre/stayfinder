import Layout from "../components/Layout";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

function Contact() {
    const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all fields ❗");
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      setLoading(false);
      alert("Message sent successfully 🚀");

      setForm({
        name: "",
        email: "",
        message: "",
      });

    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Something went wrong ❌");
    }
  };

  return (
    <Layout>
      <section className="px-6 md:px-16 py-16 bg-[#0E0E0F] text-[#F2EDE6]">

      {/* 🔥 HEADING */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-[#C9973A] text-sm mb-3">✦ Contact Us</p>

        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          Let’s connect and <br />
          <span className="text-[#C9973A] italic">build something amazing</span>
        </h1>

        <p className="text-[#A09480]">
          Questions, feedback, or ideas? We’re here to help you anytime.
        </p>
      </div>

      {/* 🔥 GRID */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {[
            {
              icon: <Mail />,
              title: "Email",
              value: "support@stayfinder.com",
            },
            {
              icon: <Phone />,
              title: "Phone",
              value: "+91 98765 43210",
            },
            {
              icon: <MapPin />,
              title: "Location",
              value: "India",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-[#1E1E21] border border-[rgba(201,151,58,0.2)] p-4 rounded-xl hover:border-[#C9973A] hover:scale-[1.02] transition-all duration-300"
            >
              <div className="text-[#C9973A]">{item.icon}</div>

              <div>
                <p className="text-xs text-[#A09480]">{item.title}</p>
                <p className="text-sm">{item.value}</p>
              </div>
            </div>
          ))}

        </div>

        {/* 🔥 RIGHT FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#1E1E21] border border-[rgba(201,151,58,0.2)] p-6 rounded-2xl space-y-4 hover:border-[#C9973A] transition-all duration-300"
        >

          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full px-4 py-3 bg-transparent border border-[rgba(201,151,58,0.2)] rounded-lg outline-none focus:border-[#C9973A] focus:ring-1 focus:ring-[#C9973A] text-sm transition-all"
          />

          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full px-4 py-3 bg-transparent border border-[rgba(201,151,58,0.2)] rounded-lg outline-none focus:border-[#C9973A] focus:ring-1 focus:ring-[#C9973A] text-sm transition-all"
          />

          <textarea
            rows="4"
            placeholder="Your Message"
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
            className="w-full px-4 py-3 bg-transparent border border-[rgba(201,151,58,0.2)] rounded-lg outline-none focus:border-[#C9973A] focus:ring-1 focus:ring-[#C9973A] text-sm transition-all"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9973A] text-[#0E0E0F] py-3 rounded-lg font-medium hover:bg-[#E8C97A] transition-all duration-300 hover:scale-[1.02]"
          >
            {loading ? "Sending..." : "Send Message →"}
          </button>

        </form>

      </div>

    </section>
    </Layout>
  );
}

export default Contact;
