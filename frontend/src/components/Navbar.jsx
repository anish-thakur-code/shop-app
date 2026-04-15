import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // Hide on protected pages — they have their own navbars
  if (location.pathname === "/" || location.pathname === "/admin") {
    return null;
  }

  return null; // Auth page has its own branding, no top navbar needed
};

export default Navbar;