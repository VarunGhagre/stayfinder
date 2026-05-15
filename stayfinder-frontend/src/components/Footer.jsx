import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

function Footer() {
  return (
    <footer
      className="text-white mt-20 border-t border-[rgba(201,151,58,0.15)]"
      style={{
        background:
          "linear-gradient(180deg,#121214 0%,#0E0E0F 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* TOP */}
        <div className="grid md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
            <h1
              className="text-3xl font-bold text-[#C9973A]"
              style={{
                fontFamily:
                  "Cormorant Garamond, serif",
              }}
            >
              StayFinder
            </h1>

            <p className="text-[#A09480] mt-4 leading-7 text-sm">
              Discover premium PGs, flats,
              villas and apartments with
              seamless booking experience.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-4 mt-6">

              <div className="footerIcon">
                <Facebook size={18} />
              </div>

              <div className="footerIcon">
                <Instagram size={18} />
              </div>

              <div className="footerIcon">
                <Twitter size={18} />
              </div>

            </div>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="footerTitle">
              Explore
            </h3>

            <ul className="footerLinks">
              <li>All Rooms</li>
              <li>Hostels</li>
              <li>Luxury Villas</li>
              <li>Nearby PGs</li>
              <li>Student Housing</li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="footerTitle">
              Company
            </h3>

            <ul className="footerLinks">
              <li>About Us</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Support</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="footerTitle">
              Contact
            </h3>

            <div className="space-y-4 text-sm text-[#A09480]">

              <div className="flex gap-3 items-center">
                <MapPin size={16} />
                <span>Bhopal, India</span>
              </div>

              <div className="flex gap-3 items-center">
                <Phone size={16} />
                <span>+91 9876543210</span>
              </div>

              <div className="flex gap-3 items-center">
                <Mail size={16} />
                <span>
                  support@stayfinder.com
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          className="mt-14 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
          style={{
            borderTop:
              "1px solid rgba(201,151,58,0.12)",
          }}
        >
          <p className="text-[#5C5448]">
            © 2026 StayFinder. All rights
            reserved.
          </p>

          <div className="flex gap-6 text-[#A09480]">
            <span className="hover:text-white cursor-pointer">
              Privacy
            </span>

            <span className="hover:text-white cursor-pointer">
              Terms
            </span>

            <span className="hover:text-white cursor-pointer">
              Sitemap
            </span>
          </div>
        </div>
      </div>

      {/* EXTRA STYLES */}
      <style>{`

        .footerTitle{
          color:white;
          font-size:18px;
          font-weight:600;
          margin-bottom:18px;
        }

        .footerLinks{
          display:flex;
          flex-direction:column;
          gap:12px;
          color:#A09480;
          font-size:14px;
        }

        .footerLinks li{
          cursor:pointer;
          transition:0.3s;
        }

        .footerLinks li:hover{
          color:white;
          transform:translateX(4px);
        }

        .footerIcon{
          width:38px;
          height:38px;
          border-radius:50%;
          background:#1E1E21;
          border:1px solid rgba(201,151,58,0.15);
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          transition:0.3s;
        }

        .footerIcon:hover{
          background:#C9973A;
          color:black;
          transform:translateY(-3px);
        }

      `}</style>
    </footer>
  );
}

export default Footer;