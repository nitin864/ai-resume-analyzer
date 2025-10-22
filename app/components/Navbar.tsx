import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const { isLoading, auth } = usePuterStore();
    const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">Resume IQ</p>
      </Link>
      <Link to="/upload">
        <p className="primary-button w-fit">Upload Resume</p>
      </Link>
      <Link to='/auth'><p className="primary-button w-fit">Authenticate</p></Link>
    </nav>
  );
};

export default Navbar;
