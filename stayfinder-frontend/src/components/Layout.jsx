import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="bg-[#0E0E0F] min-h-screen text-[#F2EDE6]">
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;