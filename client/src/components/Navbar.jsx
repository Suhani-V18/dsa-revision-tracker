import { NavLink } from "react-router-dom";

function Navbar() {
  const linkStyle = ({ isActive }) => ({
    fontFamily: "Helvetica Neue, Arial, sans-serif",
    fontSize: "0.83rem",
    letterSpacing: "0.02em",
    textDecoration: "none",
    color: isActive ? "#a8532e" : "#7a7a72",
    fontWeight: isActive ? 600 : 400,
    padding: "0.6rem 0.9rem",
    borderBottom: isActive ? "2px solid #a8532e" : "2px solid transparent",
    marginBottom: "-1px",
  });

  return (
    <nav
      style={{
        marginBottom: "2rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid #e5e5e0",
      }}
    >
      <NavLink to="/" style={linkStyle} end>
        Dashboard
      </NavLink>
      <NavLink to="/quiz" style={linkStyle}>
        Quiz
      </NavLink>
      <NavLink to="/review" style={linkStyle}>
        Code Review
      </NavLink>
      <NavLink to="/import" style={linkStyle}>
        Import
      </NavLink>
    </nav>
  );
}

export default Navbar;
