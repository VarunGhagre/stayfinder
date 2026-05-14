import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="bg-[#0E0E0F] min-h-screen text-[#F2EDE6]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;